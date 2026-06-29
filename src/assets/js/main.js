"use strict";

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
  // section biography : pop up
  // ============================================================

  document.querySelectorAll(".biography-open-modal").forEach((card) => {
    card.addEventListener("click", () => {
      const pos = card.getAttribute("data-member-pos");
      const modalBio = document.querySelector(
        `.biography-content-modal[data-index="${pos - 1}"]`,
      );
      if (!modalBio) return;

      modalBio.classList.remove("biography-hidden-modal");
      document.body.style.overflow = "hidden";
    });
  });

  document.querySelectorAll(".biography-close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn
        .closest(".biography-content-modal")
        .classList.add("biography-hidden-modal");
      document.body.style.overflow = "";
    });
  });

  document.querySelectorAll(".biography-content-modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("biography-hidden-modal");
        document.body.style.overflow = "";
      }
    });
  });

  // ============================================================
  // section footer : scrolling texts
  // ============================================================

  const lines = gsap.utils.toArray(".footer-track h4");

  if (lines.length) {
    const spacing = 70;
    const isMobile = window.innerWidth < 768;

    gsap.to(lines.slice(1), {
      y: (i) => (i + 1) * spacing,
      ease: "none",
      scrollTrigger: {
        trigger: isMobile ? ".footer-title" : ".footer-contact",
        start: isMobile ? "top 90%" : "top bottom",
        endTrigger: isMobile ? ".footer-contact" : ".footer-contact-copyright",
        end: isMobile ? "top 90%" : "bottom bottom",
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
              markers: false,
              toggleActions: "play reverse restart reverse",
            },
          },
        );
      });
    });
  });

  // ==========================================================================
  // easter egg 25/26 hihi
  // ==========================================================================

  if (document.querySelector(".hero-grid-cell-annee-rotate")) {
    Draggable.create(".hero-grid-cell-annee-rotate", {
      type: "rotation",
    });
  }

  // ==========================================================================
  // projet-page : thumbnail parallax + scale
  // ==========================================================================

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

// ==========================================================================
// loader page : loader active
// ==========================================================================

const hideLoader = (selector, delay) => {
  setTimeout(() => {
    const loader = document.querySelector(selector);
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      document.body.classList.remove("loading");
    }, 1000);
  }, delay);
};

document.body.classList.add("loading");

const isDough = sessionStorage.getItem("dough");
sessionStorage.removeItem("dough");

if (isDough) {
  document.querySelector(".loader-tetris").style.display = "none";
  hideLoader(".loader-dough", 1500);
} else {
  document.querySelector(".loader-dough").style.display = "none";
  hideLoader(".loader-tetris", 3000);
}

// clic projet ou retour → dough
document
  .querySelectorAll(".project-gallery-project-card, .projet-page-retour")
  .forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("dough", "true");
      window.location.href = el.getAttribute("href");
    });
  });
