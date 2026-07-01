"use strict";

export function initScrollTopButton() {
  const button = document.getElementById("myBtn");

  if (!button) return;

  const scrollFunction = () => {
    const scrolled =
      document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    button.style.display = scrolled ? "block" : "none";
  };

  window.addEventListener("scroll", scrollFunction);

  button.addEventListener("click", () => {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  });
}
