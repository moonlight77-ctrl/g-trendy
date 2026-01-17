// src/utils/scroll.ts

export const smoothScrollTo = (e: React.MouseEvent, id: string) => {
  e.preventDefault();

  const element = document.getElementById(id);
  if (!element) return;

  // 1. Détecter la hauteur réelle du header (Navbar)
  // On cherche la balise <header> car c'est elle qui est sticky
  const header = document.querySelector('header');
  
  // 2. Calculer l'offset dynamique
  // Si on trouve le header, on prend sa hauteur + 20px de respiration.
  // Sinon, on garde 120px par sécurité.
  const offset = header ? header.offsetHeight + 20 : 120;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;

  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // Mise à jour de l'URL
  window.history.pushState(null, "", `#${id}`);
};