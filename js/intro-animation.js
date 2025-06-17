// const enableIntroAnimation = false; // change to true to enable it

// document.addEventListener('DOMContentLoaded', () => {
//   if (!enableIntroAnimation) return;

//   const period = document.querySelector('.period');
//   const circle = document.querySelector('.circle');
//   const intro = document.getElementById('intro');

//   if (!period || !circle || !intro) return;

//   const rect = period.getBoundingClientRect();
//   const centerX = rect.left + rect.width / 4.2;
//   const centerY = rect.top + rect.height / 2 + rect.height * (5 / 20);

//   const initialSize = Math.max(window.innerWidth, window.innerHeight) * 2;
//   circle.style.cssText = `
//     width: ${initialSize}px;
//     height: ${initialSize}px;
//     top: ${centerY}px;
//     left: ${centerX}px;
//     transform: translate(-50%, -50%) scale(1);
//     animation: shrink 1s ease forwards;
//   `;

//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes shrink {
//       0% { transform: translate(-50%, -50%) scale(1); }
//       100% { transform: translate(-50%, -50%) scale(0.2); }
//     }
//   `;
//   document.head.appendChild(style);

//   intro.addEventListener('click', () => {
//     intro.style.opacity = '0';
//     intro.style.pointerEvents = 'none';
//     setTimeout(() => {
//       intro.style.display = 'none';
//     }, 1000);
//   });
// });
