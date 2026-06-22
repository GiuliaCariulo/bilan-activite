import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// section const
// ============================================================

const modal = document.querySelector(".porfolio-content-modal");
const lines = gsap.utils.toArray(".footer-track h4");

// ============================================================
// section portfolio : pop up
// ============================================================

document.querySelectorAll(".porfolio-open-modal").forEach(function (card) {
  card.addEventListener("click", function () {
    modal.classList.remove("portfolio-hidden-modal");
  });
});

document
  .querySelector(".portfolio-close-modal")
  .addEventListener("click", function () {
    modal.classList.add("portfolio-hidden-modal");
  });

// ============================================================
// section footer : scrolling texts
// ============================================================

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
      markers: true,
    },
  });
}
