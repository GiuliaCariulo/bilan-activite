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
