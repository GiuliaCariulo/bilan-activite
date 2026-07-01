"use strict";

import { Draggable } from "gsap/Draggable";

// easter egg 25/26 hihi
export function initEasterEggRotate() {
  if (!document.querySelector(".hero-grid-cell-annee-rotate")) return;

  Draggable.create(".hero-grid-cell-annee-rotate", {
    type: "rotation",
  });
}
