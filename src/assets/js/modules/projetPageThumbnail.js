"use strict";

import gsap from "gsap";

// projet-page : thumbnail parallax + scale
export function initProjetPageThumbnail() {
  const thumbnailImage = document.querySelector(".projet-page-thumbnail img");

  if (!thumbnailImage) return;

  gsap.fromTo(
    thumbnailImage,
    {
      scale: 1.08,
      yPercent: 0,
    },
    {
      scale: 1,
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".projet-page-thumbnail",
        start: "top top",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
    },
  );
}
