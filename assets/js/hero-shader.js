/* =====================================================================
   hero-shader.js :: interactive WebGL "wind field" for the hero header.
   A domain-warped flow field that streams like wind over an airfoil and
   gusts toward the cursor. Pure fragment shader, no libraries, no assets.
   Degrades gracefully: if WebGL is missing or errors, the canvas is
   removed and the CSS gradient fallback shows instead. Respects
   prefers-reduced-motion (paints one calm frame, then holds) and pauses
   when the tab is hidden.
   ===================================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  function bail() { if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas); }

  var gl;
  try {
    gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" })
      || canvas.getContext("experimental-webgl");
  } catch (e) { gl = null; }
  if (!gl) { bail(); return; }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var VERT = [
    "attribute vec2 p;",
    "void main(){ gl_Position = vec4(p, 0.0, 1.0); }"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "uniform vec2  u_res;",
    "uniform float u_time;",
    "uniform vec2  u_mouse;",   // 0..1, y up
    "uniform float u_mAmt;",    // pointer presence 0..1

    "float hash(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }",
    "float vnoise(vec2 p){",
    "  vec2 i = floor(p), f = fract(p);",
    "  vec2 u = f*f*(3.0-2.0*f);",
    "  float a = hash(i), b = hash(i+vec2(1.0,0.0));",
    "  float c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));",
    "  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);",
    "}",
    "float fbm(vec2 p){",
    "  float s = 0.0, a = 0.5;",
    "  for(int i=0;i<5;i++){ s += a*vnoise(p); p = p*2.02 + 7.1; a *= 0.5; }",
    "  return s;",
    "}",

    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / u_res;",
    "  vec2 p = uv;",
    "  p.x *= u_res.x / u_res.y;",       // aspect-correct
    "  float t = u_time * 0.06;",

    // wind streams left-to-right; domain-warp for turbulence
    "  vec2 flow = vec2(t*3.0, 0.0);",
    "  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;",
    "  float md = length(p - m);",
    "  vec2 gust = (p - m) / (md + 0.18) * (u_mAmt * 0.55);",  // cursor pushes the field

    "  vec2 q = vec2(fbm(p*1.6 + flow), fbm(p*1.6 + flow + 5.2));",
    "  vec2 r = vec2(fbm(p*1.6 + q*1.7 + flow*0.6 + gust), fbm(p*1.6 + q*1.7 + flow*0.6 + 3.3 + gust));",
    "  float f = fbm(p*1.6 + r*1.9 + flow*0.3);",

    // carve streamlines out of the field
    "  float streak = abs(sin((r.x*2.2 + r.y*1.3 + f*3.0) * 3.14159 + t*2.0));",
    "  streak = pow(1.0 - streak, 2.2);",

    "  float depth = smoothstep(0.15, 1.05, f);",
    "  vec3 base = mix(vec3(0.035,0.041,0.040), vec3(0.055,0.075,0.072), depth);",
    "  vec3 teal = vec3(0.37, 0.70, 0.65);",
    "  vec3 col = base + teal * streak * (0.18 + 0.55*depth);",

    // soft gust glow at the cursor
    "  col += teal * u_mAmt * smoothstep(0.6, 0.0, md) * 0.10;",

    // faint scanning grid, engineering feel, very subtle
    "  vec2 g = abs(fract(uv*vec2(60.0,34.0))-0.5);",
    "  float grid = smoothstep(0.48,0.5,max(g.x,g.y));",
    "  col += teal*grid*0.012;",

    "  col = pow(col, vec3(0.92));",     // gentle lift
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { bail(); return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { bail(); return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "u_res");
  var uTime = gl.getUniformLocation(prog, "u_time");
  var uMouse = gl.getUniformLocation(prog, "u_mouse");
  var uMAmt = gl.getUniformLocation(prog, "u_mAmt");

  var mx = 0.7, my = 0.6, mAmt = 0.0, mTarget = 0.0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);

  var hero = canvas.closest(".hero") || document;
  hero.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = 1.0 - (e.clientY - r.top) / r.height;
    mTarget = 1.0;
  });
  hero.addEventListener("pointerleave", function () { mTarget = 0.0; });

  var start = performance.now(), raf = 0, running = true;

  function frame(now) {
    if (!running) return;
    var t = (now - start) / 1000;
    mAmt += (mTarget - mAmt) * 0.06;
    gl.uniform1f(uTime, reduce ? 4.0 : t);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uMAmt, mAmt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (reduce) return;                 // one settled frame, then hold
    raf = requestAnimationFrame(frame);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!reduce) { running = true; start = performance.now(); raf = requestAnimationFrame(frame); }
  });

  resize();
  // guard against zero-size on very first paint
  if (!canvas.width) requestAnimationFrame(function () { resize(); raf = requestAnimationFrame(frame); });
  else raf = requestAnimationFrame(frame);
})();
