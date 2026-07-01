"use strict";

export function initPortfolioModal() {
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
}
