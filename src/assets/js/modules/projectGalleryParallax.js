"use strict";

import gsap from "gsap";

// projet-gallery : parallax — les cartes montent depuis le bas
export function initProjectGalleryParallax() {
  const cards = gsap.utils.toArray(".project-gallery-project-card");

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { yPercent: 30 },
      {
        yPercent: 0,
        ease: "power.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top 70%",
          scrub: 1.2,
          toggleActions: "play reverse",
          markers: false,
        },
      },
    );
  });
}
