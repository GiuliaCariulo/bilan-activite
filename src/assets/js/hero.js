// // ============================================================
// // main.js — Interactivité du hero (grille d'accueil)
// // Les données texte viennent de window.HERO_DATA, injecté
// // dans index.njk via un bloc <script> Nunjucks.
// // ============================================================

// document.addEventListener("DOMContentLoaded", () => {
//   // Récupère les données injectées par Nunjucks dans index.njk
//   const DATA = window.HERO_DATA || {};
//   console.log("hero.js: DATA loaded:", JSON.stringify(DATA, null, 2));
//   if (!window.HERO_DATA) {
//     console.warn(
//       "hero.js: window.HERO_DATA is not defined — expands will be disabled until data is available.",
//     );
//   }

//   // Conteneur principal de la grille (gère les classes open-r2/r3/r4)
//   const heroGrid = document.querySelector(".hero-grid");
//   console.log("hero.js: heroGrid found:", !!heroGrid);

//   // Tests rapides : logs au clic sur les trois cellules importantes
//   ["mot", "edito", "priorites"].forEach((name) => {
//     const sel = `.hero-grid-cell-${name}`;
//     const el = document.querySelector(sel);
//     if (el) {
//       el.addEventListener("click", (e) => {
//         console.log(`hero.js: TEST CLICK on ${sel}`, {
//           dataset: el.dataset,
//           classList: [...el.classList],
//         });
//       });
//     } else {
//       console.log(`hero.js: TEST element not found: ${sel}`);
//     }
//   });

//   const ROW_CLASSES = ["open-r2", "open-r3", "open-r4"];

//   // Ferme tous les expands : retire les classes "open-*"
//   // La transition de grid-template-rows est gérée par le CSS
//   function closeAllExpands() {
//     if (!heroGrid) return;
//     heroGrid.classList.remove(...ROW_CLASSES);
//     // reset inline grid heights to defaults
//     heroGrid.style.gridTemplateRows = "1fr 1fr 0fr 1fr 0fr 1fr 0fr 1fr";
//     document.querySelectorAll(".hero-grid-expand").forEach((exp) => {
//       exp.style.overflow = "hidden";
//       exp.style.maxHeight = "0";
//     });
//   }

//   // Remplit l'expand "priorités" : liste de blocs titre + texte
//   // injectés dynamiquement depuis HERO_DATA.items
//   function fillPriorites(expand, items) {
//     const content = expand.querySelector(".hero-grid-expand-content");
//     content.innerHTML = items
//       .map(
//         (item) => `
//           <h3 class="hero-grid-cell-priorites-title">${item.titre}</h3>
//           <p class="hero-grid-cell-priorites-text">${item.texte}</p>
//         `,
//       )
//       .join("");
//   }

//   // Remplit un expand "standard" (texte + suite optionnelle avec voir plus/moins)
//   // Utilise innerHTML pour que le HTML (généré par le filtre markdown de Nunjucks)
//   // soit bien interprété par le navigateur
//   function fillTextWithSuite(expand, text, textSuite) {
//     expand.querySelector(".hero-grid-expand-text").innerHTML = text;

//     const suite = expand.querySelector(".hero-grid-expand-text-suite");
//     const voirPlus = expand.querySelector(".hero-grid-voir-plus");
//     const voirMoins = expand.querySelector(".hero-grid-voir-moins");

//     // Pas de texte "suite" : on cache tous les éléments liés
//     if (!(textSuite && suite && voirPlus && voirMoins)) {
//       if (suite) suite.style.display = "none";
//       if (voirPlus) voirPlus.style.display = "none";
//       if (voirMoins) voirMoins.style.display = "none";
//       return;
//     }

//     // Initialisation : suite cachée, bouton "voir plus" visible
//     suite.innerHTML = textSuite;
//     suite.style.display = "none";
//     voirPlus.style.display = "block";
//     voirMoins.style.display = "none";

//     // Recalcule la hauteur de l'expand après affichage/masquage de la suite
//     const updateExpandHeight = () => {
//       expand.style.maxHeight = `${expand.scrollHeight}px`;
//     };

//     voirPlus.onclick = () => {
//       suite.style.display = "block";
//       voirPlus.style.display = "none";
//       voirMoins.style.display = "block";
//       updateExpandHeight();
//     };

//     voirMoins.onclick = () => {
//       suite.style.display = "none";
//       voirPlus.style.display = "block";
//       voirMoins.style.display = "none";
//       updateExpandHeight();
//     };
//   }

//   // Ouvre un expand : on mesure sa hauteur, on anime son maxHeight et on
//   // applique la valeur en pixels dans gridTemplateRows du wrapper.
//   function openExpand(expand, row) {
//     if (!expand || !heroGrid) return;
//     expand.style.overflow = "visible";

//     // Mesure la hauteur réelle du contenu
//     expand.style.maxHeight = "none";
//     const targetHeight = expand.scrollHeight;

//     // Repart de 0 pour permettre la transition CSS
//     expand.style.maxHeight = "0px";

//     // Construire les valeurs de grid-template-rows avec la hauteur mesurée en px
//     const rowsMap = {
//       r2: `1fr 1fr ${targetHeight}px 1fr 0fr 1fr 0fr 1fr`,
//       r3: `1fr 1fr 0fr 1fr ${targetHeight}px 1fr 0fr 1fr`,
//       r4: `1fr 1fr 0fr 1fr 0fr 1fr ${targetHeight}px 1fr`,
//     };

//     // Apply grid rows on next frame and animate maxHeight
//     requestAnimationFrame(() => {
//       heroGrid.style.gridTemplateRows =
//         rowsMap[row] || "1fr 1fr 0fr 1fr 0fr 1fr 0fr 1fr";
//       expand.style.maxHeight = `${targetHeight}px`;
//     });
//   }

//   // Ajoute un listener click sur chaque cellule cliquable ayant un data-row
//   const cellsWithDataRow = document.querySelectorAll(
//     ".hero-grid-cell[data-row]",
//   );
//   console.log(
//     "hero.js: found",
//     cellsWithDataRow.length,
//     "cells with [data-row]",
//   );
//   cellsWithDataRow.forEach((cell) => {
//     console.log(
//       "hero.js: attaching listener to cell",
//       cell.dataset.pos,
//       cell.className,
//     );
//     // Récupère la classe "hero-grid-cell-xxx" pour trouver la clé dans HERO_DATA
//     const key = [...cell.classList].find(
//       (c) => c.startsWith("hero-grid-cell-") && c !== "hero-grid-cell",
//     );
//     if (!DATA[key]) {
//       // si la clé n'existe pas, on logge et on ignore la cellule
//       console.warn(
//         "hero.js: no DATA for key",
//         key,
//         "— ignoring cell",
//         cell.dataset.pos,
//       );
//       return;
//     }

//     cell.addEventListener("click", () => {
//       console.log("hero.js: cell clicked", cell.dataset.pos, key);
//       const data = DATA[key];
//       const { row, signature } = data;
//       const expand = document.querySelector(`.hero-grid-expand-${row}`);
//       if (!expand) {
//         console.warn("hero.js: expand element not found for row", row);
//       }
//       console.log("hero.js: target expand element:", expand);
//       const isActive = cell.classList.contains("active");

//       // Réinitialise l'état : aucune cellule active, aucun expand ouvert
//       document
//         .querySelectorAll(".hero-grid-cell")
//         .forEach((c) => c.classList.remove("active"));
//       closeAllExpands();

//       // Si la cellule était déjà active, on s'arrête (toggle fermer)
//       if (isActive) return;

//       // Remplit le contenu selon le type de données
//       if (data.items) {
//         fillPriorites(expand, data.items);
//       } else {
//         fillTextWithSuite(expand, data.text, data.textSuite);
//       }

//       // Affiche la signature si elle existe
//       const sig = expand.querySelector(".hero-grid-expand-signature");
//       if (sig) {
//         sig.innerHTML = signature || "";
//         sig.style.display = signature ? "block" : "none";
//       }

//       // Active la cellule et ouvre la rangée correspondante
//       cell.classList.add("active");
//       heroGrid.classList.add(`open-${row}`);
//       openExpand(expand, row);
//     });
//   });
// }); // fin DOMContentLoaded
