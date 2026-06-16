/* =====================================================================
   site.js :: starfield, timeline expand/collapse, scroll reveals.
   Kept deliberately light: no frameworks, no WebGL, pauses when hidden.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- */
  /* Starfield :: static stars with a faint twinkle + rare drifter     */
  /* ---------------------------------------------------------------- */
  (function starfield() {
    var canvas = document.getElementById("starfield");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w, h, stars = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    var tints = ["#EAF3F2", "#EAF3F2", "#EAF3F2", "#9FD6D7", "#7AC143"]; // mostly starlight, occasional teal/lime

    function resize() {
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      var count = Math.min(220, Math.round((window.innerWidth * window.innerHeight) / 9000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.1 + 0.25) * dpr,
          base: Math.random() * 0.5 + 0.25,
          tw: Math.random() * 0.5,
          sp: Math.random() * 0.6 + 0.2,
          c: tints[(Math.random() * tints.length) | 0]
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = reduceMotion ? s.base
          : s.base + s.tw * Math.sin(t * 0.0007 * s.sp + i);
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    var raf = null;
    function loop(t) { draw(t); raf = requestAnimationFrame(loop); }

    resize();
    if (reduceMotion) {
      draw(0); // one static paint
    } else {
      loop(0);
    }
    window.addEventListener("resize", function () {
      resize();
      if (reduceMotion) draw(0);
    });
    document.addEventListener("visibilitychange", function () {
      if (reduceMotion) return;
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) loop(0);
    });
  })();

  /* ---------------------------------------------------------------- */
  /* Timeline :: accessible expand / collapse                          */
  /* ---------------------------------------------------------------- */
  (function timeline() {
    var heads = document.querySelectorAll(".tl-head");
    Array.prototype.forEach.call(heads, function (head) {
      head.addEventListener("click", function () {
        var item = head.closest(".tl-item");
        var open = item.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  })();

  /* ---------------------------------------------------------------- */
  /* Reveal on scroll                                                  */
  /* ---------------------------------------------------------------- */
  (function reveals() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------------- */
  /* Footer year                                                       */
  /* ---------------------------------------------------------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
