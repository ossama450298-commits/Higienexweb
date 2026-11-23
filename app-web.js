/* ============================================================
   HIGIENEX — La web como app instalable (app-web.js)
   · Abierta como app (desde el icono): barra inferior con Inicio,
     Productos, Presupuesto, Carrito y Cuenta, como una app del móvil.
   · Accesos directos del icono (mantener pulsado): ?app=compte, ?app=seguiment
     (Productos y Presupuesto usan ?seccio=, que ya existía).
   · iPhone: un aviso con cómo instalarla (Safari no tiene botón de instalar).
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    inici: ['Inici', 'Inicio', 'Home', 'Accueil', 'Start', 'الرئيسية'],
    productes: ['Productes', 'Productos', 'Products', 'Produits', 'Produkte', 'المنتجات'],
    pressupost: ['Pressupost', 'Presupuesto', 'Quote', 'Devis', 'Angebot', 'عرض سعر'],
    cistell: ['Cistell', 'Carrito', 'Cart', 'Panier', 'Warenkorb', 'السلة'],
    compte: ['Compte', 'Cuenta', 'Account', 'Compte', 'Konto', 'الحساب'],
    iosTit: ['Instal·la HIGIENEX al mòbil', 'Instala HIGIENEX en el móvil', 'Install HIGIENEX on your phone', 'Installez HIGIENEX sur votre mobile', 'HIGIENEX auf dem Handy installieren', 'ثبّت HIGIENEX على هاتفك'],
    iosTxt: ['Toca el botó Compartir i després «Afegir a la pantalla d’inici».', 'Toca el botón Compartir y después «Añadir a pantalla de inicio».', 'Tap the Share button, then “Add to Home Screen”.', 'Touchez Partager puis « Sur l’écran d’accueil ».', 'Tippen Sie auf Teilen und dann auf „Zum Home-Bildschirm“.', 'اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var esApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  if (esApp) document.documentElement.classList.add('hx-app');

  var ICON = {
    inici: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    productes: '<path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3z"/><path d="M9 13h6"/>',
    pressupost: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    cistell: '<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    compte: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  };
  function accio(k) {
    if (k === 'inici') return navTo('home');
    if (k === 'productes') return navTo('productes');
    if (k === 'pressupost') return navTo('pressupost');
    if (k === 'cistell') return openCartDrawer();
    // Cuenta: con sesión, la zona de clientes en «Tus datos»; sin sesión, entrar
    if (window.HX_USER) {
      openCartDrawer();
      setTimeout(function () { var d = document.getElementById('hxMisDades'); if (d) d.scrollIntoView({ behavior: 'smooth' }); }, 400);
    } else if (typeof openAuthModal === 'function') openAuthModal();
  }
  function barra() {
    if (!esApp) return;
    var b = document.getElementById('hxAppBar');
    if (!b) { b = document.createElement('nav'); b.id = 'hxAppBar'; b.setAttribute('aria-label', 'HIGIENEX'); document.body.appendChild(b); }
    var n = 0; try { Object.keys(cart || {}).forEach(function (k) { n += cart[k].qty; }); } catch (e) { n = 0; }
    b.innerHTML = ['inici', 'productes', 'pressupost', 'cistell', 'compte'].map(function (k) {
      return '<button type="button" data-k="' + k + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>' +
        (k === 'cistell' && n ? '<span class="hx-ab-n">' + (n > 99 ? '99+' : n) + '</span>' : '') + '<span>' + esc(t(k)) + '</span></button>';
    }).join('');
    [].forEach.call(b.querySelectorAll('button'), function (x) { x.onclick = function () { accio(x.getAttribute('data-k')); }; });
  }

  // Accesos directos del icono que no son una sección
  function accesDirecte() {
    var a = new URLSearchParams(location.search).get('app');
    if (!a) return;
    history.replaceState(history.state, '', location.pathname);
    if (a === 'compte') setTimeout(function () { accio('compte'); }, 900);
    if (a === 'seguiment') setTimeout(function () { navTo('contacte'); var s = document.getElementById('seguiment-comanda'); if (s) s.scrollIntoView(); }, 600);
  }

  // iPhone/iPad en Safari, sin instalar: aviso una sola vez
  function avisIos() {
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!ios || esApp) return;
    try { if (localStorage.getItem('hx_ios_avis')) return; localStorage.setItem('hx_ios_avis', '1'); } catch (e) { return; }
    setTimeout(function () {
      var d = document.createElement('div');
      d.id = 'hxIosAvis'; d.setAttribute('role', 'status');
      d.innerHTML = '<img src="icons/apple-touch-icon-web.png" alt="" width="44" height="44"><div><strong>' + esc(t('iosTit')) + '</strong><p>' + esc(t('iosTxt')) + '</p></div>' +
        '<button type="button" aria-label="' + esc(t('tancar')) + '">✕</button>';
      d.querySelector('button').onclick = function () { d.remove(); };
      document.body.appendChild(d);
    }, 15000);
  }

  function iniciar() {
    barra(); accesDirecte(); avisIos();
    ['renderCart', 'hxApplyLang'].forEach(function (n) {
      var f = window[n];
      if (typeof f !== 'function' || f._hxAppBar) return;
      var w = function () { var r = f.apply(this, arguments); barra(); return r; };
      w._hxAppBar = true; window[n] = w;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
