// ============================================================
// section portfolio : pop up
// ============================================================

const modal = document.querySelector(".porfolio-content-modal");

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
