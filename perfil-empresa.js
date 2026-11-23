/* ============================================================
   HIGIENEX — Datos de empresa del cliente (perfil-empresa.js)
   · Tras entrar con Google, si la cuenta no tiene empresa, se abre una
     ventana para completar Empresa, CIF/NIF y sector (o «Soy particular»).
   · Con la sesión iniciada, el formulario de presupuesto se rellena solo
     con los datos de la cuenta.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ["Completa les dades de la teva empresa", 'Completa los datos de tu empresa', 'Complete your company details', 'Complétez les données de votre entreprise', 'Vervollständigen Sie Ihre Firmendaten', 'أكمل بيانات شركتك'],
    intro: ["Així els pressupostos, les comandes i les factures sortiran ja amb les teves dades.", 'Así los presupuestos, pedidos y facturas saldrán ya con tus datos.', 'Your quotes, orders and invoices will then include your details automatically.', 'Vos devis, commandes et factures porteront ainsi automatiquement vos données.', 'So enthalten Angebote, Bestellungen und Rechnungen automatisch Ihre Daten.', 'هكذا ستظهر بياناتك تلقائيًا في عروض الأسعار والطلبات والفواتير.'],
    empresa: ['Empresa', 'Empresa', 'Company', 'Entreprise', 'Unternehmen', 'الشركة'],
    phEmpresa: ['Nom de la teva empresa', 'Nombre de tu empresa', 'Your company name', 'Nom de votre entreprise', 'Name Ihres Unternehmens', 'اسم شركتك'],
    cif: ['CIF/NIF', 'CIF/NIF', 'Tax ID (CIF/NIF)', 'N° fiscal (CIF/NIF)', 'Steuer-Nr. (CIF/NIF)', 'الرقم الضريبي'],
    opcional: ['(opcional)', '(opcional)', '(optional)', '(facultatif)', '(optional)', '(اختياري)'],
    sector: ['Sector', 'Sector', 'Sector', 'Secteur', 'Branche', 'القطاع'],
    desar: ['Desar les dades', 'Guardar datos', 'Save details', 'Enregistrer', 'Speichern', 'حفظ البيانات'],
    araNo: ['Ara no', 'Ahora no', 'Not now', 'Plus tard', 'Später', 'ليس الآن'],
    particular: ['Soc particular', 'Soy particular', "I'm a private customer", 'Je suis un particulier', 'Ich bin Privatkunde', 'أنا عميل فردي'],
    noEmpresa: ['No compro per a una empresa', 'No compro para una empresa', "I'm not buying for a company", "Je n'achète pas pour une entreprise", 'Ich kaufe nicht für ein Unternehmen', 'لا أشتري لصالح شركة'],
    falta: ["Escriu el nom de l'empresa.", 'Escribe el nombre de la empresa.', 'Enter the company name.', "Saisissez le nom de l'entreprise.", 'Geben Sie den Firmennamen ein.', 'اكتب اسم الشركة.'],
    cifMal: ['El CIF/NIF no és vàlid.', 'El CIF/NIF no es válido.', 'The tax ID is not valid.', "Le n° fiscal n'est pas valide.", 'Die Steuer-Nr. ist ungültig.', 'الرقم الضريبي غير صالح.'],
    error: ["No s'han pogut desar les dades. Torna-ho a provar.", 'No se han podido guardar los datos. Vuelve a intentarlo.', "Couldn't save your details. Please try again.", "Impossible d'enregistrer. Réessayez.", 'Speichern fehlgeschlagen. Bitte erneut versuchen.', 'تعذّر حفظ البيانات. حاول مجددًا.'],
    desat: ['Dades desades', 'Datos guardados', 'Details saved', 'Données enregistrées', 'Daten gespeichert', 'تم حفظ البيانات'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    lesDades: ['Les teves dades', 'Tus datos', 'Your details', 'Vos données', 'Ihre Daten', 'بياناتك'],
    lesDadesIntro: ['Surten als teus pressupostos, comandes i factures.', 'Salen en tus presupuestos, pedidos y facturas.', 'They appear on your quotes, orders and invoices.', 'Elles figurent sur vos devis, commandes et factures.', 'Sie erscheinen auf Ihren Angeboten, Bestellungen und Rechnungen.', 'تظهر في عروض الأسعار والطلبات والفواتير.'],
    editar: ['Editar', 'Editar', 'Edit', 'Modifier', 'Bearbeiten', 'تعديل'],
    nom: ['Nom', 'Nombre', 'Name', 'Nom', 'Name', 'الاسم'],
    email: ['Correu', 'Correo', 'Email', 'E-mail', 'E-Mail', 'البريد'],
    tipus: ['Tipus de client', 'Tipo de cliente', 'Customer type', 'Type de client', 'Kundentyp', 'نوع العميل'],
    empresaTipus: ['Empresa', 'Empresa', 'Company', 'Entreprise', 'Unternehmen', 'شركة'],
    particularTipus: ['Particular', 'Particular', 'Private customer', 'Particulier', 'Privatkunde', 'عميل فردي'],
    pais: ['País', 'País', 'Country', 'Pays', 'Land', 'البلد'],
    idiomaDocs: ['Idioma dels documents', 'Idioma de los documentos', 'Document language', 'Langue des documents', 'Dokumentsprache', 'لغة المستندات'],
    senseDada: ['Sense indicar', 'Sin indicar', 'Not set', 'Non indiqué', 'Nicht angegeben', 'غير محدد'],
  };
  // Valor guardado (en catalán, como el registro) → clave de traducción de la web
  var SECTORS = [['Sanitari / Hospitals', 't470'], ['Hotels / Turisme', 't461'], ['Indústria Alimentària', 't463'], ['Oficines / Empreses', 't467'], ['Administració Pública', 't452'], ['Altres', 't454']];

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function tc(k, def) { return (typeof cpT === 'function' && cpT(k) !== k) ? cpT(k) : def; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Falta la empresa (o «Soy particular») o falta el país
  function faltenDades(u) { return u && u.role === 'client' && ((!u.company && u.sector !== 'Particular') || !u.country); }
  function paisIdioma() { return window.HXPAIS ? HXPAIS.llegir('hxp') : {}; }

  function tancar() {
    var w = document.getElementById('hxPerfilWrap'); if (w) w.remove();
    document.removeEventListener('keydown', teclat);
  }
  function teclat(e) { if (e.key === 'Escape') tancar(); }

  async function desar(dades) {
    var w = document.getElementById('hxPerfilWrap'), err = w.querySelector('.hxp-err');
    err.textContent = '';
    w.classList.add('hxp-ocupat');
    try {
      var r = await hxApi('/me', { method: 'PATCH', body: dades });
      window.HX_PROFILE = Object.assign({}, window.HX_PROFILE || {}, r.user);
      tancar();
      omplirPressupost(true);
      pintarDades();
      if (!dades.particular && typeof showToast === 'function') showToast(t('desat'), '✅');
    } catch (e) {
      err.textContent = /CIF/.test(e.message || '') ? t('cifMal') : t('error');
    } finally {
      w.classList.remove('hxp-ocupat');
    }
  }

  function obrir(u) {
    if (document.getElementById('hxPerfilWrap')) return;
    var w = document.createElement('div');
    w.id = 'hxPerfilWrap';
    w.innerHTML =
      '<div class="hxp-caixa" role="dialog" aria-modal="true" aria-labelledby="hxpTitol">' +
        '<button type="button" class="hxp-x" aria-label="' + esc(t('tancar')) + '">✕</button>' +
        '<h2 id="hxpTitol">' + esc(t(u.company || u.sector === 'Particular' ? 'lesDades' : 'titol')) + '</h2>' +
        '<p class="hxp-intro">' + esc(t('intro')) + '</p>' +
        '<label for="hxpEmpresa">' + esc(t('empresa')) + '</label>' +
        '<input id="hxpEmpresa" type="text" autocomplete="organization" maxlength="120" placeholder="' + esc(t('phEmpresa')) + '" value="' + esc(u.company || '') + '">' +
        '<label for="hxpCif">' + esc(t('cif')) + ' <span>' + esc(t('opcional')) + '</span></label>' +
        '<input id="hxpCif" type="text" maxlength="20" placeholder="B12345678" value="' + esc(u.cif || '') + '">' +
        '<label for="hxpSector">' + esc(t('sector')) + '</label>' +
        '<select id="hxpSector">' + SECTORS.map(function (s) { return '<option value="' + esc(s[0]) + '"' + (u.sector === s[0] ? ' selected' : '') + '>' + esc(tc(s[1], s[0])) + '</option>'; }).join('') + '</select>' +
        (window.HXPAIS ? HXPAIS.camps('hxp', u, {}) : '') +
        '<p class="hxp-err" role="alert"></p>' +
        '<div class="hxp-botons">' +
          '<button type="button" class="hxp-ara-no">' + esc(t('araNo')) + '</button>' +
          '<button type="button" class="hxp-desar">' + esc(t('desar')) + '</button>' +
        '</div>' +
        '<div class="hxp-part">' +
          '<button type="button" class="hxp-particular">' + esc(t('particular')) + '</button>' +
          '<small>' + esc(t('noEmpresa')) + '</small>' +
        '</div>' +
      '</div>';
    document.body.appendChild(w);
    w.addEventListener('click', function (e) { if (e.target === w) tancar(); });
    w.querySelector('.hxp-x').onclick = tancar;
    w.querySelector('.hxp-ara-no').onclick = tancar;
    if (window.HXPAIS) HXPAIS.enllacar('hxp');
    w.querySelector('.hxp-particular').onclick = function () { desar(Object.assign({ particular: true, cif: document.getElementById('hxpCif').value }, paisIdioma())); };
    w.querySelector('.hxp-desar').onclick = function () {
      var emp = document.getElementById('hxpEmpresa').value.trim();
      if (!emp) { w.querySelector('.hxp-err').textContent = t('falta'); document.getElementById('hxpEmpresa').focus(); return; }
      desar(Object.assign({ company: emp, cif: document.getElementById('hxpCif').value, sector: document.getElementById('hxpSector').value }, paisIdioma()));
    };
    w.querySelector('#hxpEmpresa').addEventListener('keydown', function (e) { if (e.key === 'Enter') w.querySelector('.hxp-desar').click(); });
    document.addEventListener('keydown', teclat);
    setTimeout(function () { var i = document.getElementById('hxpEmpresa'); if (i) i.focus(); }, 50);
  }

  // Después de entrar con Google: pide los datos si faltan.
  window.hxPerfilEmpresa = function (u) { if (faltenDades(u)) setTimeout(function () { obrir(u); }, 600); };

  // Formulario de presupuesto: rellena con los datos de la cuenta lo que esté vacío.
  // Con «forçar» (justo después de guardar) también sustituye lo que había.
  function omplirPressupost(forcar) {
    var u = window.HX_PROFILE;
    if (!u || !window.HX_USER) return;
    [['presEmpresa', u.company], ['presCif', u.cif], ['presContacte', u.name], ['presEmail', u.email]].forEach(function (c) {
      var el = document.getElementById(c[0]);
      if (el && c[1] && (forcar || !el.value.trim())) el.value = c[1];
    });
  }
  window.hxOmplirPressupost = omplirPressupost;

  /* Zona de clientes: tarjeta «Tus datos» con un botón para editarlos */
  var IDIOMES = { ca: 'Català', es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch', ar: 'العربية' };
  function pintarDades() {
    var cart = document.getElementById('cartSection');
    var u = window.HX_USER && window.HX_PROFILE;
    var c = document.getElementById('hxMisDades');
    if (!cart || !u || u.role !== 'client') { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('div'); c.id = 'hxMisDades'; c.setAttribute('role', 'region'); c.setAttribute('aria-labelledby', 'hxMdTitol'); cart.parentNode.insertBefore(c, cart); }
    var part = u.sector === 'Particular';
    var sector = SECTORS.filter(function (x) { return x[0] === u.sector; })[0];
    var files = [
      [t('nom'), u.name], [t('email'), u.email],
      [t('tipus'), part ? t('particularTipus') : t('empresaTipus')],
    ].concat(part ? [] : [[t('empresa'), u.company], [t('cif'), u.cif], [t('sector'), sector ? tc(sector[1], sector[0]) : u.sector]])
      .concat([[t('pais'), u.country && window.HXPAIS ? HXPAIS.nomPais(u.country) : ''], [t('idiomaDocs'), IDIOMES[u.docLang] || '']]);
    c.innerHTML =
      '<div class="hxmd-cap"><div><h3 id="hxMdTitol">' + esc(t('lesDades')) + '</h3><p>' + esc(t('lesDadesIntro')) + '</p></div>' +
      '<button type="button" class="hxmd-editar">✏️ ' + esc(t('editar')) + '</button></div>' +
      '<dl>' + files.map(function (f) {
        return '<div><dt>' + esc(f[0]) + '</dt><dd' + (f[1] ? '' : ' class="hxmd-buit"') + '>' + esc(f[1] || t('senseDada')) + '</dd></div>';
      }).join('') + '</dl>';
    c.querySelector('.hxmd-editar').onclick = function () { obrir(window.HX_PROFILE || {}); };
    // El nombre de la cabecera de la zona de clientes lleva a «Tus datos»
    var xip = document.getElementById('userName');
    if (xip && xip.parentElement && !xip.parentElement._hxDades) {
      var x = xip.parentElement;
      x._hxDades = true; x.style.cursor = 'pointer'; x.setAttribute('role', 'button'); x.tabIndex = 0;
      var anar = function () { var d = document.getElementById('hxMisDades'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      x.addEventListener('click', anar);
      x.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); anar(); } });
    }
  }
  window.hxPintarDades = pintarDades;

  // Cuentas antiguas sin país: se piden los datos una sola vez por cuenta
  function demanarUnCop() {
    var u = window.HX_USER && window.HX_PROFILE;
    if (!u || u.role !== 'client' || u.country) return;
    var k = 'hx_perfil_demanat_' + String(u.email || '').toLowerCase();
    try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1'); } catch (e) { return; }
    obrir(u);
  }

  function iniciar() {
    var sec = document.getElementById('pressupost');
    if (sec && window.IntersectionObserver) {
      new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) omplirPressupost(false); }).observe(sec);
    }
    // También al iniciar sesión con email y al volver a una sesión guardada.
    var o = window.setLoggedInUser;
    if (typeof o === 'function' && !o._hxPerfil) {
      var w = function () { var r = o.apply(this, arguments); setTimeout(function () { omplirPressupost(false); pintarDades(); demanarUnCop(); }, 1500); return r; };
      w._hxPerfil = true; window.setLoggedInUser = w;
    }
    setTimeout(function () { omplirPressupost(false); pintarDades(); }, 2500);
    var al = window.hxApplyLang;
    if (typeof al === 'function' && !al._hxDades) {
      var wl = function () { var r = al.apply(this, arguments); pintarDades(); return r; };
      wl._hxDades = true; window.hxApplyLang = wl;
    }
    var lo = window.logout;
    if (typeof lo === 'function' && !lo._hxDades) {
      var wo = function () { var r = lo.apply(this, arguments); pintarDades(); return r; };
      wo._hxDades = true; window.logout = wo;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
