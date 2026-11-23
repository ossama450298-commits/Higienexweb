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
        botons(d.actions);
      }).catch(function (e) {
        // sin IA: las respuestas de siempre
        console.warn('Mònica sin IA:', e.message);
        hxHideTyping();
        base.apply(null, [text]);
      });
    };
    nou._hxIA = true;
    window.hxRespond = nou;
    // la reserva ya no consulta el servidor antiguo (higienexchat), que tiene instrucciones desfasadas
    window.HX_WORKER_URL = '';
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
