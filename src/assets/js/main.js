"use strict";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Draggable } from "gsap/Draggable";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable, SplitText);

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
        start: isMobile ? "top 90%" : "-20% bottom",
        endTrigger: isMobile ? ".footer-contact" : ".footer-contact-copyright",
        end: isMobile ? "top 100%" : "55% bottom",
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
              start: "top 50%",
              end: "bottom 60%",
              toggleActions: "play reverse restart reverse",
            },
          },
        );
      });
    });
  });

  // ==========================================================================
  // projet-gallery : parallax — les cartes montent depuis le bas
  // ==========================================================================

  window.addEventListener("load", () => {
    const cards = gsap.utils.toArray(".project-gallery-project-card");

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: "power.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top 70%",
            scrub: 1.2,
            toggleActions: "play reverse",
            markers: false,
          },
        },
      );
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
        scale: 1.08,
        yPercent: 0,
      },
      {
        scale: 1,
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

  // ============================================================
  // animations
  // ============================================================

  console.clear();

  gsap.set(".split-text", { opacity: 1 });

  document.fonts.ready.then(() => {
    let containers = gsap.utils.toArray(".split-text-container");

    containers.forEach((container) => {
      let text = container.querySelector(".split-text");
      let animation;

      SplitText.create(text, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (instance) => {
          console.log("split");
          return gsap.from(instance.lines, {
            yPercent: 120,
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              // markers: true,
              scrub: true,
              start: "20px 70%",
              end: "20px 50%",
            },
          });
        },
      });
    });
  });

  ScrollTrigger.batch(".images", {
    // interval: 0.1, // time window (in seconds) for batching to occur.
    // batchMax: 3,   // maximum batch size (targets)
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        stagger: 0.2,
        duration: 1,
        ease: "expo.out",
      }),
    // also onLeave, onEnterBack, and onLeaveBack
    // also most normal ScrollTrigger values like start, end, etc.
  });

  // ==========================================================================
  // button top
  // ==========================================================================

  // Get the button:
  let mybutton = document.getElementById("myBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  mybutton.addEventListener("click", () => {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  });
});
// ==========================================================================
// Screen mise en veille : DVD
// ==========================================================================
(function () {
  const overlay = document.getElementById("screensaver-overlay");
  const pasta = document.getElementById("dvd-pate");

  if (!overlay || !pasta) return;

  const IDLE_TIME = 10 * 1000; // 10 secondes (mode test) — remettre 10 * 60 * 1000 en prod
  let idleTimer = null;
  let animFrame = null;

  let x = Math.random() * (window.innerWidth - 220);
  let y = Math.random() * (window.innerHeight - 220);
  let vx = 2.2;
  let vy = 2.2;
  let rotation = 0;
  const rotSpeed = 0.15;

  function randomHue() {
    return Math.floor(Math.random() * 360);
  }
  pasta.style.filter += ` hue-rotate(${randomHue()}deg)`;

  function bounceCorner() {
    const baseFilter = "drop-shadow(0 0 25px rgba(255, 200, 60, 0.35))";
    pasta.style.filter = `${baseFilter} hue-rotate(${randomHue()}deg)`;
  }

  function animate() {
    const w = pasta.offsetWidth || 220;
    const h = pasta.offsetHeight || 220;

    x += vx;
    y += vy;

    let bounced = false;

    if (x <= 0) {
      x = 0;
      vx = Math.abs(vx);
      bounced = true;
    } else if (x + w >= window.innerWidth) {
      x = window.innerWidth - w;
      vx = -Math.abs(vx);
      bounced = true;
    }

    if (y <= 0) {
      y = 0;
      vy = Math.abs(vy);
      bounced = true;
    } else if (y + h >= window.innerHeight) {
      y = window.innerHeight - h;
      vy = -Math.abs(vy);
      bounced = true;
    }

    if (bounced) {
      bounceCorner();
    }

    rotation += rotSpeed;

    pasta.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

    animFrame = requestAnimationFrame(animate);
  }

  function startScreensaver() {
    overlay.classList.add("active");
    x = Math.random() * (window.innerWidth - 220);
    y = Math.random() * (window.innerHeight - 220);
    if (!animFrame) {
      animate();
    }
  }

  function stopScreensaver() {
    overlay.classList.remove("active");
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function resetIdleTimer() {
    stopScreensaver();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startScreensaver, IDLE_TIME);
  }

  ["mousemove", "mousedown", "keydown", "wheel", "touchstart"].forEach(
    (evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    },
  );

  overlay.addEventListener("mousemove", resetIdleTimer);
  overlay.addEventListener("click", resetIdleTimer);

  window.addEventListener("resize", () => {
    x = Math.min(x, window.innerWidth - (pasta.offsetWidth || 220));
    y = Math.min(y, window.innerHeight - (pasta.offsetHeight || 220));
  });

  resetIdleTimer();
})();
// ==========================================================================
// loader page : loader active
// ==========================================================================

const hideLoader = (selector, delay) => {
  setTimeout(() => {
    const loader = document.querySelector(selector);
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.classList.remove("active");
      loader.style.opacity = "";
      document.body.classList.remove("loading");
    }, 1000);
  }, delay);
};

document.body.classList.add("loading");

const isDough = sessionStorage.getItem("dough");
sessionStorage.removeItem("dough");

if (isDough) {
  document.querySelector(".loader-dough").classList.add("active");
  hideLoader(".loader-dough", 1500);
} else {
  document.querySelector(".loader-tetris").classList.add("active");
  hideLoader(".loader-tetris", 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".project-gallery-project-card, .projet-page-retour")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem("dough", "true");
        window.location.href = el.getAttribute("href");
      });
    });
});
