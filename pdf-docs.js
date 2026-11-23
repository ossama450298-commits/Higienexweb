/* ==========================================================================
   HIGIENEX · documents PDF de la web amb la plantilla comuna (pdf-kit.js)
   Cada funció substitueix la versió antiga; si la plantilla no ha carregat,
   la web continua fent servir la versió antiga com a alternativa.
   ========================================================================== */
(function () {
  'use strict';
  /* Traducció a l'idioma de la web (pdf-i18n.js) */
  var T = function () { return window.HXT ? window.HXT.apply(null, arguments) : arguments[0]; };
  /* Dades d'un producte traduïdes (sector, ús, concentració…) */
  function cT(v) { return v ? T(v) : v; }
  var NOTA_FDS =
    T("Document generat automàticament des de la web d'HIGIENEX. Aquesta FDS és una versió simplificada amb finalitat informativa i de projecte acadèmic; no substitueix la Fitxa de Dades de Seguretat oficial reglamentària (Reglament REACH 1907/2006, Annex II), disponible sota petició al departament tècnic.");

  function fitxer(t) {
    return String(t)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  }
  function infoProducte(nom) {
    var cmp = (typeof CMP_DATA !== 'undefined' && CMP_DATA[nom]) || {};
    var pi = (typeof PRODUCT_INFO !== 'undefined' && PRODUCT_INFO[nom]) || {};
    var desc = (typeof hxProdDesc === 'function' && hxProdDesc(nom)) || pi.desc || cmp.us || '';
    var tc = {};
    Object.keys(cmp).forEach(function (k) { tc[k] = typeof cmp[k] === 'string' && k !== 'price' && k !== 'emoji' ? cT(cmp[k]) : cmp[k]; });
    return { cmp: tc, pi: pi, desc: desc, preu: cmp.price || pi.price || '—' };
  }

  /* Adreça que obre la fitxa del producte (la llegeix el codi QR) */
  function urlProducte(nom, doc) {
    return 'https://ossama450298-commits.github.io/Higienexweb/?producte=' + encodeURIComponent(nom) + '&doc=' + doc;
  }

  /* ---------- Fitxa tècnica ---------- */
  function fitxaTecnica(nom) {
    var p = infoProducte(nom), c = p.cmp;
    var k = HXPDF.nou({ kicker: T('Fitxa tècnica de producte'), titol: nom, titolCurt: T('Fitxa tècnica'), num: 'Ref. ' + nom.split(' ')[0].toUpperCase() + '-' + (nom.length * 37 % 900 + 100) });
    k.franja([
      [T('Preu de referència'), p.preu, true],
      [T('Sector'), c.sector || T('Professional')],
      [T('Concentració'), c.concentracio || '—'],
      [T('Certificació'), c.certificacio || '—'],
    ]);
    k.seccio(T('Descripció del producte'), 1);
    k.paragraf(p.desc || '—', { mida: 9.8 });
    k.seccio(T('Dades del producte'), 2);
    k.parells([
      [T('Nom comercial'), nom],
      [T('Ús recomanat'), c.us || '—'],
      [T('Sector'), c.sector || '—'],
      [T('Concentració / dilució'), c.concentracio || '—'],
      [T('Biodegradabilitat'), c.biodegradable || '—'],
      [T('Envàs'), c.envas || '—'],
      [T('Fabricant'), 'HIGIENEX S.L. · Carrer de la Indústria, 25, 46010 València'],
    ]);
    k.seccio(T("Mode d'ús recomanat"), 3);
    k.llista([
      T('Diluir segons la superfície a tractar i el nivell de brutícia.'),
      T('Aplicar amb polvoritzador, mopa o baieta de microfibra.'),
      T("Deixar actuar el temps de contacte indicat a l'etiqueta i aclarir si escau."),
      T("Ventilar l'espai durant l'aplicació."),
    ]);
    k.seccio(T('Precaucions i emmagatzematge'), 4);
    k.llista([
      T("Mantenir fora de l'abast dels infants."),
      T('Emmagatzemar en lloc fresc i sec, protegit de la llum directa (entre 5 i 30 °C).'),
      T('No barrejar amb altres productes químics, especialment lleixius o àcids.'),
      T('Usar guants per manipular el producte concentrat.'),
    ]);
    k.qr(urlProducte(nom, 'fitxa'), T('Fitxa i FDS sempre al mòbil'), T("Escaneja aquest codi amb la càmera del mòbil: s'obre la fitxa del producte amb la FDS, en l'idioma del teu telèfon. Enganxa'l al magatzem o al carro de neteja."));
    k.tancar('Fitxa_tecnica_' + fitxer(nom) + '.pdf', T("Aquesta fitxa és orientativa. Per a la Fitxa de Dades de Seguretat (FDS) oficial reglamentària, contacta amb l'equip tècnic."));
  }

  /* ---------- Fitxa de dades de seguretat (FDS) ---------- */
  function fds(nom) {
    var p = infoProducte(nom), info = p.cmp;
    var k = HXPDF.nou({ kicker: T('Fitxa de dades de seguretat'), titol: T('Fitxa de seguretat'), titolCurt: T('FDS'), num: nom });
    k.franja([
      [T('Producte'), nom, true],
      [T('Versió'), T('1.0 (simplificada)')],
      [T('Reglament'), 'CE 1907/2006 · CLP'],
      [T('Urgències 24 h'), '631 706 398'],
    ]);
    var s = [
      [T('Identificació de la substància i de la societat'), null, [
        [T('Nom del producte'), nom],
        [T('Ús recomanat'), info.us || p.desc || '—'],
        [T('Fabricant'), 'HIGIENEX S.L. · Carrer de la Indústria, 25, 46010 València'],
        [T('Contacte'), 'contacto@higienexvalencia.es'],
        [T("Telèfon d'emergència"), T('631 706 398 (horari laboral i urgències 24/7)')],
      ]],
      [T('Identificació de perills'), T('Classificació segons el Reglament (CE) 1272/2008 (CLP).') + ' ' + (info.certificacio ? T('Certificació: {0}.', info.certificacio) + ' ' : '') + T('Pot causar irritació ocular i cutània lleu en contacte perllongat. No ingerir. Evitar el contacte amb els ulls.')],
      [T('Composició / informació sobre els components'), T('Tensioactius aniònics i no iònics (5-15 %), agents desinfectants segons la variant, aigua i conservants. Formulació pròpia HIGIENEX registrada. Composició exacta disponible sota petició per a auditories.')],
      [T('Primers auxilis'), T('**Contacte amb els ulls:** rentar abundantment amb aigua durant 15 minuts, mantenint les parpelles obertes. **Contacte amb la pell:** rentar amb aigua i sabó. **Ingestió:** no provocar el vòmit, beure aigua i contactar amb el Servei d\'Informació Toxicològica (915 620 420). **Inhalació:** traslladar a l\'aire lliure.')],
      [T('Mesures de lluita contra incendis'), T("Producte no inflamable. En cas d'incendi de l'entorn, usar agents extintors adequats (CO2, pols seca, escuma). No es preveuen productes de descomposició perillosos en condicions normals d'ús.")],
      [T("Mesures en cas d'abocament accidental"), T("Absorbir amb material inert (sorra, terra de diatomees). Recollir en un recipient tancat per a la seva eliminació. Esbandir la zona amb aigua. Evitar l'abocament a la xarxa de clavegueram sense diluir.")],
      [T('Manipulació i emmagatzematge'), T('Emmagatzemar en lloc fresc, sec i ben ventilat, protegit de la llum directa, entre 5 °C i 30 °C. Mantenir el recipient ben tancat. No barrejar amb altres productes químics, especialment lleixius o àcids.')],
      [T("Controls d'exposició / protecció individual"), T("Ús recomanat de guants de nitril per a la manipulació del concentrat. Ventilar l'espai durant l'aplicació. No cal protecció respiratòria en ús normal diluït.")],
      [T('Propietats fisicoquímiques'), null, [
        [T('Estat físic'), T('Líquid')],
        [T('pH (concentrat)'), T('6,5 - 8,5 aprox.')],
        [T('Solubilitat en aigua'), T('Total')],
        [T('Concentració'), info.concentracio || '—'],
      ]],
      [T('Estabilitat i reactivitat'), T('Estable en les condicions recomanades de manipulació i emmagatzematge. Evitar temperatures extremes i el contacte amb oxidants forts.')],
      [T('Informació toxicològica'), T("No es coneixen efectes greus en les condicions d'ús previstes. Consultar la secció 4 en cas d'exposició accidental.")],
      [T('Informació ecològica'), (info.biodegradable ? T('Biodegradabilitat: {0}.', info.biodegradable) + ' ' : '') + T("Formulació dissenyada per minimitzar l'impacte en ecosistemes aquàtics.")],
      [T("Consideracions sobre l'eliminació"), T("Eliminar el contingut i l'envàs segons la normativa local. Els envasos buits i esbandits es poden reciclar.")],
      [T('Informació relativa al transport'), T('No classificat com a mercaderia perillosa per al transport (ADR/RID).')],
      [T('Informació reglamentària'), T('Producte fabricat de conformitat amb la normativa europea de detergents (Reglament (CE) 648/2004) i, si escau, el Reglament de biocides (UE) 528/2012.') + ' ' + (info.certificacio ? T('Certificacions: {0}.', info.certificacio) : '')],
      [T('Altra informació'), T("Revisió del {0}. Document preparat pel departament tècnic d'HIGIENEX.", HXPDF.dd())],
    ];
    s.forEach(function (x, i) {
      k.seccio(x[0], i + 1);
      if (x[2]) k.parells(x[2]);
      else k.paragraf(x[1]);
    });
    k.qr(urlProducte(nom, 'fds'), T('FDS sempre al mòbil'), T("Escaneja aquest codi per obrir la FDS actualitzada en l'idioma del teu telèfon. Útil en cas d'inspecció o d'accident."));
    k.tancar('FDS_' + fitxer(nom) + '.pdf', NOTA_FDS);
  }

  /* ---------- Catàleg ---------- */
  function cataleg() {
    var noms = Object.keys(CMP_DATA);
    var sectors = {};
    noms.forEach(function (n) { sectors[CMP_DATA[n].sector] = 1; });
    var k = HXPDF.nou({ kicker: T('Catàleg de productes'), titol: T('Catàleg {0}', new Date().getFullYear()), titolCurt: T('Catàleg'), num: T('Higiene professional sostenible') });
    k.franja([
      [T('Productes'), T('{0} referències', noms.length), true],
      [T('Sectors'), T('{0} sectors', Object.keys(sectors).length)],
      [T('Web'), 'higienexvalencia.es'],
      [T('Telèfon'), '631 706 398'],
    ]);
    k.taula({
      head: [T('Producte'), T('Sector'), T('Dilució'), T('Certificació'), T('Preu')],
      body: noms.map(function (n) {
        var c = CMP_DATA[n];
        return [n + '\n' + cT(c.us || ''), cT(c.sector || ''), cT(c.concentracio || ''), cT(c.certificacio || ''), c.price || ''];
      }),
      columnStyles: { 0: { cellWidth: 170 }, 1: { cellWidth: 92 }, 2: { cellWidth: 74 }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 70, halign: 'right', fontStyle: 'bold', textColor: HXPDF.C.NAVY } },
      willDrawCell: function (d) { if (d.section === 'body' && d.column.index === 0) { d.cell._t = String(d.cell.raw).split('\n'); d.cell.text = []; } },
      didDrawCell: function (d) {
        if (d.section === 'body' && d.column.index === 0 && d.cell._t) {
          var doc = k.doc, x = d.cell.x + 10, y = d.cell.y + d.cell.height / 2;
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); k.color(HXPDF.C.INK); doc.text(HXPDF.net(d.cell._t[0]), x, y - 2);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.6); k.color(HXPDF.C.MUTED); doc.text(doc.splitTextToSize(HXPDF.net(d.cell._t[1] || ''), d.cell.width - 20)[0], x, y + 9);
        }
      },
      didParseCell: function (d) { if (d.section === 'body' && d.column.index === 0) d.cell.styles.minCellHeight = 36; },
    });
    k.seccio(T('Per què HIGIENEX'));
    k.llista([
      T('Concentrats que redueixen fins a un 70 % els envasos de plàstic.'),
      T('Desinfectants registrats com a biocides a la UE i productes homologats HACCP.'),
      T('Descomptes automàtics per volum i transport de 5 € per comanda.'),
      T('Fitxes tècniques i de seguretat descarregables des de la web.'),
    ]);
    k.avis(T('Vols un pressupost a mida?'), T('Fes-lo a la web en un minut (secció Pressupost) o escriu-nos a contacto@higienexvalencia.es.'));
    k.tancar('Cataleg_HIGIENEX.pdf', T("Preus orientatius sense IVA, subjectes a confirmació per part de l'equip comercial."));
  }

  /* ---------- Certificacions ---------- */
  function certificacions() {
    var certs = [
      ['ISO 14001', T('Gestió ambiental'), T('Sistema de gestió ambiental certificat per una entitat independent. Vigent des de 2022.')],
      [T('Registre de biocides UE'), T('TP2 i TP4'), T('Desinfectants TP2 (superfícies) i TP4 (contacte alimentari) registrats segons el Reglament de biocides (UE) 528/2012.')],
      [T('Homologació HACCP'), T('Línia ALIM'), T("Productes de la línia ALIM homologats per a l'ús en superfícies de contacte alimentari.")],
      [T('19 patents pròpies'), T('R+D'), T("Formulacions desenvolupades i patentades pel laboratori R+D d'HIGIENEX des de 2018.")],
    ];
    var k = HXPDF.nou({ kicker: T('Document de certificacions'), titol: T('Certificacions'), num: T('Resum per a compres i qualitat') });
    k.franja([
      [T('Certificacions'), T('4 vigents'), true],
      [T('Entitats'), T('Independents')],
      [T('Ref. empresa'), 'CIF B12345678'],
      [T('Validesa'), T('Revisió anual')],
    ]);
    k.paragraf(T("Aquest document resumeix les certificacions i garanties d'HIGIENEX perquè el pugueu compartir amb el vostre departament de compres o de qualitat. Tots els certificats complets estan disponibles sota petició."), { mida: 9.8, despres: 14 });
    var doc = k.doc, C = HXPDF.C, gap = 14, cw = (k.W - 2 * k.M - gap) / 2, ch = 92;
    certs.forEach(function (c, i) {
      var x = k.M + (i % 2) * (cw + gap), y = k.y + Math.floor(i / 2) * (ch + gap);
      k.stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, cw, ch, 6, 6, 'FD');
      k.fill(C.NAVY); doc.circle(x + 26, y + 28, 12, 'F');
      doc.setDrawColor(255, 255, 255); doc.setLineWidth(1.6); doc.lines([[4, 4], [8, -8]], x + 20, y + 28);
      k.kicker(c[1], x + 48, y + 22, C.GOLD_D);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11.5); k.color(C.INK); doc.text(HXPDF.net(c[0]), x + 48, y + 36);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); k.color(C.TXT); doc.text(doc.splitTextToSize(HXPDF.net(c[2]), cw - 32), x + 16, y + 62);
    });
    k.y += 2 * ch + gap + 26;
    k.seccio(T('Declaració'));
    k.paragraf(T("HIGIENEX S.L. declara que la informació d'aquest document és correcta a la data d'emissió i que manté vigents les certificacions indicades."), { despres: 30 });
    k.cal(60);
    k.stroke(C.INK); doc.setLineWidth(0.6); doc.line(k.M, k.y + 30, k.M + 180, k.y + 30);
    doc.setFont('times', 'italic'); doc.setFontSize(16); k.color(C.NAVY); doc.text(T('Direcció Tècnica'), k.M + 6, k.y + 24);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); k.color(C.MUTED); doc.text(T('Departament de qualitat · HIGIENEX S.L.'), k.M, k.y + 42);
    k.y += 64;
    k.tancar('Certificacions_HIGIENEX.pdf', T('Certificats complets disponibles sota petició al departament tècnic.'));
  }

  /* ---------- Portal: extracte de compte ---------- */
  function extracte() {
    var fac = CP_DB.facturas.slice().sort(function (a, b) { return a.fecha.localeCompare(b.fecha); });
    var c = CP_DB.cliente;
    if (!fac.length) { alert(cpT('t827')); return; }
    var tot = fac.reduce(function (s, f) { return s + f.total; }, 0);
    var pagat = fac.filter(function (f) { return cpEstatFactura(f) === 'pagada'; }).reduce(function (s, f) { return s + f.total; }, 0);
    var pend = tot - pagat, C = HXPDF.C;
    var k = HXPDF.nou({ kicker: cpT('t828'), titol: cpT('t828'), num: CP_FD(fac[0].fecha) + ' - ' + CP_FD(fac[fac.length - 1].fecha) });
    k.caixes([
      { titol: cpT('t786'), linies: [c.nom, 'NIF: ' + (c.nif || '—'), c.dir, c.pob, c.mail] },
      { titol: cpT('t787'), linies: ['HIGIENEX S.L.', 'CIF: B12345678', 'Carrer de la Indústria, 25 · 46010 València', 'contacto@higienexvalencia.es'] },
    ]);
    k.xifres([
      [CP_EUR(tot), cpT('t829'), C.NAVY],
      [CP_EUR(pagat), cpT('t830'), C.OK],
      [CP_EUR(pend), cpT('t831'), pend > 0 ? C.WARN : C.OK],
      [String(fac.length), cpT('t832'), C.INK],
    ]);
    var estats = fac.map(cpEstatFactura);
    k.taula({
      head: [cpT('t833'), cpT('t834'), cpT('t835'), cpT('t791'), cpT('t836')],
      body: fac.map(function (f, i) { return [f.num, CP_FD(f.fecha), CP_FD(f.venc), CP_EUR(f.total), cpEstatLabel(estats[i])]; }),
      columnStyles: { 0: { fontStyle: 'bold' }, 1: { cellWidth: 72 }, 2: { cellWidth: 72 }, 3: { cellWidth: 84, halign: 'right', fontStyle: 'bold', textColor: C.NAVY }, 4: { cellWidth: 84 } },
      willDrawCell: function (d) { if (d.section === 'body' && d.column.index === 4) { d.cell._e = estats[d.row.index]; d.cell.text = []; } },
      didDrawCell: function (d) {
        if (d.section === 'body' && d.column.index === 4) {
          var e = d.cell._e, fg = e === 'pagada' ? C.OK : e === 'vencida' ? C.BAD : C.WARN, bg = e === 'pagada' ? C.OK_BG : e === 'vencida' ? C.BAD_BG : C.WARN_BG;
          k.pindola(cpEstatLabel(e), d.cell.x + 8, d.cell.y + d.cell.height / 2 - 7.5, fg, bg);
        }
      },
    });
    k.totals([[cpT('t829'), CP_EUR(tot)], [cpT('t830'), CP_EUR(pagat), C.OK]], cpT('t831'), CP_EUR(pend));
    k.tancar(hxNomPdf('extracte'), 'HIGIENEX S.L. · ' + cpT('t838'));
  }

  /* ---------- Portal: factura ---------- */
  function factura(num) {
    var f = CP_DB.facturas.find(function (x) { return x.num === num; });
    if (!f) return;
    var c = CP_DB.cliente, e = cpEstatFactura(f), C = HXPDF.C;
    var k = HXPDF.nou({ kicker: 'Factura', titol: cpT('t795'), num: num, data: CP_FD(f.fecha) });
    var fg = e === 'pagada' ? C.OK : e === 'vencida' ? C.BAD : C.WARN, bg = e === 'pagada' ? C.OK_BG : e === 'vencida' ? C.BAD_BG : C.WARN_BG;
    k.franja([
      [cpT('t799'), CP_FD(f.fecha)],
      [cpT('t800'), CP_FD(f.venc)],
      [cpT('t801'), cpT('t802')],
      [cpT('t794'), CP_EUR(f.total), true],
    ]);
    k.pindola(cpEstatLabel(e), k.W - k.M, k.y - 12, fg, bg, 'right');
    k.y += 10;
    k.caixes([
      { titol: cpT('t786'), linies: [c.nom, 'NIF: ' + (c.nif || '—'), c.dir, c.pob, [c.mail, c.tel].filter(Boolean).join(' · ')] },
      { titol: cpT('t787'), linies: ['HIGIENEX S.L.', 'CIF: B12345678', 'Carrer de la Indústria, 25', '46010 València (València)', 'contacto@higienexvalencia.es'] },
    ], 98);
    var nomsLinia = (f.lineas || []).map(function (l) { var p = CP_DB.productos[l.art]; return l.nom || (p ? p.nom : l.art); });
    var tf = {
      head: [cpT('t788'), cpT('t789'), cpT('t790'), cpT('t791')],
      body: (f.lineas || []).map(function (l, i) {
        return [nomsLinia[i], CP_NUM(l.cant), CP_EUR(l.precio), CP_EUR(l.cant * l.precio)];
      }),
      columnStyles: { 0: { fontStyle: 'bold' }, 1: { cellWidth: 56, halign: 'right' }, 2: { cellWidth: 78, halign: 'right' }, 3: { cellWidth: 86, halign: 'right', fontStyle: 'bold', textColor: C.NAVY } },
    };
    if (HXPDF.ambFotos) HXPDF.ambFotos(tf, 0, function (i) { return nomsLinia[i]; }, k.doc);
    k.taula(tf);
    k.totals([[cpT('t792'), CP_EUR(f.base)], [cpT('t793'), CP_EUR(f.cuota)]], cpT('t794'), CP_EUR(f.total), {
      esquerra: function (x, y, w) {
        k.kicker(cpT('t801'), x, y + 12);
        var doc = k.doc;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); k.color(C.TXT);
        doc.text(doc.splitTextToSize(HXPDF.net(cpT('t803') + ' ES21 2100 4455 6612 3456 7890 (CaixaBank)'), w), x, y + 28);
        doc.setFontSize(8); k.color(C.MUTED);
        doc.text(doc.splitTextToSize(HXPDF.net(cpT('t804')), w), x, y + 56);
      },
    });
    try {
      var vr = HXVF.cadena(CP_DB.facturas).map[num];
      if (vr) { k.cal(116); k.y = HXVF.bloquePDF(k.doc, vr, k.M, k.W, k.H, k.y, cpVFLang()); }
    } catch (err) { /* sense registre VeriFactu: la factura es descarrega igualment */ }
    return k.tancar(hxNomPdf('factura', num), 'HIGIENEX S.L. · ' + cpT('t805'));
  }

  /* ---------- Portal: certificat d'impacte ---------- */
  function certificatImpacte() {
    var d = hxCalcularImpacteCliente(), c = CP_DB.cliente, C = HXPDF.C, VERD = [46, 125, 50];
    var data = window.HXT ? HXT.data(new Date(), { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('ca-ES');
    var loc = window.HXT ? HXT.locale() : 'ca-ES';
    var k = HXPDF.nou({ kicker: T("Certificat d'impacte ambiental"), titol: T('Certificat ECO'), num: T('Emès per a {0}', c.nom) });
    var doc = k.doc, W = k.W, M = k.M, cx = W / 2;
    k.y = 170;
    k.kicker(T('Es certifica que'), cx - 40, k.y, C.MUTED);
    doc.setFont('times', 'bold'); doc.setFontSize(28); k.color(C.INK);
    doc.text(HXPDF.net(c.nom), cx, k.y + 38, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); k.color(C.TXT);
    doc.text(doc.splitTextToSize(T("ha reduït el seu impacte ambiental fent servir productes concentrats HIGIENEX ECO en lloc de producte ja diluït. Aquest és el resultat de les seves comandes:"), 400), cx, k.y + 64, { align: 'center' });
    k.y += 110;
    k.xifres([
      [d.envasosEvitats.toLocaleString(loc), T('Envasos evitats'), VERD],
      [d.kgPlasticEvitat.toLocaleString(loc, { maximumFractionDigits: 1 }) + ' kg', T('Plàstic evitat'), VERD],
      [d.kgCo2Evitat.toLocaleString(loc, { maximumFractionDigits: 1 }) + ' kg', T('CO2 evitat (est.)'), VERD],
    ]);
    k.avis(T('Com es calcula'), T("Es comparen les comandes reals de productes concentrats amb la quantitat equivalent de producte ja diluït: menys envasos, menys plàstic i menys transport. Xifres orientatives amb finalitat informativa i de comunicació de sostenibilitat."), 'ok');
    /* segell */
    var sy = k.y + 60;
    k.stroke(VERD); doc.setLineWidth(1.5); doc.circle(cx, sy, 40, 'S'); doc.setLineWidth(0.6); doc.circle(cx, sy, 34, 'S');
    doc.setFont('times', 'bolditalic'); doc.setFontSize(26); k.color(C.GOLD); doc.text('X', cx, sy + 4, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(VERD[0], VERD[1], VERD[2]); doc.text('HIGIENEX ECO', cx, sy + 18, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); k.color(C.MUTED);
    doc.text(HXPDF.net(T('València, {0}', data)), cx, sy + 62, { align: 'center' });
    /* Signatura */
    var fy = sy + 110;
    k.stroke(C.INK); doc.setLineWidth(0.6); doc.line(cx - 90, fy, cx + 90, fy);
    doc.setFont('times', 'italic'); doc.setFontSize(16); k.color(C.NAVY); doc.text(HXPDF.net(T('Direcció Tècnica')), cx, fy - 8, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); k.color(C.MUTED); doc.text(HXPDF.net(T('Departament de qualitat · HIGIENEX S.L.')), cx, fy + 13, { align: 'center' });
    /* Marc de diploma: doble vora daurada i blava al voltant del cos */
    k.stroke(C.GOLD); doc.setLineWidth(1.6); doc.rect(22, 126, W - 44, k.H - 126 - 62, 'S');
    k.stroke(C.NAVY); doc.setLineWidth(0.5); doc.rect(28, 132, W - 56, k.H - 132 - 68, 'S');
    [[22, 126], [W - 22, 126], [22, k.H - 62], [W - 22, k.H - 62]].forEach(function (p) { k.fill(C.GOLD); doc.circle(p[0], p[1], 3.5, 'F'); });
    k.tancar('certificat-impacte-higienex.pdf');
  }

  /* ---------- Justificant de comanda ---------- */
  function comanda(inv, items, client) {
    var C = HXPDF.C, eur = HXPDF.eur;
    var hiHaDte = items.some(function (it) { return it.discountRate > 0; });
    var dte = items.reduce(function (s, i) { return s + (i.discountRate > 0 ? i.rawTotal - i.total : 0); }, 0);
    var sub = items.reduce(function (s, i) { return s + i.total; }, 0);
    var transport = (typeof TRANSPORT !== 'undefined' && TRANSPORT) || 0;
    var dtoCli = +inv.dtoCliImp || 0; // descuento extra de cliente (ERP)
    var iva = window.hxRedon ? hxRedon(hxRedon(sub - dtoCli + transport) * IVA_PCT) : (sub - dtoCli + transport) * IVA_PCT;
    var k = HXPDF.nou({ kicker: T('Justificant de comanda'), titol: T('Comanda'), num: 'Nº ' + inv.invoiceNum, data: inv.dateStr });
    k.franja([
      [T('Data de comanda'), inv.dateStr],
      [T('Lliurament estimat'), inv.entregaStr],
      [T('Pagament'), T('Confirmat')],
      [T('Total (IVA incl.)'), eur(inv.total), true],
    ]);
    k.caixes([
      { titol: T('Client'), linies: [client.name || T('Client'), client.company || '', client.email || ''] },
      { titol: T('Emissor'), linies: ['HIGIENEX S.L.', 'CIF: B12345678', 'Carrer de la Indústria, 25 · 46010 València', 'contacto@higienexvalencia.es'] },
    ], 84);
    var head = [T('Producte'), T('Uds.'), T('Preu/ut.')].concat(hiHaDte ? [T('Dte.')] : []).concat([T('Import')]);
    var cs = { 0: { fontStyle: 'bold' }, 1: { cellWidth: 50, halign: 'right' }, 2: { cellWidth: 74, halign: 'right' } };
    if (hiHaDte) cs[3] = { cellWidth: 52, halign: 'right' };
    cs[head.length - 1] = { cellWidth: 86, halign: 'right', fontStyle: 'bold', textColor: C.NAVY };
    var tc = {
      head: head,
      body: items.map(function (it) {
        var preu = it.rawTotal ? it.rawTotal / it.qty : it.total / it.qty;
        var r = [it.name, String(it.qty), eur(preu)];
        if (hiHaDte) r.push(it.discountRate > 0 ? '-' + Math.round(it.discountRate * 100) + ' %' : '-');
        r.push(eur(it.total));
        return r;
      }),
      columnStyles: cs,
      didParseCell: function (d) { if (d.section === 'body' && hiHaDte && d.column.index === 3 && d.cell.raw !== '-') { d.cell.styles.textColor = C.GOLD_D; d.cell.styles.fontStyle = 'bold'; } },
    };
    if (HXPDF.ambFotos) HXPDF.ambFotos(tc, 0, function (i) { return items[i].name; }, k.doc);
    k.taula(tc);
    var files = [[T('Subtotal productes'), eur(sub + dte)]];
    if (dte > 0) files.push([T('Descomptes per volum'), '-' + eur(dte), C.GOLD_D]);
    if (dtoCli > 0) files.push([T('Descompte de client ({0} %)', inv.dtoCliPct), '-' + eur(dtoCli), C.GOLD_D]);
    if (transport) files.push([T('Transport'), eur(transport)]);
    files.push([T('IVA ({0} %)', Math.round(IVA_PCT * 100)), eur(iva)]);
    k.totals(files, T('Total'), eur(inv.total), {
      esquerra: function (x, y, w) {
        var doc = k.doc, sx = x + 44, sy = y + 52;
        doc.setDrawColor(46, 125, 50); doc.setLineWidth(1.4); doc.circle(sx, sy, 34, 'S'); doc.setLineWidth(0.5); doc.circle(sx, sy, 29, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(46, 125, 50);
        doc.text(T('PAGAMENT'), sx, sy - 2, { align: 'center' }); doc.text(T('CONFIRMAT'), sx, sy + 8, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.4); k.color(C.TXT);
        doc.text(doc.splitTextToSize(T('Hem rebut el pagament. Prepararem la comanda i rebràs un avís quan surti del magatzem.'), w - 100), x + 92, y + 40);
      },
    });
    /* Estat de la comanda en quatre passos i, al costat, el QR per seguir-la */
    var passos = [T('Rebuda'), T('En preparació'), T('Enviada'), T('Entregada')], doc = k.doc, M = k.M, W = k.W, bh = 96;
    k.cal(bh + 8);
    var by = k.y, qa = 72, bw = W - 2 * M;
    k.stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(M, by, bw, bh, 6, 6, 'FD');
    k.kicker(T('Estat de la comanda'), M + 16, by + 20);
    var aw = bw - qa - 150, pw = aw / passos.length, py = by + 48;
    k.stroke(C.LINE); doc.setLineWidth(2); doc.line(M + 16 + pw / 2, py, M + 16 + aw - pw / 2, py);
    passos.forEach(function (p, i) {
      var cx = M + 16 + pw * i + pw / 2, fet = i === 0;
      if (fet) { k.fill(C.OK); doc.circle(cx, py, 9, 'F'); doc.setDrawColor(255, 255, 255); doc.setLineWidth(1.6); doc.lines([[3, 3], [6, -6]], cx - 4.5, py); }
      else { doc.setFillColor(255, 255, 255); k.stroke(C.LINE); doc.setLineWidth(1.4); doc.circle(cx, py, 9, 'FD'); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); k.color(C.MUTED); doc.text(String(i + 1), cx, py + 3, { align: 'center' }); }
      doc.setFont('helvetica', fet ? 'bold' : 'normal'); doc.setFontSize(8.2); k.color(fet ? C.OK : C.TXT);
      doc.text(HXPDF.net(p), cx, py + 24, { align: 'center' });
    });
    var qx = W - M - qa - 12, qy = by + (bh - qa) / 2;
    k.stroke(C.LINE); doc.setLineWidth(0.6); doc.line(qx - 132, by + 14, qx - 132, by + bh - 14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); k.color(C.INK);
    doc.text(doc.splitTextToSize(HXPDF.net(T('Segueix la comanda des del mòbil')), 112), qx - 118, by + 34);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.6); k.color(C.MUTED);
    doc.text(doc.splitTextToSize(HXPDF.net(T('Escaneja el codi per veure on és la comanda {0} en tot moment. També ho pots consultar a la web, a Seguiment de comanda.', inv.invoiceNum).split('. ')[0] + '.'), 112).slice(0, 4), qx - 118, by + 58);
    if (window.QRCode && typeof window.QRCode.create === 'function') {
      try {
        var q = window.QRCode.create('https://ossama450298-commits.github.io/Higienexweb/?seguiment=' + encodeURIComponent(inv.invoiceNum), { errorCorrectionLevel: 'M' });
        var n = q.modules.size, dd = q.modules.data, ps = qa / n;
        k.fill(C.TINTA);
        for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) if (dd[j * n + i]) doc.rect(qx + i * ps, qy + j * ps, ps + 0.05, ps + 0.05, 'F');
      } catch (e) { /* sense QR */ }
    }
    k.y = by + bh + 14;
    return k.tancar(hxNomPdf('comanda', inv.invoiceNum), T("Aquest document és un justificant de comanda, no una factura. La factura s'emetrà quan s'expedeixi la mercaderia. Per a qualsevol consulta, indica el número de comanda."));
  }

  window.HXPDF_DOCS = {
    fitxaTecnica: fitxaTecnica,
    fds: fds,
    cataleg: cataleg,
    certificacions: certificacions,
    extracte: extracte,
    factura: factura,
    certificatImpacte: certificatImpacte,
    comanda: comanda,
  };
})();
