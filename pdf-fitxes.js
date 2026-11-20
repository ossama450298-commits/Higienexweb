/* ==========================================================================
   HIGIENEX · fitxa tècnica i fitxa de dades de seguretat (FDS) en PDF
   Mateix estil que el catàleg: foto gran del producte, dades en targetes,
   mode d'ús en passos, perfil ambiental i QR a la fitxa al mòbil.
   La FDS segueix l'ordre de les 16 seccions del Reglament REACH, amb
   franges numerades, pictograma de perill i telèfons d'emergència a la vista.
   Fa servir la plantilla comuna (pdf-kit.js) i les fotos del catàleg.
   ========================================================================== */
(function () {
  'use strict';
  var T = function () { return window.HXT ? window.HXT.apply(null, arguments) : arguments[0]; };
  function cT(v) { return v ? T(v) : v; }
  var WEB = 'https://ossama450298-commits.github.io/Higienexweb/';
  var EMERGENCIA = '631 706 398';
  var TOXICOLOGIA = '915 620 420';

  function fitxer(t) { return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function referencia(nom) { return nom.split(' ')[0].toUpperCase() + '-' + (nom.length * 37 % 900 + 100); }
  function dades(nom) {
    var c = (typeof CMP_DATA !== 'undefined' && CMP_DATA[nom]) || {};
    var t = {};
    Object.keys(c).forEach(function (k) { t[k] = typeof c[k] === 'string' && k !== 'price' && k !== 'emoji' ? cT(c[k]) : c[k]; });
    t.desc = (typeof hxProdDesc === 'function' && hxProdDesc(nom)) || t.us || '';
    t.preu = window.HXCataleg ? window.HXCataleg.preu(nom) : 0;
    return t;
  }
  function foto(nom) {
    if (!window.HXCataleg) return Promise.resolve(null);
    return window.HXCataleg.imatge(window.HXCataleg.slug(nom), 900);
  }

  /* Eines de dibuix comunes sobre un document de la plantilla */
  function eines(k) {
    var doc = k.doc, C = HXPDF.C, net = HXPDF.net, M = k.M, W = k.W;
    var e = {
      text: function (t, x, y, mida, estil, c, opc) {
        doc.setFont('helvetica', estil || 'normal'); doc.setFontSize(mida); k.color(c || C.INK);
        doc.text(typeof t === 'string' ? net(t) : t, x, y, opc || {});
      },
      linies: function (t, amp, mida, estil) {
        doc.setFont('helvetica', estil || 'normal'); doc.setFontSize(mida);
        return doc.splitTextToSize(net(t), amp);
      },
      imatge: function (f, x, y, w, h) {
        if (!f) return;
        var s = Math.min(w / f.w, h / f.h), fw = f.w * s, fh = f.h * s;
        doc.addImage(f.data, 'JPEG', x + (w - fw) / 2, y + (h - fh) / 2, fw, fh, undefined, 'FAST');
      },
      qr: function (url, x, y, mida) {
        if (!window.QRCode || typeof window.QRCode.create !== 'function') return false;
        var q; try { q = window.QRCode.create(url, { errorCorrectionLevel: 'M' }); } catch (er) { return false; }
        var n = q.modules.size, d = q.modules.data, pas = mida / n;
        k.fill(C.TINTA);
        for (var j = 0; j < n; j++) {
          var i = 0;
          while (i < n) {
            if (d[j * n + i]) { var st = i; while (i < n && d[j * n + i]) i++; doc.rect(x + st * pas, y + j * pas, (i - st) * pas + 0.05, pas + 0.05, 'F'); }
            else i++;
          }
        }
        return true;
      },
      /* Franja crema amb QR, igual que al catàleg */
      bandaQR: function (url, titol, text) {
        var h = 76;
        k.cal(h + 10);
        var y = k.y;
        k.fill(C.CREAM); doc.roundedRect(M, y, W - 2 * M, h, 8, 8, 'F');
        doc.setFillColor(255, 255, 255); doc.roundedRect(M + 10, y + 8, 60, 60, 4, 4, 'F');
        e.qr(url, M + 15, y + 13, 50);
        e.text(titol, M + 86, y + 30, 10.5, 'bold', C.INK);
        e.text(e.linies(text, W - 2 * M - 100, 8.6), M + 86, y + 46, 8.6, 'normal', C.TXT);
        k.y += h + 14;
      },
      /* Capçalera del producte: foto a l'esquerra i dades clau a la dreta */
      fitxaProducte: function (nom, d, f, files, preu) {
        var y0 = k.y, ph = 250;
        k.stroke(C.LINE); doc.setLineWidth(0.8); doc.setFillColor(255, 255, 255); doc.roundedRect(M, y0, 190, ph, 10, 10, 'FD');
        e.imatge(f, M + 16, y0 + 16, 158, ph - 32);
        var x = M + 212, amp = W - M - x;
        k.pindola(d.sector || T('Professional'), x, y0, C.NAVY, [228, 237, 246]);
        var tn = e.linies(nom, amp, 22, 'bold');
        e.text(tn, x, y0 + 42, 22, 'bold', C.INK, { lineHeightFactor: 1.1 });
        var yy = y0 + 42 + (tn.length - 1) * 24 + 16;
        e.text('Ref. ' + referencia(nom), x, yy, 8.5, 'bold', C.GOLD_D);
        yy += 16;
        var us = e.linies(d.us || '', amp, 9.8);
        e.text(us, x, yy, 9.8, 'normal', C.TXT, { lineHeightFactor: 1.35 });
        yy += us.length * 13 + 8;
        files.forEach(function (r) {
          k.stroke(C.LINE); doc.setLineWidth(0.6); doc.line(x, yy, W - M, yy);
          k.kicker(r[0], x, yy + 14);
          e.text(e.linies(r[1] || '—', amp * 0.55, 9.2, 'bold')[0], W - M, yy + 14, 9.2, 'bold', C.INK, { align: 'right' });
          yy += 22;
        });
        if (preu) {
          k.fill(C.TINTA); doc.roundedRect(x, yy + 6, amp, 40, 6, 6, 'F');
          e.text(T('Preu per garrafa de 5 L'), x + 12, yy + 30, 8.5, 'normal', C.PALE);
          e.text(HXPDF.eur(preu), W - M - 12, yy + 32, 15, 'bold', C.GOLD, { align: 'right' });
          yy += 46;
        }
        k.y = Math.max(y0 + ph, yy) + 20;
      },
    };
    return e;
  }

  /* ---------- Fitxa tècnica ---------- */
  function fitxaTecnica(nom) {
    if (!window.HXPDF || !HXPDF.disponible()) return Promise.resolve(null);
    return foto(nom).then(function (f) {
      var d = dades(nom), C = HXPDF.C;
      var k = HXPDF.nou({ kicker: T('Fitxa tècnica de producte'), titol: nom, titolCurt: T('Fitxa tècnica') + ' · ' + nom, num: 'Ref. ' + referencia(nom), etiquetaData: T('Revisió') });
      var doc = k.doc, M = k.M, W = k.W, e = eines(k);
      e.fitxaProducte(nom, d, f, [
        [T('Concentració'), d.concentracio], [T('Certificació'), d.certificacio], [T('Biodegradable'), d.biodegradable], [T('Format'), T('Garrafa de 5 L')],
      ], d.preu);

      k.seccio(T('Descripció del producte'), 1);
      k.paragraf(d.desc || '—', { mida: 9.8 });

      k.seccio(T('Dades del producte'), 2);
      k.parells([
        [T('Nom comercial'), nom],
        [T('Referència'), referencia(nom)],
        [T('Ús recomanat'), d.us || '—'],
        [T('Sector'), d.sector || '—'],
        [T('Concentració / dilució'), d.concentracio || '—'],
        [T('Biodegradabilitat'), d.biodegradable || '—'],
        [T('Envàs'), d.envas || '—'],
        [T('Fabricant'), 'HIGIENEX S.L. · Carrer de la Indústria, 25, 46010 València'],
      ]);

      /* Mode d'ús en quatre passos */
      k.seccio(T("Mode d'ús recomanat"), 3);
      var passos = [
        [T('Diluir'), T('Diluir segons la superfície a tractar i el nivell de brutícia.')],
        [T('Aplicar'), T('Aplicar amb polvoritzador, mopa o baieta de microfibra.')],
        [T('Deixar actuar'), T("Deixar actuar el temps de contacte indicat a l'etiqueta i aclarir si escau.")],
        [T('Ventilar'), T("Ventilar l'espai durant l'aplicació.")],
      ];
      var gw = (W - 2 * M - 30) / 4, gh = 92;
      k.cal(gh + 10);
      passos.forEach(function (p, i) {
        var x = M + i * (gw + 10);
        k.fill(C.SOFT); doc.roundedRect(x, k.y, gw, gh, 6, 6, 'F');
        k.fill(C.NAVY); doc.circle(x + 18, k.y + 18, 9, 'F');
        e.text(String(i + 1), x + 18, k.y + 21.5, 9, 'bold', [255, 255, 255], { align: 'center' });
        e.text(p[0], x + 33, k.y + 22, 10, 'bold', C.INK);
        e.text(e.linies(p[1], gw - 22, 8.3), x + 11, k.y + 42, 8.3, 'normal', C.TXT, { lineHeightFactor: 1.35 });
      });
      k.y += gh + 18;

      /* Precaucions en targetes amb vora daurada */
      k.seccio(T('Precaucions i emmagatzematge'), 4);
      var prec = [
        T("Mantenir fora de l'abast dels infants."),
        T('Emmagatzemar en lloc fresc i sec, protegit de la llum directa (entre 5 i 30 °C).'),
        T('No barrejar amb altres productes químics, especialment lleixius o àcids.'),
        T('Usar guants per manipular el producte concentrat.'),
      ];
      var pw = (W - 2 * M - 10) / 2, phh = 40;
      k.cal(phh * 2 + 18);
      prec.forEach(function (t, i) {
        var x = M + (i % 2) * (pw + 10), y = k.y + Math.floor(i / 2) * (phh + 8);
        k.stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, pw, phh, 5, 5, 'FD');
        k.fill(C.GOLD); doc.rect(x, y + 6, 3, phh - 12, 'F');
        e.text(e.linies(t, pw - 28, 8.6), x + 14, y + 17, 8.6, 'normal', C.INK, { lineHeightFactor: 1.35 });
      });
      k.y += phh * 2 + 24;

      k.seccio(T('Perfil ambiental'), 5);
      var perfil = [
        [d.biodegradable || '—', T('Biodegradable'), C.OK],
        [d.envas || '—', T('Envàs'), C.OK],
        [(d.certificacio || '—').split('·')[0].trim(), T('Certificació'), C.NAVY],
        [T('València (Espanya)'), T('Fabricació'), C.GOLD_D],
      ];
      var xw = (W - 2 * M - 30) / 4;
      k.cal(70);
      perfil.forEach(function (p, i) {
        var x = M + i * (xw + 10);
        k.stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(x, k.y, xw, 60, 5, 5, 'FD');
        k.fill(p[2]); doc.rect(x, k.y + 57, xw, 3, 'F');
        k.kicker(p[1], x + 12, k.y + 18);
        /* el valor s'ajusta a l'amplada de la targeta */
        var mida = 13; doc.setFont('helvetica', 'bold'); doc.setFontSize(mida);
        while (doc.getTextWidth(HXPDF.net(p[0])) > xw - 24 && mida > 8.5) { mida -= 0.5; doc.setFontSize(mida); }
        e.text(e.linies(p[0], xw - 24, mida, 'bold')[0], x + 12, k.y + 41, mida, 'bold', p[2]);
      });
      k.y += 76;

      e.bandaQR(WEB + '?producte=' + encodeURIComponent(nom) + '&doc=fitxa', T('Fitxa i FDS sempre al mòbil'), T("Escaneja aquest codi amb la càmera del mòbil: s'obre la fitxa del producte amb la FDS, en l'idioma del teu telèfon. Enganxa'l al magatzem o al carro de neteja."));
      return k.tancar(T('Fitxa_tecnica') + '_' + fitxer(nom) + '.pdf', T("Aquesta fitxa és orientativa. Per a la Fitxa de Dades de Seguretat (FDS) oficial reglamentària, contacta amb l'equip tècnic."));
    });
  }

  /* ---------- Fitxa de dades de seguretat (FDS) ---------- */
  function fds(nom) {
    if (!window.HXPDF || !HXPDF.disponible()) return Promise.resolve(null);
    return foto(nom).then(function (f) {
      var d = dades(nom), C = HXPDF.C;
      var k = HXPDF.nou({ kicker: T('Fitxa de dades de seguretat'), titol: T('Fitxa de seguretat'), titolCurt: T('FDS') + ' · ' + nom, num: nom, etiquetaData: T('Revisió') });
      var doc = k.doc, M = k.M, W = k.W, e = eines(k);

      /* Bloc d'identificació: foto, versió i telèfons d'emergència */
      var y0 = k.y, bh = 128;
      k.stroke(C.LINE); doc.setLineWidth(0.8); doc.setFillColor(255, 255, 255); doc.roundedRect(M, y0, 96, bh, 8, 8, 'FD');
      e.imatge(f, M + 10, y0 + 10, 76, bh - 20);
      var x = M + 110, amp = 210;
      e.text(e.linies(nom, amp, 15, 'bold'), x, y0 + 18, 15, 'bold', C.INK);
      var fil = [[T('Referència'), referencia(nom)], [T('Versió'), T('1.0 (simplificada)')], [T('Data de revisió'), HXPDF.dd()], [T('Reglament'), 'CE 1907/2006 · CLP']];
      fil.forEach(function (r, i) {
        var yy = y0 + 44 + i * 21;
        k.stroke(C.LINE); doc.setLineWidth(0.5); doc.line(x, yy - 12, x + amp, yy - 12);
        k.kicker(r[0], x, yy);
        e.text(r[1], x + amp, yy, 8.8, 'bold', C.INK, { align: 'right' });
      });
      var ex = x + amp + 16, ew = W - M - ex;
      k.fill(C.BAD_BG); doc.roundedRect(ex, y0, ew, bh, 8, 8, 'F');
      k.fill(C.BAD); doc.rect(ex, y0 + 10, 3, bh - 20, 'F');
      doc.setCharSpace(1); e.text(net(T("Telèfon d'emergència")).toUpperCase(), ex + 16, y0 + 24, 7, 'bold', C.BAD); doc.setCharSpace(0);
      e.text(EMERGENCIA, ex + 16, y0 + 50, 22, 'bold', C.BAD);
      e.text(T('Horari laboral i urgències 24/7'), ex + 16, y0 + 66, 8.3, 'normal', C.TXT);
      doc.setCharSpace(1); e.text(net(T('Informació toxicològica')).toUpperCase(), ex + 16, y0 + 90, 7, 'bold', C.BAD); doc.setCharSpace(0);
      e.text(TOXICOLOGIA, ex + 16, y0 + 112, 16, 'bold', C.INK);
      k.y = y0 + bh + 18;

      /* Resum de perills amb pictograma GHS07 */
      var hh = 96;
      k.cal(hh + 10);
      var hy = k.y;
      k.fill(C.WARN_BG); doc.roundedRect(M, hy, W - 2 * M, hh, 8, 8, 'F');
      var cx = M + 48, cy = hy + hh / 2, r = 32;
      doc.setFillColor(255, 255, 255); doc.setDrawColor(204, 0, 0); doc.setLineWidth(4);
      doc.lines([[r, r], [-r, r], [-r, -r], [r, -r]], cx, cy - r, [1, 1], 'FD', true);
      e.text('!', cx, cy + 12, 34, 'bold', [0, 0, 0], { align: 'center' });
      var hx = M + 100;
      doc.setCharSpace(1); e.text(net(T('Paraula d\'advertència')).toUpperCase(), hx, hy + 22, 7, 'bold', C.WARN); doc.setCharSpace(0);
      e.text(T('Atenció'), hx, hy + 40, 15, 'bold', C.INK);
      var frases = [
        'H319 · ' + T('Provoca irritació ocular greu.'),
        'P102 · ' + T("Mantenir fora de l'abast dels infants."),
        'P280 · ' + T('Portar guants i protecció ocular.'),
        'P305+P351+P338 · ' + T("En cas de contacte amb els ulls: esbandir amb aigua durant uns minuts."),
      ];
      frases.forEach(function (t, i) { e.text(e.linies(t, W - M - hx - 12, 8.2)[0], hx, hy + 56 + i * 10.5, 8.2, i === 0 ? 'bold' : 'normal', C.TXT); });
      k.y = hy + hh + 20;

      /* Les 16 seccions, amb franja numerada */
      function seccio(n, titol) {
        k.cal(60);
        k.fill(C.NAVY); doc.roundedRect(M, k.y, W - 2 * M, 22, 4, 4, 'F');
        k.fill(C.GOLD); doc.roundedRect(M, k.y, 80, 22, 4, 4, 'F'); doc.rect(M + 74, k.y, 6, 22, 'F');
        doc.setCharSpace(0.8); e.text(net(T('Secció')).toUpperCase() + ' ' + n, M + 40, k.y + 14.5, 7.2, 'bold', C.TINTA, { align: 'center' }); doc.setCharSpace(0);
        e.text(titol, M + 92, k.y + 15, 9.6, 'bold', [255, 255, 255]);
        k.y += 32;
      }
      var info = d;
      var s = [
        [T('Identificació de la substància i de la societat'), null, [
          [T('Nom del producte'), nom],
          [T('Ús recomanat'), info.us || info.desc || '—'],
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
        seccio(i + 1, x[0]);
        if (x[2]) k.parells(x[2], { ampleEtiqueta: 150 });
        else k.paragraf(x[1], { mida: 9 });
      });
      e.bandaQR(WEB + '?producte=' + encodeURIComponent(nom) + '&doc=fds', T('FDS sempre al mòbil'), T("Escaneja aquest codi per obrir la FDS actualitzada en l'idioma del teu telèfon. Útil en cas d'inspecció o d'accident."));
      return k.tancar('FDS_' + fitxer(nom) + '.pdf', T("Document generat automàticament des de la web d'HIGIENEX. Aquesta FDS és una versió simplificada amb finalitat informativa i de projecte acadèmic; no substitueix la Fitxa de Dades de Seguretat oficial reglamentària (Reglament REACH 1907/2006, Annex II), disponible sota petició al departament tècnic."));
    });
  }
  var net = function (t) { return HXPDF.net(t); };

  function installar() {
    if (window.HXPDF_DOCS) { window.HXPDF_DOCS.fitxaTecnica = fitxaTecnica; window.HXPDF_DOCS.fds = fds; }
    else setTimeout(installar, 200);
  }
  installar();
})();
