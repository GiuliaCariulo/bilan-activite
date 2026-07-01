"use strict";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function initSplitTextReveal() {
  gsap.set(".split-text", { opacity: 1 });

  document.fonts.ready.then(() => {
    const containers = gsap.utils.toArray(".split-text-container");

    containers.forEach((container) => {
      const text = container.querySelector(".split-text");

      SplitText.create(text, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (instance) =>
          gsap.from(instance.lines, {
            yPercent: 120,
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              scrub: true,
              start: "20px 70%",
              end: "20px 50%",
            },
          }),
      });
    });
  });
}
