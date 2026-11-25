/* ============================================================
   HIGIENEX — Tutorial del área de clientes (guia-clientes.js)
   Solo para la cuenta de Edu (el servidor marca su cuenta con «guia»).
   Empieza sola cada vez que Edu inicia sesión (no al recargar la página con
   la sesión ya abierta) y se puede repetir desde Ayuda › «Ver el tutorial». Teclado: ← → y Esc.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var UI = {
    seg: ['Següent', 'Siguiente', 'Next', 'Suivant', 'Weiter', 'التالي'],
    ant: ['Anterior', 'Anterior', 'Back', 'Précédent', 'Zurück', 'السابق'],
    fi: ['Acabar', 'Terminar', 'Finish', 'Terminer', 'Fertig', 'إنهاء'],
    saltar: ['Saltar el tutorial', 'Saltar el tutorial', 'Skip tutorial', 'Passer le tutoriel', 'Tutorial überspringen', 'تخطي الدليل'],
    pas: ['Pas {0} de {1}', 'Paso {0} de {1}', 'Step {0} of {1}', 'Étape {0} sur {1}', 'Schritt {0} von {1}', 'الخطوة {0} من {1}'],
    veure: ['Veure el tutorial', 'Ver el tutorial', 'View the tutorial', 'Voir le tutoriel', 'Tutorial ansehen', 'عرض الدليل'],
  };
  // s: secció de l'àrea ('' = àrea tancada) · sel: element que es resalta (el primer que existeixi)
  var PASSOS = [
    { s: '', sel: [],
      t: ['Hola, Edu! Et presento l’àrea de clients', '¡Hola, Edu! Te presento el área de clientes', 'Hi Edu! Meet the client area', 'Bonjour Edu ! Voici l’espace client', 'Hallo Edu! Das ist der Kundenbereich', 'مرحبًا إدو! إليك منطقة العملاء'],
      x: ['En un minut veuràs com s’hi entra i què pot fer un client: comandes, factures, pagaments i les seves dades.', 'En un minuto verás cómo se entra y qué puede hacer un cliente: pedidos, facturas, pagos y sus datos.', 'In one minute you’ll see how to get in and what a client can do: orders, invoices, payments and their details.', 'En une minute : comment y accéder et ce qu’un client peut faire (commandes, factures, paiements, données).', 'In einer Minute: wie man hineinkommt und was Kunden tun können – Bestellungen, Rechnungen, Zahlungen, Daten.', 'في دقيقة سترى كيف تدخل وما يمكن للعميل فعله: الطلبات والفواتير والدفع والبيانات.'] },
    { s: '', sel: ['#userNavBtn', '#navClientBtn'],
      t: ['Com s’hi entra', 'Cómo se entra', 'How to get in', 'Comment y accéder', 'So kommt man hinein', 'كيف تدخل'],
      x: ['Amb la sessió iniciada, toca el teu nom (o el botó 📊). No cal cap altra contrasenya: és la mateixa compte de la web.', 'Con la sesión iniciada, toca tu nombre (o el botón 📊). No hace falta otra contraseña: es la misma cuenta de la web.', 'Once logged in, tap your name (or the 📊 button). No second password: it’s the same web account.', 'Une fois connecté, touchez votre nom (ou 📊). Pas de second mot de passe : c’est le même compte.', 'Angemeldet tippen Sie auf Ihren Namen (oder 📊). Kein zweites Passwort: dasselbe Konto.', 'بعد تسجيل الدخول اضغط على اسمك (أو زر 📊). لا حاجة لكلمة مرور أخرى.'] },
    { s: '', sel: ['#navCartBtn'],
      t: ['La cistella', 'La cesta', 'The cart', 'Le panier', 'Der Warenkorb', 'السلة'],
      x: ['Els productes que afegeixes de la botiga van aquí. Des de la cistella es tramita la comanda i es paga amb targeta (mode de prova).', 'Los productos que añades desde la tienda van aquí. Desde la cesta se tramita el pedido y se paga con tarjeta (modo de prueba).', 'Products you add from the shop go here. From the cart you check out and pay by card (test mode).', 'Les produits ajoutés vont ici. Depuis le panier, on valide et on paie par carte (mode test).', 'Hier landen Produkte aus dem Shop. Im Warenkorb bestellen und mit Karte zahlen (Testmodus).', 'تذهب المنتجات المضافة إلى هنا. من السلة تُكمل الطلب وتدفع بالبطاقة (وضع اختبار).'] },
    { s: 'inici', sel: ['.hxa-gran'],
      t: ['Inici: l’última comanda', 'Inicio: el último pedido', 'Home: the latest order', 'Accueil : la dernière commande', 'Start: die letzte Bestellung', 'الرئيسية: آخر طلب'],
      x: ['En entrar es veu l’última comanda amb el seu estat i una barra de progrés. Des d’aquí la pots seguir o repetir amb un toc.', 'Al entrar se ve el último pedido con su estado y una barra de progreso. Desde aquí lo puedes seguir o repetir con un toque.', 'The latest order with its status and a progress bar. Track it or reorder in one tap.', 'La dernière commande avec son état et sa progression. Suivez-la ou recommandez en un geste.', 'Die letzte Bestellung mit Status und Fortschritt. Verfolgen oder mit einem Tipp erneut bestellen.', 'آخر طلب مع حالته وشريط التقدم. يمكنك تتبعه أو تكراره بلمسة.'] },
    { s: 'inici', sel: ['#hxaC2'],
      t: ['Factures pendents', 'Facturas pendientes', 'Unpaid invoices', 'Factures à payer', 'Offene Rechnungen', 'فواتير غير مدفوعة'],
      x: ['Quant queda per pagar. Si alguna ha vençut, surt en vermell. El botó Pagar porta directament a les factures.', 'Cuánto queda por pagar. Si alguna ha vencido, sale en rojo. El botón Pagar lleva directo a las facturas.', 'How much is left to pay; overdue ones show in red. Pay takes you straight to invoices.', 'Le montant à payer ; les échues en rouge. Payer mène aux factures.', 'Offener Betrag; überfällige in Rot. Bezahlen führt direkt zu den Rechnungen.', 'المبلغ المتبقي؛ المتأخرة بالأحمر. زر «ادفع» يأخذك إلى الفواتير.'] },
    { s: 'inici', sel: ['#hxaC3'],
      t: ['Comandes programades i cites', 'Pedidos programados y citas', 'Scheduled orders and appointments', 'Commandes programmées et rendez-vous', 'Geplante Bestellungen und Termine', 'الطلبات المجدولة والمواعيد'],
      x: ['La pròxima comanda que es farà sola (cada 1, 2, 4 o 8 setmanes) i, al costat, la pròxima visita o formació demanada.', 'El próximo pedido que se hará solo (cada 1, 2, 4 u 8 semanas) y, al lado, la próxima visita o formación pedida.', 'The next order that places itself (every 1, 2, 4 or 8 weeks) and, next to it, the next visit or training.', 'La prochaine commande automatique (toutes les 1, 2, 4 ou 8 semaines) et le prochain rendez-vous.', 'Die nächste automatische Bestellung (alle 1, 2, 4 oder 8 Wochen) und der nächste Termin.', 'الطلب التالي التلقائي (كل 1 أو 2 أو 4 أو 8 أسابيع) والموعد التالي.'] },
    { s: 'inici', sel: ['.hxa-rapid'],
      t: ['Accions ràpides', 'Acciones rápidas', 'Quick actions', 'Actions rapides', 'Schnellaktionen', 'إجراءات سريعة'],
      x: ['El que més es fa: repetir l’última comanda, demanar pressupost, veure la cistella o anar a la botiga.', 'Lo que más se hace: repetir el último pedido, pedir presupuesto, ver la cesta o ir a la tienda.', 'The most common tasks: reorder, request a quote, view the cart or go to the shop.', 'L’essentiel : recommander, demander un devis, voir le panier ou la boutique.', 'Das Häufigste: erneut bestellen, Angebot, Warenkorb, Shop.', 'الأكثر استخدامًا: تكرار الطلب، طلب عرض سعر، السلة، المتجر.'] },
    { s: 'inici', sel: ['.hxa-baix', '.hxa-side .hxa-menu'], mobil: true,
      t: ['El menú', 'El menú', 'The menu', 'Le menu', 'Das Menü', 'القائمة'],
      x: ['Cinc apartats: Inici, Comandes, Factures, Dades i Ajuda. A l’ordinador és a l’esquerra; al mòbil, a baix.', 'Cinco apartados: Inicio, Pedidos, Facturas, Datos y Ayuda. En el ordenador está a la izquierda; en el móvil, abajo.', 'Five sections: Home, Orders, Invoices, Details and Help. On a computer it’s on the left; on a phone, at the bottom.', 'Cinq rubriques. À gauche sur ordinateur, en bas sur mobile.', 'Fünf Bereiche. Am Computer links, am Handy unten.', 'خمسة أقسام. على الحاسوب يسارًا، وعلى الهاتف في الأسفل.'] },
    { s: 'comandes', sel: ['.hxa-eines'],
      t: ['Comandes: cercar i filtrar', 'Pedidos: buscar y filtrar', 'Orders: search and filter', 'Commandes : rechercher et filtrer', 'Bestellungen: suchen und filtern', 'الطلبات: البحث والتصفية'],
      x: ['Cerca per número o per producte i filtra les que estan en curs, entregades o cancel·lades.', 'Busca por número o por producto y filtra los que están en curso, entregados o cancelados.', 'Search by number or product and filter in progress, delivered or cancelled.', 'Recherchez par numéro ou produit et filtrez par état.', 'Nach Nummer oder Produkt suchen und nach Status filtern.', 'ابحث بالرقم أو المنتج وصفِّ حسب الحالة.'] },
    { s: 'comandes', sel: ['.hxa-llista .hxa-fila', '.hxa-main .hxa-card'],
      t: ['Cada comanda', 'Cada pedido', 'Each order', 'Chaque commande', 'Jede Bestellung', 'كل طلب'],
      x: ['Seguiment amb la línia de temps i el mapa, el PDF, Repetir (passa a la cistella) i Programar perquè es faci sola.', 'Seguimiento con la línea de tiempo y el mapa, el PDF, Repetir (pasa a la cesta) y Programar para que se haga solo.', 'Tracking with timeline and map, PDF, Reorder (goes to the cart) and Schedule so it repeats by itself.', 'Suivi avec chronologie et carte, PDF, Recommander et Programmer.', 'Verfolgung mit Zeitleiste und Karte, PDF, Erneut bestellen und Planen.', 'التتبع مع الخط الزمني والخريطة، PDF، التكرار والجدولة.'] },
    { s: 'comandes', sel: ['.hxa-plus'],
      t: ['Reposició, programades i seus', 'Reposición, programados y sedes', 'Restock, scheduled and sites', 'Réassort, programmées et sites', 'Nachschub, geplant und Standorte', 'إعادة التزويد والمجدولة والفروع'],
      x: ['Avisa quan toca reposar un producte, permet aturar les comandes programades i afegir seus per enviar a cada centre.', 'Avisa cuando toca reponer un producto, permite pausar los pedidos programados y añadir sedes para enviar a cada centro.', 'Restock reminders, pause scheduled orders and add sites to ship to each location.', 'Rappels de réassort, pause des commandes programmées et sites de livraison.', 'Nachschub-Hinweise, geplante Bestellungen pausieren, Lieferstandorte hinzufügen.', 'تنبيهات إعادة التزويد وإيقاف الطلبات المجدولة وإضافة الفروع.'] },
    { s: 'factures', sel: ['.hxa-main .hxa-filtres', '.hxa-main .hxa-card'],
      t: ['Factures', 'Facturas', 'Invoices', 'Factures', 'Rechnungen', 'الفواتير'],
      x: ['Separades en Per pagar i Pagades, amb el PDF. Pagar obre el pagament amb targeta en mode de prova: la 4242 4242 4242 4242 s’aprova i la factura queda Cobrada també a l’ERP.', 'Separadas en Por pagar y Pagadas, con su PDF. Pagar abre el pago con tarjeta en modo de prueba: la 4242 4242 4242 4242 se aprueba y la factura queda Cobrada también en el ERP.', 'Split into To pay and Paid, with PDF. Pay opens a test-mode card payment: 4242 4242 4242 4242 is approved and the invoice is marked Paid in the ERP too.', 'À payer / Payées, avec PDF. Payer ouvre un paiement test : la 4242… est acceptée et la facture passe Encaissée dans l’ERP.', 'Offen / Bezahlt, mit PDF. Bezahlen im Testmodus: 4242… wird genehmigt, auch im ERP bezahlt.', 'غير مدفوعة / مدفوعة مع PDF. الدفع التجريبي: البطاقة 4242… تُقبل وتُسجَّل في ERP.'] },
    { s: 'dades', sel: ['#hxaD1'],
      t: ['Les meves dades', 'Mis datos', 'My details', 'Mes données', 'Meine Daten', 'بياناتي'],
      x: ['Les dades de facturació (empresa, CIF, país, idioma dels documents). Amb Editar es canvien i surten a les comandes i factures següents.', 'Los datos de facturación (empresa, CIF, país, idioma de los documentos). Con Editar se cambian y salen en los siguientes pedidos y facturas.', 'Billing details (company, tax ID, country, document language). Edit changes them for future documents.', 'Données de facturation ; Modifier les change pour les prochains documents.', 'Rechnungsdaten; Bearbeiten ändert sie für künftige Dokumente.', 'بيانات الفوترة؛ «تعديل» يغيّرها للمستندات القادمة.'] },
    { s: 'dades', sel: ['#hxaD2'],
      t: ['Seguretat', 'Seguridad', 'Security', 'Sécurité', 'Sicherheit', 'الأمان'],
      x: ['Canviar la contrasenya (demana l’actual) i veure en quants dispositius està oberta la compte, per tancar-la als altres.', 'Cambiar la contraseña (pide la actual) y ver en cuántos dispositivos está abierta la cuenta, para cerrarla en los demás.', 'Change the password (asks for the current one) and see how many devices are logged in, to log out the others.', 'Changer le mot de passe et déconnecter les autres appareils.', 'Passwort ändern und andere Geräte abmelden.', 'تغيير كلمة المرور وتسجيل الخروج من الأجهزة الأخرى.'] },
    { s: 'ajuda', sel: ['#hxaA1'],
      t: ['Ajuda', 'Ayuda', 'Help', 'Aide', 'Hilfe', 'مساعدة'],
      x: ['WhatsApp i correu de contacte, preguntes freqüents i, aquí mateix, el botó per tornar a veure aquest tutorial quan vulguis.', 'WhatsApp y correo de contacto, preguntas frecuentes y, aquí mismo, el botón para volver a ver este tutorial cuando quieras.', 'WhatsApp and email, FAQs and, right here, a button to watch this tutorial again.', 'WhatsApp, e-mail, FAQ et le bouton pour revoir ce tutoriel.', 'WhatsApp, E-Mail, FAQ und hier der Knopf, um das Tutorial erneut zu sehen.', 'واتساب والبريد والأسئلة الشائعة وزر لإعادة هذا الدليل.'] },
    { s: 'inici', sel: [], final: true,
      t: ['Tot a punt, Edu! 🎉', '¡Todo listo, Edu! 🎉', 'All set, Edu! 🎉', 'Tout est prêt, Edu ! 🎉', 'Alles bereit, Edu! 🎉', 'كل شيء جاهز يا إدو! 🎉'],
      x: ['Gràcies per dedicar-nos aquest temps. Gaudeix de la teva àrea de clients: les comandes, les factures i les teves dades, sempre a mà i al teu ritme. Qualsevol cosa que necessitis, som a un missatge de distància.', 'Gracias por dedicarnos este rato. Disfruta de tu área de clientes: tus pedidos, tus facturas y tus datos, siempre a mano y a tu ritmo. Para cualquier cosa que necesites, estamos a un mensaje de distancia.', 'Thanks for taking the time. Enjoy your client area: your orders, invoices and details, always at hand and at your own pace. Whatever you need, we’re just a message away.', 'Merci pour ce moment. Profitez de votre espace client : commandes, factures et données, toujours à portée de main. Besoin de quoi que ce soit ? Nous sommes à un message.', 'Danke für Ihre Zeit. Viel Freude mit Ihrem Kundenbereich: Bestellungen, Rechnungen und Daten, immer griffbereit. Was auch immer Sie brauchen – wir sind nur eine Nachricht entfernt.', 'شكرًا على وقتك. استمتع بمنطقة العملاء: طلباتك وفواتيرك وبياناتك دائمًا في متناولك. لأي شيء تحتاجه، نحن على بُعد رسالة.'] },
  ];

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function tr(a) { return a[LANGS.indexOf(lang())] || a[1]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function guia() { var p = window.HX_PROFILE; return !!(window.HX_USER && p && p.guia); }
  function mobil() { return window.matchMedia('(max-width: 760px)').matches; }

  var pas = 0, capa = null, tmr = null;

  function objectiu(p) {
    for (var i = 0; i < p.sel.length; i++) {
      var el = document.querySelector(p.sel[i]);
      if (!el) continue;
      if (/^#hxa[A-Z]\d$/.test(p.sel[i])) el = el.closest('.hxa-card') || el; // títol → targeta sencera
      var r = el.getBoundingClientRect();
      if (r.width && r.height) return el;
    }
    return null;
  }
  function situar() {
    if (!capa) return;
    var p = PASSOS[pas], el = objectiu(p), luz = capa.querySelector('.hxg-luz'), caixa = capa.querySelector('.hxg-caixa');
    capa.classList.toggle('sense', !el); // sense element: tot el fons enfosquit
    if (!el) { luz.style.display = 'none'; caixa.classList.add('centre'); caixa.style.top = caixa.style.left = ''; return; }
    var r = el.getBoundingClientRect(), m = 6;
    luz.style.display = 'block';
    luz.style.top = r.top - m + 'px'; luz.style.left = r.left - m + 'px';
    luz.style.width = r.width + 2 * m + 'px'; luz.style.height = Math.min(r.height, window.innerHeight) + 2 * m + 'px';
    caixa.classList.remove('centre');
    if (mobil()) { caixa.style.left = ''; caixa.style.top = r.top > window.innerHeight / 2 ? '12px' : ''; caixa.classList.toggle('dalt', r.top > window.innerHeight / 2); return; }
    var cw = caixa.offsetWidth, ch = caixa.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    var top = r.bottom + 14 + ch < vh ? r.bottom + 14 : r.top - 14 - ch >= 0 ? r.top - 14 - ch : Math.max(12, vh - ch - 12);
    var left = Math.min(Math.max(12, r.left), vw - cw - 12);
    if (r.right + 16 + cw < vw && (top === Math.max(12, vh - ch - 12))) { left = r.right + 16; top = Math.min(Math.max(12, r.top), vh - ch - 12); }
    caixa.style.top = top + 'px'; caixa.style.left = left + 'px';
  }
  function mostrar() {
    var p = PASSOS[pas], A = window.hxArea;
    if (p.s) { if (A && A.oberta()) A.ir(p.s); else if (A) A.obrir(p.s); }
    else if (A && A.oberta()) A.tancar();
    var caixa = capa.querySelector('.hxg-caixa');
    caixa.classList.toggle('final', !!p.final);
    caixa.innerHTML = '<p class="hxg-pas">' + esc(tr(UI.pas).replace('{0}', pas + 1).replace('{1}', PASSOS.length)) + '</p>' +
      '<h2 id="hxgT">' + esc(tr(p.t)) + '</h2><p id="hxgX">' + esc(tr(p.x)) + '</p>' +
      '<div class="hxg-botons"><button type="button" class="hxg-saltar" data-g="fi">' + esc(tr(UI.saltar)) + '</button><span>' +
      (pas ? '<button type="button" class="hxg-sec" data-g="ant">' + esc(tr(UI.ant)) + '</button>' : '') +
      '<button type="button" class="hxg-pri" data-g="seg">' + esc(tr(pas === PASSOS.length - 1 ? UI.fi : UI.seg)) + '</button></span></div>';
    // espera que l'àrea pinti les dades i baixa fins a l'element
    setTimeout(function () {
      var el = objectiu(p);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
      situar();
      var b = caixa.querySelector('.hxg-pri'); if (b) b.focus();
    }, p.s ? 450 : 80);
  }
  function tancarGuia() {
    if (!capa) return;
    capa.remove(); capa = null;
    clearInterval(tmr);
    document.removeEventListener('keydown', teclat, true);
    window.removeEventListener('resize', situar);
  }
  function teclat(e) {
    if (!capa) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); tancarGuia(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); anar(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); anar(-1); }
  }
  function anar(d) {
    var n = pas + d;
    if (n >= PASSOS.length) { tancarGuia(); return; }
    if (n < 0) return;
    pas = n; mostrar();
  }
  function iniciar(desDe) {
    if (!guia()) return;
    tancarGuia();
    pas = desDe || 0;
    capa = document.createElement('div');
    capa.id = 'hxGuia';
    capa.innerHTML = '<div class="hxg-bloc"></div><div class="hxg-luz"></div><div class="hxg-caixa" role="dialog" aria-modal="true" aria-labelledby="hxgT" aria-describedby="hxgX"></div>';
    document.body.appendChild(capa);
    capa.addEventListener('click', function (e) {
      var b = e.target.closest('[data-g]');
      if (!b) return;
      var g = b.getAttribute('data-g');
      if (g === 'fi') tancarGuia(); else anar(g === 'seg' ? 1 : -1);
    });
    document.addEventListener('keydown', teclat, true);
    window.addEventListener('resize', situar);
    tmr = setInterval(situar, 400); // les dades de l'àrea arriben després
    mostrar();
  }
  window.hxGuiaClientes = { iniciar: iniciar, disponible: guia };

  // Cada vegada que Edu inicia sessió (no en recarregar la pàgina amb la sessió guardada): comença sola
  function potser() {
    if (!guia() || capa) return;
    if (document.getElementById('hxPerfilWrap') || document.querySelector('#authModal.open')) { setTimeout(potser, 1500); return; }
    iniciar(0);
  }
  function vigilar() {
    var n = 0, t = setInterval(function () {
      if (guia()) { clearInterval(t); setTimeout(potser, 800); } else if (++n > 30) clearInterval(t);
    }, 500);
  }
  function arrencar() {
    var o = window.setLoggedInUser;
    if (typeof o === 'function' && !o._hxGuia) {
      // el 5è argument (skipSave) és true quan només es recupera la sessió guardada
      var w = function (n, a, r, e, nomesRecuperar) { var res = o.apply(this, arguments); if (!nomesRecuperar) vigilar(); return res; };
      w._hxGuia = true; window.setLoggedInUser = w;
    }
    var lo = window.logout;
    if (typeof lo === 'function' && !lo._hxGuia) {
      var w2 = function () { tancarGuia(); return lo.apply(this, arguments); };
      w2._hxGuia = true; window.logout = w2;
    }
  }
  window.hxGuiaClientes.textBoto = function () { return tr(UI.veure); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrencar);
  else arrencar();
})();
