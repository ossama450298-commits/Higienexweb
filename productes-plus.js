/* ============================================================
   HIGIENEX — Productes: compartir, comparar des del catàleg i estoc en temps real
   · Fitxa de producte: botó «Compartir» amb l'enllaç a la pàgina pròpia del producte
     (producto/<nom>/), que a WhatsApp surt amb la foto i el preu.
   · Catàleg: casella «Comparar» a cada producte i una barra a baix per veure la
     comparació (fa servir el comparador que ja existeix: CMP_DATA i cmpToggle).
   · Estoc: es llegeix de l'ERP (/api/stock-web) i s'actualitzen les etiquetes. Si un
     producte està «sota comanda», botó «Avisa'm quan n'hi hagi» (amb sessió iniciada).
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    compartir: ['Compartir', 'Compartir', 'Share', 'Partager', 'Teilen', 'مشاركة'],
    copiat: ['Enllaç copiat', 'Enlace copiado', 'Link copied', 'Lien copié', 'Link kopiert', 'تم نسخ الرابط'],
    comparar: ['Comparar', 'Comparar', 'Compare', 'Comparer', 'Vergleichen', 'قارن'],
    veure: ['Veure la comparació', 'Ver la comparación', 'See comparison', 'Voir la comparaison', 'Vergleich ansehen', 'عرض المقارنة'],
    tria: ['Tria un altre producte per comparar', 'Elige otro producto para comparar', 'Pick another product to compare', 'Choisissez un autre produit', 'Wählen Sie ein weiteres Produkt', 'اختر منتجًا آخر للمقارنة'],
    treure: ['Treure', 'Quitar', 'Clear', 'Effacer', 'Leeren', 'مسح'],
    titol: ['Comparació de productes', 'Comparación de productos', 'Product comparison', 'Comparaison de produits', 'Produktvergleich', 'مقارنة المنتجات'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    avisam: ["Avisa'm quan n'hi hagi", 'Avísame cuando haya', 'Notify me when available', 'Prévenez-moi', 'Benachrichtigen', 'أبلغني عند التوفر'],
    apuntat: ["T'avisarem per correu quan torni a haver-n'hi.", 'Te avisaremos por email cuando vuelva a haber.', 'We will email you when it is back.', 'Nous vous préviendrons par e-mail.', 'Wir benachrichtigen Sie per E-Mail.', 'سنبلغك بالبريد عند توفره.'],
    jaHi: ["Ja n'hi ha! Pots demanar-lo ara.", '¡Ya hay! Puedes pedirlo ahora.', 'It is in stock now!', 'Il est disponible !', 'Jetzt verfügbar!', 'متوفر الآن!'],
    inicia: ['Inicia sessió per rebre l’avís.', 'Inicia sesión para recibir el aviso.', 'Log in to get the alert.', 'Connectez-vous pour recevoir l’alerte.', 'Melden Sie sich an.', 'سجّل الدخول لتلقي التنبيه.'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function toast(m, e) { if (typeof showToast === 'function') showToast(m, e || 'ℹ️'); }
  var WEB = 'https://ossama450298-commits.github.io/Higienexweb/';

  /* ---------- Compartir des de la fitxa ---------- */
  function botoCompartir() {
    var acc = document.querySelector('#g-fitxaproducte .fp-actions');
    if (!acc || document.getElementById('fpShare')) return;
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'fpShare'; b.className = 'btn-fp-outline';
    b.onclick = function () {
      var nom = (document.getElementById('fpName') || {}).textContent || '';
      var url = WEB + 'producto/' + slug(nom) + '/';
      if (navigator.share) navigator.share({ title: nom + ' · HIGIENEX', url: url }).catch(function () { /* cancel·lat */ });
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast(t('copiat'), '🔗'); });
    };
    acc.appendChild(b);
    b.textContent = '🔗 ' + t('compartir');
  }

  /* ---------- Comparar des del catàleg ---------- */
  function nomTargeta(card) { var n = card.querySelector('.hx-u25'); return n ? n.textContent.trim() : ''; }
  function caselles() {
    if (typeof CMP_DATA === 'undefined') return;
    [].forEach.call(document.querySelectorAll('#pedidosGrid .pedido-card-new'), function (card) {
      var nom = nomTargeta(card);
      if (!CMP_DATA[nom]) return;
      var lab = card.querySelector('.hxcmp-check');
      if (!lab) {
        lab = document.createElement('label'); lab.className = 'hxcmp-check';
        lab.innerHTML = '<input type="checkbox"> <span></span>';
        lab.querySelector('input').onchange = function () { cmpToggle(nom); barra(); };
        var cos = card.querySelector('.hx-u27') || card;
        cos.appendChild(lab);
      }
      lab.querySelector('span').textContent = '⚖️ ' + t('comparar');
      lab.querySelector('input').checked = (window.cmpSelected || []).indexOf(nom) >= 0;
    });
  }
  function barra() {
    var sel = window.cmpSelected || [];
    var b = document.getElementById('hxCmpBar');
    [].forEach.call(document.querySelectorAll('.hxcmp-check input'), function (i) {
      i.checked = sel.indexOf(nomTargeta(i.closest('.pedido-card-new'))) >= 0;
    });
    if (!sel.length) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'hxCmpBar'; b.setAttribute('role', 'region'); document.body.appendChild(b); }
    b.innerHTML = '<div class="hxcmp-noms">' + sel.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>' +
      '<button type="button" class="hxcmp-treure">' + esc(t('treure')) + '</button>' +
      '<button type="button" class="hxcmp-veure"' + (sel.length < 2 ? ' disabled' : '') + '>' + esc(sel.length < 2 ? t('tria') : t('veure') + ' (' + sel.length + ')') + '</button>';
    b.querySelector('.hxcmp-treure').onclick = function () { sel.slice().forEach(function (n) { cmpToggle(n); }); barra(); };
    b.querySelector('.hxcmp-veure').onclick = finestra;
  }
  function finestra() {
    if (typeof cmpRenderTable === 'function') cmpRenderTable();
    var taula = document.getElementById('cmpTable');
    if (!taula) return;
    var m = document.createElement('div');
    m.id = 'hxCmpModal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="hxcmp-caixa"><div class="hxcmp-cap"><h3>' + esc(t('titol')) + '</h3>' +
      '<button type="button" aria-label="' + esc(t('tancar')) + '">✕</button></div><div class="hxcmp-taula"></div></div>';
    var copia = taula.cloneNode(true); copia.removeAttribute('id');
    m.querySelector('.hxcmp-taula').appendChild(copia);
    function tancar() { m.remove(); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') tancar(); }
    m.querySelector('.hxcmp-cap button').onclick = tancar;
    m.onclick = function (e) { if (e.target === m) tancar(); };
    document.addEventListener('keydown', tecla);
    document.body.appendChild(m);
    m.querySelector('.hxcmp-cap button').focus();
  }

  /* ---------- Estoc en temps real i «Avisa'm» ---------- */
  var ESTOC = {};
  function etiquetes() {
    if (typeof STOCK_INFO === 'undefined') return;
    [].forEach.call(document.querySelectorAll('#pedidosGrid .pedido-card-new'), function (card) {
      var nom = nomTargeta(card), st = ESTOC[nom];
      if (!st) return;
      var p = (window.PRODUCTS || []).filter(function (x) { return x.name === nom; })[0];
      if (p) p.stock = st;
      var info = STOCK_INFO[st] || {};
      var badge = card.querySelector('.prod-img-wrap > span');
      if (badge && info.label) {
        // el text de l'etiqueta en l'idioma de la web (mateixes claus que la resta de la pàgina)
        var clau = { 'in': 't953', low: 't330', order: 't597' }[st];
        var tr = (window.HX_I18N || {})[clau] || {};
        badge.setAttribute('data-i18n-key', clau);
        badge.textContent = tr[lang()] || tr.ca || info.label;
        badge.style.color = info.color; badge.style.background = info.bg;
      }
      var av = card.querySelector('.hxstock-avis');
      if (st === 'order' && !av) {
        av = document.createElement('button'); av.type = 'button'; av.className = 'hxstock-avis';
        av.onclick = function () { apuntar(nom, av); };
        (card.querySelector('.hx-u27') || card).appendChild(av);
      }
      if (st !== 'order' && av) av.remove();
      if (av) av.textContent = '🔔 ' + t('avisam');
    });
  }
  function apuntar(nom, boto) {
    if (!window.HX_USER) { toast(t('inicia'), '🔐'); if (typeof openAuthModal === 'function') openAuthModal(); return; }
    boto.disabled = true;
    hxApi('/stock-aviso', { method: 'POST', body: { producto: nom, lang: lang() } })
      .then(function (d) { toast(d && d.yaHay ? t('jaHi') : t('apuntat'), '🔔'); if (d && !d.yaHay) boto.textContent = '✓ ' + t('apuntat'); })
      .catch(function (e) { boto.disabled = false; toast(e.message || 'Error', '⚠️'); });
  }
  function llegirEstoc() {
    fetch(HX_API_BASE + '/stock-web').then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (d) { ESTOC = d || {}; etiquetes(); })
      .catch(function (e) { console.warn('Estoc en temps real no disponible', e); });
  }

  function iniciar() {
    botoCompartir(); caselles(); llegirEstoc();
    var tog = window.cmpToggle;
    if (typeof tog === 'function' && !tog._hxBar) {
      var w = function () { var r = tog.apply(this, arguments); barra(); return r; };
      w._hxBar = true; window.cmpToggle = w;
    }
    var a = window.hxApplyLang;
    if (typeof a === 'function' && !a._hxProd) {
      var w2 = function () {
        var r = a.apply(this, arguments);
        var s = document.getElementById('fpShare'); if (s) s.textContent = '🔗 ' + t('compartir');
        caselles(); etiquetes(); barra(); return r;
      };
      w2._hxProd = true; window.hxApplyLang = w2;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
