/* ============================================================
   HIGIENEX — Sistema d'idiomes (i18n.js)
   ============================================================
   Les traduccions són a i18n/<idioma>.js (generats a partir de
   i18n-dades.js amb  node scripts/dividir-i18n.mjs).
   La pàgina sempre carrega i18n/ca.js (català, la reserva) i
   només baixa l'idioma del visitant quan el necessita.
   ============================================================ */

var HX_I18N = {};
var HX_I18N_CARREGATS = {};
var HX_I18N_ESPERES = {};
// Incorpora a HX_I18N els idiomes que ja han arribat.
function hxI18nIncorporar() {
  var parts = window.HX_I18N_PARTS || [];
  while (parts.length) {
    var p = parts.shift(), l = p[0], d = p[1];
    for (var k in d) (HX_I18N[k] = HX_I18N[k] || {})[l] = d[k];
    HX_I18N_CARREGATS[l] = true;
    (HX_I18N_ESPERES[l] || []).forEach(function (f) { f(); });
    delete HX_I18N_ESPERES[l];
  }
}
window.hxI18nPart = hxI18nIncorporar;
// Carrega un idioma (si cal) i després crida fet().
function hxCarregarIdioma(lang, fet) {
  hxI18nIncorporar();
  if (HX_I18N_CARREGATS[lang]) { fet(); return; }
  var primer = !HX_I18N_ESPERES[lang];
  (HX_I18N_ESPERES[lang] = HX_I18N_ESPERES[lang] || []).push(fet);
  if (!primer || document.querySelector('script[data-hx-idioma="' + lang + '"]')) return;
  var s = document.createElement('script');
  s.src = 'i18n/' + lang + '.js';
  s.setAttribute('data-hx-idioma', lang);
  s.onerror = function () { HX_I18N_CARREGATS[lang] = true; hxI18nIncorporar(); fet(); };
  document.head.appendChild(s);
}
window.hxCarregarIdioma = hxCarregarIdioma;
hxI18nIncorporar();
var HX_LANG_KEY = 'hx_lang';

var HX_SENYERA_SVG = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="20" height="14" fill="#FCDD09"/><rect y="0" width="20" height="1.56" fill="#DA121A"/><rect y="3.11" width="20" height="1.56" fill="#DA121A"/><rect y="6.22" width="20" height="1.56" fill="#DA121A"/><rect y="9.33" width="20" height="1.56" fill="#DA121A"/><rect y="12.44" width="20" height="1.56" fill="#DA121A"/></svg>';

// Bandera de cada idioma: Catalunya no té emoji de bandera oficial a
// Unicode, així que per a "ca" es fa servir un SVG propi de la senyera
// en lloc de l'emoji genèric 🏴. La resta d'idiomes sí tenen emoji real.
var HX_FLAG_ES = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="20" height="14" fill="#AA151B"/><rect y="3.5" width="20" height="7" fill="#F1BF00"/></svg>';
var HX_FLAG_GB = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="20" height="14" fill="#00247D"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#FFFFFF" stroke-width="2.8"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#CF142B" stroke-width="1"/><path d="M10,0 V14 M0,7 H20" stroke="#FFFFFF" stroke-width="4.6"/><path d="M10,0 V14 M0,7 H20" stroke="#CF142B" stroke-width="2.6"/></svg>';
var HX_FLAG_FR = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="6.67" height="14" fill="#0055A4"/><rect x="6.67" width="6.67" height="14" fill="#FFFFFF"/><rect x="13.33" width="6.67" height="14" fill="#EF4135"/></svg>';
var HX_FLAG_DE = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="20" height="4.67" fill="#000000"/><rect y="4.67" width="20" height="4.67" fill="#DD0000"/><rect y="9.33" width="20" height="4.67" fill="#FFCE00"/></svg>';

var HX_FLAG_MA = '<svg viewBox="0 0 20 14" style="width:1.15rem;height:0.8rem;display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 0 0 0.5px rgba(0,0,0,0.15);"><rect width="20" height="14" fill="#C1272D"/><g transform="translate(10,7)" fill="none" stroke="#006233" stroke-width="0.9"><polygon points="0,-3.4 0.79,-1.05 3.23,-1.05 1.24,0.4 2.02,2.75 0,1.3 -2.02,2.75 -1.24,0.4 -3.23,-1.05 -0.79,-1.05"/></g></svg>';

var HX_LANG_META = {
  ca: { flag: HX_SENYERA_SVG, code: 'CA', htmlLang: 'ca' },
  es: { flag: HX_FLAG_ES, code: 'ES', htmlLang: 'es' },
  en: { flag: HX_FLAG_GB, code: 'EN', htmlLang: 'en' },
  fr: { flag: HX_FLAG_FR, code: 'FR', htmlLang: 'fr' },
  de: { flag: HX_FLAG_DE, code: 'DE', htmlLang: 'de' },
  ar: { flag: HX_FLAG_MA, code: 'AR', htmlLang: 'ar', rtl: true }
};

// Aplica un idioma: recorre tots els elements marcats amb
// data-i18n-key i els posa el text de HX_I18N per a aquest idioma.
function hxApplyLang(lang) {
  var meta = HX_LANG_META[lang] || HX_LANG_META.ca;
  document.querySelectorAll('[data-i18n-key]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-key');
    var entry = HX_I18N[key];
    if (!entry) return;
    var val = entry[lang] || entry.ca || '';
    // Si la traducció conté etiquetes HTML (per exemple <strong>), s'insereix
    // com a HTML; si és text pla, com a text (més segur, evita problemes
    // si algun dia el text ve de l'usuari).
    if (val.indexOf('<') !== -1) el.innerHTML = val;
    else el.textContent = val;
  });
  // Placeholders dels camps de formulari (atribut, no text visible del DOM)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var entry = HX_I18N[key];
    if (!entry) return;
    el.setAttribute('placeholder', entry[lang] || entry.ca || '');
  });
  document.documentElement.setAttribute('lang', meta.htmlLang);
  // L'àrab es llegeix de dreta a esquerra.
  document.documentElement.setAttribute('dir', meta.rtl ? 'rtl' : 'ltr');
  document.documentElement.classList.toggle('hx-rtl', !!meta.rtl);

  var flagEl = document.getElementById('langCurrentFlag');
  if (flagEl) flagEl.innerHTML = meta.flag;

  document.querySelectorAll('#langDropdownMenu button').forEach(function(b, i) {
    var codes = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
    b.classList.toggle('active', codes[i] === lang);
  });
}

function hxSetLang(lang) {
  try { localStorage.setItem(HX_LANG_KEY, lang); } catch (e) {}
  hxToggleLangMenu(false);
  hxCarregarIdioma(lang, function () { hxSetLangAplicar(lang); });
}
function hxSetLangAplicar(lang) {
  hxApplyLang(lang);
  if (typeof CP_LOGGED_IN !== 'undefined' && document.getElementById('hxClientApp') && document.getElementById('hxClientApp').style.display === 'block') {
    if (typeof cpRenderNav === 'function') cpRenderNav();
    if (typeof cpGo === 'function' && typeof CP_TAB !== 'undefined') cpGo(CP_TAB);
  }
}
window.hxSetLang = hxSetLang;

function hxToggleLangMenu(force) {
  var menu = document.getElementById('langDropdownMenu');
  var btn = document.getElementById('langToggleBtn');
  if (!menu) return;
  var open = (force !== undefined) ? force : !menu.classList.contains('open');
  // Portem el menú a <body> quan s'obre, perquè un ancestre (#mainNav) té
  // 'transform' en CSS i això trenca el 'position:fixed' del menú (l'ancestre
  // amb transform passa a ser el seu contenidor de referència en lloc del
  // viewport). Movent-lo a body evitem aquest problema, sobretot al mòbil.
  if (open && menu.parentNode !== document.body) {
    document.body.appendChild(menu);
  }
  if (open && btn) {
    var r = btn.getBoundingClientRect();
    var isMobile = window.innerWidth <= 820;
    menu.style.position = 'fixed';
    menu.style.top = (r.bottom + 8) + 'px';
    if (isMobile) {
      menu.style.right = '1rem';
      menu.style.left = 'auto';
    } else {
      menu.style.left = 'auto';
      menu.style.right = (window.innerWidth - r.right) + 'px';
    }
  }
  menu.classList.toggle('open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
window.hxToggleLangMenu = hxToggleLangMenu;

document.addEventListener('click', function(e) {
  var menu = document.getElementById('langDropdownMenu');
  var btn = document.getElementById('langToggleBtn');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !(btn && btn.contains(e.target))) {
    hxToggleLangMenu(false);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  try {
    var saved = localStorage.getItem(HX_LANG_KEY);
    if (saved && saved !== 'ca') hxCarregarIdioma(saved, function () { hxApplyLang(saved); });
  } catch (e) {}
});
