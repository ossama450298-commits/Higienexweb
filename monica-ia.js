/* ============================================================
   HIGIENEX — Mònica con IA (monica-ia.js)
   Cada pregunta va primero a la IA (/api/chat, Gemini en el servidor).
   Si la IA no responde (sin conexión, cupo gratuito agotado…), Mònica usa
   sus respuestas de siempre (hxRespond original), sin que el cliente vea un error.
   La IA puede proponer botones (ir a una sección, añadir al carrito, abrir el
   presupuesto); nada se hace hasta que el cliente pulsa el botón.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    aviso: ['La Mònica fa servir IA de Google. No hi escriguis dades personals.', 'Mònica usa IA de Google. No escribas datos personales.', 'Mònica uses Google AI. Please don’t share personal data.', 'Mònica utilise l’IA de Google. N’écrivez pas de données personnelles.', 'Mònica nutzt KI von Google. Bitte keine persönlichen Daten eingeben.', 'تستخدم مونيكا ذكاء Google الاصطناعي. لا تكتب بيانات شخصية.'],
    afegit: ['Afegit al cistell.', 'Añadido al carrito.', 'Added to the cart.', 'Ajouté au panier.', 'In den Warenkorb gelegt.', 'أُضيف إلى السلة.'],
    proposta: ['Comanda proposada', 'Pedido propuesto', 'Suggested order', 'Commande proposée', 'Vorgeschlagene Bestellung', 'الطلب المقترح'],
    pressu: ['Pressupost proposat', 'Presupuesto propuesto', 'Suggested quote', 'Devis proposé', 'Vorgeschlagenes Angebot', 'عرض السعر المقترح'],
    totalSense: ['Total aprox. (sense IVA)', 'Total aprox. (sin IVA)', 'Approx. total (excl. VAT)', 'Total approx. (HT)', 'Summe ca. (ohne MwSt.)', 'المجموع التقريبي (بدون ضريبة)'],
    garrafes: ['garrafes', 'garrafas', 'jerrycans', 'bidons', 'Kanister', 'عبوات'],
    afegir: ['Afegir al cistell', 'Añadir al carrito', 'Add to cart', 'Ajouter au panier', 'In den Warenkorb', 'أضف إلى السلة'],
    preparo: ['Et preparo aquesta comanda. Revisa-la i, si està bé, afegeix-la al cistell:', 'Te preparo este pedido. Revísalo y, si está bien, añádelo al carrito:', 'Here is your order. Check it and, if it looks right, add it to the cart:', 'Voici votre commande. Vérifiez-la et ajoutez-la au panier si elle vous convient :', 'Hier ist Ihre Bestellung. Prüfen Sie sie und legen Sie sie in den Warenkorb:', 'جهّزت لك هذا الطلب. راجعه وأضفه إلى السلة إن كان صحيحًا:'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Las respuestas de la IA traen **negrita**: se muestra como negrita, el resto como texto */
  var renderBase = window.hxRenderMessageDOM;
  function render(text, who) {
    if (who !== 'bot' || !/\*\*[^*]+\*\*/.test(text)) return renderBase(text, who);
    var body = document.getElementById('hxChatBody');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'hxMsg ' + who;
    div.innerHTML = esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function preu(nom) {
    var p = (window.PRODUCTS || []).filter(function (x) { return x.name === nom; })[0];
    return p ? p.price : 0;
  }

  function executar(a) {
    if (a.tipo === 'ir_a') { if (typeof navTo === 'function') navTo(a.seccion); return; }
    if (a.tipo === 'carrito') {
      a.productos.forEach(function (p) {
        if (!preu(p.nombre)) return;
        if (cart[p.nombre]) cart[p.nombre].qty += p.garrafas; else cart[p.nombre] = { qty: p.garrafas, price: preu(p.nombre) };
        recalcCartLine(p.nombre);
      });
      renderCart();
      if (typeof showToast === 'function') showToast(t('afegit'), '🛒');
      if (typeof openCartDrawer === 'function') openCartDrawer();
      return;
    }
    if (a.tipo === 'presupuesto') {
      a.productos.forEach(function (p) { if (preu(p.nombre)) PRESSUPOST_QTY[p.nombre] = p.garrafas; });
      if (typeof navTo === 'function') navTo('pressupost');
      setTimeout(function () { if (typeof renderPressupost === 'function') renderPressupost(); }, 300);
    }
  }

  function botons(accions) {
    var body = document.getElementById('hxChatBody');
    if (!body || !accions || !accions.length) return;
    accions.forEach(function (a) {
      if ((a.tipo === 'carrito' || a.tipo === 'presupuesto') && a.productos && a.productos.length) { targeta(a, body); return; }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hxQuickBtn';
      b.style.alignSelf = 'flex-start';
      b.textContent = (a.tipo === 'carrito' ? '🛒 ' : a.tipo === 'presupuesto' ? '📋 ' : '→ ') + a.texto;
      b.onclick = function () { executar(a); };
      body.appendChild(b);
    });
    body.scrollTop = body.scrollHeight;
  }

  /* Tarjeta con el pedido o presupuesto propuesto: líneas, total aproximado y botón */
  function eur(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €'; }
  function targeta(a, body) {
    var total = 0;
    var linies = a.productos.map(function (p) {
      var imp = preu(p.nombre) * p.garrafas; total += imp;
      return '<li><span><b>' + p.garrafas + '</b> × ' + esc(p.nombre) + '</span><span>' + eur(imp) + '</span></li>';
    }).join('');
    var d = document.createElement('div');
    d.className = 'hxPedido';
    d.innerHTML = '<div class="hxPedido-t">' + (a.tipo === 'carrito' ? '🛒 ' + esc(t('proposta')) : '📋 ' + esc(t('pressu'))) + '</div>' +
      '<ul>' + linies + '</ul><div class="hxPedido-tot"><span>' + esc(t('totalSense')) + '</span><b>' + eur(total) + '</b></div>';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'hxPedido-btn';
    b.textContent = a.tipo === 'carrito' ? (a.texto || t('afegir')) : a.texto;
    b.onclick = function () { executar(a); b.disabled = true; b.textContent = '✓ ' + (a.tipo === 'carrito' ? t('afegit') : a.texto); };
    d.appendChild(b);
    body.appendChild(d);
  }

  /* Sin IA: «quiero 4 garrafas de ECO y 2 de HOSP» → pedido propuesto con los productos del catálogo */
  function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  var PARAULES = /(vull|voldria|quiero|querria|necesito|necessito|demana|pide|pedir|comprar|compra|afegeix|añade|anade|add|order|want|buy|commande|bestell)/;
  function pedidoLocal(text) {
    var tx = normal(text);
    if (!PARAULES.test(tx) || !/\d/.test(tx)) return null;
    var productos = [];
    (window.PRODUCTS || []).filter(function (p) { return p.active; }).forEach(function (p) {
      var paraules = normal(p.name).split(/\s+/);
      var claus = [paraules.slice(0, 2).join(' '), paraules[0], paraules[1]].filter(function (k) { return k && k.length >= 3; });
      var pos = -1;
      for (var i = 0; i < claus.length && pos < 0; i++) pos = tx.indexOf(claus[i]);
      if (pos < 0) return;
      var abans = tx.slice(Math.max(0, pos - 30), pos).match(/(\d{1,3})\D{0,22}$/);
      var despres = tx.slice(pos, pos + 40).match(/^\D{0,30}?(\d{1,3})\s*(garraf|unit|unid|u\b|x\b)/);
      var n = abans ? +abans[1] : despres ? +despres[1] : 0;
      if (n > 0) productos.push({ nombre: p.name, garrafas: Math.min(500, n) });
    });
    return productos.length ? { tipo: 'carrito', productos: productos, texto: t('afegir') } : null;
  }
  window.hxPedidoLocal = pedidoLocal;

  function preguntarIA(text, l) {
    var hist = (window.HX_CHAT_HISTORY || []).slice(-13, -1).map(function (m) { return { role: m.who === 'user' ? 'user' : 'assistant', content: m.text }; });
    var u = window.HX_USER && window.HX_PROFILE ? window.HX_PROFILE : null;
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var limit = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    return fetch(HX_API_BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: hist, lang: l, perfil: u ? { empresa: u.company || '', sector: u.sector || '' } : null }),
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (r) {
      clearTimeout(limit);
      return r.json().then(function (d) { if (!r.ok || !d.reply) throw new Error(d.error || ('Error ' + r.status)); return d; });
    });
  }

  function iniciar() {
    var base = window.hxRespond;
    if (typeof base !== 'function' || base._hxIA) return;
    window.hxRenderMessageDOM = render;
    var nou = function (text) {
      var l = (typeof hxDetectLang === 'function' && hxDetectLang(text)) || lang();
      window.HX_LAST_LANG = l;
      hxShowTyping();
      preguntarIA(text, l).then(function (d) {
        hxHideTyping();
        if (typeof hxStat === 'function') hxStat({ k: 'c', s: 'ia', l: l });
        hxAddMessage(d.reply, 'bot');
        var acc = d.actions || [];
        // si la IA no ha propuesto el pedido pero el cliente lo pide claro, se prepara aquí
        if (!acc.some(function (x) { return x.tipo === 'carrito'; })) { var loc = pedidoLocal(text); if (loc) acc = acc.concat([loc]); }
        botons(acc);
      }).catch(function (e) {
        // sin IA: las respuestas de siempre
        console.warn('Mònica sin IA:', e.message);
        hxHideTyping();
        var local = pedidoLocal(text);
        if (local) { hxAddMessage(t('preparo'), 'bot'); botons([local]); return; }
        base.apply(null, [text]);
      });
    };
    nou._hxIA = true;
    window.hxRespond = nou;
    // aviso de privacidad bajo el campo de escribir
    var form = document.getElementById('hxChatForm');
    if (form && !document.getElementById('hxIaAvis')) {
      var p = document.createElement('p');
      p.id = 'hxIaAvis';
      p.className = 'hx-ia-avis';
      p.textContent = t('aviso');
      form.parentNode.insertBefore(p, form.nextSibling);
    }
    var a = window.hxApplyLang;
    if (typeof a === 'function' && !a._hxIA) {
      var w = function () { var r = a.apply(this, arguments); var e = document.getElementById('hxIaAvis'); if (e) e.textContent = t('aviso'); return r; };
      w._hxIA = true; window.hxApplyLang = w;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
