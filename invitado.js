/* ============================================================
   HIGIENEX — Comprar sin cuenta (invitado.js)
   Al pulsar «Tramitar pedido» sin sesión, el cliente elige entre entrar,
   crear una cuenta o seguir como invitado con su nombre y su correo.
   El pedido de invitado se guarda en el servidor con ese correo y la
   confirmación con el PDF le llega igual que a los clientes con cuenta.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ['Com vols continuar?', '¿Cómo quieres continuar?', 'How would you like to continue?', 'Comment souhaitez-vous continuer ?', 'Wie möchten Sie fortfahren?', 'كيف تريد المتابعة؟'],
    entrar: ['Iniciar sessió', 'Iniciar sesión', 'Log in', 'Se connecter', 'Anmelden', 'تسجيل الدخول'],
    crear: ['Crear un compte', 'Crear una cuenta', 'Create an account', 'Créer un compte', 'Konto erstellen', 'إنشاء حساب'],
    oInv: ['o compra com a convidat', 'o compra como invitado', 'or check out as a guest', 'ou commandez en invité', 'oder als Gast bestellen', 'أو اشترِ كضيف'],
    nom: ['Nom i cognoms', 'Nombre y apellidos', 'Full name', 'Nom et prénom', 'Vor- und Nachname', 'الاسم الكامل'],
    email: ['Correu electrònic', 'Correo electrónico', 'Email', 'E-mail', 'E-Mail', 'البريد الإلكتروني'],
    empresa: ['Empresa (opcional)', 'Empresa (opcional)', 'Company (optional)', 'Entreprise (facultatif)', 'Firma (optional)', 'الشركة (اختياري)'],
    seguir: ['Continuar com a convidat', 'Continuar como invitado', 'Continue as guest', 'Continuer en invité', 'Als Gast fortfahren', 'المتابعة كضيف'],
    nota: ["T'enviarem la confirmació i el justificant a aquest correu. Pots seguir la comanda amb el número i el correu.", 'Te enviaremos la confirmación y el justificante a este correo. Puedes seguir el pedido con el número y el correo.', "We'll email the confirmation and receipt to this address. You can track the order with its number and your email.", 'Nous enverrons la confirmation et le justificatif à cette adresse. Suivez la commande avec son numéro et votre e-mail.', 'Bestätigung und Beleg senden wir an diese Adresse. Sie können die Bestellung mit Nummer und E-Mail verfolgen.', 'سنرسل التأكيد والإيصال إلى هذا البريد. يمكنك تتبّع الطلب برقمه وبريدك.'],
    falta: ['Escriu el nom i un correu vàlid.', 'Escribe el nombre y un correo válido.', 'Enter your name and a valid email.', 'Saisissez votre nom et un e-mail valide.', 'Geben Sie Namen und eine gültige E-Mail ein.', 'اكتب الاسم وبريدًا صالحًا.'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var BTN = 'min-height:44px;padding:0 1rem;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.92rem;';
  var INP = 'width:100%;box-sizing:border-box;padding:0.7rem 0.8rem;border:1.5px solid #d5dde3;border-radius:10px;font-size:0.95rem;margin:0.3rem 0 0.7rem;';
  var guardat = null;
  try { guardat = JSON.parse(sessionStorage.getItem('hx_guest') || 'null'); } catch (e) { guardat = null; }

  function triar() {
    var g = guardat || {};
    var lbl = function (id, k) { return '<label for="' + id + '" style="font-weight:700;font-size:0.85rem">' + esc(t(k)) + '</label>'; };
    cpOpenModal(esc(t('titol')),
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap">' +
        '<button type="button" id="hxInvEntrar" style="' + BTN + 'flex:1;background:#0E2A3F;border:0;color:#fff">' + esc(t('entrar')) + '</button>' +
        '<button type="button" id="hxInvCrear" style="' + BTN + 'flex:1;background:#fff;border:1.5px solid #c9d3db;color:#0E2A3F">' + esc(t('crear')) + '</button>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:0.7rem;margin:1.2rem 0 0.8rem;color:#5a6b78;font-size:0.85rem"><span style="flex:1;height:1px;background:#e3e9ee"></span>' + esc(t('oInv')) + '<span style="flex:1;height:1px;background:#e3e9ee"></span></div>' +
      lbl('hxInvNom', 'nom') + '<input id="hxInvNom" autocomplete="name" value="' + esc(g.name || '') + '" style="' + INP + '">' +
      lbl('hxInvMail', 'email') + '<input id="hxInvMail" type="email" autocomplete="email" value="' + esc(g.email || '') + '" style="' + INP + '">' +
      lbl('hxInvEmp', 'empresa') + '<input id="hxInvEmp" autocomplete="organization" value="' + esc(g.company || '') + '" style="' + INP + '">' +
      '<p style="margin:0;font-size:0.82rem;color:#5a6b78;line-height:1.45">' + esc(t('nota')) + '</p>' +
      '<p id="hxInvErr" role="alert" style="margin:0.6rem 0 0;color:#B3261E;font-size:0.85rem;font-weight:600"></p>',
      '<button type="button" id="hxInvSeguir" style="' + BTN + 'background:#F2A900;border:0;color:#1A1A1A">' + esc(t('seguir')) + '</button>');
    document.getElementById('hxInvEntrar').onclick = function () { cpCloseModal(); _pendingCheckout = true; openAuthModal(); switchTab('login'); };
    document.getElementById('hxInvCrear').onclick = function () { cpCloseModal(); _pendingCheckout = true; openAuthModal(); switchTab('register'); };
    document.getElementById('hxInvSeguir').onclick = function () {
      var n = document.getElementById('hxInvNom').value.trim(), m = document.getElementById('hxInvMail').value.trim().toLowerCase();
      if (!n || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { document.getElementById('hxInvErr').textContent = t('falta'); return; }
      guardat = { name: n.slice(0, 80), email: m.slice(0, 200), company: document.getElementById('hxInvEmp').value.trim().slice(0, 120) };
      try { sessionStorage.setItem('hx_guest', JSON.stringify(guardat)); } catch (e) { console.warn(e); }
      window.HX_GUEST = guardat;
      cpCloseModal();
      if (typeof closeCartDrawer === 'function') closeCartDrawer();
      openPaymentModal();
    };
  }

  function iniciar() {
    var base = window.startCheckout;
    if (typeof base !== 'function' || base._hxInv) return;
    var w = function () {
      if (!Object.keys(cart || {}).length) return base.apply(this, arguments);
      if (window.HX_USER || (typeof CP_LOGGED_IN !== 'undefined' && CP_LOGGED_IN)) { window.HX_GUEST = null; return base.apply(this, arguments); }
      triar();
    };
    w._hxInv = true; window.startCheckout = w;
    // al entrar con una cuenta, ya no es invitado
    var s = window.setLoggedInUser;
    if (typeof s === 'function' && !s._hxInv) {
      var w2 = function () { window.HX_GUEST = null; return s.apply(this, arguments); };
      w2._hxInv = true; window.setLoggedInUser = w2;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
