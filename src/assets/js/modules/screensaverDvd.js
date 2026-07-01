"use strict";

// Screen mise en veille : DVD
export function initDvdScreensaver() {
  const overlay = document.getElementById("screensaver-overlay");
  const pasta = document.getElementById("dvd-pate");

  if (!overlay || !pasta) return;

  const IDLE_TIME = 10 * 60 * 1000; // 10 minutes
  let idleTimer = null;
  let animFrame = null;

  let x = Math.random() * (window.innerWidth - 220);
  let y = Math.random() * (window.innerHeight - 220);
  let vx = 2.2;
  let vy = 2.2;
  let rotation = 0;
  const rotSpeed = 0.15;

  function randomHue() {
    return Math.floor(Math.random() * 360);
  }
  pasta.style.filter += ` hue-rotate(${randomHue()}deg)`;

  function bounceCorner() {
    const baseFilter = "drop-shadow(0 0 25px rgba(255, 200, 60, 0.35))";
    pasta.style.filter = `${baseFilter} hue-rotate(${randomHue()}deg)`;
  }

  function animate() {
    const w = pasta.offsetWidth || 220;
    const h = pasta.offsetHeight || 220;

    x += vx;
    y += vy;

    let bounced = false;

    if (x <= 0) {
      x = 0;
      vx = Math.abs(vx);
      bounced = true;
    } else if (x + w >= window.innerWidth) {
      x = window.innerWidth - w;
      vx = -Math.abs(vx);
      bounced = true;
    }

    if (y <= 0) {
      y = 0;
      vy = Math.abs(vy);
      bounced = true;
    } else if (y + h >= window.innerHeight) {
      y = window.innerHeight - h;
      vy = -Math.abs(vy);
      bounced = true;
    }

    if (bounced) {
      bounceCorner();
    }

    rotation += rotSpeed;

    pasta.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

    animFrame = requestAnimationFrame(animate);
  }

  function startScreensaver() {
    overlay.classList.add("active");
    x = Math.random() * (window.innerWidth - 220);
    y = Math.random() * (window.innerHeight - 220);
    if (!animFrame) {
      animate();
    }
  }

  function stopScreensaver() {
    overlay.classList.remove("active");
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function resetIdleTimer() {
    stopScreensaver();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startScreensaver, IDLE_TIME);
  }

  ["mousemove", "mousedown", "keydown", "wheel", "touchstart"].forEach(
    (evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    },
  );

  overlay.addEventListener("mousemove", resetIdleTimer);
  overlay.addEventListener("click", resetIdleTimer);

  window.addEventListener("resize", () => {
    x = Math.min(x, window.innerWidth - (pasta.offsetWidth || 220));
    y = Math.min(y, window.innerHeight - (pasta.offsetHeight || 220));
  });

  resetIdleTimer();
}
