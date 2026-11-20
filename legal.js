/* ==========================================================================
   HIGIENEX · Páginas legales (aviso legal, privacidad y cookies)
   - Barra superior propia con «Volver a la web» (antes quedaba bajo la cabecera)
   - Fecha de última actualización e índice lateral con enlaces a cada apartado
   - Privacidad: datos de clientes, pedidos y facturas, y proveedores que tratan
     datos por cuenta de HIGIENEX
   - Cookies: tabla con lo que guarda la web en el navegador y botón para
     cambiar la elección
   Textos en los 6 idiomas de la web: [ca, es, en, fr, de, ar].
   ========================================================================== */
(function () {
  'use strict';
  var IDX = { ca: 0, es: 1, en: 2, fr: 3, de: 4, ar: 5 };
  var ACTUALITZAT = '2026-11-20';
  var D = {
    act: ['Última actualització: {0}', 'Última actualización: {0}', 'Last updated: {0}', 'Dernière mise à jour : {0}', 'Zuletzt aktualisiert: {0}', 'آخر تحديث: {0}'],
    index: ['En aquesta pàgina', 'En esta página', 'On this page', 'Sur cette page', 'Auf dieser Seite', 'في هذه الصفحة'],
    imprimir: ['Imprimir', 'Imprimir', 'Print', 'Imprimer', 'Drucken', 'طباعة'],
    // Privacitat
    p7t: ['7. Dades de clients, comandes i factures', '7. Datos de clientes, pedidos y facturas', '7. Customer, order and invoice data', '7. Données clients, commandes et factures', '7. Kunden-, Bestell- und Rechnungsdaten', '7. بيانات العملاء والطلبات والفواتير'],
    p7: [
      "Si crees un compte o fas una comanda, tractem el teu nom, l'empresa, el NIF, l'adreça d'entrega, l'email i el telèfon, i l'historial de comandes i factures, per gestionar la compra, l'entrega i la facturació (art. 6.1.b RGPD). Les factures es conserven sis anys per obligació mercantil i fiscal.",
      'Si creas una cuenta o haces un pedido, tratamos tu nombre, la empresa, el NIF, la dirección de entrega, el email y el teléfono, y el historial de pedidos y facturas, para gestionar la compra, la entrega y la facturación (art. 6.1.b RGPD). Las facturas se conservan seis años por obligación mercantil y fiscal.',
      'If you create an account or place an order, we process your name, company, tax ID, delivery address, email and phone number, and your order and invoice history, to manage the purchase, delivery and invoicing (Art. 6(1)(b) GDPR). Invoices are kept for six years as required by commercial and tax law.',
      "Si vous créez un compte ou passez une commande, nous traitons votre nom, votre entreprise, votre numéro fiscal, votre adresse de livraison, votre e-mail et votre téléphone, ainsi que l'historique des commandes et factures, pour gérer l'achat, la livraison et la facturation (art. 6.1.b RGPD). Les factures sont conservées six ans conformément aux obligations commerciales et fiscales.",
      'Wenn Sie ein Konto anlegen oder bestellen, verarbeiten wir Ihren Namen, Ihr Unternehmen, Ihre Steuernummer, Lieferadresse, E-Mail und Telefonnummer sowie Ihre Bestell- und Rechnungshistorie, um Kauf, Lieferung und Rechnungsstellung abzuwickeln (Art. 6 Abs. 1 lit. b DSGVO). Rechnungen werden aus handels- und steuerrechtlichen Gründen sechs Jahre aufbewahrt.',
      'إذا أنشأت حسابًا أو قدّمت طلبًا، نعالج اسمك واسم الشركة والرقم الضريبي وعنوان التسليم والبريد الإلكتروني والهاتف وسجل الطلبات والفواتير، لإدارة الشراء والتسليم والفوترة (المادة 6.1.ب من اللائحة العامة لحماية البيانات). تُحفظ الفواتير ست سنوات وفقًا للالتزامات التجارية والضريبية.',
    ],
    p8t: ['8. Proveïdors que tracten dades', '8. Proveedores que tratan datos', '8. Providers that process data', '8. Prestataires qui traitent des données', '8. Dienstleister, die Daten verarbeiten', '8. مقدمو الخدمات الذين يعالجون البيانات'],
    p8: [
      'Per fer funcionar la web fem servir aquests proveïdors, amb contracte d’encàrrec del tractament:',
      'Para que la web funcione usamos estos proveedores, con contrato de encargo del tratamiento:',
      'To run the website we use these providers, under a data processing agreement:',
      'Pour faire fonctionner le site, nous faisons appel à ces prestataires, liés par un contrat de sous-traitance :',
      'Für den Betrieb der Website nutzen wir folgende Dienstleister mit Auftragsverarbeitungsvertrag:',
      'لتشغيل الموقع نستخدم مقدمي الخدمات التالين، بموجب عقد معالجة بيانات:',
    ],
    cf: ['Cloudflare: servidor, base de dades i àrea de clients.', 'Cloudflare: servidor, base de datos y área de clientes.', 'Cloudflare: server, database and client area.', 'Cloudflare : serveur, base de données et espace client.', 'Cloudflare: Server, Datenbank und Kundenbereich.', 'Cloudflare: الخادم وقاعدة البيانات ومنطقة العملاء.'],
    br: ['Brevo: enviament dels emails de comandes, factures i benvinguda.', 'Brevo: envío de los emails de pedidos, facturas y bienvenida.', 'Brevo: sending order, invoice and welcome emails.', 'Brevo : envoi des e-mails de commande, de facture et de bienvenue.', 'Brevo: Versand der Bestell-, Rechnungs- und Willkommens-E-Mails.', 'Brevo: إرسال رسائل الطلبات والفواتير والترحيب.'],
    gh: ['GitHub Pages: allotjament de les pàgines públiques de la web.', 'GitHub Pages: alojamiento de las páginas públicas de la web.', 'GitHub Pages: hosting of the public web pages.', 'GitHub Pages : hébergement des pages publiques du site.', 'GitHub Pages: Hosting der öffentlichen Webseiten.', 'GitHub Pages: استضافة الصفحات العامة للموقع.'],
    tr: [
      "Quan hi ha transferències fora de la Unió Europea, s'apliquen les clàusules contractuals tipus de la Comissió Europea.",
      'Cuando hay transferencias fuera de la Unión Europea, se aplican las cláusulas contractuales tipo de la Comisión Europea.',
      'Where data is transferred outside the European Union, the European Commission’s standard contractual clauses apply.',
      "En cas de transfert hors de l'Union européenne, les clauses contractuelles types de la Commission européenne s'appliquent.",
      'Bei Übermittlungen außerhalb der Europäischen Union gelten die Standardvertragsklauseln der Europäischen Kommission.',
      'عند نقل البيانات خارج الاتحاد الأوروبي، تُطبَّق البنود التعاقدية القياسية للمفوضية الأوروبية.',
    ],
    p9t: ['9. Termini de resposta', '9. Plazo de respuesta', '9. Response time', '9. Délai de réponse', '9. Antwortfrist', '9. مهلة الرد'],
    p9: [
      "Responem les sol·licituds d'exercici de drets en el termini màxim d'un mes des que les rebem.",
      'Respondemos las solicitudes de ejercicio de derechos en el plazo máximo de un mes desde que las recibimos.',
      'We answer requests to exercise your rights within one month of receiving them.',
      "Nous répondons aux demandes d'exercice des droits dans un délai maximum d'un mois à compter de leur réception.",
      'Anfragen zur Ausübung Ihrer Rechte beantworten wir innerhalb eines Monats nach Eingang.',
      'نرد على طلبات ممارسة الحقوق خلال شهر واحد كحد أقصى من تاريخ استلامها.',
    ],
    // Cookies
    c5t: ['5. Què guarda exactament la web', '5. Qué guarda exactamente la web', '5. Exactly what the website stores', '5. Ce que le site enregistre exactement', '5. Was die Website genau speichert', '5. ما الذي يخزّنه الموقع بالضبط'],
    c5: [
      "No fem servir cookies de publicitat ni de tercers per seguir-te. La web guarda aquestes dades al teu navegador (emmagatzematge local), que pots esborrar quan vulguis des de la configuració del navegador:",
      'No usamos cookies de publicidad ni de terceros para seguirte. La web guarda estos datos en tu navegador (almacenamiento local), que puedes borrar cuando quieras desde la configuración del navegador:',
      'We do not use advertising or third-party tracking cookies. The website stores the following in your browser (local storage), which you can delete at any time in your browser settings:',
      "Nous n'utilisons ni cookies publicitaires ni cookies tiers de suivi. Le site enregistre ces données dans votre navigateur (stockage local), que vous pouvez effacer à tout moment dans les paramètres du navigateur :",
      'Wir verwenden keine Werbe- oder Tracking-Cookies von Drittanbietern. Die Website speichert Folgendes in Ihrem Browser (lokaler Speicher), das Sie jederzeit in den Browsereinstellungen löschen können:',
      'لا نستخدم ملفات تعريف ارتباط إعلانية أو ملفات تتبع من أطراف ثالثة. يحفظ الموقع ما يلي في متصفحك (التخزين المحلي)، ويمكنك حذفه في أي وقت من إعدادات المتصفح:',
    ],
    hNom: ['Nom', 'Nombre', 'Name', 'Nom', 'Name', 'الاسم'],
    hPer: ['Per a què serveix', 'Para qué sirve', 'What it is for', 'À quoi il sert', 'Wofür', 'الغرض'],
    hTip: ['Tipus', 'Tipo', 'Type', 'Type', 'Art', 'النوع'],
    hDur: ['Durada', 'Duración', 'Duration', 'Durée', 'Dauer', 'المدة'],
    nec: ['Necessària', 'Necesaria', 'Necessary', 'Nécessaire', 'Notwendig', 'ضروري'],
    pre: ['Preferències', 'Preferencias', 'Preferences', 'Préférences', 'Präferenzen', 'تفضيلات'],
    ana: ['Estadística', 'Estadística', 'Statistics', 'Statistiques', 'Statistik', 'إحصاءات'],
    fins: ['Fins que l’esborris', 'Hasta que la borres', 'Until you delete it', 'Jusqu’à suppression', 'Bis Sie es löschen', 'حتى تحذفه'],
    sessio: ['Fins que tanquis la sessió', 'Hasta que cierres la sesión', 'Until you log out', 'Jusqu’à la déconnexion', 'Bis zur Abmeldung', 'حتى تسجيل الخروج'],
    k1: ['Recorda la teva elecció sobre les cookies', 'Recuerda tu elección sobre las cookies', 'Remembers your cookie choice', 'Mémorise votre choix concernant les cookies', 'Speichert Ihre Cookie-Auswahl', 'يتذكر اختيارك بشأن ملفات تعريف الارتباط'],
    k2: ["Recorda l'idioma de la web", 'Recuerda el idioma de la web', 'Remembers the website language', 'Mémorise la langue du site', 'Speichert die Sprache der Website', 'يتذكر لغة الموقع'],
    k3: ['Guarda el carret de compra', 'Guarda el carrito de compra', 'Keeps your shopping cart', 'Conserve votre panier', 'Speichert Ihren Warenkorb', 'يحفظ سلة التسوق'],
    k4: ["Manté oberta la sessió del teu compte i de l'àrea de clients", 'Mantiene abierta la sesión de tu cuenta y del área de clientes', 'Keeps you logged in to your account and the client area', 'Maintient la session de votre compte et de l’espace client', 'Hält Sie in Ihrem Konto und im Kundenbereich angemeldet', 'يبقيك مسجلًا في حسابك ومنطقة العملاء'],
    k5: ['Pàgines i productes vistos, només al teu navegador (no s’envien enlloc)', 'Páginas y productos vistos, solo en tu navegador (no se envían a ningún sitio)', 'Pages and products viewed, only in your browser (never sent anywhere)', 'Pages et produits consultés, uniquement dans votre navigateur (jamais envoyés)', 'Angesehene Seiten und Produkte, nur in Ihrem Browser (werden nirgendwohin gesendet)', 'الصفحات والمنتجات التي شاهدتها، في متصفحك فقط (لا تُرسَل إلى أي مكان)'],
    nota: [
      "El comptador de visites és propi: compta pàgines vistes sense cookies, sense guardar la teva IP i sense identificar-te, i no compta res si el navegador té activat «No rastrejar». El mapa de Google de la pàgina de contacte pot instal·lar cookies de Google quan es carrega.",
      'El contador de visitas es propio: cuenta páginas vistas sin cookies, sin guardar tu IP y sin identificarte, y no cuenta nada si el navegador tiene activado «No rastrear». El mapa de Google de la página de contacto puede instalar cookies de Google al cargarse.',
      'Our visit counter is our own: it counts page views without cookies, without storing your IP and without identifying you, and counts nothing if your browser has “Do Not Track” enabled. The Google map on the contact page may set Google cookies when it loads.',
      "Le compteur de visites est le nôtre : il compte les pages vues sans cookies, sans enregistrer votre IP et sans vous identifier, et ne compte rien si le navigateur a activé « Ne pas suivre ». La carte Google de la page contact peut déposer des cookies Google lors de son chargement.",
      'Der Besucherzähler ist unser eigener: Er zählt Seitenaufrufe ohne Cookies, ohne Ihre IP zu speichern und ohne Sie zu identifizieren, und zählt nichts, wenn Ihr Browser „Nicht verfolgen“ aktiviert hat. Die Google-Karte auf der Kontaktseite kann beim Laden Google-Cookies setzen.',
      'عدّاد الزيارات خاص بنا: يحسب الصفحات المعروضة دون ملفات تعريف ارتباط ودون حفظ عنوان IP ودون التعرف عليك، ولا يحسب شيئًا إذا كان المتصفح يفعّل خيار «عدم التتبع». قد تضع خريطة Google في صفحة الاتصال ملفات تعريف ارتباط من Google عند تحميلها.',
    ],
    canviar: ['Canviar les meves preferències de cookies', 'Cambiar mis preferencias de cookies', 'Change my cookie preferences', 'Modifier mes préférences de cookies', 'Meine Cookie-Einstellungen ändern', 'تغيير تفضيلات ملفات تعريف الارتباط'],
  };
  function lang() {
    var l = 'ca';
    try { l = localStorage.getItem('hx_lang') || 'ca'; } catch (e) { /* sense emmagatzematge */ }
    return l in IDX ? l : 'ca';
  }
  function t(k) { var e = D[k]; return e ? e[IDX[lang()]] || e[1] : k; }
  function data() {
    var l = lang(), loc = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' }[l];
    try { return new Date(ACTUALITZAT + 'T12:00:00').toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ACTUALITZAT; }
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function seccio(cont, abans, titolKey, parts) {
    var frag = document.createDocumentFragment();
    var h = el('h3', 'hx-u56 hxl-nova'); h.setAttribute('data-hxl', titolKey); frag.appendChild(h);
    parts.forEach(function (p) { frag.appendChild(p); });
    if (abans) cont.insertBefore(frag, abans); else cont.appendChild(frag);
  }
  function para(k) { var p = el('p', 'hxl-nova'); p.setAttribute('data-hxl', k); return p; }

  function muntar() {
    ['page-aviso-legal', 'page-privacidad', 'page-cookies'].forEach(function (id) {
      var pag = document.getElementById(id);
      if (!pag || pag.getAttribute('data-hxl-ok')) return;
      pag.setAttribute('data-hxl-ok', '1');
      var cont = pag.querySelector('.container');
      // Barra superior fixa amb «Volver a la web»
      var back = cont.querySelector('.legal-back');
      var barra = el('div', 'hxl-barra');
      var dins = el('div', 'hxl-barra-in');
      dins.appendChild(el('span', 'hxl-logo', 'HIGIENE<span>X</span>'));
      if (back) dins.appendChild(back);
      var imp = el('button', 'hxl-imprimir'); imp.type = 'button'; imp.setAttribute('data-hxl', 'imprimir');
      imp.addEventListener('click', function () { window.print(); });
      dins.appendChild(imp);
      barra.appendChild(dins);
      pag.insertBefore(barra, pag.firstChild);
      // Data d'actualització sota el subtítol
      var sub = cont.querySelector('h2 + p');
      var act = el('p', 'hxl-act'); act.setAttribute('data-hxl', 'act');
      if (sub) sub.parentNode.insertBefore(act, sub.nextSibling);

      if (id === 'page-privacidad') {
        var ul = el('ul', 'hxl-nova hxl-llista');
        ['cf', 'br', 'gh'].forEach(function (k) { var li = el('li'); li.setAttribute('data-hxl', k); ul.appendChild(li); });
        seccio(cont, null, 'p7t', [para('p7')]);
        seccio(cont, null, 'p8t', [para('p8'), ul, para('tr')]);
        seccio(cont, null, 'p9t', [para('p9')]);
      }
      if (id === 'page-cookies') {
        var taula = el('div', 'hxl-taula-wrap hxl-nova');
        taula.innerHTML = '<table class="hxl-taula"><thead><tr><th data-hxl="hNom"></th><th data-hxl="hPer"></th><th data-hxl="hTip"></th><th data-hxl="hDur"></th></tr></thead><tbody>' +
          [['hx_cookie_prefs', 'k1', 'nec', 'fins'], ['hx_lang', 'k2', 'pre', 'fins'], ['hx_cart', 'k3', 'nec', 'fins'], ['hx_api_token · hx_cp_token', 'k4', 'nec', 'sessio'], ['hx_analytics', 'k5', 'ana', 'fins']]
            .map(function (r) { return '<tr><td><code>' + r[0] + '</code></td><td data-hxl="' + r[1] + '"></td><td data-hxl="' + r[2] + '"></td><td data-hxl="' + r[3] + '"></td></tr>'; }).join('') +
          '</tbody></table>';
        var nota = el('p', 'hxl-nota hxl-nova'); nota.setAttribute('data-hxl', 'nota');
        var boto = el('button', 'hxl-boto hxl-nova'); boto.type = 'button'; boto.setAttribute('data-hxl', 'canviar');
        boto.addEventListener('click', function () {
          try { localStorage.removeItem('hx_cookie_prefs'); } catch (e) { /* sense emmagatzematge */ }
          if (typeof window.legalClose === 'function') window.legalClose();
          var m = document.getElementById('hgCookieModal'); if (m) m.classList.add('active');
        });
        seccio(cont, null, 'c5t', [para('c5'), taula, nota, boto]);
      }
      // Índex lateral a partir dels apartats
      var h3s = cont.querySelectorAll('h3');
      var nav = el('nav', 'hxl-index');
      nav.setAttribute('data-hxl-aria', 'index');
      var tit = el('p', 'hxl-index-t'); tit.setAttribute('data-hxl', 'index'); nav.appendChild(tit);
      var ol = el('ol');
      [].forEach.call(h3s, function (h, i) {
        h.id = h.id || id + '-s' + (i + 1);
        var li = el('li'), a = el('a'); a.href = '#' + h.id; a.setAttribute('data-hxl-de', h.id);
        a.addEventListener('click', function (e) { e.preventDefault(); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        li.appendChild(a); ol.appendChild(li);
      });
      nav.appendChild(ol);
      cont.classList.add('hxl-cos');
      var marc = el('div', 'hxl-marc');
      cont.parentNode.insertBefore(marc, cont);
      marc.appendChild(nav);
      marc.appendChild(cont);
    });
    pintar();
  }
  function pintar() {
    document.querySelectorAll('[data-hxl]').forEach(function (e) {
      var k = e.getAttribute('data-hxl');
      e.textContent = k === 'act' ? t('act').replace('{0}', data()) : t(k);
    });
    document.querySelectorAll('[data-hxl-aria]').forEach(function (e) { e.setAttribute('aria-label', t(e.getAttribute('data-hxl-aria'))); });
    // Els enllaços de l'índex agafen el text del títol (ja traduït), sense el número
    document.querySelectorAll('[data-hxl-de]').forEach(function (a) {
      var h = document.getElementById(a.getAttribute('data-hxl-de'));
      if (h) a.textContent = h.textContent.replace(/^\s*\d+\.\s*/, '');
    });
  }
  /* Mientras hay una página legal abierta, la cabecera de la web se esconde (tapaba la barra propia) */
  function envoltar(nom, obert) {
    var f = window[nom];
    if (typeof f !== 'function' || f._hxLegal) return;
    var w = function () { var r = f.apply(this, arguments); document.body.classList.toggle('hxl-oberta', obert); return r; };
    w._hxLegal = true; window[nom] = w;
  }
  function iniciar() {
    muntar();
    envoltar('legalOpen', true);
    envoltar('legalClose', false);
    var apl = window.hxApplyLang;
    if (typeof apl === 'function' && !apl._hxLegal) {
      var w = function () { var r = apl.apply(this, arguments); pintar(); return r; };
      w._hxLegal = true; window.hxApplyLang = w;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
