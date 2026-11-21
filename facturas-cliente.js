/* ============================================================
   HIGIENEX — «Mis facturas» en la cuenta del cliente (facturas-cliente.js)
   Las facturas que HIGIENEX emite desde el ERP a la ficha con el mismo correo
   que la cuenta aparecen debajo de «Mis pedidos», con su PDF para descargar.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ['🧾 Les meves factures', '🧾 Mis facturas', '🧾 My invoices', '🧾 Mes factures', '🧾 Meine Rechnungen', '🧾 فواتيري'],
    pdf: ['Descarregar PDF', 'Descargar PDF', 'Download PDF', 'Télécharger le PDF', 'PDF herunterladen', 'تنزيل PDF'],
    venc: ['Venç', 'Vence', 'Due', 'Échéance', 'Fällig', 'تستحق'],
    pagada: ['Pagada', 'Pagada', 'Paid', 'Payée', 'Bezahlt', 'مدفوعة'],
    pendent: ['Pendent', 'Pendiente', 'Pending', 'En attente', 'Offen', 'معلّقة'],
    vencuda: ['Vençuda', 'Vencida', 'Overdue', 'Échue', 'Überfällig', 'متأخرة'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function data(iso) { var p = String(iso || '').slice(0, 10).split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : ''; }
  function eur(n) { return typeof hxFormatPrice === 'function' ? hxFormatPrice(n) : (Number(n) || 0).toFixed(2).replace('.', ',') + ' €'; }

  var FACT = null, carregant = false, darrera = 0;
  var ESTAT = { pagada: ['#E7F4EE', '#0B7256'], pendent: ['#FFF6E0', '#8A5A00'], vencuda: ['#FCE8E6', '#8C281E'] };

  function capsa() {
    var h = document.getElementById('orderHistory');
    if (!h) return null;
    var b = document.getElementById('hxMisFactures');
    if (!b) { b = document.createElement('div'); b.id = 'hxMisFactures'; h.parentNode.insertBefore(b, h.nextSibling); }
    return b;
  }

  function pintar() {
    var b = capsa(); if (!b) return;
    if (!window.HX_USER || !FACT || !FACT.length) { b.innerHTML = ''; return; }
    b.innerHTML = '<h3 class="hxmf-tit">' + esc(t('titol')) + '</h3>' + FACT.map(function (f, i) {
      var e = f.estado === 'pagada' ? 'pagada' : f.estado === 'vencida' ? 'vencuda' : 'pendent', c = ESTAT[e];
      return '<div class="hxmf-fila">' +
        '<div class="hxmf-cap"><strong>' + esc(f.num) + '</strong><span class="hxmf-estat" style="background:' + c[0] + ';color:' + c[1] + '">' + esc(t(e)) + '</span></div>' +
        '<div class="hxmf-dades"><span>' + esc(data(f.fecha)) + (f.venc ? ' · ' + esc(t('venc')) + ' ' + esc(data(f.venc)) : '') + '</span><strong>' + esc(eur(f.total)) + '</strong></div>' +
        '<button type="button" class="hxmf-pdf" data-i="' + i + '">⬇ ' + esc(t('pdf')) + '</button></div>';
    }).join('');
  }

  function carregar(forcar) {
    if (!window.HX_USER || typeof hxApi !== 'function' || carregant) return;
    if (!forcar && Date.now() - darrera < 60000) { pintar(); return; }
    carregant = true;
    hxApi('/mis-facturas').then(function (d) { FACT = d.facturas || []; darrera = Date.now(); pintar(); })
      .catch(function (e) { console.warn('No s\'han pogut carregar les factures', e); })
      .then(function () { carregant = false; });
  }

  /* PDF de la factura, amb el mateix aspecte que els altres documents de la web */
  function pdf(f) {
    if (!window.HXPDF || !HXPDF.disponible || !HXPDF.disponible()) return;
    var T = function () { return window.HXT ? HXT.apply(null, arguments) : arguments[0]; };
    var C = HXPDF.C, e = HXPDF.eur;
    var est = f.estado === 'pagada' ? 'Pagada' : f.estado === 'vencida' ? 'Vençuda' : 'Pendent';
    var k = HXPDF.nou({ kicker: T('Factura').toUpperCase(), titol: T('Factura'), num: 'Nº ' + f.num, data: data(f.fecha) });
    k.franja([[T('Data de factura'), data(f.fecha)], [T('Venciment'), data(f.venc)], [T('Estat'), T(est)], [T('Total'), e(f.total), true]]);
    var cl = f.cliente || {};
    k.caixes([
      { titol: T('Client'), linies: [cl.nom, cl.nif ? 'NIF: ' + cl.nif : '', [cl.dir, cl.pob].filter(Boolean).join(', '), cl.mail] },
      { titol: T('Emissor'), linies: ['HIGIENEX S.L.', 'CIF: B12345678', 'Carrer de la Indústria, 25 · 46010 València', 'contacto@higienexvalencia.es'] },
    ], 84);
    var tc = {
      head: [T('Producte'), T('Uds.'), T('Preu/ut.'), T('Import')],
      body: f.lineas.map(function (l) { return [l.nom, String(l.cant), e(l.precio), e(l.cant * l.precio)]; }),
      columnStyles: { 0: { fontStyle: 'bold' }, 1: { cellWidth: 50, halign: 'right' }, 2: { cellWidth: 74, halign: 'right' }, 3: { cellWidth: 86, halign: 'right', fontStyle: 'bold', textColor: C.NAVY } },
    };
    if (HXPDF.ambFotos) HXPDF.ambFotos(tc, 0, function (i) { return f.lineas[i].nom; }, k.doc);
    k.taula(tc);
    var files = [];
    if (f.dto) { files.push([T('Import brut'), e(f.bruto)]); files.push([T('Descompte de client ({0} %)', f.dto), '-' + e(f.bruto - f.base), C.GOLD_D]); }
    files.push([T('Base imposable'), e(f.base)]);
    files.push([T('IVA ({0} %)', 21), e(f.cuota)]);
    k.totals(files, T('Total'), e(f.total));
    k.tancar('Factura_' + String(f.num).replace(/[^\w-]/g, '') + '.pdf', T('Pagament per transferència a CaixaBank · ES21 2100 4455 6612 3456 7890 · Indica el número de factura.'));
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('.hxmf-pdf');
    if (!b || !FACT) return;
    var f = FACT[+b.getAttribute('data-i')];
    if (f) pdf(f);
  });

  function iniciar() {
    var o = window.renderOrderHistory;
    if (typeof o === 'function' && !o._hxMf) {
      var w = function () { var r = o.apply(this, arguments); carregar(false); return r; };
      w._hxMf = true; window.renderOrderHistory = w;
    }
    var a = window.hxApplyLang;
    if (typeof a === 'function' && !a._hxMf) {
      var w2 = function () { var r = a.apply(this, arguments); pintar(); return r; };
      w2._hxMf = true; window.hxApplyLang = w2;
    }
    var lo = window.logout;
    if (typeof lo === 'function' && !lo._hxMf) {
      var w3 = function () { FACT = null; darrera = 0; var r = lo.apply(this, arguments); pintar(); return r; };
      w3._hxMf = true; window.logout = w3;
    }
    setTimeout(function () { carregar(true); }, 2500);
  }
  window.hxMisFacturas = { carregar: carregar, pdf: pdf };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
