"use strict";

export function initBiographyModal() {
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
}
