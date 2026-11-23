/* ============================================================
   HIGIENEX — Pago con tarjeta en modo de prueba (pagament-prova.js)
   La web no cobra nada: es un proyecto de clase. Esto hace que el pago se
   comporte como uno real en modo de prueba:
   · Aviso visible con dos tarjetas de prueba (aprobada y rechazada) que se
     rellenan con un clic.
   · Comprobaciones de verdad: número de tarjeta (algoritmo de Luhn), fecha
     de caducidad no pasada y CVV.
   · La tarjeta 4000 0000 0000 0002 la «rechaza el banco».
   · La confirmación del pedido dice cómo se ha pagado (p. ej. Visa ···· 4242).
   No se guarda ni se envía ningún dato de tarjeta.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    mode: ['Mode de prova: no es cobra res.', 'Modo de prueba: no se cobra nada.', 'Test mode: nothing is charged.', 'Mode test : rien n’est débité.', 'Testmodus: Es wird nichts belastet.', 'وضع الاختبار: لن يُخصم أي مبلغ.'],
    targetes: ['Fes servir una targeta de prova:', 'Usa una tarjeta de prueba:', 'Use a test card:', 'Utilisez une carte de test :', 'Verwenden Sie eine Testkarte:', 'استخدم بطاقة اختبار:'],
    aprovada: ['Aprovada', 'Aprobada', 'Approved', 'Acceptée', 'Genehmigt', 'مقبولة'],
    rebutjada: ['Rebutjada', 'Rechazada', 'Declined', 'Refusée', 'Abgelehnt', 'مرفوضة'],
    numMal: ['El número de targeta no és vàlid. Revisa’l.', 'El número de tarjeta no es válido. Revísalo.', 'The card number is not valid. Please check it.', 'Le numéro de carte n’est pas valide. Vérifiez-le.', 'Die Kartennummer ist ungültig. Bitte prüfen.', 'رقم البطاقة غير صالح. تحقق منه.'],
    caducada: ['La targeta està caducada.', 'La tarjeta está caducada.', 'The card has expired.', 'La carte a expiré.', 'Die Karte ist abgelaufen.', 'البطاقة منتهية الصلاحية.'],
    denegada: ['El banc ha rebutjat la targeta (simulat). Prova amb una altra.', 'El banco ha rechazado la tarjeta (simulado). Prueba con otra.', 'The bank declined the card (simulated). Try another one.', 'La banque a refusé la carte (simulé). Essayez-en une autre.', 'Die Bank hat die Karte abgelehnt (simuliert). Versuchen Sie eine andere.', 'رفض البنك البطاقة (محاكاة). جرّب بطاقة أخرى.'],
    pagat: ['Pagament', 'Pago', 'Payment', 'Paiement', 'Zahlung', 'الدفع'],
    transf: ['Transferència bancària', 'Transferencia bancaria', 'Bank transfer', 'Virement bancaire', 'Banküberweisung', 'تحويل بنكي'],
    prova: ['(prova)', '(prueba)', '(test)', '(test)', '(Test)', '(اختبار)'],
  };
  var OK = '4242424242424242', KO = '4000000000000002';
  var pagament = null; // cómo se ha pagado el último pedido

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Algoritmo de Luhn: el último dígito de toda tarjeta real lo cumple
  function luhn(n) {
    var s = 0, doble = false;
    for (var i = n.length - 1; i >= 0; i--) {
      var d = +n[i];
      if (doble) { d *= 2; if (d > 9) d -= 9; }
      s += d; doble = !doble;
    }
    return n.length >= 13 && s % 10 === 0;
  }
  function marca(n) {
    if (/^4/.test(n)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'American Express';
    return 'Tarjeta';
  }
  function caducada(exp) {
    var m = /^(\d{2})\/(\d{2})$/.exec(exp || '');
    if (!m) return false;
    var fi = new Date(2000 + +m[2], +m[1], 1); // primer día del mes siguiente
    return fi <= new Date();
  }
  function error(txt) {
    var e = document.getElementById('paymentError');
    if (e) { e.textContent = txt; e.style.display = 'block'; }
  }

  function avis() {
    var form = document.getElementById('paymentCardForm');
    if (!form) return;
    var a = document.getElementById('hxPagProva');
    if (!a) { a = document.createElement('div'); a.id = 'hxPagProva'; form.parentNode.insertBefore(a, form); }
    a.innerHTML =
      '<p><strong>🧪 ' + esc(t('mode')) + '</strong> ' + esc(t('targetes')) + '</p>' +
      '<div class="hxpp-targetes">' +
        '<button type="button" data-num="' + OK + '">4242 4242 4242 4242 <span class="hxpp-ok">' + esc(t('aprovada')) + '</span></button>' +
        '<button type="button" data-num="' + KO + '">4000 0000 0000 0002 <span class="hxpp-ko">' + esc(t('rebutjada')) + '</span></button>' +
      '</div>';
    [].forEach.call(a.querySelectorAll('button'), function (b) {
      b.onclick = function () {
        if (typeof hxPaySetMethod === 'function') hxPaySetMethod('card');
        var n = document.getElementById('payCardNumber'), e = document.getElementById('payExpiry'), c = document.getElementById('payCvv'), nm = document.getElementById('payName');
        n.value = b.dataset.num.replace(/(.{4})/g, '$1 ').trim();
        var d = new Date(); e.value = ('0' + (d.getMonth() + 1)).slice(-2) + '/' + String(d.getFullYear() + 3).slice(-2);
        c.value = '123';
        if (!nm.value.trim()) nm.value = (window.HX_PROFILE && HX_PROFILE.name) || (window.HX_GUEST && HX_GUEST.name) || 'Prueba HIGIENEX';
        var err = document.getElementById('paymentError'); if (err) err.style.display = 'none';
        document.getElementById('paySubmitBtn').focus();
      };
    });
  }

  function iniciar() {
    var obrir = window.openPaymentModal;
    if (typeof obrir === 'function' && !obrir._hxPp) {
      var w = function () { var r = obrir.apply(this, arguments); pagament = null; avis(); return r; };
      w._hxPp = true; window.openPaymentModal = w;
    }
    var base = window.hxProcessPayment;
    if (typeof base === 'function' && !base._hxPp) {
      var wp = function (e, forcar) {
        var metode = forcar || (typeof _hxPayMethod !== 'undefined' ? _hxPayMethod : 'card');
        if (metode === 'card') {
          var num = document.getElementById('payCardNumber').value.replace(/\s/g, '');
          var exp = document.getElementById('payExpiry').value;
          if (num.length >= 13 && !luhn(num)) { if (e) e.preventDefault(); error(t('numMal')); return false; }
          if (caducada(exp)) { if (e) e.preventDefault(); error(t('caducada')); return false; }
          if (num === KO) {
            if (e) e.preventDefault();
            var btn = document.getElementById('paySubmitBtn'), txt = btn.textContent;
            btn.disabled = true; btn.textContent = '…';
            setTimeout(function () { btn.disabled = false; btn.textContent = txt; error(t('denegada')); }, 1200);
            return false;
          }
          pagament = marca(num) + ' ···· ' + num.slice(-4);
        } else pagament = t('transf');
        return base.apply(this, arguments);
      };
      wp._hxPp = true; window.hxProcessPayment = wp;
    }
    // el aviso de tarjetas de prueba solo con «Tarjeta»
    var sm = window.hxPaySetMethod;
    if (typeof sm === 'function' && !sm._hxPp) {
      var ws = function (m) { var r = sm.apply(this, arguments); var a = document.getElementById('hxPagProva'); if (a) a.style.display = m === 'card' ? '' : 'none'; return r; };
      ws._hxPp = true; window.hxPaySetMethod = ws;
    }
    var qp = window.hxQuickPay;
    if (typeof qp === 'function' && !qp._hxPp) {
      var wq = function (m) { pagament = { applepay: 'Apple Pay', googlepay: 'Google Pay', paypal: 'PayPal' }[m] || m; return qp.apply(this, arguments); };
      wq._hxPp = true; window.hxQuickPay = wq;
    }
    // La confirmación del pedido dice cómo se ha pagado
    var av = window.hxAvisComandaFeta;
    if (typeof av === 'function' && !av._hxPp) {
      var wa = function () {
        var r = av.apply(this, arguments);
        var cos = document.querySelector('#cpModalWrap .cp-modal-body') || document.querySelector('#cpModalWrap [data-cp-body]');
        var ult = cos || document.querySelector('#cpModalWrap');
        if (pagament && ult) {
          var files = ult.querySelectorAll('div[style*="justify-content:space-between"]');
          var ref = files[files.length - 1];
          if (ref) {
            var f = ref.cloneNode(true);
            f.children[0].textContent = t('pagat');
            f.children[1].textContent = pagament + ' ' + t('prova');
            f.id = 'hxPagMetode';
            ref.parentNode.insertBefore(f, ref.nextSibling);
          }
        }
        pagament = null;
        return r;
      };
      wa._hxPp = true; window.hxAvisComandaFeta = wa;
    }
  }
  window.HXPagamentProva = { luhn: luhn, marca: marca };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
