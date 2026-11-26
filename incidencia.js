/* ============================================================
   HIGIENEX — Notificar una incidencia con un pedido (incidencia.js)
   Se abre con el botón del email «Pedido entregado» (?incidencia=NUM)
   o desde Pedidos, en el área de clientes. El servidor comprueba que el
   pedido es del correo indicado (o del cliente con sesión), la abre en el
   ERP (Ventas › Incidencias) y avisa a la empresa por email.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ['Notificar una incidència', 'Notificar una incidencia', 'Report a problem', 'Signaler un problème', 'Problem melden', 'الإبلاغ عن مشكلة'],
    intro: ['Explica’ns què ha passat amb la comanda {0} i ho solucionem com més aviat millor.', 'Cuéntanos qué ha pasado con el pedido {0} y lo solucionamos lo antes posible.', 'Tell us what happened with order {0} and we will fix it as soon as possible.', 'Dites-nous ce qui s’est passé avec la commande {0} et nous réglerons cela au plus vite.', 'Sagen Sie uns, was mit der Bestellung {0} passiert ist – wir kümmern uns schnellstmöglich darum.', 'أخبرنا بما حدث مع الطلب {0} وسنحل المشكلة في أقرب وقت.'],
    comanda: ['Número de comanda', 'Número de pedido', 'Order number', 'Numéro de commande', 'Bestellnummer', 'رقم الطلب'],
    correu: ['Correu de la comanda', 'Correo del pedido', 'Email used for the order', 'E-mail de la commande', 'E-Mail der Bestellung', 'بريد الطلب'],
    tipus: ['Què ha passat?', '¿Qué ha pasado?', 'What happened?', 'Que s’est-il passé ?', 'Was ist passiert?', 'ماذا حدث؟'],
    detall: ['Explica-ho una mica', 'Cuéntalo un poco', 'Tell us a bit more', 'Expliquez-nous un peu', 'Beschreiben Sie es kurz', 'اشرح لنا قليلًا'],
    ph: ['Per exemple: una garrafa d’ECO Concentrat Pro ha arribat trencada.', 'Por ejemplo: una garrafa de ECO Concentrat Pro ha llegado rota.', 'For example: one ECO Concentrat Pro jerrycan arrived broken.', 'Par exemple : un bidon d’ECO Concentrat Pro est arrivé cassé.', 'Zum Beispiel: Ein Kanister ECO Concentrat Pro kam beschädigt an.', 'مثلًا: وصلت عبوة ECO Concentrat Pro مكسورة.'],
    enviar: ['Enviar la incidència', 'Enviar la incidencia', 'Send', 'Envoyer', 'Senden', 'إرسال'],
    enviant: ['Enviant…', 'Enviando…', 'Sending…', 'Envoi…', 'Wird gesendet…', 'جارٍ الإرسال…'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    fetT: ['Incidència rebuda', 'Incidencia recibida', 'Report received', 'Signalement reçu', 'Meldung erhalten', 'تم استلام البلاغ'],
    fet: ['L’hem registrada amb la referència {0}. Et respondrem en menys de 24 hores laborables.', 'La hemos registrado con la referencia {0}. Te responderemos en menos de 24 horas laborables.', 'We have logged it with reference {0}. We will reply within 24 working hours.', 'Nous l’avons enregistré sous la référence {0}. Réponse sous 24 heures ouvrées.', 'Wir haben sie unter der Referenz {0} erfasst und antworten innerhalb von 24 Arbeitsstunden.', 'سجّلناه بالمرجع {0}. سنرد خلال 24 ساعة عمل.'],
    errPedido: ['No trobem cap comanda amb aquest número i aquest correu. Revisa’ls.', 'No encontramos ningún pedido con ese número y ese correo. Revísalos.', 'We can’t find an order with that number and email. Please check them.', 'Aucune commande trouvée avec ce numéro et cet e-mail. Vérifiez-les.', 'Keine Bestellung mit dieser Nummer und E-Mail gefunden. Bitte prüfen.', 'لا يوجد طلب بهذا الرقم والبريد. تحقق منهما.'],
    errText: ['Explica una mica què ha passat.', 'Explica un poco qué ha pasado.', 'Please describe what happened.', 'Décrivez un peu ce qui s’est passé.', 'Bitte beschreiben Sie kurz, was passiert ist.', 'اشرح قليلًا ما حدث.'],
    errLimit: ['Avui ja has enviat moltes incidències. Escriu-nos per WhatsApp al 631 706 398.', 'Hoy ya has enviado muchas incidencias. Escríbenos por WhatsApp al 631 706 398.', 'You have sent many reports today. Message us on WhatsApp: 631 706 398.', 'Vous avez déjà envoyé beaucoup de signalements aujourd’hui. WhatsApp : 631 706 398.', 'Heute schon viele Meldungen gesendet. WhatsApp: 631 706 398.', 'أرسلت بلاغات كثيرة اليوم. راسلنا عبر واتساب 631 706 398.'],
    errGen: ['No s’ha pogut enviar. Torna-ho a provar o escriu-nos per WhatsApp al 631 706 398.', 'No se ha podido enviar. Vuelve a intentarlo o escríbenos por WhatsApp al 631 706 398.', 'It could not be sent. Try again or message us on WhatsApp: 631 706 398.', 'Envoi impossible. Réessayez ou WhatsApp : 631 706 398.', 'Senden nicht möglich. Erneut versuchen oder WhatsApp: 631 706 398.', 'تعذّر الإرسال. حاول مجددًا أو راسلنا عبر واتساب 631 706 398.'],
  };
  // [valor que entiende el ERP, textos]
  var TIPUS = [
    ['Producto dañado', ['Producte danyat o trencat', 'Producto dañado o roto', 'Damaged or broken product', 'Produit abîmé ou cassé', 'Beschädigtes Produkt', 'منتج تالف أو مكسور']],
    ['Falta algún producto', ['Falta algun producte', 'Falta algún producto', 'Something is missing', 'Il manque un produit', 'Es fehlt etwas', 'ينقص منتج']],
    ['Producto equivocado', ['Producte equivocat', 'Producto equivocado', 'Wrong product', 'Mauvais produit', 'Falsches Produkt', 'منتج خاطئ']],
    ['Retraso en la entrega', ['Retard en l’entrega', 'Retraso en la entrega', 'Late delivery', 'Retard de livraison', 'Verspätete Lieferung', 'تأخر التسليم']],
    ['Factura incorrecta', ['Factura incorrecta', 'Factura incorrecta', 'Incorrect invoice', 'Facture incorrecte', 'Falsche Rechnung', 'فاتورة غير صحيحة']],
    ['Otros', ['Una altra cosa', 'Otra cosa', 'Something else', 'Autre chose', 'Etwas anderes', 'شيء آخر']],
  ];

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k, a) { return (TX[k][LANGS.indexOf(lang())] || TX[k][1]).replace('{0}', a == null ? '' : a); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var tornarFocus = null;
  function tancar() {
    var m = document.getElementById('hxInc');
    if (m) m.remove();
    if (tornarFocus && tornarFocus.isConnected) try { tornarFocus.focus(); } catch (e) { /* ja no hi és */ }
  }
  function obrir(num) {
    tancar();
    tornarFocus = document.activeElement;
    var u = window.HX_USER && window.HX_USER.role !== 'admin' ? window.HX_USER : null;
    var m = document.createElement('div');
    m.id = 'hxInc';
    m.innerHTML = '<form class="hxi-caixa" role="dialog" aria-modal="true" aria-labelledby="hxiT" novalidate>' +
      '<button type="button" class="hxi-x" data-i="tancar" aria-label="' + esc(t('tancar')) + '">✕</button>' +
      '<h2 id="hxiT">' + esc(t('titol')) + '</h2>' +
      '<p class="hxi-intro" id="hxiIntro">' + esc(t('intro', num || '…')) + '</p>' +
      '<label for="hxiNum">' + esc(t('comanda')) + '</label><input id="hxiNum" value="' + esc(num || '') + '" maxlength="40" autocomplete="off" required>' +
      (u ? '' : '<label for="hxiMail">' + esc(t('correu')) + '</label><input id="hxiMail" type="email" autocomplete="email" maxlength="160" required>') +
      '<fieldset><legend>' + esc(t('tipus')) + '</legend><div class="hxi-tipus">' + TIPUS.map(function (x, i) {
        return '<label><input type="radio" name="hxiTipus" value="' + esc(x[0]) + '"' + (i ? '' : ' checked') + '><span>' + esc(x[1][LANGS.indexOf(lang())]) + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<label for="hxiText">' + esc(t('detall')) + '</label><textarea id="hxiText" rows="4" maxlength="1500" placeholder="' + esc(t('ph')) + '" required></textarea>' +
      '<p class="hxi-err" id="hxiErr" role="alert"></p>' +
      '<button type="submit" class="hxi-btn">' + esc(t('enviar')) + '</button></form>';
    document.body.appendChild(m);
    var f = m.querySelector('form');
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-i="tancar"]')) tancar(); });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); tancar(); } });
    f.addEventListener('submit', function (e) { e.preventDefault(); enviar(f, u); });
    (document.getElementById(num ? (u ? 'hxiText' : 'hxiMail') : 'hxiNum') || f).focus();
  }
  function enviar(f, u) {
    var err = document.getElementById('hxiErr'), btn = f.querySelector('[type=submit]');
    var num = document.getElementById('hxiNum').value.trim();
    var mail = u ? u.email : (document.getElementById('hxiMail').value || '').trim();
    var texto = document.getElementById('hxiText').value.trim();
    var tipo = (f.querySelector('input[name=hxiTipus]:checked') || {}).value || 'Otros';
    err.textContent = '';
    if (!num || (!u && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))) { err.textContent = t('errPedido'); return; }
    if (texto.length < 5) { err.textContent = t('errText'); return; }
    btn.disabled = true; btn.textContent = t('enviant');
    window.hxApi('/incidencias', { method: 'POST', body: { num: num, email: mail, tipo: tipo, texto: texto, lang: lang() } })
      .then(function (d) {
        f.innerHTML = '<button type="button" class="hxi-x" data-i="tancar" aria-label="' + esc(t('tancar')) + '">✕</button>' +
          '<div class="hxi-ok" aria-hidden="true">✓</div><h2 id="hxiT">' + esc(t('fetT')) + '</h2><p class="hxi-intro">' + esc(t('fet', d.ref || '')) + '</p>' +
          '<button type="button" class="hxi-btn" data-i="tancar">' + esc(t('tancar')) + '</button>';
        var b = f.querySelector('.hxi-btn'); if (b) b.focus();
      })
      .catch(function (x) {
        btn.disabled = false; btn.textContent = t('enviar');
        err.textContent = x.status === 404 ? t('errPedido') : x.status === 429 ? t('errLimit') : x.status === 400 ? t('errText') : t('errGen');
      });
  }
  window.hxIncidencia = { obrir: obrir };

  // Enllaç del correu «Comanda entregada»: ?incidencia=NUM
  function desDeURL() {
    var num = null;
    try { num = new URLSearchParams(location.search).get('incidencia'); } catch (e) { num = null; }
    if (!num) return;
    setTimeout(function () { obrir(String(num).slice(0, 40)); }, 900);
    try { var q = new URLSearchParams(location.search); q.delete('incidencia'); history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '')); } catch (e) { /* adreça sense canviar */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', desDeURL); else desDeURL();
})();
