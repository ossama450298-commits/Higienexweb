/* ==========================================================================
   HIGIENEX · PDF en àrab (pdf-arab.js)
   Amb la web en àrab, els PDF que rep el client (comanda, pressupost i
   factura) surten en àrab. Es carrega la tipografia «HX Arab» (lletres àrabs
   i llatines: noms de producte, números, €) i es fa servir en lloc de la
   Helvetica, que no té lletres àrabs. jsPDF ja enllaça les lletres i les
   ordena de dreta a esquerra. Els textos que no són aquí surten en anglès.
   ========================================================================== */
(function () {
  'use strict';
  var AR = {
    'A l’atenció de: {0}': 'إلى عناية: {0}',
    "Aquest document és un justificant de comanda, no una factura. La factura s'emetrà quan s'expedeixi la mercaderia. Per a qualsevol consulta, indica el número de comanda.": 'هذا المستند إيصال طلب وليس فاتورة. ستصدر الفاتورة عند شحن البضاعة. لأي استفسار، اذكر رقم الطلب.',
    'Base imposable': 'الأساس الخاضع للضريبة',
    'COMANDA CONFIRMADA': 'تم تأكيد الطلب',
    CONFIRMAT: 'مؤكَّد',
    Client: 'العميل',
    Comanda: 'الطلب',
    Confirmat: 'مؤكَّد',
    Data: 'التاريخ',
    'Data de comanda': 'تاريخ الطلب',
    'Data de factura': 'تاريخ الفاتورة',
    'Descarregar el PDF de la comanda': 'تنزيل ملف PDF للطلب',
    'Descompte de client ({0} %)': 'خصم العميل {0}%',
    'Descompte per volum': 'خصم الكمية',
    'Descomptes per volum': 'خصومات الكمية',
    'Detall de la comanda': 'تفاصيل الطلب',
    'Document generat a higienexvalencia.es': 'مستند صادر من higienexvalencia.es',
    'Dte.': 'خصم',
    Emissor: 'المُصدِر',
    'En preparació': 'قيد التحضير',
    Entregada: 'تم التسليم',
    Enviada: 'تم الشحن',
    'Escaneja el codi per veure on és la comanda {0} en tot moment. També ho pots consultar a la web, a Seguiment de comanda.': 'امسح الرمز لمعرفة مكان الطلب {0} في أي وقت. يمكنك أيضًا متابعته على الموقع في «تتبّع الطلب».',
    'Escriu a contacto@higienexvalencia.es o truca al 631 706 398 indicant el número de pressupost.': 'راسلنا على contacto@higienexvalencia.es أو اتصل على 631706398 34+ مع ذكر رقم عرض السعر.',
    Estat: 'الحالة',
    'Estat de la comanda': 'حالة الطلب',
    Factura: 'فاتورة',
    'Gràcies per la teva comanda. Ja la estem preparant.': 'شكرًا على طلبك. نحن نُحضّره الآن.',
    'HIGIENE PROFESSIONAL SOSTENIBLE': 'نظافة مهنية مستدامة',
    'Hem rebut el pagament. Prepararem la comanda i rebràs un avís quan surti del magatzem.': 'استلمنا الدفعة. سنُحضّر الطلب وسيصلك إشعار عند خروجه من المستودع.',
    'Hem rebut la teva comanda {0} — HIGIENEX': 'استلمنا طلبك {0} — HIGIENEX',
    'IVA ({0} %)': 'ضريبة القيمة المضافة {0}%',
    Import: 'المبلغ',
    'Import brut': 'المبلغ الإجمالي',
    'Justificant de comanda': 'إيصال الطلب',
    'Justificant de la comanda en PDF (descàrrega): {0}': 'إيصال الطلب بصيغة PDF (للتنزيل): {0}',
    'Lliurament estimat': 'التسليم المتوقع',
    'O escaneja el codi per fer la comanda a la web.': 'أو امسح الرمز لتقديم الطلب على الموقع.',
    PAGAMENT: 'الدفع',
    Pagament: 'الدفع',
    'Pagament per transferència a CaixaBank · ES21 2100 4455 6612 3456 7890 · Indica el número de factura.': 'الدفع بتحويل بنكي إلى CaixaBank · ES21 2100 4455 6612 3456 7890 · اذكر رقم الفاتورة.',
    'Per confirmar la comanda, indica el número {0} al nostre equip comercial.': 'لتأكيد الطلب، أبلغ فريق المبيعات بالرقم {0}.',
    'Pots seguir la comanda a la web, a «Seguiment de comanda», amb el número {0}.': 'يمكنك متابعة الطلب على الموقع في «تتبّع الطلب» بالرقم {0}.',
    Pressupost: 'عرض سعر',
    'Pressupost sense compromís, vàlid fins al {0}.': 'عرض سعر دون التزام، صالح حتى {0}.',
    'Preu/ut.': 'سعر الوحدة',
    'Preus en euros. Descomptes per volum aplicats automàticament.': 'الأسعار باليورو. خصومات الكمية مطبّقة تلقائيًا.',
    Producte: 'المنتج',
    'Pàg.': 'صفحة',
    Rebuda: 'مستلَم',
    'Segueix la comanda des del mòbil': 'تابع طلبك من هاتفك',
    'Subtotal productes': 'مجموع المنتجات',
    Total: 'الإجمالي',
    'Total (IVA incl.)': 'الإجمالي شامل الضريبة',
    'Total (IVA inclòs)': 'الإجمالي شامل الضريبة',
    Transport: 'الشحن',
    'Transport de {0} per comanda. IVA del {1} % inclòs al total.': 'شحن بقيمة {0} لكل طلب. ضريبة القيمة المضافة {1} % مشمولة في الإجمالي.',
    'Uds.': 'الكمية',
    Venciment: 'تاريخ الاستحقاق',
    'Vols confirmar-lo o ajustar quantitats?': 'هل تريد تأكيده أو تعديل الكميات؟',
    '{0} referència': '{0} صنف',
    '{0} referències': '{0} أصناف',
    'Pressupost sense compromís': 'عرض سعر دون التزام',
    Condicions: 'الشروط',
    Pagada: 'مدفوعة',
    Pendent: 'معلّقة',
    'Vençuda': 'متأخرة',
    'Pagament confirmat': 'تم تأكيد الدفع',
    'Data d’emissió': 'تاريخ الإصدار',
    'Vàlid fins al': 'صالح حتى',
    Productes: 'المنتجات',
  };
  var FONT = 'HXArab', carregada = false, b64 = {};

  function enArab() {
    if (window.HX_LANG_DOC) return window.HX_LANG_DOC === 'ar'; // documentos en el idioma del cliente
    try { return localStorage.getItem('hx_lang') === 'ar'; } catch (e) { return false; }
  }
  function aB64(buf) {
    var s = '', a = new Uint8Array(buf), i;
    for (i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000));
    return btoa(s);
  }
  // La tipografia es baixa només amb la web en àrab (uns 330 KB), abans que calgui fer cap PDF.
  function carregar() {
    if (carregada || !(enArab() || (window.hxIdiomaDocs && window.hxIdiomaDocs() === 'ar'))) return;
    carregada = 'baixant';
    Promise.all(['regular', 'bold'].map(function (p) {
      return fetch('fonts/hx-arab-' + p + '.ttf').then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(function (buf) { b64[p] = aB64(buf); });
    })).then(function () { carregada = true; }).catch(function (e) { carregada = false; console.warn('Tipografia àrab no disponible', e); });
  }
  window.hxCarregarArab = carregar;
  function actiu() { return carregada === true && enArab(); }

  /* Traduccions: amb la tipografia a punt, l'àrab; si no, l'anglès de sempre */
  function enganxarHXT() {
    var T = window.HXT;
    if (!T || T._hxAr) return !!T;
    var nou = function (text) {
      if (actiu() && AR[text] && !T.forcat) {
        var args = Array.prototype.slice.call(arguments, 1);
        return AR[text].replace(/\{(\d)\}/g, function (m, i) { return args[i] != null ? args[i] : m; });
      }
      return T.apply(this, arguments);
    };
    Object.keys(T).forEach(function (k) { nou[k] = T[k]; });
    nou._hxAr = true;
    window.HXT = nou;
    return true;
  }

  /* jsPDF: la Helvetica es canvia per «HX Arab» a tots els PDF mentre la web és en àrab */
  function enganxarJsPDF() {
    var J = window.jspdf && window.jspdf.jsPDF;
    if (!J || J.API._hxAr) return !!J;
    // setFont és de cada document: s'embolcalla en crear-lo (esdeveniment «initialized» de jsPDF)
    J.API.events.push(['initialized', function () {
      var doc = this, setFont = doc.setFont;
      doc.setFont = function (nom, estil) {
        if (actiu() && (!nom || /^helvetica$/i.test(nom))) {
          if (!doc.getFontList()[FONT]) {
            doc.addFileToVFS('hx-arab-regular.ttf', b64.regular);
            doc.addFont('hx-arab-regular.ttf', FONT, 'normal');
            doc.addFileToVFS('hx-arab-bold.ttf', b64.bold);
            doc.addFont('hx-arab-bold.ttf', FONT, 'bold');
          }
          return setFont.call(doc, FONT, /bold/i.test(String(estil || '')) ? 'bold' : 'normal');
        }
        return setFont.apply(doc, arguments);
      };
      // l'espaiat entre lletres trencaria les lletres àrabs enllaçades
      var setCharSpace = doc.setCharSpace;
      doc.setCharSpace = function (v) { return setCharSpace.call(doc, actiu() ? 0 : v); };
      if (actiu()) doc.setFont('helvetica', 'normal');
    }]);
    J.API._hxAr = true;
    return true;
  }

  function iniciar() {
    carregar();
    enganxarHXT(); enganxarJsPDF();
    // en canviar d'idioma a l'àrab, es baixa la tipografia
    var a = window.hxApplyLang;
    if (typeof a === 'function' && !a._hxAr) {
      var w = function () { var r = a.apply(this, arguments); carregar(); return r; };
      w._hxAr = true; window.hxApplyLang = w;
    }
  }
  window.HXArab = { actiu: actiu, carregar: carregar };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  // jsPDF i les traduccions es poden carregar més tard: es tornen a enganxar quan hi siguin
  var n = 0, t = setInterval(function () { if ((enganxarHXT() && enganxarJsPDF()) || ++n > 40) clearInterval(t); }, 500);
})();
