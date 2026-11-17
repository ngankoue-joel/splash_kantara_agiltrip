/* Page d'aperçu seulement : à ne pas copier dans le projet.
   splash.js ne montre le splash qu'une fois par onglet, et la version complète qu'une fois par
   appareil. Ces boutons effacent les drapeaux puis rechargent la page pour le revoir. */
(function () {
  'use strict';
  document.querySelectorAll('[data-version]').forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      try {
        window.sessionStorage.removeItem('kantara.splash.vu');
        if (bouton.getAttribute('data-version') === 'complet') {
          window.localStorage.removeItem('kantara.splash.deja-lance');
        } else {
          window.localStorage.setItem('kantara.splash.deja-lance', '1');
        }
      } catch (erreur) { /* stockage bloqué : splash.js montrera la version courte */ }
      window.location.reload();
    });
  });
}());
