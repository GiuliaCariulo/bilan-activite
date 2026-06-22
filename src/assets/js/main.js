// Entrée globale (garder un petit log pour vérifier le chargement)
console.log("main.js chargé");
console.log("test");

// ============================================================
// hero.js — Gestion de la grille héro et des expansions
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // ouverture / fermeture des expands
  // ==========================================================================

  const heroGrid = document.querySelector(".hero-grid");
  const clickableCells = document.querySelectorAll(
    ".hero-grid-cell-mot, .hero-grid-cell-edito, .hero-grid-cell-priorites",
  );

  function closeAll() {
    heroGrid.classList.remove("open-r2", "open-r3", "open-r4");
    clickableCells.forEach((c) => c.classList.remove("active"));
  }

  clickableCells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      e.preventDefault();

      const rowType = cell.getAttribute("data-row");
      if (!rowType) return;

      const isAlreadyOpen = heroGrid.classList.contains(`open-${rowType}`);

      closeAll();

      if (!isAlreadyOpen) {
        heroGrid.classList.add(`open-${rowType}`);
        cell.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // voir plus / voir moins
  // ==========================================================================

  document.querySelectorAll(".hero-grid-expand").forEach((expand) => {
    const suite = expand.querySelector(".hero-grid-expand-text-suite");
    const voirPlus = expand.querySelector(".hero-grid-voir-plus");
    const voirMoins = expand.querySelector(".hero-grid-voir-moins");

    if (!suite || !voirPlus || !voirMoins) return;

    voirPlus.addEventListener("click", () => {
      suite.style.display = "block";
      voirPlus.style.display = "none";
      voirMoins.style.display = "block";
    });

    voirMoins.addEventListener("click", () => {
      suite.style.display = "none";
      voirPlus.style.display = "block";
      voirMoins.style.display = "none";
    });
  });
});
