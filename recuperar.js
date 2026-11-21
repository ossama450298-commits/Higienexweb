/* ============================================================
   HIGIENEX — Recuperar la contraseña (recuperar.js)
   «He olvidado la contraseña» pide un enlace por email; el enlace
   (?reset=…) abre una ventana para poner una contraseña nueva.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var TX = {
    titol: ['Recuperar la contrasenya', 'Recuperar la contraseña', 'Reset your password', 'Récupérer le mot de passe', 'Passwort zurücksetzen', 'استعادة كلمة المرور'],
    intro: ["Escriu el correu del teu compte i t'enviarem un enllaç per posar una contrasenya nova.", 'Escribe el correo de tu cuenta y te enviaremos un enlace para poner una contraseña nueva.', "Enter your account email and we'll send you a link to choose a new password.", 'Saisissez l’e-mail de votre compte : nous vous enverrons un lien pour choisir un nouveau mot de passe.', 'Geben Sie die E-Mail Ihres Kontos ein. Wir senden Ihnen einen Link für ein neues Passwort.', 'اكتب بريد حسابك وسنرسل لك رابطًا لاختيار كلمة مرور جديدة.'],
    email: ['Correu electrònic', 'Correo electrónico', 'Email', 'E-mail', 'E-Mail', 'البريد الإلكتروني'],
    enviar: ["Enviar-me l'enllaç", 'Enviarme el enlace', 'Send me the link', 'M’envoyer le lien', 'Link senden', 'أرسل لي الرابط'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    enviat: ["Si hi ha un compte amb aquest correu, t'hem enviat un enllaç (val 1 hora). Mira també el correu brossa.", 'Si hay una cuenta con ese correo, te hemos enviado un enlace (vale 1 hora). Mira también el correo no deseado.', 'If an account exists for that email, we have sent you a link (valid for 1 hour). Check your spam folder too.', 'Si un compte existe avec cet e-mail, nous vous avons envoyé un lien (valable 1 heure). Vérifiez aussi les indésirables.', 'Falls ein Konto mit dieser E-Mail existiert, haben wir Ihnen einen Link gesendet (1 Stunde gültig). Prüfen Sie auch den Spam-Ordner.', 'إذا كان هناك حساب بهذا البريد فقد أرسلنا لك رابطًا (صالح لساعة). تحقّق أيضًا من البريد غير المرغوب.'],
    emailMal: ['Escriu un correu vàlid.', 'Escribe un correo válido.', 'Enter a valid email.', 'Saisissez un e-mail valide.', 'Geben Sie eine gültige E-Mail ein.', 'اكتب بريدًا صالحًا.'],
    nova: ['Posa una contrasenya nova', 'Pon una contraseña nueva', 'Choose a new password', 'Choisissez un nouveau mot de passe', 'Neues Passwort festlegen', 'اختر كلمة مرور جديدة'],
    pass1: ['Contrasenya nova (mínim 6 caràcters)', 'Contraseña nueva (mínimo 6 caracteres)', 'New password (at least 6 characters)', 'Nouveau mot de passe (6 caractères minimum)', 'Neues Passwort (mindestens 6 Zeichen)', 'كلمة مرور جديدة (6 أحرف على الأقل)'],
    pass2: ['Repeteix la contrasenya', 'Repite la contraseña', 'Repeat the password', 'Répétez le mot de passe', 'Passwort wiederholen', 'أعد كتابة كلمة المرور'],
    desar: ['Desar i entrar', 'Guardar y entrar', 'Save and sign in', 'Enregistrer et se connecter', 'Speichern und anmelden', 'حفظ والدخول'],
    curta: ['La contrasenya ha de tenir mínim 6 caràcters.', 'La contraseña debe tener mínimo 6 caracteres.', 'The password must have at least 6 characters.', 'Le mot de passe doit contenir au moins 6 caractères.', 'Das Passwort muss mindestens 6 Zeichen haben.', 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'],
    diferents: ['Les dues contrasenyes no coincideixen.', 'Las dos contraseñas no coinciden.', 'The two passwords do not match.', 'Les deux mots de passe ne correspondent pas.', 'Die Passwörter stimmen nicht überein.', 'كلمتا المرور غير متطابقتين.'],
    caducat: ["L'enllaç ha caducat o ja s'ha fet servir. Demana'n un de nou des de «He oblidat la contrasenya».", 'El enlace ha caducado o ya se ha usado. Pide uno nuevo desde «He olvidado la contraseña».', 'The link has expired or was already used. Ask for a new one from «Forgot password».', 'Le lien a expiré ou a déjà été utilisé. Demandez-en un nouveau.', 'Der Link ist abgelaufen oder wurde bereits verwendet. Fordern Sie einen neuen an.', 'انتهت صلاحية الرابط أو استُخدم من قبل. اطلب رابطًا جديدًا.'],
    error: ["No s'ha pogut connectar. Torna-ho a provar.", 'No se ha podido conectar. Vuelve a intentarlo.', "Couldn't connect. Please try again.", 'Connexion impossible. Réessayez.', 'Keine Verbindung. Bitte erneut versuchen.', 'تعذّر الاتصال. حاول مجددًا.'],
    fet: ['Contrasenya canviada. Ja has entrat al teu compte.', 'Contraseña cambiada. Ya has entrado en tu cuenta.', 'Password changed. You are now signed in.', 'Mot de passe modifié. Vous êtes connecté.', 'Passwort geändert. Sie sind angemeldet.', 'تم تغيير كلمة المرور وتسجيل دخولك.'],
  };
  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) { return TX[k][LANGS.indexOf(lang())]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var BTN = 'min-height:44px;padding:0 1.1rem;border-radius:10px;font-weight:700;cursor:pointer;';
  var INP = 'width:100%;box-sizing:border-box;padding:0.7rem 0.8rem;border:1.5px solid #d5dde3;border-radius:10px;font-size:0.95rem;margin-top:0.3rem;';
  function msg(id, txt, ok) { var e = document.getElementById(id); if (e) { e.textContent = txt; e.style.color = ok ? '#0B7256' : '#B3261E'; } }

  /* 1. Pedir el enlace */
  window.forgotPassword = function () {
    var pre = ((document.getElementById('loginEmail') || {}).value || '').trim();
    if (typeof closeAuthModal === 'function') closeAuthModal();
    cpOpenModal(esc(t('titol')),
      '<p style="margin:0 0 1rem;color:#4a5a67;line-height:1.5">' + esc(t('intro')) + '</p>' +
      '<label for="hxRecMail" style="font-weight:700;font-size:0.85rem">' + esc(t('email')) + '</label>' +
      '<input id="hxRecMail" type="email" autocomplete="email" value="' + esc(/@/.test(pre) ? pre : '') + '" style="' + INP + '">' +
      '<p id="hxRecMsg" role="status" style="margin:0.8rem 0 0;font-size:0.88rem;font-weight:600;line-height:1.45"></p>',
      '<button type="button" onclick="cpCloseModal()" style="' + BTN + 'background:#fff;border:1.5px solid #c9d3db;color:#0E2A3F">' + esc(t('tancar')) + '</button>' +
      '<button type="button" id="hxRecBtn" style="' + BTN + 'background:#0E2A3F;border:0;color:#fff">' + esc(t('enviar')) + '</button>');
    var inp = document.getElementById('hxRecMail'), btn = document.getElementById('hxRecBtn');
    function enviar() {
      var e = inp.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { msg('hxRecMsg', t('emailMal')); inp.focus(); return; }
      btn.disabled = true;
      hxApi('/password-reset/request', { method: 'POST', body: { email: e, lang: lang() } })
        .then(function () { msg('hxRecMsg', t('enviat'), true); btn.style.display = 'none'; })
        .catch(function () { msg('hxRecMsg', t('error')); btn.disabled = false; });
    }
    btn.onclick = enviar;
    inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') enviar(); });
    setTimeout(function () { inp.focus(); }, 50);
  };

  /* 2. Enlace del email: poner la contraseña nueva */
  function nova(token) {
    cpOpenModal(esc(t('nova')),
      '<label for="hxRecP1" style="font-weight:700;font-size:0.85rem">' + esc(t('pass1')) + '</label>' +
      '<input id="hxRecP1" type="password" autocomplete="new-password" style="' + INP + 'margin-bottom:0.8rem">' +
      '<label for="hxRecP2" style="font-weight:700;font-size:0.85rem">' + esc(t('pass2')) + '</label>' +
      '<input id="hxRecP2" type="password" autocomplete="new-password" style="' + INP + '">' +
      '<p id="hxRecMsg2" role="alert" style="margin:0.8rem 0 0;font-size:0.88rem;font-weight:600;line-height:1.45"></p>',
      '<button type="button" id="hxRecBtn2" style="' + BTN + 'background:#0E2A3F;border:0;color:#fff">' + esc(t('desar')) + '</button>');
    var btn = document.getElementById('hxRecBtn2');
    function desar() {
      var a = document.getElementById('hxRecP1').value, b = document.getElementById('hxRecP2').value;
      if (a.length < 6) { msg('hxRecMsg2', t('curta')); return; }
      if (a !== b) { msg('hxRecMsg2', t('diferents')); return; }
      btn.disabled = true;
      hxApi('/password-reset/confirm', { method: 'POST', body: { token: token, password: a } })
        .then(function (res) {
          hxSetApiToken(res.token);
          window.HX_PROFILE = res.user;
          setLoggedInUser(res.user.name, '', res.user.role, res.user.email);
          cpCloseModal();
          showToast(t('fet'), '🔐');
        })
        .catch(function (e) { msg('hxRecMsg2', e.status === 410 || e.status === 400 ? t('caducat') : t('error')); btn.disabled = false; });
    }
    btn.onclick = desar;
    document.getElementById('hxRecP2').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') desar(); });
    setTimeout(function () { document.getElementById('hxRecP1').focus(); }, 50);
  }

  function iniciar() {
    var token = '';
    try { token = new URLSearchParams(location.search).get('reset') || ''; } catch (e) { return; }
    if (!/^[0-9a-f]{64}$/.test(token)) return;
    // el enlace no se queda en la barra de direcciones ni en el historial
    try { var u = new URL(location.href); u.searchParams.delete('reset'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) { console.warn(e); }
    setTimeout(function () { nova(token); }, 600);
  }
  if (document.readyState === 'complete') iniciar(); else window.addEventListener('load', iniciar);
})();
