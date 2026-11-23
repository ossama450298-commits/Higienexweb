/* ============================================================
   HIGIENEX — Seguimiento del pedido con línea de tiempo (seguimiento.js)
   Recibido → Confirmado → En preparación → Enviado → Entregado, cada paso
   con su fecha (el servidor guarda cuándo cambia el estado) y, para los que
   faltan, la fecha prevista. Debajo, el mapa de la ruta de siempre.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var PASSOS = [
    ['Pendent de confirmació', ['Comanda rebuda', 'Pedido recibido', 'Order received', 'Commande reçue', 'Bestellung eingegangen', 'تم استلام الطلب']],
    ['Confirmada', ['Confirmada', 'Confirmado', 'Confirmed', 'Confirmée', 'Bestätigt', 'مؤكَّد']],
    ['En preparació', ['En preparació', 'En preparación', 'Being prepared', 'En préparation', 'In Vorbereitung', 'قيد التجهيز']],
    ['Enviada', ['Enviada', 'Enviado', 'Shipped', 'Expédiée', 'Versandt', 'تم الشحن']],
    ['Entregada', ['Entregada', 'Entregado', 'Delivered', 'Livrée', 'Zugestellt', 'تم التسليم']],
  ];
  var TX = {
    comanda: ['Comanda', 'Pedido', 'Order', 'Commande', 'Bestellung', 'الطلب'],
    previst: ['Previst', 'Previsto', 'Expected', 'Prévu', 'Voraussichtlich', 'متوقع'],
    fet: ['Fet', 'Hecho', 'Done', 'Fait', 'Erledigt', 'تم'],
    ara: ['Ara', 'Ahora', 'Now', 'En cours', 'Jetzt', 'الآن'],
    cancel: ['Comanda cancel·lada. Si tens dubtes, escriu-nos.', 'Pedido cancelado. Si tienes dudas, escríbenos.', 'Order cancelled. If you have questions, write to us.', 'Commande annulée. Pour toute question, écrivez-nous.', 'Bestellung storniert. Bei Fragen schreiben Sie uns.', 'تم إلغاء الطلب. إن كان لديك سؤال، راسلنا.'],
    productes: ['Productes', 'Productos', 'Products', 'Produits', 'Produkte', 'المنتجات'],
    noTrobada: ['No hem trobat cap comanda amb aquest email i número. Revisa les dades o escriu-nos per WhatsApp i t’ajudem.', 'No hemos encontrado ningún pedido con este email y número. Revisa los datos o escríbenos por WhatsApp y te ayudamos.', 'We couldn’t find an order with this email and number. Check the details or message us on WhatsApp.', 'Aucune commande trouvée avec cet e-mail et ce numéro. Vérifiez les données ou écrivez-nous sur WhatsApp.', 'Keine Bestellung mit dieser E-Mail und Nummer gefunden. Prüfen Sie die Angaben oder schreiben Sie uns per WhatsApp.', 'لم نجد طلبًا بهذا البريد والرقم. تحقق من البيانات أو راسلنا عبر واتساب.'],
    cercant: ['Cercant…', 'Buscando…', 'Searching…', 'Recherche…', 'Suche…', 'جارٍ البحث…'],
  };
  var LOC = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function i() { return LANGS.indexOf(lang()); }
  function t(k) { return TX[k][i()]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function data(d, hora) {
    var o = { weekday: 'short', day: 'numeric', month: 'short' };
    if (hora) { o.hour = '2-digit'; o.minute = '2-digit'; }
    return new Date(d).toLocaleString(LOC[lang()], o);
  }
  // días laborables (lunes a viernes) a partir de una fecha
  function mesLaborables(d, n) {
    var x = new Date(d);
    while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0 && x.getDay() !== 6) n--; }
    return x;
  }

  function pintar(box, o) {
    if (!o) {
      box.innerHTML = '<div class="hx-tl-no">⚠️ ' + esc(t('noTrobada')) + '</div>';
      return false;
    }
    var estat = o.status || PASSOS[0][0];
    var cancel = estat === 'Cancel·lada';
    var idx = Math.max(0, PASSOS.map(function (p) { return p[0]; }).indexOf(estat));
    var log = o.log || [];
    var quan = {};
    quan[PASSOS[0][0]] = o.date;
    log.forEach(function (l) { if (!quan[l.s]) quan[l.s] = l.at; });
    var previst = { Enviada: mesLaborables(o.date, 2), Entregada: mesLaborables(o.date, 3) };
    var files = PASSOS.map(function (p, k) {
      var fet = !cancel && k <= idx, ara = !cancel && k === idx;
      var quanTxt = quan[p[0]] ? data(quan[p[0]], true) : fet ? t('fet') : previst[p[0]] ? t('previst') + ': ' + data(previst[p[0]]) : '';
      return '<li class="hx-tl-pas' + (fet ? ' fet' : '') + (ara ? ' ara' : '') + '"><span class="hx-tl-punt" aria-hidden="true">' + (fet ? '✓' : '') + '</span>' +
        '<div><strong>' + esc(p[1][i()]) + (ara ? ' <em>' + esc(t('ara')) + '</em>' : '') + '</strong>' +
        (quanTxt ? '<small>' + esc(quanTxt) + '</small>' : '') + '</div></li>';
    }).join('');
    var items = (o.items || []).map(function (it) { return esc(it.name) + ' ×' + it.qty; }).join(', ');
    var progres = [0, 0.06, 0.2, 0.6, 1][idx];
    var eta = typeof cpT === 'function' ? (cancel ? cpT('t929') : idx === 4 ? cpT('t927') : idx === 3 ? cpT('t925') : cpT('t924')) : '';
    box.innerHTML = '<div class="hx-seguiment hx-tl">' +
      '<div class="hx-tl-cap"><strong>📦 ' + esc(t('comanda')) + ' ' + esc(o.invoiceNum) + '</strong>' +
      '<span>' + esc(data(o.date)) + ' · <b>' + (typeof hxFormatPrice === 'function' ? hxFormatPrice(o.total) : Number(o.total).toFixed(2) + ' €') + '</b></span></div>' +
      (cancel ? '<div class="hx-tl-no">' + esc(t('cancel')) + '</div>' : '<ol class="hx-tl-llista">' + files + '</ol>') +
      (typeof hxMapaRuta === 'function' && !cancel ? hxMapaRuta(progres, typeof cpT === 'function' ? cpT('t928') : '', eta, cancel) : '') +
      '<p class="hx-tl-prod"><b>' + esc(t('productes')) + ':</b> ' + items + '</p></div>';
    return false;
  }

  window.hxTrackOrder = function (e) {
    if (e) e.preventDefault();
    var email = document.getElementById('trackEmail').value.trim().toLowerCase();
    var num = document.getElementById('trackNum').value.trim().toUpperCase();
    var box = document.getElementById('trackResult');
    if (!box) return false;
    box.innerHTML = '<div class="hx-tl-cerca">' + esc(t('cercant')) + '</div>';
    hxApi('/orders/track', { method: 'POST', body: { email: email, num: num } })
      .then(function (d) { pintar(box, d.order); })
      .catch(function () {
        var l = typeof hxLocalTrack === 'function' ? hxLocalTrack(email, num) : null;
        pintar(box, l ? { invoiceNum: l.invoiceNum, date: l.date || Date.now(), total: l.total, items: l.items || [], status: l.status } : null);
      });
    return false;
  };
  window.hxShowTrackedOrder = pintar;
})();
