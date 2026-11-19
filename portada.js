/* ============================================================
   HIGIENEX — Portada, menú i ordre de la web (portada.js)
   ============================================================
   · Portada nova: missatge clar sobre la foto, productes destacats,
     solucions per sector, per què HIGIENEX i crida final.
   · Menú de 6 entrades (amb subapartats) i textos en 5 idiomes.
   · Calculadores juntes en una pàgina amb pestanyes.
   · Botiga primer i comparativa plegable a Productes.
   · Llibreries pesades (Excel, PDF, captures) es carreguen després
     de mostrar la pàgina.
   Els textos van a D com [ca, es, en, fr, de].
   ============================================================ */
(function () {
  'use strict';

  var D = {
    heroT: ["Productes d'higiene professional que netegen més amb menys", 'Productos de higiene profesional que limpian más con menos', 'Professional hygiene products that clean more with less', "Des produits d'hygiène professionnelle qui nettoient plus avec moins", 'Profi-Hygieneprodukte, die mit weniger mehr reinigen'],
    heroP: ['Fabriquem a València des de 2015 per a hospitals, hotels, indústria alimentària i oficines. Fórmules concentrades, certificades i amb un 70\u00a0% menys d’envasos.', 'Fabricamos en Valencia desde 2015 para hospitales, hoteles, industria alimentaria y oficinas. Fórmulas concentradas, certificadas y con un 70\u00a0% menos de envases.', 'Made in Valencia since 2015 for hospitals, hotels, the food industry and offices. Concentrated, certified formulas with 70\u00a0% less packaging.', 'Fabriqués à Valence depuis 2015 pour les hôpitaux, les hôtels, l’agroalimentaire et les bureaux. Des formules concentrées, certifiées et avec 70\u00a0% d’emballages en moins.', 'Seit 2015 in Valencia hergestellt – für Kliniken, Hotels, Lebensmittelindustrie und Büros. Konzentrierte, zertifizierte Rezepturen mit 70\u00a0% weniger Verpackung.'],
    verProductes: ['Veure productes', 'Ver productos', 'See products', 'Voir les produits', 'Produkte ansehen'],
    demanarPres: ['Demanar pressupost', 'Pedir presupuesto', 'Request a quote', 'Demander un devis', 'Angebot anfordern'],
    fet1: ['Certificat ISO 14001', 'Certificado ISO 14001', 'ISO 14001 certified', 'Certifié ISO 14001', 'ISO 14001 zertifiziert'],
    fet2: ['19 patents pròpies', '19 patentes propias', '19 own patents', '19 brevets propres', '19 eigene Patente'],
    fet3: ['Descomptes de fins al 15\u00a0%', 'Descuentos de hasta el 15\u00a0%', 'Up to 15\u00a0% volume discount', 'Jusqu’à 15\u00a0% de remise', 'Bis zu 15\u00a0% Mengenrabatt'],
    x3cap: ['Una garrafa HIGIENEX rendeix com tres de convencionals', 'Una garrafa HIGIENEX rinde como tres convencionales', 'One HIGIENEX container goes as far as three standard ones', 'Un bidon HIGIENEX équivaut à trois bidons classiques', 'Ein HIGIENEX-Kanister ersetzt drei herkömmliche'],
    destT: ['Els més demanats', 'Los más pedidos', 'Best sellers', 'Les plus demandés', 'Am häufigsten bestellt'],
    destP: ['Preu per garrafa de 5 L, sense IVA. El descompte per volum s’aplica sol al cistell.', 'Precio por garrafa de 5 L, sin IVA. El descuento por volumen se aplica solo en el carrito.', 'Price per 5 L container, excl. VAT. Volume discounts are applied automatically in the cart.', 'Prix par bidon de 5 L, HT. La remise sur volume s’applique automatiquement au panier.', 'Preis pro 5-L-Kanister, zzgl. MwSt. Mengenrabatte werden im Warenkorb automatisch abgezogen.'],
    veureFitxa: ['Veure la fitxa', 'Ver la ficha', 'View details', 'Voir la fiche', 'Details ansehen'],
    totCataleg: ['Veure tot el catàleg', 'Ver todo el catálogo', 'See the full catalogue', 'Voir tout le catalogue', 'Ganzen Katalog ansehen'],
    garrafa: ['/ garrafa 5 L', '/ garrafa 5 L', '/ 5 L container', '/ bidon 5 L', '/ 5-L-Kanister'],
    sectT: ['Solucions per al teu sector', 'Soluciones para tu sector', 'Solutions for your sector', 'Des solutions pour votre secteur', 'Lösungen für Ihre Branche'],
    s1t: ['Hospitals i sanitat', 'Hospitales y sanidad', 'Hospitals and healthcare', 'Hôpitaux et santé', 'Kliniken und Gesundheitswesen'],
    s1d: ['Desinfecció virucida i bactericida per a quiròfans, UCI i zones crítiques.', 'Desinfección virucida y bactericida para quirófanos, UCI y zonas críticas.', 'Virucidal and bactericidal disinfection for operating rooms, ICUs and critical areas.', 'Désinfection virucide et bactéricide pour blocs opératoires, réanimation et zones critiques.', 'Viruzide und bakterizide Desinfektion für OPs, Intensivstationen und kritische Bereiche.'],
    s2t: ['Hotels i residències', 'Hoteles y residencias', 'Hotels and care homes', 'Hôtels et résidences', 'Hotels und Pflegeheime'],
    s2d: ['Habitacions i banys sense residus visibles i amb aroma neutre.', 'Habitaciones y baños sin residuos visibles y con aroma neutro.', 'Rooms and bathrooms with no visible residue and a neutral scent.', 'Chambres et salles de bain sans résidus visibles, au parfum neutre.', 'Zimmer und Bäder ohne sichtbare Rückstände, mit neutralem Duft.'],
    s3t: ['Indústria alimentària', 'Industria alimentaria', 'Food industry', 'Agroalimentaire', 'Lebensmittelindustrie'],
    s3d: ['Desgreixant industrial compatible amb HACCP i sense aclarit.', 'Desengrasante industrial compatible con APPCC y sin aclarado.', 'HACCP-compatible industrial degreaser, no rinsing needed.', 'Dégraissant industriel compatible HACCP, sans rinçage.', 'HACCP-konformer Industrieentfetter ohne Nachspülen.'],
    s4t: ['Oficines i coworking', 'Oficinas y coworking', 'Offices and coworking', 'Bureaux et coworking', 'Büros und Coworking'],
    s4d: ['Superfícies antimicrobianes i reposició automàtica sense ocupar-te’n.', 'Superficies antimicrobianas y reposición automática sin preocuparte.', 'Antimicrobial surfaces and automatic restocking, hassle-free.', 'Surfaces antimicrobiennes et réassort automatique, sans y penser.', 'Antimikrobielle Oberflächen und automatische Nachlieferung ohne Aufwand.'],
    sVeure: ['Productes per a aquest sector', 'Productos para este sector', 'Products for this sector', 'Produits pour ce secteur', 'Produkte für diese Branche'],
    whyT: ['Per què HIGIENEX', 'Por qué HIGIENEX', 'Why HIGIENEX', 'Pourquoi HIGIENEX', 'Warum HIGIENEX'],
    w1t: ['Menys plàstic, menys camions', 'Menos plástico, menos camiones', 'Less plastic, fewer lorries', 'Moins de plastique, moins de camions', 'Weniger Plastik, weniger Lkw'],
    w1d: ['Com que és concentrat, cada comanda mou un 70\u00a0% menys d’envasos i ocupa menys espai al teu magatzem.', 'Como es concentrado, cada pedido mueve un 70\u00a0% menos de envases y ocupa menos espacio en tu almacén.', 'Because it is concentrated, every order ships 70\u00a0% less packaging and takes up less room in your storeroom.', 'Comme il est concentré, chaque commande transporte 70\u00a0% d’emballages en moins et prend moins de place dans votre réserve.', 'Weil es konzentriert ist, bewegt jede Bestellung 70\u00a0% weniger Verpackung und braucht weniger Platz im Lager.'],
    w2t: ['Certificat i traçable', 'Certificado y trazable', 'Certified and traceable', 'Certifié et traçable', 'Zertifiziert und rückverfolgbar'],
    w2d: ['ISO 14001, registre de biocides i codi QR de lot en cada envàs, amb la seva fitxa de seguretat.', 'ISO 14001, registro de biocidas y código QR de lote en cada envase, con su ficha de seguridad.', 'ISO 14001, biocide registration and a batch QR code on every container, linked to its safety data sheet.', 'ISO 14001, enregistrement biocide et QR code de lot sur chaque bidon, avec sa fiche de sécurité.', 'ISO 14001, Biozid-Registrierung und Chargen-QR-Code auf jedem Gebinde mit Sicherheitsdatenblatt.'],
    w3t: ['Comprar és fàcil', 'Comprar es fácil', 'Easy to order', 'Commander est simple', 'Einfach bestellen'],
    w3d: ['Comanda en línia, justificant al teu correu i comandes que es repeteixen soles cada 1, 2, 4 o 8 setmanes.', 'Pedido en línea, justificante en tu correo y pedidos que se repiten solos cada 1, 2, 4 u 8 semanas.', 'Order online, get the confirmation by email and set orders to repeat every 1, 2, 4 or 8 weeks.', 'Commande en ligne, justificatif par e-mail et commandes qui se répètent toutes les 1, 2, 4 ou 8 semaines.', 'Online bestellen, Bestätigung per E-Mail und Bestellungen, die sich alle 1, 2, 4 oder 8 Wochen wiederholen.'],
    ctaT: ['Necessites un pressupost per al teu centre?', '¿Necesitas un presupuesto para tu centro?', 'Need a quote for your premises?', 'Besoin d’un devis pour votre établissement ?', 'Brauchen Sie ein Angebot für Ihren Betrieb?'],
    ctaP: ['Prepara’l en un minut o demana que un tècnic visiti les teves instal·lacions sense cap cost.', 'Prepáralo en un minuto o pide que un técnico visite tus instalaciones sin coste.', 'Build it in a minute, or ask for a free visit from one of our technicians.', 'Préparez-le en une minute ou demandez la visite gratuite d’un technicien.', 'Erstellen Sie es in einer Minute oder fordern Sie einen kostenlosen Technikerbesuch an.'],
    ferPres: ['Fer un pressupost', 'Hacer un presupuesto', 'Build a quote', 'Faire un devis', 'Angebot erstellen'],
    demanarVisita: ['Demanar una visita', 'Pedir una visita', 'Book a visit', 'Demander une visite', 'Besuch anfragen'],
    // menú
    mInici: ['Inici', 'Inicio', 'Home', 'Accueil', 'Startseite'],
    mProductes: ['Productes', 'Productos', 'Products', 'Produits', 'Produkte'],
    mSafe: ['HIGIENEX SafeStock', 'HIGIENEX SafeStock', 'HIGIENEX SafeStock', 'HIGIENEX SafeStock', 'HIGIENEX SafeStock'],
    mCalc: ['Calculadores', 'Calculadoras', 'Calculators', 'Calculateurs', 'Rechner'],
    mPres: ['Pressupost i cita', 'Presupuesto y cita', 'Quotes and visits', 'Devis et rendez-vous', 'Angebot und Termin'],
    mCita: ['Demanar una cita', 'Pedir una cita', 'Book a visit', 'Prendre rendez-vous', 'Termin vereinbaren'],
    mEmpresa: ['Empresa', 'Empresa', 'Company', 'Entreprise', 'Unternehmen'],
    mOper: ['Operacions i logística', 'Operaciones y logística', 'Operations and logistics', 'Opérations et logistique', 'Betrieb und Logistik'],
    mComp: ['Sostenibilitat i mercat', 'Sostenibilidad y mercado', 'Sustainability and market', 'Durabilité et marché', 'Nachhaltigkeit und Markt'],
    mNews: ['Newsletter', 'Newsletter', 'Newsletter', 'Newsletter', 'Newsletter'],
    mAjuda: ['Ajuda i contacte', 'Ayuda y contacto', 'Help and contact', 'Aide et contact', 'Hilfe und Kontakt'],
    // calculadores
    calcT: ['Calculadores', 'Calculadoras', 'Calculators', 'Calculateurs', 'Rechner'],
    calcP: ['Calcula dosis, costos i impacte abans de comprar', 'Calcula dosis, costes e impacto antes de comprar', 'Work out doses, costs and impact before you buy', 'Calculez doses, coûts et impact avant d’acheter', 'Dosierung, Kosten und Wirkung vor dem Kauf berechnen'],
    tab1: ['Dosi i cost per ús', 'Dosis y coste por uso', 'Dose and cost per use', 'Dose et coût par usage', 'Dosierung und Kosten pro Anwendung'],
    tab2: ['Comparador', 'Comparador', 'Comparison', 'Comparateur', 'Vergleich'],
    tab3: ['Comandes recurrents', 'Pedidos recurrentes', 'Recurring orders', 'Commandes récurrentes', 'Wiederkehrende Bestellungen'],
    tab4: ['Impacte ambiental', 'Impacto ambiental', 'Environmental impact', 'Impact environnemental', 'Umweltwirkung'],
    // productes
    compara: ['Comparar els productes per sector i certificació', 'Comparar los productos por sector y certificación', 'Compare products by sector and certification', 'Comparer les produits par secteur et certification', 'Produkte nach Branche und Zertifizierung vergleichen'],
    // peu
    whatsapp: ['Escriu-nos per WhatsApp', 'Escríbenos por WhatsApp', 'Message us on WhatsApp', 'Écrivez-nous sur WhatsApp', 'Schreiben Sie uns per WhatsApp'],
    intern: ['Accés intern', 'Acceso interno', 'Staff access', 'Accès interne', 'Mitarbeiterzugang'],
  };
  var IDX = { ca: 0, es: 1, en: 2, fr: 3, de: 4 };
  function lang() {
    var l = 'ca';
    try { l = localStorage.getItem('hx_lang') || 'ca'; } catch (e) { /* sense emmagatzematge */ }
    if (l === 'ar') l = 'en';
    return l in IDX ? l : 'ca';
  }
  function t(k) { var e = D[k]; return e ? e[IDX[lang()]] || e[0] : k; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pintarTextos() {
    document.querySelectorAll('[data-hxm]').forEach(function (el) { el.textContent = t(el.getAttribute('data-hxm')); });
    // Les etiquetes de secció portaven una numeració (04 / ...) que no coincidia amb el menú.
    document.querySelectorAll('.section-tag').forEach(function (el) {
      var s = el.textContent, n = s.replace(/^\s*\d+\s*\/\s*/, '');
      if (n !== s) el.textContent = n;
    });
  }

  /* ---------- Portada ---------- */
  var DEST = [
    { nom: 'ECO Concentrat Pro', img: 'img/prod-eco-concentrat-pro.webp', preu: 12.5, sector: 's1t' },
    { nom: 'Desinfectant HOSP-V', img: 'img/prod-desinfectant-hosp-v.webp', preu: 18, sector: 's1t' },
    { nom: 'Net HOSTAL Premium', img: 'img/prod-net-hostal-premium.webp', preu: 11.2, sector: 's2t' },
  ];
  var SECTORS = [
    { k: 's1', cat: 'Hospitals' }, { k: 's2', cat: 'Hotels' }, { k: 's3', cat: 'Alimentacio' }, { k: 's4', cat: 'Oficines' },
  ];
  function preuDe(nom, defecte) {
    // Agafa el preu de la llista de productes de la web si existeix (així no queda desfasat).
    try {
      var llista = window.PRODUCTS || [];
      for (var i = 0; i < llista.length; i++) if (llista[i].name === nom && llista[i].price) return +llista[i].price;
    } catch (e) { /* sense llista */ }
    return defecte;
  }
  function eur(n) {
    var loc = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE' }[lang()];
    return Number(n).toLocaleString(loc, { style: 'currency', currency: 'EUR' });
  }
  function portadaHTML() {
    var cards = DEST.map(function (p) {
      var preu = preuDe(p.nom, p.preu);
      return '<article class="hxh-prod">' +
        '<button type="button" class="hxh-prod-img" data-fitxa="' + esc(p.nom) + '" aria-label="' + esc(p.nom) + '"><img src="' + p.img + '" alt="" loading="lazy" width="160" height="160"></button>' +
        '<div class="hxh-prod-body"><span class="hxh-prod-sector" data-hxm="' + p.sector + '"></span>' +
        '<h3>' + esc(p.nom) + '</h3>' +
        (preu ? '<p class="hxh-prod-preu"><b>' + eur(preu) + '</b> <span data-hxm="garrafa"></span></p>' : '') +
        '<button type="button" class="hxh-link" data-fitxa="' + esc(p.nom) + '" data-hxm="veureFitxa"></button></div></article>';
    }).join('');
    var sectors = SECTORS.map(function (s) {
      return '<button type="button" class="hxh-sector" data-cat="' + s.cat + '"><span class="hxh-sector-t" data-hxm="' + s.k + 't"></span>' +
        '<span class="hxh-sector-d" data-hxm="' + s.k + 'd"></span><span class="hxh-sector-l" data-hxm="sVeure"></span></button>';
    }).join('');
    return '' +
      '<div class="hxh-wrap">' +
      '<section class="hxh-block" aria-labelledby="hxhDest"><div class="hxh-head"><h2 id="hxhDest" data-hxm="destT"></h2><p data-hxm="destP"></p></div>' +
      '<div class="hxh-prods">' + cards + '</div>' +
      '<p class="hxh-more"><button type="button" class="hxh-btn hxh-btn-line" data-nav="productes" data-hxm="totCataleg"></button></p></section>' +
      '<section class="hxh-block" aria-labelledby="hxhSect"><div class="hxh-head"><h2 id="hxhSect" data-hxm="sectT"></h2></div>' +
      '<div class="hxh-sectors">' + sectors + '</div></section>' +
      '<section class="hxh-block" aria-labelledby="hxhWhy"><div class="hxh-head"><h2 id="hxhWhy" data-hxm="whyT"></h2></div>' +
      '<div class="hxh-why">' +
      '<div><h3 data-hxm="w1t"></h3><p data-hxm="w1d"></p></div>' +
      '<div><h3 data-hxm="w2t"></h3><p data-hxm="w2d"></p></div>' +
      '<div><h3 data-hxm="w3t"></h3><p data-hxm="w3d"></p></div></div></section>' +
      '</div>' +
      '<section class="hxh-cta" aria-labelledby="hxhCta"><div class="hxh-cta-in"><div><h2 id="hxhCta" data-hxm="ctaT"></h2><p data-hxm="ctaP"></p></div>' +
      '<div class="hxh-btns"><button type="button" class="hxh-btn hxh-btn-gold" data-nav="pressupost" data-hxm="ferPres"></button>' +
      '<button type="button" class="hxh-btn hxh-btn-ghost" data-nav="cita" data-hxm="demanarVisita"></button></div></div></section>';
  }
  function heroHTML() {
    return '<div class="hxh-hero-in">' +
      '<h1 class="hxh-hero-t" data-hxm="heroT"></h1>' +
      '<p class="hxh-hero-p" data-hxm="heroP"></p>' +
      '<div class="hxh-btns"><button type="button" class="hxh-btn hxh-btn-gold" data-nav="productes" data-hxm="verProductes"></button>' +
      '<button type="button" class="hxh-btn hxh-btn-ghost" data-nav="pressupost" data-hxm="demanarPres"></button></div>' +
      '<ul class="hxh-facts"><li data-hxm="fet1"></li><li data-hxm="fet2"></li><li data-hxm="fet3"></li></ul>' +
      '</div>' +
      // El concentrat ×3: cau una gota i el número s'omple com una garrafa (un sol moment animat).
      '<figure class="hxh-x3"><div class="hxh-x3-stage" aria-hidden="true"><span class="hxh-drop"></span>' +
      '<span class="hxh-x3-num" data-x="\u00d73">\u00d73</span></div>' +
      '<figcaption data-hxm="x3cap"></figcaption></figure>';
  }
  function muntarPortada() {
    var hero = document.getElementById('heroLogoWrap');
    if (hero) hero.outerHTML = '<div id="hxHero">' + heroHTML() + '</div>';
    var home = document.getElementById('home');
    if (home) { home.innerHTML = portadaHTML(); home.classList.add('hxh-home'); }
  }

  /* ---------- Menú ---------- */
  function muntarMenu() {
    var inner = document.querySelector('#navDropdown .dd-inner');
    if (!inner) return;
    var client = document.getElementById('navClientDditem');
    var items = [
      ['home', 'mInici'],
      ['productes', 'mProductes', [['safestock', 'mSafe']]],
      ['calculadores', 'mCalc'],
      ['pressupost', 'mPres', [['cita', 'mCita']]],
      ['empresa', 'mEmpresa', [['operacions', 'mOper'], ['compromis', 'mComp'], ['newsletter', 'mNews']]],
      ['contacte', 'mAjuda'],
    ];
    var html = items.map(function (it) {
      var sub = (it[2] || []).map(function (s) { return '<a class="dditem dd-sub" data-nav="' + s[0] + '" href="?seccio=' + s[0] + '"><span data-hxm="' + s[1] + '"></span></a>'; }).join('');
      return '<a class="dditem" data-nav="' + it[0] + '" href="?seccio=' + it[0] + '"><span data-hxm="' + it[1] + '"></span></a>' + sub;
    }).join('');
    inner.innerHTML = html;
    if (client) { client.classList.add('dd-client'); inner.appendChild(client); }
  }

  /* ---------- Calculadores amb pestanyes ---------- */
  var CALCS = [['calculadora', 'tab1'], ['comparador', 'tab2'], ['simulador-recurrent', 'tab3'], ['calc-eco', 'tab4']];
  function muntarCalculadores() {
    var ref = document.getElementById('g-productes');
    if (!ref || document.getElementById('g-calculadores')) return;
    var g = document.createElement('div');
    g.className = 'hg-page'; g.id = 'g-calculadores';
    g.innerHTML = '<div class="cat-banner"><div class="cat-banner-inner"><div><h2 data-hxm="calcT"></h2><p data-hxm="calcP"></p></div></div></div>' +
      '<div class="hxc-tabs" role="tablist">' + CALCS.map(function (c, i) {
        return '<button type="button" role="tab" class="hxc-tab" data-calc="' + c[0] + '" aria-selected="' + (i ? 'false' : 'true') + '" data-hxm="' + c[1] + '"></button>';
      }).join('') + '</div>';
    CALCS.forEach(function (c) { var s = document.getElementById(c[0]); if (s) g.appendChild(s); });
    ref.parentNode.insertBefore(g, ref.nextSibling);
    mostrarCalc('calculadora');
  }
  function mostrarCalc(id) {
    CALCS.forEach(function (c) {
      var s = document.getElementById(c[0]); if (s) s.hidden = c[0] !== id;
      var b = document.querySelector('.hxc-tab[data-calc="' + c[0] + '"]'); if (b) b.setAttribute('aria-selected', c[0] === id ? 'true' : 'false');
    });
  }

  /* ---------- Productes: botiga primer, comparativa plegable ---------- */
  function ordenarProductes() {
    var taula = document.querySelector('#productes .products-table-wrap');
    var grid = document.getElementById('pedidosGrid');
    if (!taula || !grid || taula.closest('details')) return;
    var det = document.createElement('details');
    det.className = 'hxp-compara';
    det.innerHTML = '<summary data-hxm="compara"></summary>';
    taula.parentNode.removeChild(taula);
    det.appendChild(taula);
    grid.parentNode.insertBefore(det, grid.nextSibling);
    // Taula en targetes al mòbil: cada cel·la porta el nom de la seva columna.
    var heads = [].map.call(taula.querySelectorAll('thead th'), function (th) { return th; });
    taula.querySelectorAll('tbody tr').forEach(function (tr) {
      [].forEach.call(tr.children, function (td, i) { if (heads[i]) td.setAttribute('data-col', heads[i].textContent.trim()); });
    });
  }

  /* ---------- Peu ---------- */
  function arreglarPeu() {
    // El mateix telèfon sortia dues vegades: el segon passa a ser WhatsApp.
    var tels = document.querySelectorAll('footer a[href="tel:631706398"]');
    if (tels.length > 1) {
      var a = tels[1];
      a.href = 'https://wa.me/34631706398?text=Hola%20HIGIENEX';
      a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<span data-hxm="whatsapp"></span>';
    }
    // L'accés al panell intern passa de la capçalera al peu.
    var barra = document.querySelector('.footer-bottom-bar');
    if (barra && !document.getElementById('hxIntern')) {
      var p = document.createElement('p');
      p.className = 'hx-intern';
      p.innerHTML = '<a id="hxIntern" href="https://higienexweb2.ossama450298.workers.dev/erp/" target="_blank" rel="noopener" data-hxm="intern"></a>';
      barra.appendChild(p);
    }
  }

  /* ---------- Navegació ---------- */
  function enllacos(e) {
    var el = e.target.closest('[data-nav],[data-fitxa],.hxh-sector,.hxc-tab');
    if (!el) return;
    if (el.classList.contains('hxc-tab')) { mostrarCalc(el.getAttribute('data-calc')); return; }
    e.preventDefault();
    if (el.hasAttribute('data-fitxa')) {
      var nom = el.getAttribute('data-fitxa');
      if (typeof window.obrirFitxaProducte === 'function') window.obrirFitxaProducte(nom);
      else if (typeof window.openProductPopup === 'function') window.openProductPopup(nom);
      return;
    }
    if (el.classList.contains('hxh-sector')) {
      window.navTo('productes');
      var cat = el.getAttribute('data-cat');
      setTimeout(function () {
        if (typeof window.filterByCategory === 'function') window.filterByCategory(cat);
        var g = document.getElementById('categoryFilters'); if (g) g.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -90);
      }, 150);
      return;
    }
    window.navTo(el.getAttribute('data-nav'));
  }
  function envoltarNavTo() {
    var orig = window.navTo;
    if (typeof orig !== 'function' || orig._hxPortada) return;
    var calcIds = CALCS.map(function (c) { return c[0]; });
    var nou = function (id) {
      if (id === 'calculadores' || calcIds.indexOf(id) !== -1) {
        orig('calculadores');
        mostrarCalc(id === 'calculadores' ? 'calculadora' : id);
        try { history.replaceState(history.state, '', location.pathname + '?seccio=' + id); } catch (e) { /* sense historial */ }
        return;
      }
      orig(id);
    };
    nou._hxPortada = true;
    window.navTo = nou;
  }

  /* ---------- Llibreries pesades: després de mostrar la pàgina ---------- */
  function carregar(src) {
    return new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
  }
  function carregarDiferit() {
    carregar('jspdf.umd.min.js')
      .then(function () { return carregar('jspdf.plugin.autotable.min.js'); })
      .then(function () { return carregar('html2canvas.min.js'); })
      .then(function () { return carregar('vendor/xlsx.full.min.js'); })
      .catch(function (e) { console.warn('Llibreria no carregada:', e); });
  }

  function iniciar() {
    muntarPortada();
    muntarMenu();
    muntarCalculadores();
    ordenarProductes();
    arreglarPeu();
    envoltarNavTo();
    pintarTextos();
    document.addEventListener('click', enllacos);
    // La finestra emergent de la newsletter tapava la pàgina: el formulari ja és a la secció.
    window.hxMaybeShowNewsletterPopup = function () {};
    // Quan canvia l'idioma, es tornen a posar els textos.
    var origApply = window.hxApplyLang;
    if (typeof origApply === 'function') {
      window.hxApplyLang = function () { var r = origApply.apply(this, arguments); pintarTextos(); return r; };
    }
    if (document.readyState === 'complete') setTimeout(carregarDiferit, 300);
    else window.addEventListener('load', function () { setTimeout(carregarDiferit, 300); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  window.HXPortada = { textos: pintarTextos, calc: mostrarCalc };
})();
