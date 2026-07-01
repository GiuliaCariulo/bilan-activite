"use strict";

import gsap from "gsap";

// sessions & encadrants explosion: fiouuuu !
export function initTeamExplosion() {
  const containers = gsap.utils.toArray(".team-container");

  containers.forEach((container) => {
    const teamBox = container.querySelector(".team-box");
    const cards = gsap.utils.toArray(
      container.querySelectorAll(".team-card-member"),
    );

    if (!teamBox || !cards.length) return;

    const boxRect = teamBox.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      const offsetX = boxCenterX - cardCenterX;
      const offsetY = boxCenterY - cardCenterY;

      const scaleStart = Math.min(
        boxRect.width / cardRect.width,
        boxRect.height / cardRect.height,
      );

      gsap.fromTo(
        card,
        { x: offsetX, y: offsetY, scale: scaleStart, zIndex: 0 },
        {
          x: 0,
          y: 0,
          scale: 1,
          zIndex: 1,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: "top 50%",
            end: "bottom 60%",
            toggleActions: "play reverse restart reverse",
          },
        },
      );
    });
  });
}
