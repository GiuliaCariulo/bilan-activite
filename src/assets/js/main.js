import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// section portfolio : pop up
// ============================================================
const modal = document.querySelector(".porfolio-content-modal");

document.querySelectorAll(".porfolio-open-modal").forEach(function (card) {
  card.addEventListener("click", function () {
    const popupId = card.parentElement.getAttribute("data-portfolio-popup");
    document
      .getElementById(popupId)
      .classList.remove("portfolio-selector-hidden");
    modal.classList.remove("portfolio-hidden-modal");
  });
});

document
  .querySelector(".portfolio-close-modal")
  .addEventListener("click", function () {
    modal.classList.add("portfolio-hidden-modal");

    document
      .querySelectorAll(".portfolio-body-modal")
      .forEach(function (contentModal) {
        contentModal.classList.add("portfolio-selector-hidden");
      });
  });

// ============================================================
// section footer : scrolling texts
// ============================================================
const lines = gsap.utils.toArray(".footer-track h4");

if (lines.length) {
  const trackHeight = document.querySelector(".footer-animation").offsetHeight;
  const spacing = 70;

  gsap.to(lines.slice(1), {
    y: (i) => (i + 1) * spacing,
    ease: "none",
    scrollTrigger: {
      trigger: ".footer-contact",
      start: "top bottom",
      endTrigger: ".footer-contact-copyright",
      end: "bottom bottom",
      scrub: true,
      markers: false,
    },
  });
}

// ============================================================
// hero.js — Gestion de la grille héro et des expansions
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // ouverture / fermeture des expands
  // ==========================================================================

  const heroGrid = document.querySelector(".hero-grid");
  const clickableCells = document.querySelectorAll(
    ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
  );

  function closeAll() {
    heroGrid.classList.remove("open-r2", "open-r3", "open-r4");
    clickableCells.forEach((c) => c.classList.remove("active"));
  }

  clickableCells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      e.preventDefault();

      const rowType = cell.getAttribute("data-row");
      if (!rowType) return;

      const isAlreadyOpen = heroGrid.classList.contains(`open-${rowType}`);

      closeAll();

      if (!isAlreadyOpen) {
        heroGrid.classList.add(`open-${rowType}`);
        cell.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // voir plus / voir moins
  // ==========================================================================

  document.querySelectorAll(".hero-grid-expand").forEach((expand) => {
    const suite = expand.querySelector(".hero-grid-expand-text-suite");
    const voirPlus = expand.querySelector(".hero-grid-voir-plus");
    const voirMoins = expand.querySelector(".hero-grid-voir-moins");

    if (!suite || !voirPlus || !voirMoins) return;

    voirPlus.addEventListener("click", () => {
      suite.style.display = "block";
      voirPlus.style.display = "none";
      voirMoins.style.display = "block";
    });

    voirMoins.addEventListener("click", () => {
      suite.style.display = "none";
      voirPlus.style.display = "block";
      voirMoins.style.display = "none";
    });
  });
});
