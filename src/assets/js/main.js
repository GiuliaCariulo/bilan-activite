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

  if (heroGrid) {
    const clickableCells = heroGrid.querySelectorAll(
      ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
    );

    // ==========================================================================
    // lignes de la grille
    // ==========================================================================

    function getCssRows() {
      return getComputedStyle(heroGrid).gridTemplateRows;
    }

    function getRowsArray() {
      return getCssRows().split(" ");
    }

    function getRowsWithOpenExpand(rowIndex, expandHeight) {
      const rows = getRowsArray();
      rows[rowIndex] = `${expandHeight}px`;
      return rows.join(" ");
    }

    function getExpandRowIndex(rowType) {
      const rows = {
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
      heroGrid.style.removeProperty("grid-template-rows");
      heroGrid.classList.remove("open-r2", "open-r3", "open-r4");

      clickableCells.forEach((cell) => {
        cell.classList.remove("active");
      });

      heroGrid.querySelectorAll(".hero-grid-expand").forEach((expand) => {
        expand.classList.remove("is-expanded");
      });
    }

    function openRow(rowType) {
      const expand = heroGrid.querySelector(`.hero-grid-expand-${rowType}`);
      const rowIndex = getExpandRowIndex(rowType);

      if (!expand || rowIndex === undefined) return;

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
  }

  // ==========================================================================
  // easter egg 25/26 hihi
  // ==========================================================================

  if (document.querySelector(".hero-grid-cell-annee-rotate")) {
    Draggable.create(".hero-grid-cell-annee-rotate", {
      type: "rotation",
    });
  }

  // ============================================================
  // projet-page : thumbnail parallax + scale
  // ============================================================

  const thumbnailImage = document.querySelector(".projet-page-thumbnail img");

  if (thumbnailImage) {
    gsap.fromTo(
      thumbnailImage,
      {
        scale: 1.5,
        yPercent: 0,
      },
      {
        scale: 1.1,
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
});
