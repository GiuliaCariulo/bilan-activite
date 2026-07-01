"use strict";

import gsap from "gsap";

export function initFooterMarquee() {
  const lines = gsap.utils.toArray(".footer-track h4");

  if (!lines.length) return;

  const spacing = 70;
  const isMobile = window.innerWidth < 768;

  gsap.to(lines.slice(1), {
    y: (i) => (i + 1) * spacing,
    ease: "none",
    scrollTrigger: {
      trigger: isMobile ? ".footer-title" : ".footer-contact",
      start: isMobile ? "top 90%" : "-20% bottom",
      endTrigger: isMobile ? ".footer-contact" : ".footer-contact-copyright",
      end: isMobile ? "top 100%" : "55% bottom",
      scrub: true,
      markers: false,
    },
  });
}
