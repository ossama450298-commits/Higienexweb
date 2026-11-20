/* ============================================================
   HIGIENEX — Entrar o registrarse con Google o Apple (login-social.js)
   Los botones aparecen en «Iniciar sesión» y en «Registrarse» solo si el
   servidor tiene configurado el proveedor (GET /api/auth-config).
   Google/Apple devuelven un token firmado; el servidor lo comprueba y
   abre la sesión (o crea la cuenta la primera vez).
   ============================================================ */
(function () {
  'use strict';
  var TX = {
    o: ['o', 'o', 'or', 'ou', 'oder', 'أو'],
    apple: ['Continua amb Apple', 'Continuar con Apple', 'Continue with Apple', 'Continuer avec Apple', 'Weiter mit Apple', 'المتابعة باستخدام Apple'],
    entrant: ['Entrant…', 'Entrando…', 'Signing in…', 'Connexion…', 'Anmeldung…', 'جارٍ الدخول…'],
    error: ["No s'ha pogut iniciar la sessió. Torna-ho a provar o entra amb el teu email.", 'No se ha podido iniciar sesión. Vuelve a intentarlo o entra con tu email.', "Sign-in failed. Try again or use your email.", 'La connexion a échoué. Réessayez ou utilisez votre e-mail.', 'Anmeldung fehlgeschlagen. Versuchen Sie es erneut oder nutzen Sie Ihre E-Mail.', 'تعذّر تسجيل الدخول. حاول مجددًا أو استخدم بريدك الإلكتروني.'],
    admin: ["Aquest compte ha d'entrar amb email i contrasenya.", 'Esta cuenta debe entrar con email y contraseña.', 'This account must sign in with email and password.', 'Ce compte doit se connecter avec e-mail et mot de passe.', 'Dieses Konto muss sich mit E-Mail und Passwort anmelden.', 'يجب أن يدخل هذا الحساب بالبريد وكلمة المرور.'],
  };
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var GLOC = { ca: 'ca', es: 'es', en: 'en', fr: 'fr', de: 'de', ar: 'ar' };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }

  var CONF = null, googleListo = false, appleListo = false;

  function cargarScript(src) {
    return new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
  }

  function aviso(caja, txt) {
    var e = caja.querySelector('.hxs-err'); if (!e) return;
    e.textContent = txt || ''; e.style.display = txt ? 'block' : 'none';
  }

  async function entrar(proveedor, idToken, nombre, caja) {
    aviso(caja, '');
    caja.classList.add('hxs-ocupat');
    try {
      var res = await hxApi('/login-social', { method: 'POST', body: { provider: proveedor, idToken: idToken, name: nombre || '', lang: lang() } });
      hxSetApiToken(res.token);
      window.HX_PROFILE = res.user;
      if (res.portal && typeof cpAplicarPortal === 'function') cpAplicarPortal(res.portal);
      if (typeof clearLoginError === 'function') clearLoginError();
      closeAuthModal();
      setLoggedInUser(res.user.name, '', res.user.role, res.user.email);
      showWelcome(res.user.name, false);
    } catch (e) {
      aviso(caja, e.status === 403 ? t('admin') : t('error'));
    } finally {
      caja.classList.remove('hxs-ocupat');
    }
  }

  function bloque(id, dalt) {
    var d = document.createElement('div');
    var o = '<div class="hxs-o"><span></span><em>' + t('o') + '</em><span></span></div>';
    d.className = 'hxs-bloc' + (dalt ? ' hxs-dalt' : ''); d.id = id;
    d.innerHTML = (dalt ? '' : o) +
      (CONF.google ? '<div class="hxs-google"></div>' : '') +
      (CONF.apple ? '<button type="button" class="hxs-apple"><svg viewBox="0 0 17 20" width="16" height="19" aria-hidden="true"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1 7.4c-1.9 3.3-.5 8.1 1.4 10.8.9 1.3 2 2.8 3.4 2.7 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.5.9c1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-3 1.5-3-.1-.1-2.9-1.1-3-4.7zM11.5 3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z"/></svg><span>' + t('apple') + '</span></button>' : '') +
      '<p class="hxs-err" role="alert" style="display:none"></p>' + (dalt ? o : '');
    return d;
  }

  function pintarGoogle(caja) {
    var g = caja.querySelector('.hxs-google');
    if (!g || !googleListo || !g.offsetParent) return; // es pinta quan la caixa és visible
    g.innerHTML = '';
    google.accounts.id.renderButton(g, {
      type: 'standard', theme: 'outline', size: 'large', shape: 'rectangular',
      text: caja.id === 'hxsRegistre' ? 'signup_with' : 'continue_with',
      logo_alignment: 'center', locale: GLOC[lang()], width: Math.min(400, Math.max(220, g.clientWidth || 320)),
    });
  }

  function montar() {
    if (!CONF || (!CONF.google && !CONF.apple)) return;
    var llocs = [
      ['hxsLogin', document.querySelector('#panelLogin a[onclick^="forgotPassword"]')],
      ['hxsRegistre', document.querySelector('#panelRegister > p')],
    ];
    llocs.forEach(function (l) {
      var vell = document.getElementById(l[0]); if (vell) vell.remove();
      if (!l[1]) return;
      var ancla = l[0] === 'hxsLogin' ? l[1].parentElement : l[1];
      var b = bloque(l[0], l[0] === 'hxsRegistre');
      ancla.parentNode.insertBefore(b, ancla.nextSibling);
      var ap = b.querySelector('.hxs-apple');
      if (ap) ap.addEventListener('click', function () { iniciarApple(b); });
      pintarGoogle(b);
    });
  }

  // El botón de Google responde a la caja donde se pulsó.
  var cajaGoogle = null;
  document.addEventListener('pointerdown', function (e) { var b = e.target.closest && e.target.closest('.hxs-bloc'); if (b) cajaGoogle = b; }, true);

  async function prepararGoogle() {
    await cargarScript('https://accounts.google.com/gsi/client');
    google.accounts.id.initialize({
      client_id: CONF.google,
      callback: function (r) { entrar('google', r.credential, '', cajaGoogle || document.getElementById('hxsLogin')); },
      ux_mode: 'popup', auto_select: false, cancel_on_tap_outside: true,
    });
    googleListo = true;
    document.querySelectorAll('.hxs-bloc').forEach(pintarGoogle);
  }

  async function prepararApple() {
    await cargarScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js');
    AppleID.auth.init({ clientId: CONF.apple, scope: 'name email', redirectURI: location.origin + location.pathname, usePopup: true });
    appleListo = true;
  }

  async function iniciarApple(caja) {
    aviso(caja, '');
    try {
      if (!appleListo) await prepararApple();
      var r = await AppleID.auth.signIn();
      var n = r.user && r.user.name ? [r.user.name.firstName, r.user.name.lastName].filter(Boolean).join(' ') : '';
      await entrar('apple', r.authorization.id_token, n, caja);
    } catch (e) {
      // Cerrar la ventana de Apple no es un error que haya que enseñar.
      if (!(e && /popup_closed|user_cancelled/i.test(e.error || ''))) aviso(caja, t('error'));
    }
  }

  async function iniciar() {
    try {
      CONF = await hxApi('/auth-config');
    } catch (e) { return; } // sin servidor no hay botones
    if (!CONF.google && !CONF.apple) return;
    montar();
    if (CONF.google) prepararGoogle().catch(function () { var g = document.querySelectorAll('.hxs-google'); g.forEach(function (x) { x.remove(); }); });
    // El botón de Google se pinta al abrir la ventana o cambiar de pestaña, con el ancho real.
    ['openAuthModal', 'switchTab'].forEach(function (f) {
      var o = window[f];
      if (typeof o !== 'function' || o._hxSocial) return;
      var w = function () { var r = o.apply(this, arguments); setTimeout(function () { document.querySelectorAll('.hxs-bloc').forEach(pintarGoogle); }, 60); return r; };
      w._hxSocial = true; window[f] = w;
    });
    // Al cambiar de idioma se vuelven a pintar los textos y el botón de Google.
    var apl = window.hxApplyLang;
    if (typeof apl === 'function' && !apl._hxSocial) {
      var w = function () { var r = apl.apply(this, arguments); montar(); return r; };
      w._hxSocial = true; window.hxApplyLang = w;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(iniciar, 300); });
  else setTimeout(iniciar, 300);
})();
