import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
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
    const trackHeight =
      document.querySelector(".footer-animation").offsetHeight;
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

  // ==========================================================================
  // ouverture / fermeture des expands
  // ==========================================================================

  const heroGrid = document.querySelector(".hero-grid");
  const clickableCells = document.querySelectorAll(
    ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
  );

  // Doit rester synchro avec la valeur par défaut de grid-template-rows dans _hero.scss
  // (vh et non % : voir le commentaire dans _hero.scss sur le fallback CSS Grid)
  const DEFAULT_ROWS = "20vh 20vh 0px 20vh 0px 20vh 0px 20vh";

  function closeAll() {
    heroGrid.style.gridTemplateRows = DEFAULT_ROWS;
    heroGrid.classList.remove("open-r2", "open-r3", "open-r4");
    clickableCells.forEach((c) => c.classList.remove("active"));
    // remet "voir plus" par défaut quand on referme une ligne
    heroGrid
      .querySelectorAll(".hero-grid-expand")
      .forEach((expand) => expand.classList.remove("is-expanded"));
  }

  // Calcule la vraie hauteur de l'expand (scrollHeight) et l'injecte en px
  // dans grid-template-rows : une transition CSS ne peut pas animer vers "auto".
  function openRow(rowType) {
    const expand = heroGrid.querySelector(`.hero-grid-expand-${rowType}`);
    if (!expand) return;

    const expandHeight = expand.scrollHeight;

    const rowHeights = {
      r2: `20vh 20vh ${expandHeight}px 20vh 0px 20vh 0px 20vh`,
      r3: `20vh 20vh 0px 20vh ${expandHeight}px 20vh 0px 20vh`,
      r4: `20vh 20vh 0px 20vh 0px 20vh ${expandHeight}px 20vh`,
    };

    heroGrid.classList.add(`open-${rowType}`);
    heroGrid.style.gridTemplateRows = rowHeights[rowType];
  }

  closeAll();

  clickableCells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      e.preventDefault();

      const rowType = cell.getAttribute("data-row");
      if (!rowType) return;

      const isAlreadyOpen = heroGrid.classList.contains(`open-${rowType}`);

      closeAll();

      if (!isAlreadyOpen) {
        cell.classList.add("active");
        // attend le prochain frame pour mesurer la hauteur une fois le DOM stable
        requestAnimationFrame(() => openRow(rowType));
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

    const rowType = [...expand.classList]
      .find((cls) => /^hero-grid-expand-r\d$/.test(cls))
      ?.replace("hero-grid-expand-", "");

    // Si cet expand est actuellement ouvert, recalcule sa hauteur après le toggle
    const refreshHeightIfOpen = () => {
      if (rowType && heroGrid.classList.contains(`open-${rowType}`)) {
        openRow(rowType);
      }
    };

    voirPlus.addEventListener("click", () => {
      expand.classList.add("is-expanded");
      refreshHeightIfOpen();
    });

    voirMoins.addEventListener("click", () => {
      expand.classList.remove("is-expanded");
      refreshHeightIfOpen();
    });
  });
});
