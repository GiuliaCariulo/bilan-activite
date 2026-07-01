"use strict";

export function initScrollTopButton() {
  const button = document.getElementById("myBtn");

  if (!button) return;

  const updateVisibility = () => {
    const isModalOpen = document.body.style.overflow === "hidden";
    const scrolled =
      document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;

    button.style.display = !isModalOpen && scrolled ? "block" : "none";
  };

  window.addEventListener("scroll", updateVisibility);

  // Les modales togglent document.body.style.overflow à l'ouverture/fermeture ;
  // on observe cet attribut pour masquer le bouton dès qu'une modale s'ouvre,
  // sans attendre un événement de scroll.
  new MutationObserver(updateVisibility).observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  });

  button.addEventListener("click", () => {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  });
}
