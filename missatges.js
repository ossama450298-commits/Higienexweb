/* ============================================================
   HIGIENEX — Avisos en l'idioma de la web (missatges.js)
   ------------------------------------------------------------
   Molts avisos (showToast i alert) estaven escrits en català dins
   del codi i sortien així en qualsevol idioma. Aquí es tradueixen
   en el moment de mostrar-los: primer pel text exacte i, si el
   missatge porta dades (un nom, una quantitat…), per patró.
   També: carret més clar (sense «Client/Sortir» si no hi ha sessió,
   avís de compte abans de pagar), quantitat inicial 1 i «Seguir la
   meva comanda» al menú i al panell de contacte.
   Cada entrada: [es, en, fr, de, ar]
   ============================================================ */
(function () {
  'use strict';
  var IDX = { es: 0, en: 1, fr: 2, de: 3, ar: 4 };
  function lang() {
    try { return localStorage.getItem('hx_lang') || 'ca'; } catch (e) { return 'ca'; }
  }

  /* ---------- Textos exactes ---------- */
  var EXACTE = {
    'Afegeix almenys un producte al cistell abans de pagar.': ['Añade al menos un producto al carrito antes de pagar.', 'Add at least one product to your cart before paying.', 'Ajoutez au moins un produit au panier avant de payer.', 'Legen Sie vor dem Bezahlen mindestens ein Produkt in den Warenkorb.', 'أضف منتجًا واحدًا على الأقل إلى السلة قبل الدفع.'],
    'Afegeix almenys un producte al cistell abans de tramitar la comanda.': ['Añade al menos un producto al carrito antes de tramitar el pedido.', 'Add at least one product to your cart before checking out.', 'Ajoutez au moins un produit au panier avant de valider la commande.', 'Legen Sie mindestens ein Produkt in den Warenkorb, bevor Sie bestellen.', 'أضف منتجًا واحدًا على الأقل إلى السلة قبل إتمام الطلب.'],
    'Afegeix almenys un producte.': ['Añade al menos un producto.', 'Add at least one product.', 'Ajoutez au moins un produit.', 'Fügen Sie mindestens ein Produkt hinzu.', 'أضف منتجًا واحدًا على الأقل.'],
    'Aquest email ja està registrat. Inicia sessió.': ['Este email ya está registrado. Inicia sesión.', 'This email is already registered. Please log in.', 'Cet e-mail est déjà enregistré. Connectez-vous.', 'Diese E-Mail ist bereits registriert. Bitte melden Sie sich an.', 'هذا البريد مسجّل بالفعل. سجّل الدخول.'],
    'El fitxer supera els 5 MB. Si us plau, adjunta un CV més lleuger.': ['El archivo supera los 5 MB. Adjunta un CV más ligero.', 'The file is over 5 MB. Please attach a smaller CV.', 'Le fichier dépasse 5 Mo. Joignez un CV plus léger.', 'Die Datei ist größer als 5 MB. Bitte hängen Sie einen kleineren Lebenslauf an.', 'يتجاوز الملف 5 ميغابايت. يُرجى إرفاق سيرة ذاتية أصغر.'],
    'El navegador ha bloquejat la finestra emergent. Permet les finestres emergents per descarregar el document.': ['El navegador ha bloqueado la ventana emergente. Permite las ventanas emergentes para descargar el documento.', 'Your browser blocked the pop-up. Allow pop-ups to download the document.', 'Le navigateur a bloqué la fenêtre. Autorisez les fenêtres pop-up pour télécharger le document.', 'Der Browser hat das Pop-up blockiert. Erlauben Sie Pop-ups, um das Dokument herunterzuladen.', 'منع المتصفح النافذة المنبثقة. اسمح بالنوافذ المنبثقة لتنزيل المستند.'],
    'Format no admès. Adjunta el CV en PDF o Word (.doc/.docx).': ['Formato no admitido. Adjunta el CV en PDF o Word (.doc/.docx).', 'Format not supported. Attach your CV as PDF or Word (.doc/.docx).', 'Format non accepté. Joignez votre CV en PDF ou Word (.doc/.docx).', 'Format nicht unterstützt. Bitte Lebenslauf als PDF oder Word (.doc/.docx) anhängen.', 'الصيغة غير مدعومة. أرفق السيرة الذاتية بصيغة PDF أو Word (.doc/.docx).'],
    'La contrasenya ha de tenir minim 6 caracters.': ['La contraseña debe tener al menos 6 caracteres.', 'The password must be at least 6 characters long.', 'Le mot de passe doit contenir au moins 6 caractères.', 'Das Passwort muss mindestens 6 Zeichen lang sein.', 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'],
    'Omple tots els camps obligatoris.': ['Rellena todos los campos obligatorios.', 'Please fill in all required fields.', 'Remplissez tous les champs obligatoires.', 'Bitte füllen Sie alle Pflichtfelder aus.', 'يُرجى تعبئة جميع الحقول الإلزامية.'],
    'Omple tots els camps.': ['Rellena todos los campos.', 'Please fill in all fields.', 'Remplissez tous les champs.', 'Bitte füllen Sie alle Felder aus.', 'يُرجى تعبئة جميع الحقول.'],
    'Selecciona una quantitat primer.': ['Elige una cantidad primero.', 'Choose a quantity first.', "Choisissez d'abord une quantité.", 'Wählen Sie zuerst eine Menge.', 'اختر الكمية أولًا.'],
    "Adjunta el teu CV abans d'enviar la candidatura.": ['Adjunta tu CV antes de enviar la candidatura.', 'Attach your CV before sending your application.', 'Joignez votre CV avant d’envoyer votre candidature.', 'Hängen Sie Ihren Lebenslauf an, bevor Sie die Bewerbung senden.', 'أرفق سيرتك الذاتية قبل إرسال الطلب.'],
    'Afegeix almenys un producte per generar el pressupost.': ['Añade al menos un producto para generar el presupuesto.', 'Add at least one product to build the quote.', 'Ajoutez au moins un produit pour générer le devis.', 'Fügen Sie mindestens ein Produkt hinzu, um das Angebot zu erstellen.', 'أضف منتجًا واحدًا على الأقل لإعداد عرض السعر.'],
    "El teu accés és només de lectura: no pots fer comandes. Demana-ho a un administrador de l'equip.": ['Tu acceso es solo de lectura: no puedes hacer pedidos. Pídeselo a un administrador del equipo.', 'Your access is read-only: you cannot place orders. Ask a team administrator.', 'Votre accès est en lecture seule : vous ne pouvez pas commander. Demandez à un administrateur de l’équipe.', 'Ihr Zugang ist schreibgeschützt: Sie können nicht bestellen. Wenden Sie sich an einen Administrator.', 'صلاحيتك للقراءة فقط: لا يمكنك تقديم الطلبات. اطلب ذلك من مسؤول الفريق.'],
    "Encara es carrega el mòdul d'Excel, torna-ho a provar en un segon.": ['Todavía se está cargando el módulo de Excel, vuelve a intentarlo en un segundo.', 'The Excel module is still loading. Try again in a second.', 'Le module Excel est encore en cours de chargement, réessayez dans une seconde.', 'Das Excel-Modul lädt noch. Versuchen Sie es gleich noch einmal.', 'ما زالت وحدة Excel قيد التحميل، حاول مجددًا بعد ثانية.'],
    "Escriu un breu comentari abans d'enviar.": ['Escribe un breve comentario antes de enviar.', 'Write a short comment before sending.', 'Écrivez un court commentaire avant d’envoyer.', 'Schreiben Sie vor dem Senden einen kurzen Kommentar.', 'اكتب تعليقًا قصيرًا قبل الإرسال.'],
    'Falta el nom o el correu.': ['Falta el nombre o el correo.', 'Name or email is missing.', 'Il manque le nom ou l’e-mail.', 'Name oder E-Mail fehlt.', 'الاسم أو البريد الإلكتروني ناقص.'],
    'Gràcies per la teva valoració!': ['¡Gracias por tu valoración!', 'Thank you for your review!', 'Merci pour votre avis !', 'Danke für Ihre Bewertung!', 'شكرًا على تقييمك!'],
    'Inicia sessió per finalitzar la teva comanda': ['Inicia sesión para finalizar tu pedido', 'Log in to complete your order', 'Connectez-vous pour finaliser votre commande', 'Melden Sie sich an, um Ihre Bestellung abzuschließen', 'سجّل الدخول لإتمام طلبك'],
    'Introdueix un email vàlid per rebre el pressupost.': ['Introduce un email válido para recibir el presupuesto.', 'Enter a valid email to receive the quote.', 'Saisissez un e-mail valide pour recevoir le devis.', 'Geben Sie eine gültige E-Mail ein, um das Angebot zu erhalten.', 'أدخل بريدًا إلكترونيًا صالحًا لاستلام عرض السعر.'],
    'La sessió ha caducat. Torna a iniciar sessió.': ['La sesión ha caducado. Vuelve a iniciar sesión.', 'Your session has expired. Please log in again.', 'La session a expiré. Reconnectez-vous.', 'Die Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'انتهت الجلسة. سجّل الدخول مجددًا.'],
    "No s'ha pogut carregar el generador de PDF.": ['No se ha podido cargar el generador de PDF.', 'The PDF generator could not be loaded.', 'Le générateur de PDF n’a pas pu être chargé.', 'Der PDF-Generator konnte nicht geladen werden.', 'تعذّر تحميل مولّد ملفات PDF.'],
    'No se ha podido cargar el generador de PDF.': ['No se ha podido cargar el generador de PDF.', 'The PDF generator could not be loaded.', 'Le générateur de PDF n’a pas pu être chargé.', 'Der PDF-Generator konnte nicht geladen werden.', 'تعذّر تحميل مولّد ملفات PDF.'],
    "No s'ha pogut enviar l'email. Torna-ho a provar més tard.": ['No se ha podido enviar el email. Vuelve a intentarlo más tarde.', 'The email could not be sent. Please try again later.', 'L’e-mail n’a pas pu être envoyé. Réessayez plus tard.', 'Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.', 'تعذّر إرسال البريد الإلكتروني. حاول مجددًا لاحقًا.'],
    "No s'ha pogut generar l'Excel.": ['No se ha podido generar el Excel.', 'The Excel file could not be created.', 'Le fichier Excel n’a pas pu être généré.', 'Die Excel-Datei konnte nicht erstellt werden.', 'تعذّر إنشاء ملف Excel.'],
    "No s'ha pogut generar la plantilla.": ['No se ha podido generar la plantilla.', 'The template could not be created.', 'Le modèle n’a pas pu être généré.', 'Die Vorlage konnte nicht erstellt werden.', 'تعذّر إنشاء النموذج.'],
    'Només un administrador pot convidar membres.': ['Solo un administrador puede invitar miembros.', 'Only an administrator can invite members.', 'Seul un administrateur peut inviter des membres.', 'Nur ein Administrator kann Mitglieder einladen.', 'يمكن للمسؤول فقط دعوة الأعضاء.'],
    'Només un administrador pot eliminar membres.': ['Solo un administrador puede eliminar miembros.', 'Only an administrator can remove members.', 'Seul un administrateur peut supprimer des membres.', 'Nur ein Administrator kann Mitglieder entfernen.', 'يمكن للمسؤول فقط حذف الأعضاء.'],
    "Membre eliminat de l'equip.": ['Miembro eliminado del equipo.', 'Member removed from the team.', 'Membre retiré de l’équipe.', 'Mitglied aus dem Team entfernt.', 'تم حذف العضو من الفريق.'],
    'Obrint el teu correu per demanar la recuperació…': ['Abriendo tu correo para pedir la recuperación…', 'Opening your email app to request a reset…', 'Ouverture de votre messagerie pour demander la récupération…', 'Ihr E-Mail-Programm wird geöffnet, um die Wiederherstellung anzufordern…', 'جارٍ فتح بريدك لطلب الاستعادة…'],
    'Preferències de cookies guardades.': ['Preferencias de cookies guardadas.', 'Cookie preferences saved.', 'Préférences de cookies enregistrées.', 'Cookie-Einstellungen gespeichert.', 'تم حفظ تفضيلات ملفات تعريف الارتباط.'],
    'Segueixes amb la sessió de client oberta.': ['Sigues con la sesión de cliente abierta.', 'You are still logged in as a customer.', 'Votre session client est toujours ouverte.', 'Sie sind weiterhin als Kunde angemeldet.', 'ما زلت مسجّل الدخول كعميل.'],
  };
  /* ---------- Missatges amb dades: patró en català i plantilla per idioma ---------- */
  var PATRONS = [
    [/^⚠️ (.+): estoc baix \(últimes unitats\)\. Aquesta quantitat pot trigar més del normal a servir-se\.$/, ['⚠️ {1}: stock bajo (últimas unidades). Esta cantidad puede tardar más de lo normal.', '⚠️ {1}: low stock (last units). This quantity may take longer than usual.', '⚠️ {1} : stock faible (dernières unités). Cette quantité peut prendre plus de temps.', '⚠️ {1}: geringer Bestand (letzte Einheiten). Diese Menge kann länger dauern.', '⚠️ {1}: مخزون منخفض (آخر الوحدات). قد تستغرق هذه الكمية وقتًا أطول من المعتاد.']],
    [/^(.+) afegit! \((\d+) u\.\)(.*)$/, ['{1} añadido ({2} u.){3}', '{1} added ({2} u.){3}', '{1} ajouté ({2} u.){3}', '{1} hinzugefügt ({2} Stk.){3}', 'تمت إضافة {1} ({2} وحدة){3}']],
    [/^(.+) afegit al cistell!$/, ['{1} añadido al carrito', '{1} added to your cart', '{1} ajouté au panier', '{1} in den Warenkorb gelegt', 'تمت إضافة {1} إلى السلة']],
    [/^(\d+) productes afegits al cistell\.$/, ['{1} productos añadidos al carrito.', '{1} products added to your cart.', '{1} produits ajoutés au panier.', '{1} Produkte in den Warenkorb gelegt.', 'تمت إضافة {1} منتجات إلى السلة.']],
    [/^Benvingut\/da, (.+)!$/, ['¡Bienvenido/a, {1}!', 'Welcome, {1}!', 'Bienvenue, {1} !', 'Willkommen, {1}!', 'أهلًا بك يا {1}!']],
    [/^Pressupost enviat a (.+) ✅$/, ['Presupuesto enviado a {1} ✅', 'Quote sent to {1} ✅', 'Devis envoyé à {1} ✅', 'Angebot an {1} gesendet ✅', 'تم إرسال عرض السعر إلى {1} ✅']],
    [/^Sessió iniciada com a (.+)\.$/, ['Sesión iniciada como {1}.', 'Logged in as {1}.', 'Connecté en tant que {1}.', 'Angemeldet als {1}.', 'تم تسجيل الدخول باسم {1}.']],
    [/^Missatge enviat: "(.*)"$/, ['Mensaje enviado: "{1}"', 'Message sent: "{1}"', 'Message envoyé : « {1} »', 'Nachricht gesendet: „{1}“', 'تم إرسال الرسالة: "{1}"']],
  ];
  function traduir(msg) {
    var i = IDX[lang()];
    if (i == null || typeof msg !== 'string') return msg;
    if (EXACTE[msg]) return EXACTE[msg][i];
    for (var k = 0; k < PATRONS.length; k++) {
      var m = PATRONS[k][0].exec(msg);
      if (m) return PATRONS[k][1][i].replace(/\{(\d)\}/g, function (x, n) { return m[+n] || ''; });
    }
    return msg;
  }

  /* ---------- Textos nous ---------- */
  var D = {
    avisT: ['Per pagar necessites un compte', 'Para pagar necesitas una cuenta', 'You need an account to pay', 'Un compte est nécessaire pour payer', 'Zum Bezahlen brauchen Sie ein Konto', 'تحتاج إلى حساب للدفع'],
    avisP: ['Es crea en un minut i et permet seguir les comandes, repetir-les i rebre les factures.', 'Se crea en un minuto y te permite seguir los pedidos, repetirlos y recibir las facturas.', 'It takes a minute and lets you track orders, repeat them and receive your invoices.', 'Il se crée en une minute et permet de suivre vos commandes, de les répéter et de recevoir vos factures.', 'Es ist in einer Minute erstellt und Sie können Bestellungen verfolgen, wiederholen und Rechnungen erhalten.', 'يُنشأ في دقيقة ويتيح لك تتبّع الطلبات وتكرارها واستلام الفواتير.'],
    entrar: ['Iniciar sessió', 'Iniciar sesión', 'Log in', 'Se connecter', 'Anmelden', 'تسجيل الدخول'],
    crear: ['Crear un compte', 'Crear una cuenta', 'Create an account', 'Créer un compte', 'Konto erstellen', 'إنشاء حساب'],
    seguir: ['Seguir la meva comanda', 'Seguir mi pedido', 'Track my order', 'Suivre ma commande', 'Meine Bestellung verfolgen', 'تتبّع طلبي'],
    seguirD: ['Amb el número de comanda i el teu email', 'Con el número de pedido y tu email', 'With your order number and email', 'Avec le numéro de commande et votre e-mail', 'Mit Bestellnummer und E-Mail', 'برقم الطلب وبريدك الإلكتروني'],
  };
  function t(k) { var e = D[k], l = lang(); var i = { ca: 0, es: 1, en: 2, fr: 3, de: 4, ar: 5 }[l]; return e ? e[i == null ? 0 : i] : k; }

  /* ---------- Carret ---------- */
  function actualitzarCarret() {
    var sessio = !!(window.HX_USER && window.HX_USER.email);
    var xip = document.getElementById('userName'), sortir = document.querySelector('#pedidosSection button[onclick="logout()"]');
    if (xip && xip.parentElement) xip.parentElement.style.display = sessio ? '' : 'none';
    if (sortir) sortir.style.display = sessio ? '' : 'none';
    var boto = document.getElementById('sendOrder');
    if (!boto) return;
    var avis = document.getElementById('hxAvisCompte');
    if (sessio) { if (avis) avis.remove(); return; }
    if (!avis) {
      avis = document.createElement('div');
      avis.id = 'hxAvisCompte';
      boto.parentNode.insertBefore(avis, boto);
    }
    avis.innerHTML = '<b>' + t('avisT') + '</b><span>' + t('avisP') + '</span>' +
      '<div class="hxac-btns"><button type="button" data-ac="login">' + t('entrar') + '</button>' +
      '<button type="button" data-ac="register">' + t('crear') + '</button></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#hxAvisCompte [data-ac]');
    if (!b) return;
    if (typeof window.openAuthModal === 'function') window.openAuthModal();
    if (typeof window.switchTab === 'function') window.switchTab(b.getAttribute('data-ac'));
  });

  /* ---------- Seguir la comanda: menú i panell de contacte ---------- */
  function anarASeguiment() {
    window.navTo('contacte');
    setTimeout(function () {
      var s = document.getElementById('seguiment-comanda');
      if (s) { s.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); }
    }, 120);
  }
  /* Enllaç directe des del QR del justificant: ?seguiment=NUM obre el seguiment amb el número posat */
  function seguimentDesDeURL() {
    var num = ''; try { num = new URLSearchParams(location.search).get('seguiment') || ''; } catch (e) { return; }
    if (!num) return;
    var obrir = function () {
      anarASeguiment();
      setTimeout(function () { var c = document.getElementById('trackNum'); if (c) { c.value = num; var m = document.getElementById('trackEmail'); if (m) m.focus(); } }, 300);
    };
    if (document.readyState === 'complete') setTimeout(obrir, 400); else window.addEventListener('load', function () { setTimeout(obrir, 400); });
  }
  function afegirSeguiment() {
    var ajuda = document.querySelector('#navDropdown .dditem[data-nav="contacte"]');
    if (ajuda && !document.getElementById('hxMenuSeguir')) {
      var a = document.createElement('a');
      a.className = 'dditem dd-sub'; a.id = 'hxMenuSeguir'; a.href = '?seccio=contacte';
      a.innerHTML = '<span></span>';
      ajuda.parentNode.insertBefore(a, ajuda.nextSibling);
    }
    var pan = document.getElementById('hxContacte');
    if (pan && !document.getElementById('hxctSeguir')) {
      var op = document.createElement('a');
      op.className = 'hxct-op seguir'; op.id = 'hxctSeguir'; op.href = '?seccio=contacte';
      op.innerHTML = '<span class="hxct-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg></span>' +
        '<span class="hxct-txt"><b></b><span></span></span>';
      var form = pan.querySelector('.hxct-op.form');
      pan.insertBefore(op, form || null);
    }
    pintar();
  }
  function pintar() {
    var a = document.querySelector('#hxMenuSeguir span'); if (a) a.textContent = t('seguir');
    var b = document.querySelector('#hxctSeguir .hxct-txt b'); if (b) b.textContent = t('seguir');
    var c = document.querySelector('#hxctSeguir .hxct-txt > span'); if (c) c.textContent = t('seguirD');
    actualitzarCarret();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('#hxMenuSeguir, #hxctSeguir');
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    var pan = document.getElementById('hxContacte'); if (pan && !pan.hidden) document.getElementById('hxChatLauncher').click();
    anarASeguiment();
  }, true);


  // Accessibilitat: noms per a lectors de pantalla
  var A11Y = {
    qty: ['Quantitat de {p}', 'Cantidad de {p}', 'Quantity of {p}', 'Quantité de {p}', 'Menge von {p}', 'كمية {p}'],
    menos: ['Treure una unitat de {p}', 'Quitar una unidad de {p}', 'Remove one {p}', 'Retirer une unité de {p}', 'Eine Einheit {p} entfernen', 'إزالة وحدة من {p}'],
    mas: ['Afegir una unitat de {p}', 'Añadir una unidad de {p}', 'Add one {p}', 'Ajouter une unité de {p}', 'Eine Einheit {p} hinzufügen', 'إضافة وحدة من {p}'],
    mapa: ['Mapa de la ubicació d\'HIGIENEX', 'Mapa de la ubicación de HIGIENEX', 'Map of HIGIENEX location', 'Carte de l\'emplacement d\'HIGIENEX', 'Karte des HIGIENEX-Standorts', 'خريطة موقع HIGIENEX'],
    org: ['Organigrama (desplaçable)', 'Organigrama (desplazable)', 'Organisation chart (scrollable)', 'Organigramme (défilant)', 'Organigramm (scrollbar)', 'الهيكل التنظيمي (قابل للتمرير)'],
  };
  function a11y() {
    var i = ['ca', 'es', 'en', 'fr', 'de', 'ar'].indexOf(localStorage.getItem('hx_lang') || 'ca'); if (i < 0) i = 0;
    var t = function (k, p) { return A11Y[k][i].replace('{p}', p || ''); };
    document.querySelectorAll('.pedido-card-new').forEach(function (c) {
      var nom = c.querySelector('.hx-u25'); nom = nom ? nom.textContent.trim() : (c.querySelector('img') || {}).alt || '';
      var q = c.querySelector('.qty-num'); if (q) q.setAttribute('aria-label', t('qty', nom));
      var b = c.querySelectorAll('button[onclick^="changeQty"]');
      b.forEach(function (x) { x.setAttribute('aria-label', t(/-1/.test(x.getAttribute('onclick')) ? 'menos' : 'mas', nom)); });
    });
    document.querySelectorAll('input.qty-num:not([aria-label])').forEach(function (q) { q.setAttribute('aria-label', t('qty', '')); });
    document.querySelectorAll('iframe.map-embed, iframe[src*="google.com/maps"]').forEach(function (f) { f.setAttribute('title', t('mapa')); });
    var org = document.querySelector('#organitzacio .org-chart'); org = org && org.parentElement;
    if (org) { org.setAttribute('tabindex', '0'); org.setAttribute('role', 'region'); org.setAttribute('aria-label', t('org')); org.classList.add('hx-scroll-a11y'); }
    // Camps de formulari sense etiqueta: usar el placeholder o el text proper
    document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea').forEach(function (e) {
      if (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || (e.labels && e.labels.length)) return;
      var txt = e.getAttribute('placeholder') || e.getAttribute('title') || '';
      if (!txt) { var prev = e.previousElementSibling; if (prev && prev.textContent.trim().length < 60) txt = prev.textContent.trim(); }
      if (!txt) { var fld = e.closest('.form-field, .form-group, label'); if (fld) { var l = fld.querySelector('label, .lbl, span'); if (l && l !== e) txt = l.textContent.trim(); } }
      if (txt) e.setAttribute('aria-label', txt.replace(/\s*\*\s*$/, ''));
    });
    document.querySelectorAll('.comp-table-wrap, .table-wrap, [style*="overflow-x:auto"]').forEach(function (w) {
      if (w.hasAttribute('tabindex')) return;
      w.setAttribute('tabindex', '0'); w.classList.add('hx-scroll-a11y');
      if (!w.getAttribute('aria-label')) { var h = w.closest('section'); h = h && h.querySelector('h2'); w.setAttribute('role', 'region'); w.setAttribute('aria-label', h ? h.textContent.trim() : t('org')); }
    });
    var mb = document.getElementById('menuToggleBtn'), dd = document.getElementById('navDropdown');
    if (mb && dd) { mb.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false'); mb.setAttribute('aria-controls', 'navDropdown'); }
  }
  function vigilarMenu() {
    var dd = document.getElementById('navDropdown'), mb = document.getElementById('menuToggleBtn');
    if (!dd || !mb || !window.MutationObserver) return;
    new MutationObserver(function () { mb.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false'); }).observe(dd, { attributes: true, attributeFilter: ['class'] });
  }

  function iniciar() {
    // Avisos traduïts
    var toast = window.showToast;
    if (typeof toast === 'function' && !toast._hxTrad) {
      var nouToast = function (msg) { var a = [].slice.call(arguments); a[0] = traduir(msg); return toast.apply(this, a); };
      nouToast._hxTrad = true; window.showToast = nouToast;
    }
    var alerta = window.alert;
    window.alert = function (msg) { return alerta.call(window, traduir(msg)); };
    // Quantitat inicial 1 a la botiga
    document.querySelectorAll('#pedidosGrid .qty-num').forEach(function (n) { if (n.value === '0') n.value = '1'; });
    // Carret
    var obrir = window.openCartDrawer;
    if (typeof obrir === 'function' && !obrir._hxCarret) {
      var nou = function () { var r = obrir.apply(this, arguments); actualitzarCarret(); return r; };
      nou._hxCarret = true; window.openCartDrawer = nou;
    }
    ['setLoggedInUser', 'logout'].forEach(function (f) {
      var o = window[f];
      if (typeof o === 'function' && !o._hxCarret) { var w = function () { var r = o.apply(this, arguments); actualitzarCarret(); return r; }; w._hxCarret = true; window[f] = w; }
    });
    afegirSeguiment();
    seguimentDesDeURL();
    a11y(); vigilarMenu();
    var apl = window.hxApplyLang;
    if (typeof apl === 'function' && !apl._hxMiss) { var w2 = function () { var r = apl.apply(this, arguments); pintar(); a11y(); return r; }; w2._hxMiss = true; window.hxApplyLang = w2; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  window.HXMissatges = { traduir: traduir };
})();
