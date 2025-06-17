document.addEventListener('DOMContentLoaded', () => {
  const period = document.querySelector('.period');
  const circle = document.querySelector('.circle');
  const intro = document.getElementById('intro');

  const periodRect = period.getBoundingClientRect();
  const fontSize = parseFloat(getComputedStyle(period).fontSize);

  const centerX = periodRect.left + periodRect.width / 4.2;
  const centerY = periodRect.top + periodRect.height / 2;
  const offsetY = periodRect.height * (5 / 20);
  const adjustedCenterY = centerY + offsetY;

  const initialSize = Math.max(window.innerWidth, window.innerHeight) * 2;
  const finalSize = periodRect.width * 0.8;

  circle.style.cssText = `
    width: ${initialSize}px;
    height: ${initialSize}px;
    top: ${adjustedCenterY}px;
    left: ${centerX}px;
    --final-size: ${finalSize}px;
  `; 

  const style = document.createElement('style');
  style.textContent = `
    @keyframes shrink {
      0% {
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        width: var(--final-size);
        height: var(--final-size);
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `;
  document.head.appendChild(style);

  // Fade out on click
  intro.addEventListener('click', () => {
  intro.style.opacity = '0';
  intro.style.pointerEvents = 'none';

  // Wait for the fade-out transition to finish, then hide or remove it
  setTimeout(() => {
    intro.style.display = 'none'; // or use .remove() if you want to delete the node
  }, 1000); // match your CSS transition duration (1s)
});