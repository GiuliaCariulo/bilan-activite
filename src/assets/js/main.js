import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

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
      document.body.style.overflow = "hidden"; // ← ici
    });
  });

  document
    .querySelector(".portfolio-close-modal")
    .addEventListener("click", function () {
      modal.classList.add("portfolio-hidden-modal");
      document.body.style.overflow = ""; // ← ici

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

  // const isMobile = window.innerWidth < 768;
  // const spacing = 38;

  // gsap.to(lines.slice(1), {
  //   y: (i) => (i + 1) * spacing,
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: ".footer-animation",
  //     start: "top bottom",
  //     endTrigger: ".footer-contact",
  //     end: "bottom bottom",
  //     scrub: true,
  //     markers: true,
  //   },
  // });

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

  // ==========================================================================
  // easteregg 25/26 hihi
  // ==========================================================================

  Draggable.create(".hero-grid-cell-annee-rotate", {
    type: "rotation",
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // section portfolio : pop up
  // ============================================================

  const modal = document.querySelector(".porfolio-content-modal");
  const modalCloseButton = document.querySelector(".portfolio-close-modal");

  document.querySelectorAll(".porfolio-open-modal").forEach((card) => {
    card.addEventListener("click", () => {
      if (!modal) return;

      const popupId = card.parentElement.getAttribute("data-portfolio-popup");
      const popup = document.getElementById(popupId);

      if (!popup) return;

      popup.classList.remove("portfolio-selector-hidden");
      modal.classList.remove("portfolio-hidden-modal");
      document.body.style.overflow = "hidden";
    });
  });

  if (modal && modalCloseButton) {
    modalCloseButton.addEventListener("click", () => {
      modal.classList.add("portfolio-hidden-modal");
      document.body.style.overflow = "";

      document
        .querySelectorAll(".portfolio-body-modal")
        .forEach((contentModal) => {
          contentModal.classList.add("portfolio-selector-hidden");
        });
    });
  }

  // ============================================================
  // section footer : scrolling texts
  // ============================================================

  const lines = gsap.utils.toArray(".footer-track h4");

  if (lines.length) {
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

  const heroGrid = document.querySelector(".hero-grid");

  if (!heroGrid) return;

  const clickableCells = heroGrid.querySelectorAll(
    ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
  );

  // ==========================================================================
  // lignes de la grille
  // ==========================================================================

  // On lit la grille directement depuis le CSS.
  // Ça évite que le JS écrase la media query mobile quand aucun expand n'est ouvert.
  function getCssRows() {
    return getComputedStyle(heroGrid).gridTemplateRows;
  }

  function getRowsArray() {
    return getCssRows().split(" ");
  }

  // Remplace une ligne 0px par la vraie hauteur de l'expand.
  // rowIndex est en base 0 : ligne CSS 5 = index 4.
  function getRowsWithOpenExpand(rowIndex, expandHeight) {
    const rows = getRowsArray();

    rows[rowIndex] = `${expandHeight}px`;

    return rows.join(" ");
  }

  function getExpandRowIndex(rowType) {
    const rows = {
      // desktop : r2 = ligne 3, r3 = ligne 5, r4 = ligne 7
      // mobile avec ton CSS : r3 = ligne 5, r2 = ligne 14, r4 = ligne 17
      r2: window.matchMedia("(max-width: 768px)").matches ? 13 : 2,
      r3: window.matchMedia("(max-width: 768px)").matches ? 4 : 4,
      r4: window.matchMedia("(max-width: 768px)").matches ? 16 : 6,
    };

    return rows[rowType];
  }

  // ==========================================================================
  // ouverture / fermeture des expands
  // ==========================================================================

  function closeAll() {
    // Très important : on enlève la valeur inline pour redonner la main au CSS.
    heroGrid.style.removeProperty("grid-template-rows");

    heroGrid.classList.remove("open-r2", "open-r3", "open-r4");

    clickableCells.forEach((cell) => {
      cell.classList.remove("active");
    });

    // Remet "voir plus" par défaut quand on referme une ligne.
    heroGrid.querySelectorAll(".hero-grid-expand").forEach((expand) => {
      expand.classList.remove("is-expanded");
    });
  }

  // Calcule la vraie hauteur de l'expand et l'injecte à la bonne ligne.
  // On fait ça parce qu'une transition CSS ne peut pas animer proprement vers "auto".
  function openRow(rowType) {
    const expand = heroGrid.querySelector(`.hero-grid-expand-${rowType}`);
    const rowIndex = getExpandRowIndex(rowType);

    if (!expand || rowIndex === undefined) return;

    // On enlève d'abord l'inline style pour repartir de la grille CSS actuelle.
    heroGrid.style.removeProperty("grid-template-rows");

    const expandHeight = expand.scrollHeight;
    const rowHeights = getRowsWithOpenExpand(rowIndex, expandHeight);

    heroGrid.classList.add(`open-${rowType}`);
    heroGrid.style.gridTemplateRows = rowHeights;
  }

  clickableCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      event.preventDefault();

      const rowType = cell.getAttribute("data-row");

      if (!rowType) return;

      const isAlreadyOpen = heroGrid.classList.contains(`open-${rowType}`);

      closeAll();

      if (!isAlreadyOpen) {
        cell.classList.add("active");

        // Attend le prochain frame pour mesurer la hauteur une fois le DOM stable.
        requestAnimationFrame(() => {
          openRow(rowType);
        });
      }
    });
  });

  // ==========================================================================
  // voir plus / voir moins
  // ==========================================================================

  heroGrid.querySelectorAll(".hero-grid-expand").forEach((expand) => {
    const suite = expand.querySelector(".hero-grid-expand-text-suite");
    const voirPlus = expand.querySelector(".hero-grid-voir-plus");
    const voirMoins = expand.querySelector(".hero-grid-voir-moins");

    if (!suite || !voirPlus || !voirMoins) return;

    const rowType = [...expand.classList]
      .find((className) => /^hero-grid-expand-r\d$/.test(className))
      ?.replace("hero-grid-expand-", "");

    // Si cet expand est déjà ouvert, on recalcule sa hauteur après le toggle.
    const refreshHeightIfOpen = () => {
      if (rowType && heroGrid.classList.contains(`open-${rowType}`)) {
        requestAnimationFrame(() => {
          openRow(rowType);
        });
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

  // ==========================================================================
  // recalcul au resize
  // ==========================================================================

  window.addEventListener("resize", () => {
    const openedRow = ["r2", "r3", "r4"].find((rowType) =>
      heroGrid.classList.contains(`open-${rowType}`),
    );

    if (openedRow) {
      requestAnimationFrame(() => {
        openRow(openedRow);
      });
    } else {
      heroGrid.style.removeProperty("grid-template-rows");
    }

    ScrollTrigger.refresh();
  });

  // ==========================================================================
  // easter egg 25/26 hihi
  // ==========================================================================

  Draggable.create(".hero-grid-cell-annee-rotate", {
    type: "rotation",
  });
});
