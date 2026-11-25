/* ============================================================
   HIGIENEX — Mònica en el área de clientes (monica-area.js)
   Botón flotante «Pregúntale a Mònica» mientras el área está abierta.
   Mònica responde con los datos reales del cliente (el servidor los lee de
   la base de datos con la sesión) y propone botones del área: ver el
   seguimiento, repetir un pedido, pagar una factura en modo prueba, etc.
   Nada se hace hasta que el cliente pulsa el botón.
   Sin IA (sin conexión o cupo agotado) responde con los datos del área.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    boto: ['Pregunta a la Mònica', 'Pregúntale a Mònica', 'Ask Mònica', 'Demandez à Mònica', 'Mònica fragen', 'اسأل مونيكا'],
    rol: ['La teva assistent', 'Tu asistente', 'Your assistant', 'Votre assistante', 'Ihre Assistentin', 'مساعدتك'],
    hola: ['Hola, {0}! Sóc la Mònica. Veig les teves comandes i factures: pregunta’m el que vulguis.', '¡Hola, {0}! Soy Mònica. Veo tus pedidos y facturas: pregúntame lo que quieras.', 'Hi {0}! I’m Mònica. I can see your orders and invoices: ask me anything.', 'Bonjour {0} ! Je suis Mònica. Je vois vos commandes et factures : demandez-moi ce que vous voulez.', 'Hallo {0}! Ich bin Mònica. Ich sehe Ihre Bestellungen und Rechnungen: fragen Sie mich.', 'مرحبًا {0}! أنا مونيكا. أرى طلباتك وفواتيرك: اسألني ما تشاء.'],
    s1: ['On és la meva última comanda?', '¿Dónde está mi último pedido?', 'Where is my latest order?', 'Où en est ma dernière commande ?', 'Wo ist meine letzte Bestellung?', 'أين طلبي الأخير؟'],
    s2: ['Quines factures tinc pendents?', '¿Qué facturas tengo pendientes?', 'Which invoices are unpaid?', 'Quelles factures dois-je payer ?', 'Welche Rechnungen sind offen?', 'ما الفواتير غير المدفوعة؟'],
    s3: ['Vull repetir la comanda', 'Quiero repetir el pedido', 'I want to reorder', 'Je veux recommander', 'Ich möchte erneut bestellen', 'أريد تكرار الطلب'],
    s4: ['Com canvio la contrasenya?', '¿Cómo cambio la contraseña?', 'How do I change my password?', 'Comment changer le mot de passe ?', 'Wie ändere ich das Passwort?', 'كيف أغيّر كلمة المرور؟'],
    escriu: ['Escriu la teva pregunta…', 'Escribe tu pregunta…', 'Type your question…', 'Écrivez votre question…', 'Ihre Frage…', 'اكتب سؤالك…'],
    enviar: ['Enviar', 'Enviar', 'Send', 'Envoyer', 'Senden', 'إرسال'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    avis: ['La Mònica fa servir IA de Google i veu les teves comandes i factures per ajudar-te. No hi escriguis contrasenyes ni dades de targeta.', 'Mònica usa IA de Google y ve tus pedidos y facturas para ayudarte. No escribas contraseñas ni datos de tarjeta.', 'Mònica uses Google AI and sees your orders and invoices to help you. Don’t type passwords or card details.', 'Mònica utilise l’IA de Google et voit vos commandes et factures. N’écrivez ni mot de passe ni carte.', 'Mònica nutzt Google-KI und sieht Ihre Bestellungen und Rechnungen. Keine Passwörter oder Kartendaten eingeben.', 'تستخدم مونيكا ذكاء Google وترى طلباتك وفواتيرك. لا تكتب كلمات مرور أو بيانات بطاقة.'],
    pensant: ['La Mònica està escrivint…', 'Mònica está escribiendo…', 'Mònica is typing…', 'Mònica écrit…', 'Mònica schreibt…', 'مونيكا تكتب…'],
    targetaT: ['Pregunta a la Mònica', 'Pregúntale a Mònica', 'Ask Mònica', 'Demandez à Mònica', 'Mònica fragen', 'اسأل مونيكا'],
    targetaX: ['Et respon a l’instant amb les teves dades: on és una comanda, què tens per pagar o com fer qualsevol cosa a l’àrea.', 'Te responde al momento con tus datos: dónde está un pedido, qué tienes por pagar o cómo hacer cualquier cosa en el área.', 'Instant answers with your own data: where an order is, what you owe or how to do anything here.', 'Réponses immédiates avec vos données : commandes, montants dus, mode d’emploi.', 'Sofortige Antworten mit Ihren Daten: Bestellstatus, offene Beträge, Anleitungen.', 'إجابات فورية ببياناتك: حالة الطلب، المستحقات، وطريقة القيام بأي شيء.'],
    // respostes sense IA
    lUlt: ['La teva última comanda és la **{0}** ({1}), de {2}. Estat: **{3}**.', 'Tu último pedido es el **{0}** ({1}), de {2}. Estado: **{3}**.', 'Your latest order is **{0}** ({1}), {2}. Status: **{3}**.', 'Votre dernière commande est **{0}** ({1}), {2}. État : **{3}**.', 'Ihre letzte Bestellung ist **{0}** ({1}), {2}. Status: **{3}**.', 'طلبك الأخير **{0}** ({1})، {2}. الحالة: **{3}**.'],
    lCap: ['Encara no tens cap comanda. Vols que t’ajudi a fer-ne una?', 'Todavía no tienes pedidos. ¿Te ayudo a hacer uno?', 'You have no orders yet. Shall I help you place one?', 'Pas encore de commande. Je vous aide à en passer une ?', 'Noch keine Bestellungen. Soll ich helfen?', 'لا توجد طلبات بعد. هل أساعدك في طلب؟'],
    lFact: ['Tens **{0}** factures per pagar, en total **{1}**.', 'Tienes **{0}** facturas por pagar, en total **{1}**.', 'You have **{0}** unpaid invoices, **{1}** in total.', 'Vous avez **{0}** factures à payer, **{1}** au total.', 'Sie haben **{0}** offene Rechnungen, insgesamt **{1}**.', 'لديك **{0}** فواتير غير مدفوعة، بإجمالي **{1}**.'],
    lFactOk: ['No tens cap factura pendent. Tot pagat!', 'No tienes ninguna factura pendiente. ¡Todo pagado!', 'No unpaid invoices. All paid!', 'Aucune facture à payer. Tout est réglé !', 'Keine offenen Rechnungen. Alles bezahlt!', 'لا فواتير غير مدفوعة. كل شيء مدفوع!'],
    lClau: ['A Les meves dades › Seguretat pots canviar la contrasenya (et demana l’actual).', 'En Mis datos › Seguridad puedes cambiar la contraseña (te pide la actual).', 'In My details › Security you can change your password (it asks for the current one).', 'Dans Mes données › Sécurité (le mot de passe actuel est demandé).', 'Unter Meine Daten › Sicherheit (aktuelles Passwort erforderlich).', 'في بياناتي › الأمان يمكنك تغيير كلمة المرور.'],
    lRep: ['Et deixo un botó per repetir la comanda {0}: els productes passen a la cistella i només has de confirmar.', 'Te dejo un botón para repetir el pedido {0}: los productos pasan a la cesta y solo tienes que confirmar.', 'Here’s a button to reorder {0}: the products go into your cart and you just confirm.', 'Voici un bouton pour recommander {0} : les produits passent au panier.', 'Hier ein Knopf, um {0} erneut zu bestellen.', 'إليك زرًا لتكرار الطلب {0}.'],
    lAltre: ['Ara no puc consultar la IA. Mira la secció Ajuda o escriu-nos per WhatsApp al 631 706 398.', 'Ahora no puedo consultar la IA. Mira la sección Ayuda o escríbenos por WhatsApp al 631 706 398.', 'I can’t reach the AI right now. Check Help or message us on WhatsApp: 631 706 398.', 'L’IA est indisponible. Consultez l’Aide ou WhatsApp : 631 706 398.', 'Die KI ist gerade nicht erreichbar. Siehe Hilfe oder WhatsApp: 631 706 398.', 'الذكاء غير متاح الآن. راجع المساعدة أو واتساب: 631 706 398.'],
    bSeg: ['Veure el seguiment', 'Ver el seguimiento', 'View tracking', 'Voir le suivi', 'Verfolgung ansehen', 'عرض التتبع'],
    bFact: ['Anar a les factures', 'Ir a las facturas', 'Go to invoices', 'Voir les factures', 'Zu den Rechnungen', 'إلى الفواتير'],
    bRep: ['Repetir la comanda', 'Repetir el pedido', 'Reorder', 'Recommander', 'Erneut bestellen', 'كرّر الطلب'],
    bClau: ['Canviar la contrasenya', 'Cambiar la contraseña', 'Change password', 'Changer le mot de passe', 'Passwort ändern', 'تغيير كلمة المرور'],
    bAjuda: ['Obrir l’Ajuda', 'Abrir Ayuda', 'Open Help', 'Ouvrir l’Aide', 'Hilfe öffnen', 'فتح المساعدة'],
    bBotiga: ['Anar a la botiga', 'Ir a la tienda', 'Go to the shop', 'Aller à la boutique', 'Zum Shop', 'إلى المتجر'],
  };

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) {
    var v = TX[k][LANGS.indexOf(lang())] || TX[k][1];
    for (var i = 1; i < arguments.length; i++) v = v.split('{' + (i - 1) + '}').join(arguments[i]);
    return v;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function negreta(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
  function eur(n) { return typeof window.hxFormatPrice === 'function' ? window.hxFormatPrice(n) : (Number(n) || 0).toFixed(2).replace('.', ',') + ' €'; }

  var HIST = []; // { who: 'user'|'bot', text }
  var ocupat = false, tornarFocus = null;

  /* ---------- estructura ---------- */
  function boto() {
    var b = document.getElementById('hxMoniBtn');
    if (b) return b;
    b = document.createElement('button');
    b.type = 'button'; b.id = 'hxMoniBtn';
    b.innerHTML = '<span class="hxm-av" aria-hidden="true">M</span><span class="hxm-txt"></span>';
    b.onclick = obrir;
    document.body.appendChild(b);
    return b;
  }
  function textos() {
    var b = document.getElementById('hxMoniBtn');
    if (b) { b.querySelector('.hxm-txt').textContent = t('boto'); b.setAttribute('aria-label', t('boto')); }
  }
  function panell() {
    var p = document.getElementById('hxMoni');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'hxMoni';
    p.hidden = true;
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-modal', 'false');
    p.setAttribute('aria-labelledby', 'hxmNom');
    document.body.appendChild(p);
    p.addEventListener('click', clic);
    p.addEventListener('submit', function (e) {
      e.preventDefault();
      var i = document.getElementById('hxmIn');
      var v = i.value.trim();
      if (!v || ocupat) return;
      i.value = '';
      preguntar(v);
    });
    p.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); tancar(); } });
    return p;
  }
  function pintar() {
    var p = panell();
    var u = window.HX_PROFILE || window.HX_USER || {};
    var nom = String(u.name || '').split(' ')[0];
    var msgs = [{ who: 'bot', text: t('hola', nom) }].concat(HIST);
    p.innerHTML =
      '<header class="hxm-cap"><span class="hxm-av" aria-hidden="true">M</span><div><b id="hxmNom">Mònica</b><small>' + esc(t('rol')) + '</small></div>' +
      '<button type="button" class="hxm-x" data-m="tancar" aria-label="' + esc(t('tancar')) + '">✕</button></header>' +
      '<div class="hxm-cos" id="hxmCos" aria-live="polite">' + msgs.map(missatge).join('') +
      (ocupat ? '<div class="hxm-msg bot hxm-pensa">' + esc(t('pensant')) + '</div>' : '') +
      (HIST.length ? '' : '<div class="hxm-suggs">' + ['s1', 's2', 's3', 's4'].map(function (k) { return '<button type="button" data-preg="' + esc(t(k)) + '">' + esc(t(k)) + '</button>'; }).join('') + '</div>') +
      '</div>' +
      '<form class="hxm-form"><label class="hxa-sr" for="hxmIn">' + esc(t('escriu')) + '</label>' +
      '<input id="hxmIn" autocomplete="off" maxlength="600" placeholder="' + esc(t('escriu')) + '"' + (ocupat ? ' disabled' : '') + '>' +
      '<button type="submit" aria-label="' + esc(t('enviar')) + '"' + (ocupat ? ' disabled' : '') + '>➤</button></form>' +
      '<p class="hxm-avis">' + esc(t('avis')) + '</p>';
    var cos = document.getElementById('hxmCos');
    cos.scrollTop = cos.scrollHeight;
  }
  function missatge(m, i) {
    var acc = (m.actions || []).map(function (a, k) {
      return '<button type="button" class="hxm-acc" data-msg="' + (i - 1) + '" data-k="' + k + '">' + esc(a.texto) + '</button>';
    }).join('');
    return '<div class="hxm-msg ' + m.who + '">' + negreta(m.text) + (acc ? '<div class="hxm-accs">' + acc + '</div>' : '') + '</div>';
  }

  /* ---------- preguntar ---------- */
  function preguntar(text) {
    HIST.push({ who: 'user', text: text });
    ocupat = true; pintar();
    var hist = HIST.slice(-13, -1).map(function (m) { return { role: m.who === 'user' ? 'user' : 'assistant', content: m.text }; });
    var u = window.HX_PROFILE || {};
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var limit = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    var tok = typeof window.hxApiToken === 'function' ? window.hxApiToken() : '';
    var l = (typeof window.hxDetectLang === 'function' && window.hxDetectLang(text)) || lang();
    fetch(window.HX_API_BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
      body: JSON.stringify({ message: text, history: hist, lang: l, area: true, perfil: { empresa: u.company || '', sector: u.sector || '' } }),
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (r) {
      clearTimeout(limit);
      return r.json().then(function (d) { if (!r.ok || !d.reply) throw new Error(d.error || ('Error ' + r.status)); return d; });
    }).then(function (d) {
      HIST.push({ who: 'bot', text: d.reply, actions: d.actions || [] });
    }).catch(function (e) {
      console.warn('Mònica (área) sin IA:', e.message);
      HIST.push(local(text));
    }).then(function () {
      ocupat = false; pintar();
      var i = document.getElementById('hxmIn'); if (i) i.focus();
    });
  }
  // Sin IA: respuestas con los datos que ya tiene el área
  function local(text) {
    var q = String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var d = window.hxArea ? window.hxArea.dades() : {};
    var c = (d.comandes || [])[0];
    if (/factur|invoice|rechnung|pagar|pay|debo|dois|deber|فاتور/.test(q)) {
      var p = (d.factures || []).filter(function (f) { return f.estado !== 'pagada'; });
      if (!p.length) return { who: 'bot', text: t('lFactOk') };
      var tot = p.reduce(function (s, f) { return s + (+f.total || 0); }, 0);
      return { who: 'bot', text: t('lFact', p.length, eur(tot)), actions: [{ tipo: 'area', accion: 'factures', texto: t('bFact') }] };
    }
    if (/repet|reorder|recommand|erneut|كرر/.test(q)) {
      if (!c) return { who: 'bot', text: t('lCap'), actions: [{ tipo: 'ir_a', seccion: 'productes', texto: t('bBotiga') }] };
      return { who: 'bot', text: t('lRep', c.invoiceNum), actions: [{ tipo: 'area', accion: 'repetir', ref: c.invoiceNum, texto: t('bRep') }] };
    }
    if (/contrasen|password|passwort|mot de passe|clau|كلمة/.test(q)) return { who: 'bot', text: t('lClau'), actions: [{ tipo: 'area', accion: 'cambiar_clave', texto: t('bClau') }] };
    if (/pedido|comanda|order|commande|bestell|طلب|seguim|track|suivi/.test(q)) {
      if (!c) return { who: 'bot', text: t('lCap'), actions: [{ tipo: 'ir_a', seccion: 'productes', texto: t('bBotiga') }] };
      var nomEstat = window.hxArea.estat ? window.hxArea.estat(c.status) : c.status;
      var data = new Date(c.date).toLocaleDateString({ ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' }[lang()]);
      return { who: 'bot', text: t('lUlt', c.invoiceNum, data, eur(c.total), nomEstat), actions: [{ tipo: 'area', accion: 'seguimiento', ref: c.invoiceNum, texto: t('bSeg') }] };
    }
    return { who: 'bot', text: t('lAltre'), actions: [{ tipo: 'area', accion: 'ajuda', texto: t('bAjuda') }] };
  }

  /* ---------- botons proposats ---------- */
  var SECCIO = { inici: 'inici', comandes: 'comandes', factures: 'factures', dades: 'dades', ajuda: 'ajuda' };
  function executar(a) {
    var A = window.hxArea;
    if (!A) return;
    if (a.tipo === 'ir_a') { A.tancar(); if (typeof window.navTo === 'function') window.navTo(a.seccion === 'cita' ? 'contacte' : a.seccion); return; }
    if (a.tipo === 'presupuesto') {
      A.tancar();
      (a.productos || []).forEach(function (p) { if (window.PRESSUPOST_QTY) window.PRESSUPOST_QTY[p.nombre] = p.garrafas; });
      if (typeof window.navTo === 'function') window.navTo('pressupost');
      setTimeout(function () { if (typeof window.renderPressupost === 'function') window.renderPressupost(); }, 300);
      return;
    }
    if (a.tipo === 'carrito') {
      (a.productos || []).forEach(function (p) {
        var pr = (window.PRODUCTS || []).filter(function (x) { return x.name === p.nombre; })[0];
        if (!pr || typeof window.recalcCartLine !== 'function') return;
        if (window.cart[p.nombre]) window.cart[p.nombre].qty += p.garrafas; else window.cart[p.nombre] = { qty: p.garrafas, price: pr.price };
        window.recalcCartLine(p.nombre);
      });
      A.tancar();
      if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
      return;
    }
    if (a.tipo !== 'area') return;
    var que = a.accion;
    if (SECCIO[que]) { A.ir(SECCIO[que]); tancarMobil(); return; }
    if (que === 'seguimiento') { A.accio('seguir', a.ref); tancarMobil(); return; }
    if (que === 'repetir') { tancar(); A.accio('repetir', a.ref); return; }
    if (que === 'programar') { A.accio('programar', a.ref); return; }
    if (que === 'pdf_pedido') { A.accio('pdf-comanda', a.ref); return; }
    if (que === 'pdf_factura') { A.accio('pdf-factura', a.ref); return; }
    if (que === 'pagar') { A.ir('factures'); tancarMobil(); setTimeout(function () { A.accio('pagar', a.ref); }, 150); return; }
    if (que === 'editar_datos') { A.ir('dades'); A.accio('editar'); return; }
    if (que === 'cambiar_clave') {
      A.ir('dades'); tancarMobil();
      setTimeout(function () { var i = document.getElementById('hxaCA'); if (i) { i.scrollIntoView({ block: 'center' }); i.focus(); } }, 150);
    }
  }
  // en el móvil el panel tapa el área: se cierra para que se vea el resultado
  function tancarMobil() { if (window.matchMedia('(max-width: 760px)').matches) tancar(); }
  function clic(e) {
    if (e.target.closest('[data-m="tancar"]')) { tancar(); return; }
    var s = e.target.closest('[data-preg]');
    if (s && !ocupat) { preguntar(s.getAttribute('data-preg')); return; }
    var b = e.target.closest('.hxm-acc');
    if (b) {
      var m = HIST[+b.getAttribute('data-msg')];
      var a = m && m.actions && m.actions[+b.getAttribute('data-k')];
      if (a) executar(a);
    }
  }

  /* ---------- obrir / tancar ---------- */
  function obrir() {
    if (!window.hxArea || !window.hxArea.oberta()) return;
    tornarFocus = document.activeElement;
    pintar();
    var p = panell(); p.hidden = false;
    document.documentElement.classList.add('hxm-oberta');
    var i = document.getElementById('hxmIn'); if (i) i.focus();
  }
  function tancar() {
    var p = document.getElementById('hxMoni');
    if (!p || p.hidden) return;
    p.hidden = true;
    document.documentElement.classList.remove('hxm-oberta');
    if (tornarFocus && tornarFocus.isConnected) try { tornarFocus.focus(); } catch (e) { /* ja no hi és */ }
    else { var b = document.getElementById('hxMoniBtn'); if (b) b.focus(); }
  }
  function targeta() {
    return '<div role="group" class="hxa-card hxm-targeta" aria-labelledby="hxmT"><span class="hxm-av" aria-hidden="true">M</span><div>' +
      '<h2 id="hxmT">' + esc(t('targetaT')) + '</h2><p class="hxa-meta">' + esc(t('targetaX')) + '</p>' +
      '<button type="button" class="hxa-btn" data-acc="monica">' + esc(t('boto')) + '</button></div></div>';
  }
  window.hxMonicaArea = { obrir: obrir, tancar: tancar, targeta: targeta };

  function iniciar() {
    boto(); textos();
    var al = window.hxApplyLang;
    if (typeof al === 'function' && !al._hxMoni) {
      var w = function () { var r = al.apply(this, arguments); textos(); var p = document.getElementById('hxMoni'); if (p && !p.hidden) pintar(); return r; };
      w._hxMoni = true; window.hxApplyLang = w;
    }
    var lo = window.logout;
    if (typeof lo === 'function' && !lo._hxMoni) {
      var w2 = function () { HIST = []; tancar(); return lo.apply(this, arguments); };
      w2._hxMoni = true; window.logout = w2;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
