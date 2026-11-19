/* ==========================================================================
   HIGIENEX · plantilla comuna dels PDF de la web (jsPDF + autoTable)
   Tots els documents comparteixen el mateix aspecte que el pressupost:
   capçalera en blau tinta amb el logotip, franja de dades clau, seccions
   numerades, taules netes i peu amb les dades de l'empresa i les pàgines.

   Ús:
     var k = HXPDF.nou({ kicker: 'FITXA TÈCNICA', titol: 'Fitxa tècnica', num: 'ECO Concentrat Pro', data: '18/11/2026' });
     k.franja([['PREU', '12,50 €'], ...]);
     k.seccio('Descripció', 1);  k.paragraf('…');
     k.tancar('Fitxer.pdf', 'Nota legal opcional del peu');
   ========================================================================== */
(function () {
  'use strict';

  var C = {
    NAVY: [11, 61, 107],
    TINTA: [14, 42, 63],
    GOLD: [242, 169, 0],
    GOLD_D: [184, 134, 11],
    INK: [22, 35, 46],
    TXT: [74, 90, 106],
    MUTED: [112, 128, 146],
    PALE: [178, 200, 222],
    LINE: [227, 232, 237],
    SOFT: [245, 248, 251],
    CREAM: [255, 246, 224],
    CREAM_L: [245, 214, 140],
    OK: [11, 114, 86],
    OK_BG: [229, 243, 238],
    WARN: [138, 89, 0],
    WARN_BG: [250, 241, 222],
    BAD: [150, 42, 32],
    BAD_BG: [248, 231, 228],
  };
  var EMPRESA = {
    nom: 'HIGIENEX S.L.',
    cif: 'B12345678',
    adreca: 'Carrer de la Indústria, 25 · 46010 València',
    tel: '631 706 398',
    mail: 'contacto@higienexvalencia.es',
    web: 'higienexvalencia.es',
  };

  /* Traducció (pdf-i18n.js); si no ha carregat, es deixa el text en català. */
  function tr(t) { return window.HXT ? window.HXT.apply(null, arguments) : t; }
  function disponible() {
    return !!(window.jspdf && window.jspdf.jsPDF && typeof new window.jspdf.jsPDF().autoTable === 'function');
  }

  function eur(n) {
    var neg = Number(n) < 0;
    var v = (Math.round(Math.abs(Number(n) || 0) * 100) / 100).toFixed(2).split('.');
    return (neg ? '-' : '') + v[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + v[1] + ' €';
  }
  function dd(d) {
    d = d || new Date();
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
  }
  /* Helvetica de jsPDF només té els caràcters de Windows-1252: es canvien els que no hi són. */
  function net(t) {
    return String(t == null ? '' : t)
      .replace(/[−–]/g, '-')
      .replace(/₂/g, '2')
      .replace(/[✓✔]/g, '')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/ /g, ' ');
  }

  function nou(o) {
    o = o || {};
    var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    var W = 595.28,
      H = 841.89,
      M = 40,
      BAIX = H - 64;
    var k = { doc: doc, W: W, H: H, M: M, C: C, E: EMPRESA, eur: eur, dd: dd, net: net, y: 0 };
    var titolCurt = net(o.titolCurt || o.titol || '');
    doc.setProperties({
      title: net((o.titol || '') + (o.num ? ' ' + o.num : '')),
      subject: net(o.kicker || ''),
      author: EMPRESA.nom,
      creator: EMPRESA.nom + ' · ' + EMPRESA.web,
    });

    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    k.fill = fill; k.stroke = stroke; k.color = color;

    function kicker(t, x, y, c, align) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); color(c || C.MUTED); doc.setCharSpace(1);
      var tx = net(t).toUpperCase();
      if (align === 'right') x -= doc.getTextWidth(tx) + tx.length * 1;
      doc.text(tx, x, y); doc.setCharSpace(0);
    }
    k.kicker = kicker;

    function logo(x, y, mida, blanc) {
      doc.setFont('times', 'bold'); doc.setFontSize(mida);
      if (blanc) doc.setTextColor(255, 255, 255); else color(C.NAVY);
      doc.text('HIGIENE', x, y);
      doc.setFont('times', 'bolditalic'); color(C.GOLD);
      doc.text('X', x + doc.getTextWidth('HIGIENE') + 1, y);
    }
    k.logo = logo;

    k.capcalera = function (primera) {
      var hh = primera ? 108 : 54;
      fill(C.NAVY); doc.rect(0, 0, W, hh, 'F');
      /* reflex suau a la dreta, com la portada del panell */
      doc.setFillColor(21, 82, 138);
      if (primera) doc.circle(W - 40, -30, 120, 'F'); else doc.circle(W - 30, -20, 64, 'F');
      fill(C.NAVY); doc.rect(0, hh - 1, W, 1, 'F');
      fill(C.GOLD); doc.rect(0, hh, W, 3, 'F');
      if (primera) {
        logo(M, 50, 30, true);
        doc.setFont('helvetica', 'normal'); color(C.PALE);
        doc.setFontSize(7.5); doc.setCharSpace(1.6); doc.text(net(tr('HIGIENE PROFESSIONAL SOSTENIBLE')), M, 68); doc.setCharSpace(0);
        doc.setFontSize(8.5); doc.text(EMPRESA.nom + '  ·  CIF ' + EMPRESA.cif, M, 86);
        if (o.kicker) kicker(o.kicker, W - M, 30, C.GOLD, 'right');
        doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
        var t = net(o.titol || '');
        var mida = 22;
        doc.setFontSize(mida);
        while (doc.getTextWidth(t) > 300 && mida > 13) { mida -= 1; doc.setFontSize(mida); }
        doc.text(t, W - M, 55, { align: 'right' });
        if (o.num) { doc.setFontSize(10.5); color(C.GOLD); doc.text(net(o.num), W - M, 73, { align: 'right' }); }
        if (o.data !== false) {
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); color(C.PALE);
          doc.text(net(o.etiquetaData || tr('Data')) + ': ' + net(o.data || dd()), W - M, 89, { align: 'right' });
        }
      } else {
        logo(M, 34, 17, true);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(255, 255, 255);
        doc.text(titolCurt + (o.num ? ' · ' + net(o.num) : ''), W - M, 32, { align: 'right' });
      }
    };

    k.nouFull = function () { doc.addPage(); k.capcalera(false); k.y = 82; };
    k.cal = function (h) { if (k.y + h > BAIX) k.nouFull(); };

    /* Franja de dades clau: [[etiqueta, valor, destacat?], ...] */
    k.franja = function (claus) {
      var y = k.y, cw = (W - 2 * M) / claus.length;
      fill(C.SOFT); stroke(C.LINE); doc.setLineWidth(0.6); doc.roundedRect(M, y, W - 2 * M, 46, 5, 5, 'FD');
      claus.forEach(function (c, i) {
        var x = M + i * cw + 14;
        if (i) { stroke(C.LINE); doc.line(M + i * cw, y + 9, M + i * cw, y + 37); }
        kicker(c[0], x, y + 18);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(c[2] ? 11 : 9.6); color(c[2] ? C.NAVY : C.INK);
        doc.text(doc.splitTextToSize(net(c[1]), cw - 22)[0], x, y + 34);
      });
      k.y = y + 64;
    };

    /* Dues caixes (client / emissor…): [{titol, linies:[negreta, ...], accent}] */
    k.caixes = function (caixes, alt) {
      var n = caixes.length, gap = 16, bw = (W - 2 * M - gap * (n - 1)) / n, y = k.y;
      alt = alt || 92;
      caixes.forEach(function (c, i) {
        var x = M + i * (bw + gap);
        stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, bw, alt, 5, 5, 'FD');
        fill(c.accent || (i ? C.NAVY : C.GOLD)); doc.rect(x, y + 10, 3, 20, 'F');
        kicker(c.titol, x + 14, y + 18);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); color(C.INK);
        doc.text(doc.splitTextToSize(net(c.linies[0] || '—'), bw - 28)[0], x + 14, y + 34);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); color(C.TXT);
        c.linies.slice(1).filter(Boolean).slice(0, 4).forEach(function (l, j) {
          doc.text(doc.splitTextToSize(net(l), bw - 28)[0], x + 14, y + 50 + j * 12);
        });
      });
      k.y = y + alt + 20;
    };

    /* Títol de secció amb número (només quan els apartats van en ordre) */
    k.seccio = function (titol, num) {
      k.cal(46);
      var y = k.y + 12, x = M;
      if (num != null) {
        fill(C.NAVY); doc.roundedRect(M, y - 11, 22, 16, 3, 3, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(255, 255, 255);
        doc.text(String(num), M + 11, y, { align: 'center' });
        x = M + 30;
      }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11.5); color(C.INK);
      doc.text(net(titol), x, y);
      stroke(C.LINE); doc.setLineWidth(0.6); doc.line(M, y + 8, W - M, y + 8);
      fill(C.GOLD); doc.rect(M, y + 7, 30, 2, 'F');
      k.y = y + 22;
    };

    /* Paràgraf. Admet **negreta** dins del text. */
    k.paragraf = function (text, opc) {
      opc = opc || {};
      var mida = opc.mida || 9.2, int = mida * 1.45, amp = W - 2 * M - (opc.sagnat || 0);
      doc.setFontSize(mida);
      var trossos = net(text).split('**');
      /* text amb negretes: es compon paraula a paraula */
      var linies = [[]], ample = 0;
      trossos.forEach(function (tr, i) {
        var neg = i % 2 === 1;
        doc.setFont('helvetica', neg ? 'bold' : 'normal');
        tr.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          var w = doc.getTextWidth(p);
          if (/^\s+$/.test(p)) { if (ample) { linies[linies.length - 1].push({ t: ' ', n: neg, w: doc.getTextWidth(' ') }); ample += doc.getTextWidth(' '); } return; }
          if (ample + w > amp && ample) { linies.push([]); ample = 0; }
          linies[linies.length - 1].push({ t: p, n: neg, w: w }); ample += w;
        });
      });
      linies.forEach(function (l) {
        k.cal(int);
        var x = M + (opc.sagnat || 0);
        l.forEach(function (p) {
          doc.setFont('helvetica', p.n ? 'bold' : 'normal'); color(p.n ? C.INK : opc.color || C.TXT);
          doc.text(p.t, x, k.y + mida); x += p.w;
        });
        k.y += int;
      });
      k.y += opc.despres != null ? opc.despres : 12;
    };

    /* Llista amb pics daurats */
    k.llista = function (elements, opc) {
      opc = opc || {};
      elements.forEach(function (t) {
        doc.setFontSize(opc.mida || 9);
        var ls = doc.splitTextToSize(net(t), W - 2 * M - 16);
        k.cal(ls.length * 12 + 4);
        fill(C.GOLD); doc.circle(M + 3, k.y + 5.5, 1.9, 'F');
        doc.setFont('helvetica', 'normal'); color(C.TXT); doc.text(ls, M + 14, k.y + 8.5);
        k.y += ls.length * 12.4 + 4;
      });
      k.y += 6;
    };

    /* Taula de parells etiqueta / valor */
    k.parells = function (files, opc) {
      opc = opc || {};
      k.taula({
        body: files.map(function (f) { return [net(f[0]), net(f[1])]; }),
        sensCap: true,
        columnStyles: { 0: { cellWidth: opc.ampleEtiqueta || 160, fontStyle: 'bold', textColor: C.INK, fillColor: C.SOFT }, 1: { textColor: C.TXT } },
      });
    };

    /* Taula estàndard (autoTable) */
    k.taula = function (t) {
      var cfg = {
        startY: k.y,
        body: t.body,
        theme: 'plain',
        margin: { left: M, right: M, top: 78, bottom: 70 },
        styles: { font: 'helvetica', fontSize: t.mida || 9, textColor: C.INK, cellPadding: { top: 7, bottom: 7, left: 10, right: 10 }, valign: 'middle', overflow: 'linebreak' },
        headStyles: { fillColor: C.NAVY, textColor: 255, fontStyle: 'bold', fontSize: 7.5, cellPadding: { top: 9, bottom: 9, left: 10, right: 10 } },
        alternateRowStyles: t.sensCap ? {} : { fillColor: C.SOFT },
        columnStyles: t.columnStyles || {},
        didParseCell: function (d) {
          if (d.section === 'head' && t.columnStyles && t.columnStyles[d.column.index] && t.columnStyles[d.column.index].halign) d.cell.styles.halign = t.columnStyles[d.column.index].halign;
          if (t.didParseCell) t.didParseCell(d);
        },
        willDrawCell: t.willDrawCell,
        didDrawCell: function (d) {
          if (t.didDrawCell) t.didDrawCell(d);
          if (d.section === 'body') { stroke(C.LINE); doc.setLineWidth(0.5); doc.line(d.cell.x, d.cell.y + d.cell.height, d.cell.x + d.cell.width, d.cell.y + d.cell.height); }
        },
        didDrawPage: function (d) { if (d.pageNumber > 1) k.capcalera(false); },
      };
      if (!t.sensCap) cfg.head = [t.head.map(function (h) { return net(h).toUpperCase(); })];
      if (t.sensCap) { cfg.styles.lineColor = C.LINE; }
      doc.autoTable(cfg);
      k.y = doc.lastAutoTable.finalY + (t.despres != null ? t.despres : 18);
    };

    /* Caixa de totals alineada a la dreta. files: [[etiqueta, valor, colorOpcional]] */
    k.totals = function (files, etiquetaTotal, total, opc) {
      opc = opc || {};
      var tw = opc.ample || 230, tx = W - M - tw, th = 22 + files.length * 20 + 44;
      k.cal(th + 10);
      var y = k.y;
      stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(tx, y, tw, th, 5, 5, 'FD');
      var yt = y + 22;
      files.forEach(function (f) {
        doc.setFont('helvetica', f[2] ? 'bold' : 'normal'); doc.setFontSize(9.4); color(f[2] || C.TXT);
        doc.text(net(f[0]), tx + 14, yt); color(f[2] || C.INK); doc.text(net(f[1]), W - M - 14, yt, { align: 'right' }); yt += 20;
      });
      var ytot = y + th - 44;
      fill(C.NAVY); doc.roundedRect(tx, ytot, tw, 44, 5, 5, 'F'); doc.rect(tx, ytot, tw, 8, 'F');
      kicker(etiquetaTotal, tx + 14, ytot + 26, C.PALE);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255); doc.text(net(total), W - M - 14, ytot + 28, { align: 'right' });
      if (opc.esquerra) opc.esquerra(M, y, W - 2 * M - tw - 18, th);
      k.y = y + th + 20;
    };

    /* Avís destacat. tipus: 'crema' (per defecte), 'ok', 'avis', 'blau' */
    k.avis = function (titol, text, tipus) {
      var bg = { crema: C.CREAM, ok: C.OK_BG, avis: C.WARN_BG, blau: [234, 241, 248] }[tipus || 'crema'];
      var vora = { crema: C.CREAM_L, ok: [170, 214, 196], avis: [235, 205, 150], blau: [196, 214, 232] }[tipus || 'crema'];
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6);
      var ls = doc.splitTextToSize(net(text), W - 2 * M - 32);
      var h = (titol ? 30 : 16) + ls.length * 11.5 + 6;
      k.cal(h + 6);
      fill(bg); stroke(vora); doc.setLineWidth(0.6); doc.roundedRect(M, k.y, W - 2 * M, h, 5, 5, 'FD');
      var yy = k.y + 20;
      if (titol) { doc.setFont('helvetica', 'bold'); doc.setFontSize(10); color(C.INK); doc.text(net(titol), M + 16, yy); yy += 16; }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); color(C.TXT); doc.text(ls, M + 16, yy);
      k.y += h + 16;
    };

    /* Targetes de xifres: [[valor, etiqueta, color]] */
    k.xifres = function (xs) {
      var gap = 12, n = xs.length, cw = (W - 2 * M - gap * (n - 1)) / n;
      k.cal(70);
      xs.forEach(function (x, i) {
        var cx = M + i * (cw + gap);
        stroke(C.LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(cx, k.y, cw, 60, 5, 5, 'FD');
        fill(x[2] || C.NAVY); doc.rect(cx, k.y + 57, cw, 3, 'F');
        kicker(x[1], cx + 12, k.y + 18);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(15); color(x[2] || C.NAVY);
        doc.text(net(x[0]), cx + 12, k.y + 42);
      });
      k.y += 78;
    };

    /* Etiqueta en forma de píndola */
    k.pindola = function (text, x, y, fg, bg, align) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
      var t = net(text).toUpperCase(), w = doc.getTextWidth(t) + 16;
      if (align === 'right') x -= w;
      fill(bg); doc.roundedRect(x, y, w, 15, 7.5, 7.5, 'F'); color(fg); doc.text(t, x + w / 2, y + 10.4, { align: 'center' });
      return w;
    };

    /* Peu a totes les pàgines i descàrrega */
    k.tancar = function (fitxer, nota) {
      if (nota) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.4);
        var ls = doc.splitTextToSize(net(nota), W - 2 * M);
        if (k.y + ls.length * 9.5 > H - 58) k.nouFull();
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.4);
        color(C.MUTED); doc.text(ls, M, k.y + 4);
      }
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) {
        doc.setPage(i);
        stroke(C.GOLD); doc.setLineWidth(1); doc.line(M, H - 48, W - M, H - 48);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.4); color(C.MUTED);
        doc.text(EMPRESA.nom + '  ·  CIF ' + EMPRESA.cif + '  ·  ' + EMPRESA.adreca + '  ·  ' + EMPRESA.tel + '  ·  ' + EMPRESA.mail, M, H - 34);
        doc.text(net(o.pagina || tr('Pàg.')) + ' ' + i + ' / ' + n, W - M, H - 34, { align: 'right' });
        doc.setFontSize(6.6); color(C.PALE);
        doc.text(net(o.generat || tr('Document generat a higienexvalencia.es')) + ' · ' + dd() + ' ' + new Date().toTimeString().slice(0, 5), M, H - 24);
      }
      if (fitxer) doc.save(fitxer);
      return doc;
    };

    k.capcalera(true);
    k.y = 134;
    return k;
  }

  window.HXPDF = { nou: nou, disponible: disponible, eur: eur, dd: dd, net: net, C: C, EMPRESA: EMPRESA };
})();
