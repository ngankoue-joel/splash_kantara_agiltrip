/* Kantara AgilTrip — splash screen (templates/composants/splash.html, static/css/splash.css).
   JavaScript natif. Chargé dans <head> sans « defer » : la version est choisie avant le premier
   affichage, si bien que le splash ne clignote pas sur les pages suivantes de la session.
   - premier lancement sur l'appareil (drapeau dans localStorage) : version complète, arche puis bus ;
   - lancements suivants : version courte, l'arche seule ;
   - une seule fois par onglet (sessionStorage) : rien quand on change de page ;
   - stockage bloqué : version courte ;
   - « réduire les animations » activé : le logo 1 s, sans mouvement.
   Un toucher, un clic ou une touche du clavier le ferme tout de suite. À la fin, il quitte le DOM. */
(function () {
  'use strict';

  var CLE_APPAREIL = 'kantara.splash.deja-lance';
  var CLE_SESSION = 'kantara.splash.vu';
  // Fin du fondu de chaque version (ms). Filet de sécurité si « animationend » n'arrive pas.
  var DUREES = { complet: 7760, court: 2500, reduit: 1400 };

  var choisirVersion = function () {
    var version;
    try {
      if (window.sessionStorage.getItem(CLE_SESSION)) { return null; }
      window.sessionStorage.setItem(CLE_SESSION, '1');
      version = window.localStorage.getItem(CLE_APPAREIL) ? 'court' : 'complet';
      window.localStorage.setItem(CLE_APPAREIL, '1');
    } catch (erreur) {
      version = 'court';
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      version = 'reduit';
    }
    return version;
  };

  var version = choisirVersion();
  var racine = document.documentElement;
  var classes = version ? ['splash-actif', 'splash-' + version] : [];
  classes.forEach(function (nom) { racine.classList.add(nom); });

  var brancher = function () {
    var splash = document.querySelector('.splash');
    var minuteur = null;
    var retirer = function () {
      window.clearTimeout(minuteur);
      document.removeEventListener('keydown', retirer);
      if (splash && splash.parentNode) { splash.parentNode.removeChild(splash); }
      classes.forEach(function (nom) { racine.classList.remove(nom); });
    };
    if (!splash || !version) { retirer(); return; }  // déjà vu dans cet onglet : il ne s'affiche pas
    splash.addEventListener('animationend', function (evenement) {
      if (evenement.target === splash) { retirer(); }
    });
    splash.addEventListener('click', retirer);
    document.addEventListener('keydown', retirer);
    minuteur = window.setTimeout(retirer, DUREES[version] + 500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', brancher);
  } else {
    brancher();
  }
}());
