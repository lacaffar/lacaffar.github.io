/* =====================================================================
   site.js :: timeline expand/collapse, scroll reveals, scroll-spy.
   Kept deliberately light: no frameworks, no WebGL, pauses when hidden.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  /* Scroll-spy: highlight the active section in the left nav          */
  /* ---------------------------------------------------------------- */
  (function spy() {
    var links = document.querySelectorAll(".spy a[data-spy]");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    Array.prototype.forEach.call(links, function (l) { map[l.getAttribute("data-spy")] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          Array.prototype.forEach.call(links, function (l) { l.classList.remove("active"); });
          map[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    ["about", "timeline", "work", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  })();

  /* ---------------------------------------------------------------- */
  /* Footer year                                                       */
  /* ---------------------------------------------------------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
