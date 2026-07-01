"use strict";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initImagesBatchReveal() {
  ScrollTrigger.batch(".images", {
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        stagger: 0.2,
        duration: 1,
        ease: "expo.out",
      }),
  });
}
