/* ============================================================
   HIGIENEX — País del cliente e idioma de sus documentos (pais-idioma.js)
   · En «Crear cuenta» y en «Completa los datos de tu empresa» el cliente
     elige su país; el idioma de los documentos se propone según el país
     (se puede cambiar).
   · Con la sesión iniciada, el pedido, el presupuesto, las facturas y sus
     emails salen en ese idioma, aunque la web se esté viendo en otro.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var NOMS_IDIOMA = { ca: 'Català', es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch', ar: 'العربية' };
  var TX = {
    pais: ['País', 'País', 'Country', 'Pays', 'Land', 'البلد'],
    idioma: ['Idioma dels teus documents', 'Idioma de tus documentos', 'Language of your documents', 'Langue de vos documents', 'Sprache Ihrer Dokumente', 'لغة مستنداتك'],
    ajuda: ['Comandes, pressupostos, factures i correus t’arribaran en aquest idioma.', 'Pedidos, presupuestos, facturas y emails te llegarán en este idioma.', 'Orders, quotes, invoices and emails will reach you in this language.', 'Commandes, devis, factures et e-mails vous parviendront dans cette langue.', 'Bestellungen, Angebote, Rechnungen und E-Mails erhalten Sie in dieser Sprache.', 'ستصلك الطلبات وعروض الأسعار والفواتير ورسائل البريد بهذه اللغة.'],
    altre: ['Un altre país', 'Otro país', 'Other country', 'Autre pays', 'Anderes Land', 'بلد آخر'],
  };
  // España primero; el resto, por orden alfabético en el idioma de la web
  var PAISOS = ['ES', 'AD', 'PT', 'FR', 'BE', 'LU', 'MC', 'CH', 'DE', 'AT', 'IT', 'NL', 'IE', 'GB', 'DK', 'SE', 'NO', 'FI', 'PL', 'CZ', 'RO', 'GR',
    'US', 'CA', 'MX', 'AR', 'CO', 'CL', 'PE', 'UY', 'VE', 'EC', 'BO', 'PY', 'CR', 'PA', 'DO', 'GT',
    'MA', 'DZ', 'TN', 'EG', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SN', 'CI', 'CN', 'JP', 'IN', 'AU'];
  var ARAB = ['MA', 'DZ', 'TN', 'EG', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'LY', 'IQ', 'SY', 'YE', 'MR', 'SD', 'PS'];
  var HISP = ['MX', 'AR', 'CO', 'CL', 'PE', 'UY', 'VE', 'EC', 'BO', 'PY', 'CR', 'PA', 'DO', 'GT', 'HN', 'SV', 'NI', 'CU', 'PR'];

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function nomPais(codi) {
    if (codi === 'ZZ') return t('altre');
    try { return new Intl.DisplayNames([lang() === 'ca' ? 'ca' : lang(), 'es'], { type: 'region' }).of(codi) || codi; } catch (e) { return codi; }
  }
  // Idioma que se propone para cada país
  function idiomaPerPais(p) {
    if (p === 'ES') return lang() === 'ca' ? 'ca' : 'es';
    if (p === 'AD') return 'ca';
    if (['FR', 'BE', 'LU', 'MC', 'SN', 'CI'].indexOf(p) >= 0) return 'fr';
    if (['DE', 'AT', 'CH', 'LI'].indexOf(p) >= 0) return 'de';
    if (ARAB.indexOf(p) >= 0) return 'ar';
    if (HISP.indexOf(p) >= 0) return 'es';
    return 'en';
  }
  // País del navegador (es-ES → ES), como primera propuesta
  function paisNavegador() {
    var ls = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
    for (var i = 0; i < ls.length; i++) {
      var m = /-([A-Z]{2})$/i.exec(ls[i] || '');
      if (m && PAISOS.indexOf(m[1].toUpperCase()) >= 0) return m[1].toUpperCase();
    }
    return 'ES';
  }

  /* Los dos campos (país e idioma) con el estilo de cada formulario */
  function camps(prefix, u, cls) {
    u = u || {};
    var pais = u.country || paisNavegador();
    var idioma = u.docLang || idiomaPerPais(pais);
    var resta = PAISOS.slice(1).concat(PAISOS.indexOf(pais) < 0 && pais !== 'ZZ' ? [pais] : [])
      .map(function (c) { return [c, nomPais(c)]; })
      .sort(function (a, b) { return a[1].localeCompare(b[1]); });
    var opts = [['ES', nomPais('ES')]].concat(resta, [['ZZ', nomPais('ZZ')]])
      .map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === pais ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('');
    var optsL = LANGS.map(function (l) { return '<option value="' + l + '"' + (l === idioma ? ' selected' : '') + '>' + NOMS_IDIOMA[l] + '</option>'; }).join('');
    return '<div class="' + (cls.wrap || '') + '"><label for="' + prefix + 'Pais" class="' + (cls.label || '') + '">' + esc(t('pais')) + '</label>' +
      '<select id="' + prefix + 'Pais" autocomplete="country" class="' + (cls.input || '') + '">' + opts + '</select></div>' +
      '<div class="' + (cls.wrap || '') + '"><label for="' + prefix + 'Idioma" class="' + (cls.label || '') + '">' + esc(t('idioma')) + '</label>' +
      '<select id="' + prefix + 'Idioma" class="' + (cls.input || '') + '"' + (u.docLang ? ' data-triat="1"' : '') + '>' + optsL + '</select>' +
      '<small class="hx-pi-ajuda">' + esc(t('ajuda')) + '</small></div>';
  }
  // Al cambiar el país se propone su idioma, salvo que el cliente ya haya elegido uno
  function enllacar(prefix) {
    var p = document.getElementById(prefix + 'Pais'), l = document.getElementById(prefix + 'Idioma');
    if (!p || !l) return;
    p.addEventListener('change', function () { if (!l.dataset.triat) l.value = idiomaPerPais(p.value); });
    l.addEventListener('change', function () { l.dataset.triat = '1'; });
  }
  function llegir(prefix) {
    var p = document.getElementById(prefix + 'Pais'), l = document.getElementById(prefix + 'Idioma');
    return p && l ? { country: p.value, docLang: l.value } : {};
  }
  window.HXPAIS = { camps: camps, enllacar: enllacar, llegir: llegir, nomPais: nomPais };

  /* Idioma de los documentos: el del cliente con sesión iniciada o, si no, el de la web */
  function idiomaDocs() {
    var u = (window.HX_USER && window.HX_PROFILE) || (!window.HX_USER && window.HX_GUEST);
    return (u && LANGS.indexOf(u.docLang) >= 0 && u.docLang) || lang();
  }
  window.hxIdiomaDocs = idiomaDocs;
  // Ejecuta fn con los documentos en el idioma del cliente (pdf-i18n.js y pdf-arab.js lo miran)
  function ambIdiomaDocs(fn, self, args) {
    var abans = window.HX_LANG_DOC, l = idiomaDocs();
    window.HX_LANG_DOC = l !== lang() ? l : abans;
    try { return fn.apply(self, args); } finally { window.HX_LANG_DOC = abans; }
  }
  window.hxAmbIdiomaDocs = function (fn) { return ambIdiomaDocs(fn, null, []); };
  // Nombre del PDF en el mismo idioma que su contenido: Presupuesto_…, Devis_…, Rechnung_…
  var NOMS_PDF = {
    comanda: ['Comanda', 'Pedido', 'Order', 'Commande', 'Bestellung', 'طلب'],
    pressupost: ['Pressupost', 'Presupuesto', 'Quote', 'Devis', 'Angebot', 'عرض_سعر'],
    factura: ['Factura', 'Factura', 'Invoice', 'Facture', 'Rechnung', 'فاتورة'],
    extracte: ['Extracte_de_compte', 'Extracto_de_cuenta', 'Account_statement', 'Releve_de_compte', 'Kontoauszug', 'كشف_حساب'],
  };
  window.hxNomPdf = function (tipus, num) {
    var l = window.HX_LANG_DOC || lang(), noms = NOMS_PDF[tipus] || NOMS_PDF.factura;
    var n = String(num == null ? '' : num).replace(/[^\w-]/g, '');
    return noms[LANGS.indexOf(l)] + (n ? '_' + n : '') + '.pdf';
  };
  function embolcallar(obj, nom) {
    var f = obj && obj[nom];
    if (typeof f !== 'function' || f._hxDoc) return;
    var w = function () { return ambIdiomaDocs(f, this, arguments); };
    w._hxDoc = true;
    obj[nom] = w;
  }

  function iniciar() {
    // Pedido, presupuesto y facturas del área de clientes
    ['sendOrder', 'descarregarPressupostPDF', 'enviarPressupostEmail', 'cpEnviarFacturaEmail'].forEach(function (n) { embolcallar(window, n); });
    if (window.HXPDF_DOCS) ['comanda', 'factura', 'extracte'].forEach(function (n) { embolcallar(window.HXPDF_DOCS, n); });
    // Los emails que se preparan en la web llevan el idioma de los documentos
    var iw = window.hxIdiomaWeb;
    if (typeof iw === 'function' && !iw._hxDoc) {
      var nouIw = function () { return window.HX_LANG_DOC || iw.apply(this, arguments); };
      nouIw._hxDoc = true;
      window.hxIdiomaWeb = nouIw;
    }
    // «Crear cuenta»: país e idioma antes del sector
    var sec = document.getElementById('regSector');
    if (sec && !document.getElementById('regPais')) {
      var div = document.createElement('div');
      div.id = 'regPaisIdioma';
      div.innerHTML = camps('reg', null, { wrap: 'hx-u58', label: 'hx-u57', input: 'hx-u59' });
      sec.parentNode.parentNode.insertBefore(div, sec.parentNode);
      enllacar('reg');
    }
    var api = window.hxApi;
    if (typeof api === 'function' && !api._hxPais) {
      var nouApi = function (path, opts) {
        if (path === '/register' && opts && opts.body) Object.assign(opts.body, llegir('reg'));
        return api.apply(this, arguments);
      };
      nouApi._hxPais = true;
      window.hxApi = nouApi;
    }
    // Al cambiar el idioma de la web se traducen las etiquetas (sin perder lo elegido)
    var al = window.hxApplyLang;
    if (typeof al === 'function' && !al._hxPais) {
      var nouAl = function () {
        var r = al.apply(this, arguments), d = document.getElementById('regPaisIdioma');
        if (d) {
          var v = llegir('reg'), triat = document.getElementById('regIdioma').dataset.triat;
          d.innerHTML = camps('reg', { country: v.country, docLang: triat ? v.docLang : '' }, { wrap: 'hx-u58', label: 'hx-u57', input: 'hx-u59' });
          enllacar('reg');
        }
        return r;
      };
      nouAl._hxPais = true;
      window.hxApplyLang = nouAl;
    }
    // Si los documentos van en árabe, se prepara ya la tipografía árabe de los PDF
    setInterval(function () { if (idiomaDocs() === 'ar' && typeof window.hxCarregarArab === 'function') window.hxCarregarArab(); }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
