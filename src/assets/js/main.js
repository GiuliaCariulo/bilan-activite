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
