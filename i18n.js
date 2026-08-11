/* ============================================================
   HIGIENEX — Sistema d'idiomes (i18n.js)
   ============================================================
   Fitxer separat que gestiona el canvi d'idioma de la web
   pública (index.html). Les traduccions en si (data-ca, data-es,
   data-en, data-fr, data-de) es queden com a atributs directament
   sobre cada element HTML que cal traduir — així qualsevol persona
   pot obrir index.html i veure, just al costat de cada text, la
   seva traducció, sense haver de buscar-la en un fitxer a part.

   Aquest fitxer només conté el "motor" que llegeix aquests atributs
   i canvia el text visible: el desplegable d'idioma, la detecció
   de l'idioma guardat, i la funció que aplica la traducció.

   Idiomes disponibles: català (ca), castellà (es), anglès (en),
   francès (fr), alemany (de). El català és l'idioma per defecte
   i també la traducció de reserva (fallback) si mai falta algun
   text en un altre idioma.
   ============================================================ */

var HX_LANG_KEY = 'hx_lang';

var HX_LANG_META = {
  ca: { flag: '🏴', code: 'CA', htmlLang: 'ca' },
  es: { flag: '🇪🇸', code: 'ES', htmlLang: 'es' },
  en: { flag: '🇬🇧', code: 'EN', htmlLang: 'en' },
  fr: { flag: '🇫🇷', code: 'FR', htmlLang: 'fr' },
  de: { flag: '🇩🇪', code: 'DE', htmlLang: 'de' }
};

// Aplica un idioma: recorre tots els elements marcats amb data-i18n
// i els canvia el text pel de l'atribut data-<idioma> corresponent.
function hxApplyLang(lang) {
  var meta = HX_LANG_META[lang] || HX_LANG_META.ca;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var txt = el.getAttribute('data-' + lang);
    if (txt) {
      el.textContent = txt;
    } else {
      // Si falta la traducció en aquest idioma, es fa servir el català
      // com a reserva (mai es queda un text buit).
      var fallback = el.getAttribute('data-ca');
      if (fallback) el.textContent = fallback;
    }
  });
  document.documentElement.setAttribute('lang', meta.htmlLang);

  var flagEl = document.getElementById('langCurrentFlag');
  var codeEl = document.getElementById('langCurrentCode');
  if (flagEl) flagEl.textContent = meta.flag;
  if (codeEl) codeEl.textContent = meta.code;

  document.querySelectorAll('#langDropdownMenu button').forEach(function(b, i) {
    var codes = ['ca', 'es', 'en', 'fr', 'de'];
    b.classList.toggle('active', codes[i] === lang);
  });
}

// Es crida quan l'usuari tria un idioma del desplegable.
function hxSetLang(lang) {
  try { localStorage.setItem(HX_LANG_KEY, lang); } catch (e) {}
  hxApplyLang(lang);
  hxToggleLangMenu(false);
}
window.hxSetLang = hxSetLang;

// Obre/tanca el desplegable del selector d'idioma.
function hxToggleLangMenu(force) {
  var menu = document.getElementById('langDropdownMenu');
  var btn = document.getElementById('langToggleBtn');
  if (!menu) return;
  var open = (force !== undefined) ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
window.hxToggleLangMenu = hxToggleLangMenu;

// Tanca el desplegable si es clica fora seu.
document.addEventListener('click', function(e) {
  var menu = document.getElementById('langDropdownMenu');
  var wrap = document.getElementById('langDropdownWrap');
  if (menu && menu.classList.contains('open') && wrap && !wrap.contains(e.target)) {
    hxToggleLangMenu(false);
  }
});

// En carregar la pàgina, si l'usuari ja havia triat un idioma abans
// (guardat al navegador), s'aplica automàticament.
document.addEventListener('DOMContentLoaded', function() {
  try {
    var saved = localStorage.getItem(HX_LANG_KEY);
    if (saved && saved !== 'ca') hxApplyLang(saved);
  } catch (e) {}
});
