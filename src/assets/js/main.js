import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

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
  const footerAnimation = document.querySelector(".footer-animation");

  if (lines.length && footerAnimation) {
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
  // valeurs de grille desktop / mobile
  // ==========================================================================

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  // Doit rester synchro avec grid-template-rows desktop dans _hero.scss
  const DESKTOP_DEFAULT_ROWS = "20vh 20vh 0px 20vh 0px 20vh 0px 20vh";

  // Doit rester synchro avec grid-template-rows mobile dans _hero.scss
  // Chaque unité vaut une colonne mobile : 6 colonnes = cases carrées.
  const MOBILE_UNIT = "calc(100vw / 6)";

  const MOBILE_DEFAULT_ROWS = `
    repeat(2, ${MOBILE_UNIT})
    0px
    repeat(2, ${MOBILE_UNIT})
    0px
    repeat(6, ${MOBILE_UNIT})
    0px
    repeat(2, ${MOBILE_UNIT})
    0px
    repeat(8, ${MOBILE_UNIT})
  `;

  function getDefaultRows() {
    return isMobile() ? MOBILE_DEFAULT_ROWS : DESKTOP_DEFAULT_ROWS;
  }

  // ==========================================================================
  // ouverture / fermeture des expands
  // ==========================================================================

  function closeAll() {
    heroGrid.style.gridTemplateRows = getDefaultRows();
    heroGrid.classList.remove("open-r2", "open-r3", "open-r4");

    clickableCells.forEach((cell) => {
      cell.classList.remove("active");
    });

    // Remet "voir plus" par défaut quand on referme une ligne
    heroGrid.querySelectorAll(".hero-grid-expand").forEach((expand) => {
      expand.classList.remove("is-expanded");
    });
  }

  // Calcule la vraie hauteur de l'expand et l'injecte en px.
  // On fait ça parce qu'une transition CSS ne peut pas animer proprement vers "auto".
  function openRow(rowType) {
    const expand = heroGrid.querySelector(`.hero-grid-expand-${rowType}`);

    if (!expand) return;

    const expandHeight = expand.scrollHeight;
    const rowHeights = isMobile()
      ? getMobileRows(rowType, expandHeight)
      : getDesktopRows(rowType, expandHeight);

    if (!rowHeights) return;

    heroGrid.classList.add(`open-${rowType}`);
    heroGrid.style.gridTemplateRows = rowHeights;
  }

  function getDesktopRows(rowType, expandHeight) {
    const rows = {
      r2: `20vh 20vh ${expandHeight}px 20vh 0px 20vh 0px 20vh`,
      r3: `20vh 20vh 0px 20vh ${expandHeight}px 20vh 0px 20vh`,
      r4: `20vh 20vh 0px 20vh 0px 20vh ${expandHeight}px 20vh`,
    };

    return rows[rowType];
  }

  function getMobileRows(rowType, expandHeight) {
    const closed = "0px";
    const open = `${expandHeight}px`;

    const rows = {
      // r3 = edito
      r3: `
        repeat(2, ${MOBILE_UNIT})
        ${open}
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(6, ${MOBILE_UNIT})
        ${closed}
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(8, ${MOBILE_UNIT})
      `,

      // r2 = mot du directeur
      r2: `
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(6, ${MOBILE_UNIT})
        ${open}
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(8, ${MOBILE_UNIT})
      `,

      // r4 = priorités
      r4: `
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(2, ${MOBILE_UNIT})
        ${closed}
        repeat(6, ${MOBILE_UNIT})
        ${closed}
        repeat(2, ${MOBILE_UNIT})
        ${open}
        repeat(8, ${MOBILE_UNIT})
      `,
    };

    return rows[rowType];
  }

  closeAll();

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
      openRow(openedRow);
    } else {
      heroGrid.style.gridTemplateRows = getDefaultRows();
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
