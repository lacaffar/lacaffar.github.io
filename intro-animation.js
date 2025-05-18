document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      const intro = document.querySelector(".intro-animation");
      const content = document.querySelector(".page-content");
      
      if (intro) intro.style.display = "none";
      if (content) content.style.opacity = "1";
    }, 4000); // Match animation duration
  });