// ============================================================
// hero.js — Gestion de la grille héro et des expansions
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const heroGrid = document.querySelector(".hero-grid");
  const clickableCells = document.querySelectorAll(
    ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
  );

  // Pour chaque cellule cliquable, ajouter l'écouteur
  clickableCells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      e.preventDefault();
      const rowType = cell.getAttribute("data-row"); // "r2", "r3", "r4"

      if (!rowType) return;

      // Vérifier si cette section est déjà ouverte
      const isAlreadyOpen = heroGrid.classList.contains(`open-${rowType}`);

      // Fermer toutes les sections ouvertes
      heroGrid.classList.remove("open-r2", "open-r3", "open-r4");

      // Retirer la classe is-active de tous les expand
      document.querySelectorAll(".hero-grid-expand").forEach((expand) => {
        expand.classList.remove("is-active");
      });

      // Si elle n'était pas déjà ouverte, l'ouvrir
      if (!isAlreadyOpen) {
        heroGrid.classList.add(`open-${rowType}`);
        const expand = document.querySelector(`.hero-grid-expand-${rowType}`);
        if (expand) {
          expand.classList.add("is-active");
        }
      }
    });
  });
});
