/* ============================================================
   HIGIENEX — Valoraciones de productos (valoraciones.js)
   · Las valoraciones se guardan en el servidor y las ve todo el mundo.
   · Solo valora quien ha iniciado sesión y ha comprado el producto
     («Compra verificada»); sale su nombre y la inicial del apellido.
   · Las opiniones de muestra que ya tenía la web salen como «de ejemplo».
   · En la zona de clientes: «Valora lo que has comprado».
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    verificada: ['Compra verificada', 'Compra verificada', 'Verified purchase', 'Achat vérifié', 'Verifizierter Kauf', 'شراء موثّق'],
    exemple: ['opinió d’exemple', 'opinión de ejemplo', 'sample review', 'avis d’exemple', 'Beispielbewertung', 'رأي على سبيل المثال'],
    entra: ['Inicia sessió per valorar: només poden opinar els clients que l’han comprat.', 'Inicia sesión para valorar: solo pueden opinar los clientes que lo han comprado.', 'Log in to review: only customers who bought it can leave a review.', 'Connectez-vous pour donner votre avis : seuls les clients qui l’ont acheté peuvent le faire.', 'Melden Sie sich an: Nur Kunden, die das Produkt gekauft haben, können es bewerten.', 'سجّل الدخول للتقييم: يمكن فقط للعملاء الذين اشتروه إبداء رأيهم.'],
    noComprat: ['Encara no l’has comprat: quan el rebis, podràs valorar-lo.', 'Todavía no lo has comprado: cuando lo recibas, podrás valorarlo.', 'You haven’t bought it yet: you can review it once you receive it.', 'Vous ne l’avez pas encore acheté : vous pourrez le noter après réception.', 'Sie haben es noch nicht gekauft: Nach Erhalt können Sie es bewerten.', 'لم تشترِه بعد: يمكنك تقييمه بعد استلامه.'],
    actualitza: ['Actualitzar la meva valoració', 'Actualizar mi valoración', 'Update my review', 'Modifier mon avis', 'Bewertung aktualisieren', 'تحديث تقييمي'],
    envia: ['Enviar valoració', 'Enviar valoración', 'Send review', 'Envoyer l’avis', 'Bewertung senden', 'إرسال التقييم'],
    gracies: ['Gràcies per la teva valoració!', '¡Gracias por tu valoración!', 'Thanks for your review!', 'Merci pour votre avis !', 'Danke für Ihre Bewertung!', 'شكرًا على تقييمك!'],
    error: ['No s’ha pogut desar la valoració.', 'No se ha podido guardar la valoración.', 'Couldn’t save your review.', 'Impossible d’enregistrer l’avis.', 'Bewertung konnte nicht gespeichert werden.', 'تعذّر حفظ التقييم.'],
    valoraTit: ['Valora el que has comprat', 'Valora lo que has comprado', 'Review what you bought', 'Notez vos achats', 'Bewerten Sie Ihre Käufe', 'قيّم ما اشتريته'],
    valoraIntro: ['La teva opinió ajuda altres empreses a triar.', 'Tu opinión ayuda a otras empresas a elegir.', 'Your opinion helps other businesses choose.', 'Votre avis aide d’autres entreprises à choisir.', 'Ihre Meinung hilft anderen Unternehmen bei der Wahl.', 'رأيك يساعد الشركات الأخرى على الاختيار.'],
    valorar: ['Valorar', 'Valorar', 'Review', 'Noter', 'Bewerten', 'قيّم'],
    jaValorat: ['Ja l’has valorat', 'Ya lo has valorado', 'Already reviewed', 'Déjà noté', 'Bereits bewertet', 'قيّمته بالفعل'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var SRV = {}; // valoraciones del servidor por producto
  var MEU = { comprados: [], mias: {} }; // de la cuenta con sesión
  var SEED = window.HX_REVIEWS_SEED || (typeof HX_REVIEWS_SEED !== 'undefined' ? HX_REVIEWS_SEED : {});
  function sessio() { return !!(window.HX_USER && typeof hxApiToken === 'function' && hxApiToken()); }

  function carregar() {
    var a = fetch(HX_API_BASE + '/reviews').then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { SRV = d || {}; }).catch(function () {});
    var b = sessio() ? hxApi('/reviews/mias').then(function (d) { MEU = d || MEU; }).catch(function () {}) : Promise.resolve(MEU = { comprados: [], mias: {} });
    return Promise.all([a, b]).then(function () { pintarZona(); });
  }

  /* Lista que pinta la ficha: primero las de clientes (verificadas), después las de ejemplo */
  window.hxReviewsFor = function (name) {
    var reals = (SRV[name] || []).map(function (r) { return { n: r.n + ' · ✓ ' + t('verificada'), s: r.s, t: r.t }; });
    var mostra = (SEED[name] || []).map(function (r) { return { n: r.n + ' · ' + t('exemple'), s: r.s, t: r.t }; });
    return reals.concat(mostra);
  };

  /* Formulario de la ficha según quién la mira */
  function formulari(name) {
    var nom = document.getElementById('fpReviewName');
    if (nom) nom.style.display = 'none'; // el nombre sale de la cuenta
    var text = document.getElementById('fpReviewText');
    var boto = text && text.parentNode.querySelector('button');
    var nota = document.getElementById('hxValNota');
    if (!nota && text) { nota = document.createElement('p'); nota.id = 'hxValNota'; nota.className = 'hx-val-nota'; text.parentNode.insertBefore(nota, text); }
    var pot = sessio() && MEU.comprados.indexOf(name) >= 0;
    if (nota) nota.textContent = !sessio() ? t('entra') : !pot ? t('noComprat') : '';
    if (nota) nota.style.display = nota.textContent ? '' : 'none';
    ['fpReviewStars', 'fpReviewText'].forEach(function (id) { var e = document.getElementById(id); if (e) e.style.display = pot ? '' : 'none'; });
    if (boto) { boto.style.display = pot ? '' : 'none'; boto.textContent = MEU.mias[name] ? t('actualitza') : t('envia'); }
    if (pot && MEU.mias[name]) {
      window.HX_CURRENT_REVIEW_STARS = MEU.mias[name].s;
      try { HX_CURRENT_REVIEW_STARS = MEU.mias[name].s; } catch (e) { /* variable de app-2.js */ }
      if (typeof hxRenderReviewStarsPicker === 'function') hxRenderReviewStarsPicker();
      if (text && !text.value) text.value = MEU.mias[name].t || '';
    }
  }

  window.fpEnviarValoracio = function () {
    var name = (document.getElementById('fpName') || {}).textContent;
    var text = document.getElementById('fpReviewText');
    var estrelles = typeof HX_CURRENT_REVIEW_STARS !== 'undefined' ? HX_CURRENT_REVIEW_STARS : 5;
    hxApi('/reviews', { method: 'POST', body: { product: name, stars: estrelles, text: text ? text.value.trim() : '' } })
      .then(function () {
        if (typeof showToast === 'function') showToast(t('gracies'), '⭐');
        return carregar();
      })
      .then(function () { if (typeof hxRenderProductRating === 'function') hxRenderProductRating(name, 'fpRating', 'fpReviewsList'); formulari(name); })
      .catch(function (e) { if (typeof showToast === 'function') showToast((e && e.message) || t('error'), '⚠️'); });
  };

  /* Zona de clientes: productos comprados para valorar */
  function pintarZona() {
    var c = document.getElementById('hxValora');
    var dades = document.getElementById('hxMisDades');
    if (!sessio() || !MEU.comprados.length || !dades) { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('div'); c.id = 'hxValora'; c.setAttribute('role', 'region'); c.setAttribute('aria-labelledby', 'hxValTit'); dades.parentNode.insertBefore(c, dades.nextSibling); }
    c.innerHTML = '<h3 id="hxValTit">⭐ ' + esc(t('valoraTit')) + '</h3><p>' + esc(t('valoraIntro')) + '</p><ul>' +
      MEU.comprados.map(function (p) {
        var m = MEU.mias[p];
        return '<li><span>' + esc(p) + '</span>' + (m ? '<span class="hx-val-fet">' + '★'.repeat(m.s) + ' · ' + esc(t('jaValorat')) + '</span>' : '') +
          '<button type="button" data-p="' + esc(p) + '">' + esc(m ? t('actualitza') : t('valorar')) + '</button></li>';
      }).join('') + '</ul>';
    [].forEach.call(c.querySelectorAll('button[data-p]'), function (b) {
      b.onclick = function () {
        if (typeof closePedidosSection === 'function') closePedidosSection();
        if (typeof obrirFitxaProducte === 'function') obrirFitxaProducte(b.getAttribute('data-p'));
        setTimeout(function () { var x = document.getElementById('fpReviewStars'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 450);
      };
    });
  }

  function iniciar() {
    var fitxa = window.obrirFitxaProducte;
    if (typeof fitxa === 'function' && !fitxa._hxVal) {
      var w = function (name) { var r = fitxa.apply(this, arguments); formulari(name); return r; };
      w._hxVal = true; window.obrirFitxaProducte = w;
    }
    ['setLoggedInUser', 'logout', 'openCartDrawer'].forEach(function (n) {
      var f = window[n];
      if (typeof f !== 'function' || f._hxVal) return;
      var w2 = function () { var r = f.apply(this, arguments); setTimeout(carregar, n === 'setLoggedInUser' ? 1800 : 50); return r; };
      w2._hxVal = true; window[n] = w2;
    });
    carregar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
