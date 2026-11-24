/* ============================================================
   HIGIENEX — Web en mantenimiento
   El Centro de control del ERP puede poner la web pública en mantenimiento
   (Configuración → Modo mantenimiento → «También la web pública»). Aquí se
   pregunta al servidor al abrir la web y cada minuto: si está activado, se tapa
   la web con un aviso (y el teléfono); cuando se desactiva, el aviso se quita solo.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ['Estem en manteniment', 'Estamos en mantenimiento', 'We are under maintenance', 'Site en maintenance', 'Wartungsarbeiten', 'الموقع قيد الصيانة'],
    text: [
      'Estem millorant la web. Tornarem a estar disponibles molt aviat.',
      'Estamos mejorando la web. Volveremos a estar disponibles muy pronto.',
      'We are improving the website. We will be back very soon.',
      'Nous améliorons le site. Nous revenons très bientôt.',
      'Wir verbessern die Website. Wir sind bald wieder da.',
      'نقوم بتحسين الموقع. سنعود قريبًا جدًا.',
    ],
    urgent: ['Per a urgències, truca’ns:', 'Para urgencias, llámanos:', 'For urgent matters, call us:', 'En cas d’urgence, appelez-nous :', 'In dringenden Fällen:', 'للحالات العاجلة اتصل بنا:'],
    auto: [
      'Aquesta pàgina s’actualitza sola quan tornem.',
      'Esta página se actualiza sola cuando volvamos.',
      'This page refreshes by itself when we are back.',
      'Cette page se met à jour toute seule à notre retour.',
      'Diese Seite aktualisiert sich automatisch.',
      'ستتحدث هذه الصفحة تلقائيًا عند عودتنا.',
    ],
  };
  function lang() {
    try {
      var l = localStorage.getItem('hx_lang') || 'ca';
      return LANGS.indexOf(l) >= 0 ? l : 'ca';
    } catch (e) {
      return 'ca';
    }
  }
  function t(k) {
    return TX[k][LANGS.indexOf(lang())];
  }
  function base() {
    return typeof HX_API_BASE !== 'undefined' ? HX_API_BASE : 'https://higienexweb2.ossama450298.workers.dev/api';
  }
  function mostrar(msg) {
    var c = document.getElementById('hxMant');
    if (!c) {
      c = document.createElement('div');
      c.id = 'hxMant';
      c.setAttribute('role', 'alertdialog');
      c.setAttribute('aria-modal', 'true');
      c.setAttribute('aria-labelledby', 'hxMantT');
      document.body.appendChild(c);
    }
    var l = lang();
    c.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    c.innerHTML =
      '<div class="hxmant-caixa"><div class="hxmant-logo">HIGIENE<span>X</span></div>' +
      '<div class="hxmant-ic" aria-hidden="true">🛠️</div><h1 id="hxMantT"></h1><p class="hxmant-txt"></p>' +
      '<p class="hxmant-msg"></p><p class="hxmant-tel"><span></span> <a href="tel:+34631706398">631 706 398</a></p>' +
      '<p class="hxmant-auto"></p></div>';
    c.querySelector('h1').textContent = t('titol');
    c.querySelector('.hxmant-txt').textContent = t('text');
    var m = c.querySelector('.hxmant-msg');
    if (msg) m.textContent = msg;
    else m.remove();
    c.querySelector('.hxmant-tel span').textContent = t('urgent');
    c.querySelector('.hxmant-auto').textContent = t('auto');
    document.documentElement.classList.add('hx-en-mant');
  }
  function amagar() {
    var c = document.getElementById('hxMant');
    if (c) c.remove();
    document.documentElement.classList.remove('hx-en-mant');
  }
  function comprovar() {
    fetch(base() + '/mantenimiento', { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (d) {
        if (d && d.web) mostrar(d.msg || '');
        else amagar();
      })
      .catch(function (e) {
        console.warn('Estado de mantenimiento no disponible', e);
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', comprovar);
  else comprovar();
  setInterval(comprovar, 60000);
})();
