"use strict";

const hideLoader = (selector, delay) => {
  setTimeout(() => {
    const loader = document.querySelector(selector);
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.classList.remove("active");
      loader.style.opacity = "";
      document.body.classList.remove("loading");
    }, 1000);
  }, delay);
};

export function initLoader() {
  document.body.classList.add("loading");

  const isDough = sessionStorage.getItem("dough");
  sessionStorage.removeItem("dough");

  if (isDough) {
    document.querySelector(".loader-dough").classList.add("active");
    hideLoader(".loader-dough", 1500);
  } else {
    document.querySelector(".loader-tetris").classList.add("active");
    hideLoader(".loader-tetris", 3000);
  }
}

export function initDoughNavigation() {
  document
    .querySelectorAll(".project-gallery-project-card, .projet-page-retour")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem("dough", "true");
        window.location.href = el.getAttribute("href");
      });
    });
}
