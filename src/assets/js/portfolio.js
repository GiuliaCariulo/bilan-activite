document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById(card.dataset.popup).style.display = "flex";
  });
});

document.querySelectorAll(".portfolio-close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.closest(".portfolio-overlay").style.display = "none";
  });
});
