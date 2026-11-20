/* ==========================================================================
   HIGIENEX · catàleg de productes en PDF (versió revista)
   Portada amb la gamma, presentació amb xifres i índex, una pàgina per
   producte (foto gran, preu, descomptes per volum, característiques i QR a
   la fitxa), comparativa i contraportada per fer la comanda.
   Fa servir la plantilla comuna (pdf-kit.js) per a capçaleres i textos.
   ========================================================================== */
(function () {
  'use strict';
  var T = function () { return window.HXT ? window.HXT.apply(null, arguments) : arguments[0]; };
  function cT(v) { return v ? T(v) : v; }

  var DESCOMPTES = [[1, 4, 0], [5, 9, 5], [10, 19, 10], [20, null, 15]];
  var WEB = 'https://ossama450298-commits.github.io/Higienexweb/';

  function slug(nom) {
    return 'img/prod-' + String(nom).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.webp';
  }
  /* Preu per garrafa de 5 L, el mateix que mostra la botiga */
  function preuGarrafa(nom) {
    var preu = null;
    document.querySelectorAll('#pedidosGrid .pedido-card-new').forEach(function (c) {
      var n = c.querySelector('.hx-u25'), p = c.querySelector('.hx-price[data-eur]');
      if (n && p && n.textContent.trim() === nom) preu = parseFloat(p.getAttribute('data-eur'));
    });
    if (preu == null && typeof CMP_DATA !== 'undefined' && CMP_DATA[nom]) preu = parseFloat(String(CMP_DATA[nom].price).replace(',', '.'));
    return preu || 0;
  }
  function descripcio(nom) {
    return (typeof hxProdDesc === 'function' && hxProdDesc(nom)) || '';
  }
  /* jsPDF no llegeix WebP: es passa cada foto per un canvas i s'exporta en JPEG sobre blanc */
  function carregarImatge(src, maxH) {
    return new Promise(function (ok) {
      var im = new Image();
      im.onload = function () {
        var esc = Math.min(1, maxH / im.naturalHeight);
        var c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * esc); c.height = Math.round(im.naturalHeight * esc);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(im, 0, 0, c.width, c.height);
        /* Es retalla el marge blanc perquè tots els envasos ocupin el mateix espai */
        var px = x.getImageData(0, 0, c.width, c.height).data, x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
        for (var j = 0; j < c.height; j += 2) for (var i = 0; i < c.width; i += 2) {
          var o = (j * c.width + i) * 4;
          if (px[o] + px[o + 1] + px[o + 2] < 720) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; }
        }
        if (x1 > x0 && y1 > y0) {
          var pad = 6; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(c.width, x1 + pad); y1 = Math.min(c.height, y1 + pad);
          var r = document.createElement('canvas'); r.width = x1 - x0; r.height = y1 - y0;
          var rx = r.getContext('2d'); rx.fillStyle = '#fff'; rx.fillRect(0, 0, r.width, r.height);
          rx.drawImage(c, x0, y0, r.width, r.height, 0, 0, r.width, r.height);
          c = r;
        }
        ok({ data: c.toDataURL('image/jpeg', 0.86), w: c.width, h: c.height });
      };
      im.onerror = function () { ok(null); };
      im.src = src;
    });
  }

  function cataleg() {
    if (!window.HXPDF || !HXPDF.disponible()) return Promise.resolve(null);
    var noms = Object.keys(CMP_DATA);
    return Promise.all(noms.map(function (n) { return carregarImatge(slug(n), 900); })).then(function (fotos) {
      var IMG = {};
      noms.forEach(function (n, i) { IMG[n] = fotos[i]; });
      return construir(noms, IMG);
    });
  }

  function construir(noms, IMG) {
    var any = new Date().getFullYear();
    var k = HXPDF.nou({ kicker: T('Catàleg de productes'), titol: T('Catàleg {0}', any), titolCurt: T('Catàleg {0}', any), data: false });
    var doc = k.doc, W = k.W, H = k.H, M = k.M, C = HXPDF.C, net = HXPDF.net, eur = HXPDF.eur;
    var fill = k.fill, color = k.color, stroke = k.stroke;
    var sectors = {};
    noms.forEach(function (n) { var s = cT(CMP_DATA[n].sector) || T('Professional'); (sectors[s] = sectors[s] || []).push(n); });

    function foto(nom, x, y, w, h) {
      var f = IMG[nom]; if (!f) return;
      var e = Math.min(w / f.w, h / f.h), fw = f.w * e, fh = f.h * e;
      doc.addImage(f.data, 'JPEG', x + (w - fw) / 2, y + (h - fh), fw, fh, 'p-' + nom, 'FAST');
    }
    function text(t, x, y, mida, estil, c, opc) {
      doc.setFont('helvetica', estil || 'normal'); doc.setFontSize(mida); color(c || C.INK);
      doc.text(typeof t === 'string' ? net(t) : t, x, y, opc || {});
    }
    function linies(t, amp, mida, estil) {
      doc.setFont('helvetica', estil || 'normal'); doc.setFontSize(mida);
      return doc.splitTextToSize(net(t), amp);
    }
    function qr(url, x, y, mida, c) {
      if (!window.QRCode || typeof window.QRCode.create !== 'function') return false;
      var q; try { q = window.QRCode.create(url, { errorCorrectionLevel: 'M' }); } catch (e) { return false; }
      var n = q.modules.size, d = q.modules.data, pas = mida / n;
      fill(c || C.TINTA);
      for (var j = 0; j < n; j++) {
        var i = 0;
        while (i < n) {
          if (d[j * n + i]) { var st = i; while (i < n && d[j * n + i]) i++; doc.rect(x + st * pas, y + j * pas, (i - st) * pas + 0.05, pas + 0.05, 'F'); }
          else i++;
        }
      }
      return true;
    }

    /* ---------- 1. Portada ---------- */
    doc.deletePage(1); doc.addPage();
    fill(C.TINTA); doc.rect(0, 0, W, H, 'F');
    doc.setFillColor(21, 58, 86); doc.circle(W + 40, 120, 230, 'F');
    k.logo(M, 74, 34, true);
    doc.setCharSpace(1.6); text(T('HIGIENE PROFESSIONAL SOSTENIBLE'), M, 94, 7.5, 'normal', C.PALE); doc.setCharSpace(0);
    text(T('Catàleg'), M, 214, 58, 'bold', [255, 255, 255]);
    text(String(any), M, 274, 58, 'bold', C.GOLD);
    var sub = linies(T('Productes d\'higiene professional que netegen més amb menys: concentrats, certificats i amb un 70 % menys d\'envasos.'), 330, 12.5);
    text(sub, M, 312, 12.5, 'normal', C.PALE, { lineHeightFactor: 1.5 });
    /* la gamma sencera sobre una safata blanca */
    var ty = 400, th = 300;
    doc.setFillColor(255, 255, 255); doc.roundedRect(M, ty, W - 2 * M, th, 10, 10, 'F');
    var slot = (W - 2 * M - 30) / noms.length;
    noms.forEach(function (n, i) { foto(n, M + 15 + i * slot + 4, ty + 22, slot - 8, th - 70); });
    fill(C.GOLD); doc.rect(M, ty + th - 34, W - 2 * M, 2, 'F');
    text(T('{0} referències · {1} sectors · preus sense IVA', noms.length, Object.keys(sectors).length), W / 2, ty + th - 14, 9, 'bold', C.TINTA, { align: 'center' });
    var dades = [['×3', T('rendiment per garrafa')], ['-70 %', T('menys plàstic')], ['ISO 14001', T('gestió ambiental')], ['19', T('patents pròpies')]];
    var cw = (W - 2 * M) / dades.length;
    dades.forEach(function (d, i) {
      var x = M + i * cw;
      if (i) { stroke([46, 80, 108]); doc.setLineWidth(0.6); doc.line(x, 732, x, 774); }
      text(d[0], x + (i ? 14 : 0), 752, 17, 'bold', [255, 255, 255]);
      text(d[1], x + (i ? 14 : 0), 768, 8, 'normal', C.PALE);
    });
    text('higienexvalencia.es  ·  ' + HXPDF.EMPRESA.tel + '  ·  ' + HXPDF.EMPRESA.mail, M, H - 30, 8, 'normal', C.PALE);

    /* ---------- 2. Presentació i índex ---------- */
    k.nouFull();
    var pagProd = {}, llocIndex = [];
    text(T('Qui som'), M, k.y + 22, 24, 'bold', C.INK);
    k.y += 40;
    k.paragraf(T('HIGIENEX fabrica a València productes d\'higiene i neteja professional des de 2015. Treballem amb hospitals, hotels, indústria alimentària i oficines que necessiten resultats garantits, traçabilitat i menys impacte ambiental.'), { mida: 10.5 });
    k.paragraf(T('Les nostres fórmules concentrades rendeixen fins a tres vegades més per garrafa: menys envasos, menys transport i menys espai al magatzem, amb el mateix resultat.'), { mida: 10.5 });
    k.xifres([['×3', T('Rendiment'), C.NAVY], ['-70 %', T('Plàstic'), C.OK], ['24-72 h', T('Entrega'), C.NAVY], ['-15 %', T('Per volum'), C.GOLD_D]]);
    k.seccio(T('Índex de productes'));
    Object.keys(sectors).forEach(function (s) {
      k.cal(30);
      text(s, M, k.y + 4, 8, 'bold', C.GOLD_D);
      k.y += 16;
      sectors[s].forEach(function (n) {
        text(n, M + 12, k.y + 4, 10.5, 'bold', C.INK);
        var us = cT(CMP_DATA[n].us) || '';
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); var wn = 0;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); wn = doc.getTextWidth(net(n));
        text(us, M + 22 + wn, k.y + 4, 8.5, 'normal', C.MUTED);
        llocIndex.push([n, doc.getCurrentPageInfo().pageNumber, k.y + 4]);
        stroke(C.LINE); doc.setLineDashPattern([1, 2], 0); doc.line(M + 12, k.y + 10, W - M, k.y + 10); doc.setLineDashPattern([], 0);
        k.y += 22;
      });
      k.y += 6;
    });
    k.seccio(T('Com fer la comanda'));
    var passos = [[T('Tria'), T('Afegeix els productes al carret de la web.')], [T('Confirma'), T('Reps la confirmació i el PDF per email.')], [T('Reps'), T('Entrega a València en 24-72 h. Transport 5 €.')]];
    var pw = (W - 2 * M - 24) / 3;
    k.cal(70);
    passos.forEach(function (p, i) {
      var x = M + i * (pw + 12);
      fill(C.SOFT); doc.roundedRect(x, k.y, pw, 62, 6, 6, 'F');
      fill(C.NAVY); doc.circle(x + 18, k.y + 18, 9, 'F');
      text(String(i + 1), x + 18, k.y + 21.5, 9, 'bold', [255, 255, 255], { align: 'center' });
      text(p[0], x + 34, k.y + 22, 11, 'bold', C.INK);
      text(linies(p[1], pw - 24, 8.5), x + 12, k.y + 42, 8.5, 'normal', C.TXT);
    });
    k.y += 80;

    /* ---------- 3. Una pàgina per producte ---------- */
    Object.keys(sectors).forEach(function (s) {
      sectors[s].forEach(function (nom) {
        var c = CMP_DATA[nom], preu = preuGarrafa(nom);
        k.nouFull();
        pagProd[nom] = doc.getNumberOfPages();
        var y0 = 82;
        /* foto */
        stroke(C.LINE); doc.setLineWidth(0.8); doc.setFillColor(255, 255, 255); doc.roundedRect(M, y0, 230, 330, 10, 10, 'FD');
        fill(C.GOLD); doc.rect(M + 20, y0 + 329, 40, 2, 'F');
        foto(nom, M + 20, y0 + 22, 190, 290);
        /* columna dreta */
        var x = M + 254, amp = W - M - x;
        k.pindola(s, x, y0 + 2, C.NAVY, [228, 237, 246]);
        var tn = linies(nom, amp, 25, 'bold');
        text(tn, x, y0 + 46, 25, 'bold', C.INK, { lineHeightFactor: 1.1 });
        var yy = y0 + 46 + (tn.length - 1) * 27.5 + 20;
        text(linies(cT(c.us) || '', amp, 10.5), x, yy, 10.5, 'normal', C.TXT, { lineHeightFactor: 1.4 });
        yy += 34;
        /* preu */
        fill(C.TINTA); doc.roundedRect(x, yy, amp, 74, 8, 8, 'F');
        doc.setCharSpace(1); text(T('PREU PER GARRAFA DE 5 L'), x + 16, yy + 20, 7, 'bold', C.PALE); doc.setCharSpace(0);
        text(eur(preu), x + 16, yy + 52, 28, 'bold', C.GOLD);
        text(T('sense IVA'), x + amp - 16, yy + 52, 9, 'normal', C.PALE, { align: 'right' });
        yy += 90;
        /* descomptes per volum */
        text(T('Descomptes per volum'), x, yy, 9.5, 'bold', C.INK);
        yy += 8;
        DESCOMPTES.forEach(function (d, i) {
          var fy = yy + i * 21;
          if (i % 2 === 0) { fill(C.SOFT); doc.rect(x, fy, amp, 21, 'F'); }
          var rang = d[1] ? T('{0}-{1} garrafes', d[0], d[1]) : T('{0} garrafes o més', d[0]);
          text(rang, x + 10, fy + 14, 9, 'normal', C.TXT);
          text(d[2] ? '-' + d[2] + ' %' : '—', x + amp * 0.58, fy + 14, 9, 'bold', d[2] ? C.OK : C.MUTED);
          text(eur(preu * (1 - d[2] / 100)), x + amp - 10, fy + 14, 9.5, 'bold', C.INK, { align: 'right' });
        });
        k.y = y0 + 352;
        /* descripció */
        k.seccio(T('Descripció'));
        k.paragraf(descripcio(nom) || cT(c.us) || '', { mida: 9.6 });
        /* característiques en targetes */
        k.seccio(T('Característiques'));
        var fit = [[T('Concentració'), cT(c.concentracio)], [T('Certificació'), cT(c.certificacio)], [T('Biodegradable'), cT(c.biodegradable)], [T('Envàs'), cT(c.envas)], [T('Format'), T('Garrafa de 5 L')], [T('Fabricació'), T('València (Espanya)')]];
        var gw = (W - 2 * M - 20) / 3, gh = 46;
        k.cal(gh * 2 + 14);
        fit.forEach(function (f, i) {
          var gx = M + (i % 3) * (gw + 10), gy = k.y + Math.floor(i / 3) * (gh + 8);
          stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(gx, gy, gw, gh, 5, 5, 'FD');
          k.kicker(f[0], gx + 10, gy + 15);
          text(linies(f[1] || '—', gw - 20, 9.5, 'bold')[0], gx + 10, gy + 33, 9.5, 'bold', C.INK);
        });
        k.y += gh * 2 + 22;
        /* QR a la fitxa */
        var qy = Math.max(k.y, H - 150);
        if (qy + 76 < H - 56) {
          fill(C.CREAM); doc.roundedRect(M, qy, W - 2 * M, 76, 8, 8, 'F');
          doc.setFillColor(255, 255, 255); doc.roundedRect(M + 10, qy + 8, 60, 60, 4, 4, 'F');
          qr(WEB + '?producte=' + encodeURIComponent(nom) + '&doc=fds', M + 15, qy + 13, 50);
          text(T('Fitxa tècnica i FDS al mòbil'), M + 86, qy + 30, 10.5, 'bold', C.INK);
          text(linies(T('Escaneja el codi per obrir la fitxa del producte i la fitxa de seguretat actualitzades, en l\'idioma del teu telèfon.'), W - 2 * M - 100, 8.6), M + 86, qy + 46, 8.6, 'normal', C.TXT);
        }
      });
    });

    /* ---------- 4. Comparativa ---------- */
    k.nouFull();
    text(T('Comparativa de la gamma'), M, k.y + 22, 22, 'bold', C.INK);
    k.y += 40;
    k.taula({
      head: [T('Producte'), T('Sector'), T('Dilució'), T('Certificació'), T('Preu / 5 L')],
      body: noms.map(function (n) { var c = CMP_DATA[n]; return [n, cT(c.sector || ''), cT(c.concentracio || ''), cT(c.certificacio || ''), eur(preuGarrafa(n))]; }),
      columnStyles: { 0: { cellWidth: 140, fontStyle: 'bold', textColor: C.INK }, 1: { cellWidth: 100 }, 2: { cellWidth: 80 }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 70, halign: 'right', fontStyle: 'bold', textColor: C.NAVY } },
      didParseCell: function (d) { if (d.section === 'body') d.cell.styles.minCellHeight = 30; },
    });
    k.seccio(T('Per què HIGIENEX'));
    k.llista([
      T('Concentrats que redueixen fins a un 70 % els envasos de plàstic.'),
      T('Desinfectants registrats com a biocides a la UE i productes homologats HACCP.'),
      T('Descomptes automàtics per volum i transport de 5 € per comanda.'),
      T('Fitxes tècniques i de seguretat descarregables des de la web.'),
    ]);
    k.avis(T('Vols un pressupost a mida?'), T('Fes-lo a la web en un minut (secció Pressupost) o escriu-nos a contacto@higienexvalencia.es.'));
    k.paragraf(T("Preus orientatius sense IVA, subjectes a confirmació per part de l'equip comercial."), { mida: 7.6, color: C.MUTED });

    /* ---------- 5. Contraportada ---------- */
    doc.addPage();
    var ultima = doc.getNumberOfPages();
    fill(C.TINTA); doc.rect(0, 0, W, H, 'F');
    doc.setFillColor(21, 58, 86); doc.circle(-60, H - 120, 230, 'F');
    k.logo(M, 120, 30, true);
    text(linies(T('Fes la teva comanda avui'), W - 2 * M, 34, 'bold'), M, 210, 34, 'bold', [255, 255, 255], { lineHeightFactor: 1.15 });
    text(linies(T('Compra a la web amb descomptes automàtics, demana un pressupost a mida o una visita tècnica gratuïta.'), 360, 12), M, 270, 12, 'normal', C.PALE, { lineHeightFactor: 1.5 });
    var cont = [[T('Web'), 'higienexvalencia.es'], [T('Telèfon i WhatsApp'), HXPDF.EMPRESA.tel], [T('Email'), HXPDF.EMPRESA.mail], [T('Adreça'), HXPDF.EMPRESA.adreca], [T('Horari'), T('Dilluns a divendres, 8:00-17:30')]];
    cont.forEach(function (c, i) {
      var cy = 360 + i * 46;
      doc.setCharSpace(1); text(net(c[0]).toUpperCase(), M, cy, 7, 'bold', C.GOLD); doc.setCharSpace(0);
      text(c[1], M, cy + 18, 13, 'bold', [255, 255, 255]);
    });
    doc.setFillColor(255, 255, 255); doc.roundedRect(W - M - 150, 360, 150, 150, 8, 8, 'F');
    qr(WEB, W - M - 136, 374, 122);
    text(T('Escaneja per anar a la botiga'), W - M - 75, 528, 8.5, 'normal', C.PALE, { align: 'center' });
    fill(C.GOLD); doc.rect(0, H - 70, W, 4, 'F');
    text(HXPDF.EMPRESA.nom + '  ·  CIF ' + HXPDF.EMPRESA.cif, M, H - 40, 8, 'normal', C.PALE);

    /* Números de pàgina de l'índex, ara que se sap on ha quedat cada producte */
    llocIndex.forEach(function (l) {
      doc.setPage(l[1]);
      doc.setFillColor(255, 255, 255); doc.rect(W - M - 22, l[2] - 10, 22, 13, 'F');
      text(String(pagProd[l[0]]), W - M, l[2], 10.5, 'bold', C.NAVY, { align: 'right' });
    });

    /* Peu i número de pàgina a les pàgines interiors (no a les portades) */
    var n = doc.getNumberOfPages();
    for (var i = 2; i < ultima; i++) {
      doc.setPage(i);
      stroke(C.GOLD); doc.setLineWidth(1); doc.line(M, H - 48, W - M, H - 48);
      text(T('Catàleg {0}', any) + '  ·  ' + HXPDF.EMPRESA.nom + '  ·  higienexvalencia.es  ·  ' + HXPDF.EMPRESA.tel, M, H - 34, 7.4, 'normal', C.MUTED);
      text(T('Pàg.') + ' ' + i + ' / ' + n, W - M, H - 34, 7.4, 'normal', C.MUTED, { align: 'right' });
    }
    doc.setProperties({ title: net(T('Catàleg {0}', any)) + ' · HIGIENEX', subject: net(T('Catàleg de productes')), author: HXPDF.EMPRESA.nom });
    if (!window.HXPDF_SENSE_DESAR) doc.save(net(T('Catàleg')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_') + '_HIGIENEX_' + any + '.pdf');
    return doc;
  }

  function installar() {
    if (window.HXPDF_DOCS) window.HXPDF_DOCS.cataleg = cataleg;
    else setTimeout(installar, 200);
  }
  window.HXCataleg = { generar: cataleg, imatge: carregarImatge, preu: preuGarrafa, slug: slug };

  /* ---------- Fotos en miniatura per a tots els PDF ----------
     Els documents de comanda, factura i pressupost es generen de cop (sense esperar),
     així que les fotos es preparen un cop carregada la pàgina i es guarden aquí. */
  var FOTOS = {};
  function clau(nom) { return String(nom || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function precarregar() {
    if (typeof CMP_DATA === 'undefined') return;
    Object.keys(CMP_DATA).forEach(function (n) {
      if (FOTOS[clau(n)]) return;
      carregarImatge(slug(n), 420).then(function (f) { if (f) FOTOS[clau(n)] = f; });
    });
  }
  if (document.readyState === 'complete') setTimeout(precarregar, 1500);
  else window.addEventListener('load', function () { setTimeout(precarregar, 1500); });
  function fotoDe(nom) { return FOTOS[clau(nom)] || null; }
  /* Requadre blanc amb la foto del producte */
  function miniatura(doc, nom, x, y, w, h) {
    var f = fotoDe(nom); if (!f) return false;
    doc.setFillColor(255, 255, 255); doc.setDrawColor(227, 232, 237); doc.setLineWidth(0.5); doc.roundedRect(x, y, w, h, 3, 3, 'FD');
    var s = Math.min((w - 4) / f.w, (h - 4) / f.h), fw = f.w * s, fh = f.h * s;
    doc.addImage(f.data, 'JPEG', x + (w - fw) / 2, y + (h - fh) / 2, fw, fh, 'mini-' + clau(nom), 'FAST');
    return true;
  }
  /* Afegeix la miniatura a la columna d'una taula d'autoTable */
  function ambFotos(t, col, nomFila, doc) {
    var pdc = t.didParseCell, ddc = t.didDrawCell;
    t.didParseCell = function (d) {
      if (pdc) pdc(d);
      if (d.section === 'body' && d.column.index === col && fotoDe(nomFila(d.row.index))) {
        var p = d.cell.styles.cellPadding;
        d.cell.styles.cellPadding = { top: 9, bottom: 9, left: 46, right: (p && p.right) || 10 };
        d.cell.styles.minCellHeight = 42;
      }
    };
    t.didDrawCell = function (d) {
      if (d.section === 'body' && d.column.index === col) {
        var nom = nomFila(d.row.index);
        if (fotoDe(nom)) miniatura(doc || (d.doc), nom, d.cell.x + 8, d.cell.y + 5, 30, d.cell.height - 10);
      }
      if (ddc) ddc(d);
    };
    return t;
  }
  if (window.HXPDF) { HXPDF.foto = fotoDe; HXPDF.miniatura = miniatura; HXPDF.ambFotos = ambFotos; HXPDF.precarregarFotos = precarregar; }
  installar();
})();
