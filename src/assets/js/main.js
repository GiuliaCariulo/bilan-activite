import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

document.addEventListener("DOMContentLoaded", () => {
  //   // ============================================================
  //   // section portfolio : pop up
  //   // ============================================================
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

  //   // ============================================================
  //   // section footer : scrolling texts
  //   // ============================================================
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

  //   // ============================================================
  //   // hero.js — Gestion de la grille héro et des expansions
  //   // ============================================================

  //   // ==========================================================================
  //   // ouverture / fermeture des expands
  //   // ==========================================================================

  const heroGrid = document.querySelector(".hero-grid");
  const clickableCells = document.querySelectorAll(
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

    // Remet les lignes des autres expands à 0, au cas où leur transition de
    // fermeture ne serait pas terminée (sinon on figerait une hauteur intermédiaire).
    ["r2", "r3", "r4"].forEach((rowType) => {
      const otherRowIndex = getExpandRowIndex(rowType);
      if (otherRowIndex !== undefined) rows[otherRowIndex] = "0px";
    });

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
  // fermeture au clic sur un lien du hero (contact, sessions, etc.)
  // ==========================================================================

  heroGrid.querySelectorAll("a.hero-grid-cell").forEach((link) => {
    link.addEventListener("click", () => {
      closeAll();
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
  // recalcul au resize
  // ==========================================================================

  window.addEventListener("resize", () => {
    const openedRow = ["r2", "r3", "r4"].find((rowType) =>
      heroGrid.classList.contains(`open-${rowType}`),
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
  });

  // ==========================================================================
  // sessions & encadrants explosion: fiouuuu !
  // ==========================================================================

  window.addEventListener("load", () => {
    const containers = gsap.utils.toArray(".team-container");

    containers.forEach((container) => {
      const teamBox = container.querySelector(".team-box");
      const cards = gsap.utils.toArray(
        container.querySelectorAll(".team-card-member"),
      );

      if (!teamBox || !cards.length) return;

      const boxRect = teamBox.getBoundingClientRect();
      const boxCenterX = boxRect.left + boxRect.width / 2;
      const boxCenterY = boxRect.top + boxRect.height / 2;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const offsetX = boxCenterX - cardCenterX;
        const offsetY = boxCenterY - cardCenterY;

        const scaleStart = Math.min(
          boxRect.width / cardRect.width,
          boxRect.height / cardRect.height,
        );

        gsap.fromTo(
          card,
          { x: offsetX, y: offsetY, scale: scaleStart, zIndex: 0 },
          {
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            duration: 1,
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              end: "bottom 60%",
              markers: true,
              toggleActions: "play reverse restart reverse",
            },
          },
        );
      });
    });
  });
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
