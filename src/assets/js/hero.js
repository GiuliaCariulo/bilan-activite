// ============================================================
// main.js — Interactivité du hero (grille d'accueil)
// Les données texte viennent de window.HERO_DATA, injecté
// dans index.njk via un bloc <script> Nunjucks.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Récupère les données injectées par Nunjucks dans index.njk
  const DATA = window.HERO_DATA;

  // Conteneur principal de la grille (gère les classes open-r2/r3/r4)
  const heroGrid = document.querySelector(".hero-grid");

  const ROW_CLASSES = ["open-r2", "open-r3", "open-r4"];

  // Ferme tous les expands : retire les classes "open-*"
  // La transition de grid-template-rows est gérée par le CSS
  function closeAllExpands() {
    heroGrid.classList.remove(...ROW_CLASSES);
    document.querySelectorAll(".hero-grid-expand").forEach((exp) => {
      exp.style.overflow = "hidden";
    });
  }

  // Remplit l'expand "priorités" : liste de blocs titre + texte
  // injectés dynamiquement depuis HERO_DATA.items
  function fillPriorites(expand, items) {
    const content = expand.querySelector(".hero-grid-expand-content");
    content.innerHTML = items
      .map(
        (item) => `
          <h3 class="hero-grid-cell-priorites-title">${item.titre}</h3>
          <p class="hero-grid-cell-priorites-text">${item.texte}</p>
        `,
      )
      .join("");
  }

  // Remplit un expand "standard" (texte + suite optionnelle avec voir plus/moins)
  // Utilise innerHTML pour que le HTML (généré par le filtre markdown de Nunjucks)
  // soit bien interprété par le navigateur
  function fillTextWithSuite(expand, text, textSuite) {
    expand.querySelector(".hero-grid-expand-text").innerHTML = text;

    const suite = expand.querySelector(".hero-grid-expand-text-suite");
    const voirPlus = expand.querySelector(".hero-grid-voir-plus");
    const voirMoins = expand.querySelector(".hero-grid-voir-moins");

    // Pas de texte "suite" : on cache tous les éléments liés
    if (!(textSuite && suite && voirPlus && voirMoins)) {
      if (suite) suite.style.display = "none";
      if (voirPlus) voirPlus.style.display = "none";
      if (voirMoins) voirMoins.style.display = "none";
      return;
    }

    // Initialisation : suite cachée, bouton "voir plus" visible
    suite.innerHTML = textSuite;
    suite.style.display = "none";
    voirPlus.style.display = "block";
    voirMoins.style.display = "none";

    // Recalcule la hauteur de l'expand après affichage/masquage de la suite
    const updateExpandHeight = () => {
      expand.style.maxHeight = `${expand.scrollHeight}px`;
    };

    voirPlus.onclick = () => {
      suite.style.display = "block";
      voirPlus.style.display = "none";
      voirMoins.style.display = "block";
      updateExpandHeight();
    };

    voirMoins.onclick = () => {
      suite.style.display = "none";
      voirPlus.style.display = "block";
      voirMoins.style.display = "none";
      updateExpandHeight();
    };
  }

  // Ouvre un expand : la hauteur est gérée par la transition CSS du wrapper
  // (grid-template-rows passe de 0fr à 1fr via .open-rX)
  function openExpand(expand) {
    expand.style.overflow = "visible";
  }

  // Ajoute un listener click sur chaque cellule cliquable ayant un data-row
  document.querySelectorAll(".hero-grid-cell[data-row]").forEach((cell) => {
    // Récupère la classe "hero-grid-cell-xxx" pour trouver la clé dans HERO_DATA
    const key = [...cell.classList].find(
      (c) => c.startsWith("hero-grid-cell-") && c !== "hero-grid-cell",
    );
    if (!DATA[key]) return;

    cell.addEventListener("click", () => {
      const data = DATA[key];
      const { row, signature } = data;
      const expand = document.querySelector(`.hero-grid-expand-${row}`);
      const isActive = cell.classList.contains("active");

      // Réinitialise l'état : aucune cellule active, aucun expand ouvert
      document
        .querySelectorAll(".hero-grid-cell")
        .forEach((c) => c.classList.remove("active"));
      closeAllExpands();

      // Si la cellule était déjà active, on s'arrête (toggle fermer)
      if (isActive) return;

      // Remplit le contenu selon le type de données
      if (data.items) {
        fillPriorites(expand, data.items);
      } else {
        fillTextWithSuite(expand, data.text, data.textSuite);
      }

      // Affiche la signature si elle existe
      const sig = expand.querySelector(".hero-grid-expand-signature");
      if (sig) {
        sig.innerHTML = signature || "";
        sig.style.display = signature ? "block" : "none";
      }

      // Active la cellule et ouvre la rangée correspondante
      cell.classList.add("active");
      heroGrid.classList.add(`open-${row}`);
      openExpand(expand);
    });
  });
}); // fin DOMContentLoaded
