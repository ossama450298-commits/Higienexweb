/* ============================================================
   HIGIENEX — Millores per al client (hx-plus.js)
   · Repetir una comanda en un clic i comandes programades
   · Calculadora de dosificació i cost per ús
   · Previsió de reposició (i enllaç ?repetir= dels emails d'avís)
   · QR de producte: obre la fitxa i la FDS en l'idioma del mòbil
   · Diverses seus per client
   · Demanar una cita (visita, formació o auditoria)
   Tots els textos, en els 6 idiomes de la web (ca, es, en, fr, de, ar).
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var WEB = 'https://ossama450298-commits.github.io/Higienexweb/';

  function lang() {
    var l = 'ca';
    try { l = localStorage.getItem('hx_lang') || 'ca'; } catch (e) { /* sense emmagatzematge: català */ }
    return LANGS.indexOf(l) >= 0 ? l : 'ca';
  }
  var LOCALE = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' };

  /* ---------- textos: [ca, es, en, fr, de, ar] ---------- */
  var D = {
    menuCalc: ['🧮 Calculadora de cost per ús', '🧮 Calculadora de coste por uso', '🧮 Cost-per-use calculator', '🧮 Calculateur de coût par usage', '🧮 Kosten-pro-Anwendung-Rechner', "🧮 حاسبة تكلفة الاستخدام"],
    menuCita: ['📅 Demana una cita', '📅 Pide una cita', '📅 Book an appointment', '📅 Prendre rendez-vous', '📅 Termin vereinbaren', "📅 احجز موعدًا"],
    // calculadora
    calcTag: ['🧮 Eina per a compres', '🧮 Herramienta para compras', '🧮 Purchasing tool', '🧮 Outil pour les achats', '🧮 Werkzeug für den Einkauf', "🧮 أداة للمشتريات"],
    calcTitle: ['Quant et costa cada neteja?', '¿Cuánto te cuesta cada limpieza?', 'How much does each clean cost you?', 'Combien vous coûte chaque nettoyage ?', 'Was kostet Sie jede Reinigung?', "كم تكلّفك كل عملية تنظيف؟"],
    calcSub: [
      "Tria el producte i la superfície: et diem quant n'has de posar per litre d'aigua, quant costa cada ús i quant gastaràs al mes. Compara-ho amb el que fas servir ara.",
      'Elige el producto y la superficie: te decimos cuánto echar por litro de agua, cuánto cuesta cada uso y cuánto gastarás al mes. Compáralo con lo que usas ahora.',
      'Pick the product and the surface: we tell you how much to add per litre of water, what each use costs and your monthly spend. Compare it with what you use now.',
      "Choisissez le produit et la surface : nous vous indiquons la dose par litre d'eau, le coût de chaque usage et votre dépense mensuelle. Comparez avec votre produit actuel.",
      'Wählen Sie Produkt und Fläche: Wir sagen Ihnen die Dosierung pro Liter Wasser, die Kosten pro Anwendung und Ihre Monatsausgaben. Vergleichen Sie mit Ihrem jetzigen Produkt.',
      "اختر المنتج والسطح: نخبرك بالكمية المناسبة لكل لتر ماء، وتكلفة كل استخدام، وإنفاقك الشهري. قارنها بما تستخدمه الآن.",
    ],
    producte: ['Producte', 'Producto', 'Product', 'Produit', 'Produkt', "المنتج"],
    us: ['Superfície o ús', 'Superficie o uso', 'Surface or use', "Surface ou usage", 'Fläche oder Anwendung', "السطح أو الاستخدام"],
    suelos: ['Terres', 'Suelos', 'Floors', 'Sols', 'Böden', "الأرضيات"],
    superficies: ['Superfícies i mobiliari', 'Superficies y mobiliario', 'Surfaces and furniture', 'Surfaces et mobilier', 'Oberflächen und Mobiliar', "الأسطح والأثاث"],
    banos: ['Banys', 'Baños', 'Bathrooms', 'Sanitaires', 'Sanitärbereiche', "الحمّامات"],
    cocina: ['Cuina i indústria alimentària', 'Cocina e industria alimentaria', 'Kitchens and food industry', 'Cuisine et agroalimentaire', 'Küche und Lebensmittelindustrie', "المطابخ والصناعات الغذائية"],
    desinfeccion: ['Desinfecció (polvoritzador)', 'Desinfección (pulverizador)', 'Disinfection (spray)', 'Désinfection (pulvérisateur)', 'Desinfektion (Sprühflasche)', "التطهير (بخاخ)"],
    litresUs: ['Litres de solució per ús', 'Litros de solución por uso', 'Litres of solution per use', 'Litres de solution par usage', 'Liter Lösung pro Anwendung', "لترات المحلول لكل استخدام"],
    litresUsAj: ['Una galleda sol tenir 8 L; desinfectar una habitació amb polvoritzador, uns 0,05 L.', 'Un cubo suele tener 8 L; desinfectar una habitación con pulverizador, unos 0,05 L.', 'A bucket is usually 8 L; spraying one room takes about 0.05 L.', 'Un seau fait en général 8 L ; désinfecter une pièce au pulvérisateur, environ 0,05 L.', 'Ein Eimer hat meist 8 L; einen Raum mit der Sprühflasche desinfizieren, etwa 0,05 L.', "الدلو عادةً 8 لترات؛ رش غرفة واحدة يحتاج نحو 0.05 لتر."],
    usosDia: ['Usos al dia', 'Usos al día', 'Uses per day', 'Usages par jour', 'Anwendungen pro Tag', "مرات الاستخدام يوميًا"],
    diesMes: ['Dies de neteja al mes', 'Días de limpieza al mes', 'Cleaning days per month', 'Jours de nettoyage par mois', 'Reinigungstage pro Monat', "أيام التنظيف شهريًا"],
    dosi: ['Dosi recomanada', 'Dosis recomendada', 'Recommended dose', 'Dose recommandée', 'Empfohlene Dosierung', "الجرعة الموصى بها"],
    mlL: ['{0} mL per litre d\'aigua', '{0} mL por litro de agua', '{0} mL per litre of water', "{0} mL par litre d'eau", '{0} mL pro Liter Wasser', "{0} مل لكل لتر ماء"],
    senseDiluir: ['Sense diluir, a punt per usar', 'Sin diluir, listo para usar', 'Undiluted, ready to use', 'Pur, prêt à l\'emploi', 'Unverdünnt, gebrauchsfertig', "دون تخفيف، جاهز للاستخدام"],
    perUs: ['Per cada ús', 'Por cada uso', 'Per use', 'Par usage', 'Pro Anwendung', "لكل استخدام"],
    mlProducte: ['{0} mL de producte', '{0} mL de producto', '{0} mL of product', '{0} mL de produit', '{0} mL Produkt', "{0} مل من المنتج"],
    alMes: ['Al mes', 'Al mes', 'Per month', 'Par mois', 'Pro Monat', "شهريًا"],
    garrafes: ['{0} L · {1} garrafes de 5 L', '{0} L · {1} garrafas de 5 L', '{0} L · {1} × 5 L containers', '{0} L · {1} bidons de 5 L', '{0} L · {1} Kanister à 5 L', "{0} لتر · {1} × عبوة 5 لترات"],
    concNota: [
      'Dosi segons la concentració de la fitxa ({0}): un producte ×3 necessita un terç de la dosi d\'un de convencional.',
      'Dosis según la concentración de la ficha ({0}): un producto ×3 necesita un tercio de la dosis de uno convencional.',
      'Dose based on the data-sheet concentration ({0}): a ×3 product needs a third of the dose of a conventional one.',
      "Dose selon la concentration de la fiche ({0}) : un produit ×3 demande un tiers de la dose d'un produit classique.",
      'Dosierung nach der Konzentration im Datenblatt ({0}): Ein ×3-Produkt braucht ein Drittel der Dosis eines herkömmlichen.',
      "الجرعة محسوبة وفق تركيز ورقة البيانات ({0}): المنتج المركّز ×3 يحتاج إلى ثلث جرعة المنتج التقليدي.",
    ],
    compara: ['Compara amb el teu producte actual', 'Compara con tu producto actual', 'Compare with your current product', 'Comparez avec votre produit actuel', 'Mit Ihrem jetzigen Produkt vergleichen', "قارن بمنتجك الحالي"],
    preuActual: ['Preu per litre (€)', 'Precio por litro (€)', 'Price per litre (€)', 'Prix au litre (€)', 'Preis pro Liter (€)', "السعر لكل لتر (€)"],
    dosiActual: ['Dosi que uses (mL/L)', 'Dosis que usas (mL/L)', 'Dose you use (mL/L)', 'Dose utilisée (mL/L)', 'Ihre Dosierung (mL/L)', "الجرعة التي تستخدمها (مل/لتر)"],
    estalvi: ['Estalviaries {0} al mes', 'Ahorrarías {0} al mes', 'You would save {0} a month', 'Vous économiseriez {0} par mois', 'Sie würden {0} pro Monat sparen', "ستوفّر {0} شهريًا"],
    estalviAny: ['{0} a l\'any · un {1} menys', '{0} al año · un {1} menos', '{0} a year · {1} less', '{0} par an · {1} de moins', '{0} pro Jahr · {1} weniger', "{0} سنويًا · {1} أقل"],
    mesCar: [
      'Amb aquestes dades, el teu producte actual surt {0} més barat al mes. Parla amb nosaltres i ho revisem.',
      'Con estos datos, tu producto actual sale {0} más barato al mes. Habla con nosotros y lo revisamos.',
      'With these figures your current product is {0} a month cheaper. Talk to us and we will review it.',
      'Avec ces chiffres, votre produit actuel revient {0} moins cher par mois. Parlons-en.',
      'Mit diesen Werten ist Ihr jetziges Produkt {0} pro Monat günstiger. Sprechen Sie uns an.',
      "بهذه الأرقام يكون منتجك الحالي أرخص بمقدار {0} شهريًا. تحدّث معنا وسنراجع الأمر.",
    ],
    actualMes: ['El teu producte actual: {0} al mes', 'Tu producto actual: {0} al mes', 'Your current product: {0} a month', 'Votre produit actuel : {0} par mois', 'Ihr jetziges Produkt: {0} pro Monat', "منتجك الحالي: {0} شهريًا"],
    afegirGarrafes: ['Afegeix {0} garrafes al cistell', 'Añadir {0} garrafas al carrito', 'Add {0} containers to the basket', 'Ajouter {0} bidons au panier', '{0} Kanister in den Warenkorb', "أضف {0} عبوات إلى السلة"],
    afegit: ['Afegit al cistell', 'Añadido al carrito', 'Added to basket', 'Ajouté au panier', 'In den Warenkorb gelegt', "أُضيف إلى السلة"],
    // cita
    citaTag: ['📅 Sense compromís', '📅 Sin compromiso', '📅 No obligation', '📅 Sans engagement', '📅 Unverbindlich', "📅 دون أي التزام"],
    citaTitle: ['Demana una visita, una auditoria o una formació', 'Pide una visita, una auditoría o una formación', 'Book a visit, an audit or a training session', 'Demandez une visite, un audit ou une formation', 'Besuch, Audit oder Schulung vereinbaren', "احجز زيارة أو تدقيقًا أو جلسة تدريب"],
    citaSub: [
      'Tria el dia i l\'hora que et vagi bé. Rebràs la confirmació per email i un tècnic et trucarà el dia abans.',
      'Elige el día y la hora que te vaya bien. Recibirás la confirmación por email y un técnico te llamará el día antes.',
      'Choose a day and time that suits you. You will get an email confirmation and a technician will call you the day before.',
      'Choisissez le jour et l\'heure qui vous conviennent. Vous recevrez une confirmation par e-mail et un technicien vous appellera la veille.',
      'Wählen Sie Tag und Uhrzeit. Sie erhalten eine Bestätigung per E-Mail, und ein Techniker ruft Sie am Vortag an.',
      "اختر اليوم والوقت المناسبين لك. ستصلك رسالة تأكيد بالبريد الإلكتروني وسيتصل بك فنّي في اليوم السابق.",
    ],
    tipus: ['Què necessites?', '¿Qué necesitas?', 'What do you need?', 'De quoi avez-vous besoin ?', 'Was brauchen Sie?', "ماذا تحتاج؟"],
    visita: ['Visita tècnica', 'Visita técnica', 'Technical visit', 'Visite technique', 'Technischer Besuch', "زيارة فنية"],
    formacion: ['Formació del personal', 'Formación del personal', 'Staff training', 'Formation du personnel', 'Personalschulung', "تدريب الفريق"],
    auditoria: ["Auditoria d'higiene", 'Auditoría de higiene', 'Hygiene audit', "Audit d'hygiène", 'Hygiene-Audit', "تدقيق النظافة"],
    visitaD: ['Revisem productes, dosis i procediments al teu centre.', 'Revisamos productos, dosis y procedimientos en tu centro.', 'We review products, doses and procedures on site.', 'Nous révisons produits, doses et procédures sur place.', 'Wir prüfen Produkte, Dosierung und Abläufe vor Ort.', "نراجع المنتجات والجرعات والإجراءات في موقعك."],
    formacionD: ['Sessió de 90 minuts per a l\'equip de neteja.', 'Sesión de 90 minutos para el equipo de limpieza.', '90-minute session for your cleaning team.', 'Séance de 90 minutes pour l\'équipe de nettoyage.', '90-minütige Schulung für Ihr Reinigungsteam.', "جلسة مدتها 90 دقيقة لفريق التنظيف لديك."],
    auditoriaD: ['Informe amb millores i estalvi estimat.', 'Informe con mejoras y ahorro estimado.', 'Report with improvements and estimated savings.', 'Rapport avec améliorations et économies estimées.', 'Bericht mit Verbesserungen und geschätzter Ersparnis.', "تقرير بالتحسينات والتوفير المتوقع."],
    dia: ['Dia', 'Día', 'Day', 'Jour', 'Tag', "اليوم"],
    hora: ['Hora', 'Hora', 'Time', 'Heure', 'Uhrzeit', "الوقت"],
    triaDia: ['Tria un dia del calendari.', 'Elige un día del calendario.', 'Pick a day on the calendar.', 'Choisissez un jour dans le calendrier.', 'Wählen Sie einen Tag im Kalender.', "اختر يومًا من التقويم."],
    ple: ['complet', 'completo', 'full', 'complet', 'ausgebucht', "محجوز"],
    nom: ['Nom i cognoms', 'Nombre y apellidos', 'Full name', 'Nom et prénom', 'Vor- und Nachname', "الاسم الكامل"],
    empresa: ['Empresa', 'Empresa', 'Company', 'Entreprise', 'Unternehmen', "الشركة"],
    email: ['Email', 'Email', 'Email', 'E-mail', 'E-Mail', "البريد الإلكتروني"],
    telefon: ['Telèfon', 'Teléfono', 'Phone', 'Téléphone', 'Telefon', "الهاتف"],
    notes: ['Què vols que revisem? (opcional)', '¿Qué quieres que revisemos? (opcional)', 'What should we look at? (optional)', 'Que souhaitez-vous que nous examinions ? (facultatif)', 'Was sollen wir prüfen? (optional)', "ما الذي تريد أن نراجعه؟ (اختياري)"],
    reservar: ['Reserva la cita', 'Reservar la cita', 'Book the appointment', 'Réserver le rendez-vous', 'Termin buchen', "احجز الموعد"],
    reservant: ['Reservant…', 'Reservando…', 'Booking…', 'Réservation…', 'Wird gebucht…', "جارٍ الحجز…"],
    citaOk: ['Cita reservada', 'Cita reservada', 'Appointment booked', 'Rendez-vous réservé', 'Termin gebucht', "تم حجز الموعد"],
    citaOkTxt: ['{0}, el {1} a les {2}. T\'hem enviat la confirmació a {3}.', '{0}, el {1} a las {2}. Te hemos enviado la confirmación a {3}.', '{0} on {1} at {2}. We have sent the confirmation to {3}.', '{0}, le {1} à {2}. Nous avons envoyé la confirmation à {3}.', '{0} am {1} um {2}. Die Bestätigung haben wir an {3} gesendet.', "{0} يوم {1} الساعة {2}. أرسلنا التأكيد إلى {3}."],
    calendari: ['Afegeix-la al calendari', 'Añádela al calendario', 'Add to calendar', 'Ajouter au calendrier', 'Zum Kalender hinzufügen', "أضف إلى التقويم"],
    altraCita: ['Demanar una altra cita', 'Pedir otra cita', 'Book another one', 'Prendre un autre rendez-vous', 'Weiteren Termin buchen', "احجز موعدًا آخر"],
    errCampos: ['Omple el nom i un email vàlid.', 'Rellena el nombre y un email válido.', 'Please enter your name and a valid email.', 'Indiquez votre nom et un e-mail valide.', 'Bitte Name und gültige E-Mail angeben.', "يُرجى إدخال اسمك وبريد إلكتروني صالح."],
    errHora: ['Tria un dia i una hora.', 'Elige un día y una hora.', 'Choose a day and a time.', 'Choisissez un jour et une heure.', 'Bitte Tag und Uhrzeit wählen.', "اختر يومًا ووقتًا."],
    errTaken: ["Aquesta hora s'acaba d'ocupar. Tria'n una altra.", 'Esa hora se acaba de ocupar. Elige otra.', 'That slot has just been taken. Please pick another.', 'Ce créneau vient d\'être pris. Choisissez-en un autre.', 'Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.', "حُجز هذا الموعد للتو. يُرجى اختيار موعد آخر."],
    errLimit: ['Has fet massa reserves avui. Truca al 631 706 398.', 'Has hecho demasiadas reservas hoy. Llama al 631 706 398.', 'Too many bookings today. Please call +34 631 706 398.', 'Trop de réservations aujourd\'hui. Appelez le +34 631 706 398.', 'Zu viele Buchungen heute. Bitte rufen Sie +34 631 706 398 an.', "حجوزات كثيرة اليوم. يُرجى الاتصال على ‎+34 631 706 398."],
    errXarxa: ["No s'ha pogut reservar. Torna-ho a provar o truca al 631 706 398.", 'No se ha podido reservar. Inténtalo de nuevo o llama al 631 706 398.', 'The booking failed. Try again or call +34 631 706 398.', 'La réservation a échoué. Réessayez ou appelez le +34 631 706 398.', 'Buchung fehlgeschlagen. Bitte erneut versuchen oder +34 631 706 398 anrufen.', "تعذّر الحجز. حاول مرة أخرى أو اتصل على ‎+34 631 706 398."],
    // àrea client
    repetir: ['🔁 Repetir', '🔁 Repetir', '🔁 Reorder', '🔁 Recommander', '🔁 Erneut bestellen', "🔁 إعادة الطلب"],
    programar: ['📅 Programar', '📅 Programar', '📅 Schedule', '📅 Programmer', '📅 Planen', "📅 جدولة"],
    repetit: ['Comanda copiada al cistell. Revisa-la i tramita-la.', 'Pedido copiado al carrito. Revísalo y tramítalo.', 'Order copied to the basket. Review it and check out.', 'Commande copiée dans le panier. Vérifiez-la et validez.', 'Bestellung in den Warenkorb kopiert. Prüfen und abschließen.', "نُسخ الطلب إلى السلة. راجعه وأكمل الشراء."],
    progTitol: ['Programar aquesta comanda', 'Programar este pedido', 'Schedule this order', 'Programmer cette commande', 'Diese Bestellung planen', "جدولة هذا الطلب"],
    progTxt: [
      'La generarem automàticament amb els mateixos productes i t\'avisarem per email cada vegada. Pots aturar-la quan vulguis.',
      'La generaremos automáticamente con los mismos productos y te avisaremos por email cada vez. Puedes pararla cuando quieras.',
      'We will create it automatically with the same products and email you each time. You can stop it at any time.',
      'Nous la créerons automatiquement avec les mêmes produits et vous préviendrons par e-mail à chaque fois. Vous pouvez l\'arrêter à tout moment.',
      'Wir erstellen sie automatisch mit denselben Produkten und benachrichtigen Sie jedes Mal per E-Mail. Sie können sie jederzeit stoppen.',
      "سننشئه تلقائيًا بالمنتجات نفسها ونرسل لك بريدًا في كل مرة. يمكنك إيقافه في أي وقت.",
    ],
    cada: ['Cada', 'Cada', 'Every', 'Toutes les', 'Alle', "كل"],
    setmanes: ['{0} setmanes', '{0} semanas', '{0} weeks', '{0} semaines', '{0} Wochen', "{0} أسابيع"],
    setmana: ['setmana', 'semana', 'week', 'semaine', 'Woche', "أسبوع"],
    primera: ['Primera comanda', 'Primer pedido', 'First order', 'Première commande', 'Erste Bestellung', "الطلب الأول"],
    seu: ['Seu', 'Sede', 'Site', 'Site', 'Standort', "الفرع"],
    seuPrincipal: ['Seu principal', 'Sede principal', 'Main site', 'Site principal', 'Hauptstandort', "الفرع الرئيسي"],
    cancelar: ['Cancel·lar', 'Cancelar', 'Cancel', 'Annuler', 'Abbrechen', "إلغاء"],
    confirmar: ['Programar', 'Programar', 'Schedule', 'Programmer', 'Planen', "جدولة"],
    programada: ['Comanda programada. La primera es generarà el {0}.', 'Pedido programado. El primero se generará el {0}.', 'Order scheduled. The first one will be created on {0}.', 'Commande programmée. La première sera créée le {0}.', 'Bestellung geplant. Die erste wird am {0} erstellt.', "تمت جدولة الطلب. سيُنشأ الأول بتاريخ {0}."],
    errLogin: ['Inicia sessió per fer-ho.', 'Inicia sesión para hacerlo.', 'Please log in first.', 'Connectez-vous d\'abord.', 'Bitte zuerst anmelden.', "يُرجى تسجيل الدخول أولًا."],
    errGen: ["No s'ha pogut desar. Torna-ho a provar.", 'No se ha podido guardar. Inténtalo de nuevo.', 'Could not save. Please try again.', "Impossible d'enregistrer. Réessayez.", 'Speichern fehlgeschlagen. Bitte erneut versuchen.', "تعذّر الحفظ. يُرجى المحاولة مرة أخرى."],
    reposicio: ['🔔 Reposició prevista', '🔔 Reposición prevista', '🔔 Expected restock', '🔔 Réassort prévu', '🔔 Voraussichtliche Nachbestellung', "🔔 إعادة التزويد المتوقعة"],
    reposicioAj: ['Segons cada quant compres cada producte.', 'Según cada cuánto compras cada producto.', 'Based on how often you buy each product.', 'Selon la fréquence d\'achat de chaque produit.', 'Je nachdem, wie oft Sie jedes Produkt kaufen.', "استنادًا إلى وتيرة شرائك لكل منتج."],
    queden: ['queden uns {0} dies', 'quedan unos {0} días', 'about {0} days left', 'environ {0} jours restants', 'noch etwa {0} Tage', "بقي نحو {0} يومًا"],
    jaToca: ['ja tocaria reposar', 'ya tocaría reponer', 'due for restock', 'à réapprovisionner', 'Nachbestellung fällig', "حان وقت إعادة التزويد"],
    afegir: ['Afegeix', 'Añadir', 'Add', 'Ajouter', 'Hinzufügen', "إضافة"],
    programades: ['📅 Comandes programades', '📅 Pedidos programados', '📅 Scheduled orders', '📅 Commandes programmées', '📅 Geplante Bestellungen', "📅 الطلبات المجدولة"],
    propera: ['Propera: {0}', 'Próxima: {0}', 'Next: {0}', 'Prochaine : {0}', 'Nächste: {0}', "التالي: {0}"],
    aturada: ['Aturada', 'Pausada', 'Paused', 'En pause', 'Pausiert', "متوقف"],
    aturar: ['Aturar', 'Pausar', 'Pause', 'Suspendre', 'Pausieren', "إيقاف مؤقت"],
    reprendre: ['Reprendre', 'Reanudar', 'Resume', 'Reprendre', 'Fortsetzen', "استئناف"],
    senseIva: ['sense IVA', 'sin IVA', 'excl. VAT', 'HT', 'ohne MwSt.', "دون ضريبة القيمة المضافة"],
    eliminar: ['Eliminar', 'Eliminar', 'Delete', 'Supprimer', 'Löschen', "حذف"],
    capProg: ['Encara no tens cap comanda programada. Fes servir «Programar» en una comanda anterior.', 'Aún no tienes ningún pedido programado. Usa «Programar» en un pedido anterior.', 'No scheduled orders yet. Use «Schedule» on a previous order.', 'Aucune commande programmée. Utilisez « Programmer » sur une commande précédente.', 'Noch keine geplanten Bestellungen. Nutzen Sie «Planen» bei einer früheren Bestellung.', "لا توجد طلبات مجدولة بعد. استخدم «جدولة» على طلب سابق."],
    seus: ['📍 Les meves seus', '📍 Mis sedes', '📍 My sites', '📍 Mes sites', '📍 Meine Standorte', "📍 فروعي"],
    seusAj: ['Per a grups amb diversos centres: tria a quina seu va cada comanda i mira el total de cadascuna.', 'Para grupos con varios centros: elige a qué sede va cada pedido y mira el total de cada una.', 'For groups with several locations: choose where each order goes and see the total per site.', 'Pour les groupes multi-sites : choisissez le site de chaque commande et consultez le total par site.', 'Für Gruppen mit mehreren Standorten: Wählen Sie den Standort jeder Bestellung und sehen Sie die Summen.', "للمجموعات ذات المواقع المتعددة: اختر وجهة كل طلب واطّلع على الإجمالي لكل فرع."],
    comandes: ['{0} comandes · {1}', '{0} pedidos · {1}', '{0} orders · {1}', '{0} commandes · {1}', '{0} Bestellungen · {1}', "{0} طلبات · {1}"],
    novaSeu: ['+ Afegeix una seu', '+ Añadir una sede', '+ Add a site', '+ Ajouter un site', '+ Standort hinzufügen', "+ إضافة فرع"],
    nomSeu: ['Nom de la seu (p. ex. Hotel Centre)', 'Nombre de la sede (p. ej. Hotel Centro)', 'Site name (e.g. City Hotel)', 'Nom du site (ex. Hôtel Centre)', 'Name des Standorts (z. B. Hotel Zentrum)', "اسم الفرع (مثل: فندق المدينة)"],
    adreca: ['Adreça de lliurament', 'Dirección de entrega', 'Delivery address', 'Adresse de livraison', 'Lieferadresse', "عنوان التسليم"],
    contacte: ['Persona de contacte', 'Persona de contacto', 'Contact person', 'Contact', 'Ansprechpartner', "الشخص المسؤول"],
    desar: ['Desa la seu', 'Guardar la sede', 'Save site', 'Enregistrer le site', 'Standort speichern', "حفظ الفرع"],
    enviarA: ['Enviar a', 'Enviar a', 'Deliver to', 'Livrer à', 'Liefern an', "التسليم إلى"],
    sedeTotal: ['Total sense seu assignada', 'Total sin sede asignada', 'Total without a site', 'Total sans site', 'Summe ohne Standort', "الإجمالي دون فرع"],
    // QR i fitxa
    fds: ['⚠️ FDS (PDF)', '⚠️ FDS (PDF)', '⚠️ SDS (PDF)', '⚠️ FDS (PDF)', '⚠️ SDB (PDF)', "⚠️ ورقة بيانات السلامة (PDF)"],
    etiqueta: ['🏷️ Etiqueta QR', '🏷️ Etiqueta QR', '🏷️ QR label', '🏷️ Étiquette QR', '🏷️ QR-Etikett', "🏷️ ملصق QR"],
    etiquetaTxt: ['Escaneja per veure la fitxa i la FDS', 'Escanea para ver la ficha y la FDS', 'Scan to see the data sheet and SDS', 'Scannez pour voir la fiche et la FDS', 'Scannen für Datenblatt und SDB', "امسح الرمز لعرض ورقة البيانات وورقة السلامة"],
    etiquetaIdioma: ["S'obre en l'idioma del mòbil", 'Se abre en el idioma del móvil', "Opens in the phone's language", 'S\'ouvre dans la langue du téléphone', 'Öffnet sich in der Sprache des Handys', "يُفتح بلغة الهاتف"],
    loginRepetir: ['Inicia sessió per recuperar la comanda que t\'hem preparat.', 'Inicia sesión para recuperar el pedido que te hemos preparado.', 'Log in to load the order we prepared for you.', 'Connectez-vous pour récupérer la commande préparée.', 'Melden Sie sich an, um die vorbereitete Bestellung zu laden.', "سجّل الدخول لتحميل الطلب الذي جهّزناه لك."],
  };
  function t(k) {
    var e = D[k];
    var s = e ? e[LANGS.indexOf(lang())] || e[0] : k;
    var a = [].slice.call(arguments, 1);
    return s.replace(/\{(\d)\}/g, function (m, i) { return a[i] != null ? a[i] : m; });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(v) { return typeof window.hxFormatPrice === 'function' ? window.hxFormatPrice(v) : v.toFixed(2) + ' €'; }
  function num(v, d) { return Number(v).toLocaleString(LOCALE[lang()], { maximumFractionDigits: d == null ? 1 : d }); }
  function dataLlarga(iso) {
    return new Date(iso + 'T12:00:00Z').toLocaleDateString(LOCALE[lang()], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  }
  function dataCurta(iso) {
    return new Date(iso + 'T12:00:00Z').toLocaleDateString(LOCALE[lang()], { day: 'numeric', month: 'short', timeZone: 'UTC' });
  }
  function avui() { return new Date().toISOString().slice(0, 10); }
  function sumaDies(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function toast(msg, ico) { if (typeof window.showToast === 'function') window.showToast(msg, ico || '✅'); }
  function api(path, opts) { return window.hxApi(path, opts); }
  function logat() { return !!(window.HX_USER && window.HX_USER.email); }

  /* ---------- estils ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.hxp-calc{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.6rem;margin-top:1.8rem;text-align:left}' +
    '.hxp-card{background:#fff;border-radius:18px;box-shadow:var(--shadow);padding:1.5rem}' +
    '.hxp-f{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.9rem}.hxp-f label{font-size:.82rem;font-weight:700;color:var(--green-deep,#0B3D6B)}' +
    '.hxp-f small{font-size:.74rem;color:#6b7785}' +
    '.hxp-f input,.hxp-f select,.hxp-f textarea{padding:.65rem .75rem;border:1.5px solid var(--border,#D9E5F0);border-radius:10px;font:inherit;font-size:.9rem;background:#fff;width:100%;box-sizing:border-box}' +
    '.hxp-row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}' +
    '.hxp-res{display:flex;flex-direction:column;gap:1rem}.hxp-big{font-size:1.9rem;font-weight:800;color:#0B3D6B;line-height:1.1}' +
    '.hxp-lbl{font-size:.74rem;font-weight:700;color:#6b7785;margin-bottom:.15rem}.hxp-sub{font-size:.86rem;color:#3d4a57}' +
    '.hxp-sep{border:0;border-top:1px solid #EEF2F5;margin:.3rem 0}' +
    '.hxp-good{background:#E8F5E9;color:#1B5E20;border-radius:12px;padding:.9rem 1rem;font-weight:700}' +
    '.hxp-warn{background:#FFF6E0;color:#7A5200;border-radius:12px;padding:.9rem 1rem;font-size:.88rem}' +
    '.hxp-btn{background:#0B3D6B;color:#fff;border:0;border-radius:12px;padding:.8rem 1.1rem;font:inherit;font-weight:700;cursor:pointer}' +
    '.hxp-btn:hover{background:#0E2A3F}.hxp-btn[disabled]{opacity:.6;cursor:default}' +
    '.hxp-ghost{background:#fff;color:#0B3D6B;border:1.5px solid #D9E5F0;border-radius:10px;padding:.45rem .8rem;font:inherit;font-size:.8rem;font-weight:700;cursor:pointer}' +
    '.hxp-ghost:hover{border-color:#0B3D6B}' +
    '.hxp-nota{font-size:.76rem;color:#6b7785;margin-top:.4rem}' +
    '.hxp-cita{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:1.6rem;margin-top:1.8rem;text-align:left}' +
    '.hxp-tipus{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-bottom:1rem}' +
    '.hxp-tipus button{text-align:left;background:#fff;border:1.5px solid #D9E5F0;border-radius:12px;padding:.7rem .8rem;cursor:pointer;font:inherit}' +
    '.hxp-tipus button b{display:block;font-size:.86rem;color:#0B3D6B}.hxp-tipus button span{font-size:.74rem;color:#6b7785}' +
    '.hxp-tipus button[aria-pressed=true]{border-color:#0B3D6B;box-shadow:inset 0 0 0 1px #0B3D6B;background:#F2F7FC}' +
    '.hxp-cal{display:grid;grid-template-columns:repeat(5,1fr);gap:.4rem}' +
    '.hxp-cal .h{font-size:.7rem;font-weight:700;color:#6b7785;text-align:center;text-transform:capitalize}' +
    '.hxp-cal button{border:1.5px solid #D9E5F0;background:#fff;border-radius:10px;padding:.45rem 0;cursor:pointer;font:inherit;font-size:.82rem;line-height:1.2}' +
    '.hxp-cal button small{display:block;font-size:.64rem;color:#6b7785}' +
    '.hxp-cal button[aria-pressed=true]{background:#0B3D6B;color:#fff;border-color:#0B3D6B}.hxp-cal button[aria-pressed=true] small{color:#cfe0f0}' +
    '.hxp-cal button[disabled]{opacity:.4;cursor:default}.hxp-cal .buit{visibility:hidden}' +
    '.hxp-hores{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0 1rem}' +
    '.hxp-hores button{border:1.5px solid #D9E5F0;background:#fff;border-radius:10px;padding:.45rem .8rem;cursor:pointer;font:inherit;font-weight:700;font-size:.85rem}' +
    '.hxp-hores button[aria-pressed=true]{background:#0B3D6B;color:#fff;border-color:#0B3D6B}.hxp-hores button[disabled]{opacity:.35;text-decoration:line-through;cursor:default}' +
    '.hxp-area h3{color:#0B3D6B;font-size:.95rem;font-weight:700;margin:1.6rem 0 .3rem}.hxp-area .aj{font-size:.78rem;color:#6b7785;margin:0 0 .6rem}' +
    '.hxp-item{border:1px solid #EEF2F5;border-radius:12px;padding:.75rem .9rem;margin-bottom:.55rem;display:flex;gap:.6rem;align-items:center;justify-content:space-between;flex-wrap:wrap}' +
    '.hxp-item .tx{flex:1;min-width:160px;font-size:.84rem;color:#33424f}.hxp-item .tx b{color:#0B3D6B}' +
    '.hxp-item .bt{display:flex;gap:.4rem;flex-wrap:wrap}' +
    '.hxp-acc{display:flex;gap:.4rem;justify-content:flex-end;margin-top:.5rem;flex-wrap:wrap}' +
    '.hxp-modal{position:fixed;inset:0;background:rgba(11,37,69,.55);display:flex;align-items:center;justify-content:center;z-index:2147483000;padding:1rem}' +
    '.hxp-modal>div{background:#fff;border-radius:18px;max-width:440px;width:100%;padding:1.5rem;box-shadow:0 30px 80px rgba(0,0,0,.3)}' +
    '.hxp-modal h3{margin:0 0 .4rem;color:#0B3D6B}.hxp-modal p{font-size:.86rem;color:#4b5866;margin:0 0 1rem}' +
    '.hxp-pulse{animation:hxpPulse 1.2s ease-in-out 3}@keyframes hxpPulse{50%{box-shadow:0 0 0 6px rgba(242,169,0,.45)}}' +
    '@media (prefers-reduced-motion:reduce){.hxp-pulse{animation:none;outline:3px solid #F2A900}}' +
    '@media (max-width:820px){.hxp-calc,.hxp-cita{grid-template-columns:1fr}.hxp-tipus{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  /* ============================================================
     CALCULADORA
     ============================================================ */
  var CONV = { suelos: 30, superficies: 40, banos: 50, cocina: 50 }; // mL/L d'un producte convencional
  var CALC_PROD = {
    'ECO Concentrat Pro': { f: 3, usos: ['suelos', 'superficies', 'banos'] },
    'Desinfectant HOSP-V': { rtu: true, usos: ['desinfeccion'] },
    'Detergent ALIM-PRO': { f: 2, usos: ['cocina', 'superficies', 'suelos'] },
    'Net HOSTAL Premium': { f: 2, usos: ['suelos', 'banos', 'superficies'] },
    'Gamma Superfícies QR': { f: 3, usos: ['superficies', 'suelos'] },
    'WorkSafe Antimicrobial': { rtu: true, usos: ['desinfeccion'] },
  };
  // Valors de comparació per defecte: preus de mercat orientatius (el client posa els seus)
  var PREU_CONV = 4.9, PREU_RTU = 19.9, LITRES_RTU = 0.05;
  var C = { prod: 'ECO Concentrat Pro', uso: 'suelos', litres: 8, usosDia: 6, dies: 22, preu: PREU_CONV, dosi: 30 };
  function preuDe(nom) {
    var p = (window.PRODUCTS || []).filter(function (x) { return x.name === nom; })[0];
    return p ? p.price : 0;
  }
  function calcular() {
    var cp = CALC_PROD[C.prod], rtu = !!cp.rtu;
    var dosi = rtu ? 1000 : Math.round((CONV[C.uso] || 30) / cp.f);
    var mlUs = dosi * C.litres;
    var preu = preuDe(C.prod);
    var costUs = (mlUs / 1000) * preu;
    var usosMes = C.usosDia * C.dies;
    var litresMes = (mlUs * usosMes) / 1000;
    var costMes = costUs * usosMes;
    var actualMes = ((C.dosi * C.litres) / 1000) * C.preu * usosMes;
    return { rtu: rtu, dosi: dosi, mlUs: mlUs, costUs: costUs, litresMes: litresMes, garrafes: Math.max(1, Math.ceil(litresMes / 5)), costMes: costMes, actualMes: actualMes, estalvi: actualMes - costMes };
  }
  function pintarCalc() {
    var box = document.getElementById('hxCalc');
    if (!box) return;
    var cp = CALC_PROD[C.prod];
    var opt = function (v, txt, sel) { return '<option value="' + esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + esc(txt) + '</option>'; };
    var cmp = window.CMP_DATA && window.CMP_DATA[C.prod];
    box.innerHTML =
      '<span class="section-tag">' + esc(t('calcTag')) + '</span>' +
      '<h2>' + esc(t('calcTitle')) + '</h2>' +
      '<p class="section-sub">' + esc(t('calcSub')) + '</p>' +
      '<div class="hxp-calc"><div class="hxp-card">' +
      '<div class="hxp-f"><label for="hxpProd">' + esc(t('producte')) + '</label><select id="hxpProd" onchange="hxpCalc(\'prod\',this.value)">' +
      Object.keys(CALC_PROD).map(function (n) { return opt(n, n + ' · ' + money(preuDe(n)) + ' / L', C.prod); }).join('') + '</select></div>' +
      '<div class="hxp-f"><label for="hxpUso">' + esc(t('us')) + '</label><select id="hxpUso" onchange="hxpCalc(\'uso\',this.value)">' +
      cp.usos.map(function (u) { return opt(u, t(u), C.uso); }).join('') + '</select></div>' +
      '<div class="hxp-f"><label for="hxpLitres">' + esc(t('litresUs')) + '</label><input id="hxpLitres" type="number" min="0.01" step="0.01" value="' + C.litres + '" oninput="hxpCalc(\'litres\',this.value)"><small>' + esc(t('litresUsAj')) + '</small></div>' +
      '<div class="hxp-row"><div class="hxp-f"><label for="hxpUsos">' + esc(t('usosDia')) + '</label><input id="hxpUsos" type="number" min="1" step="1" value="' + C.usosDia + '" oninput="hxpCalc(\'usosDia\',this.value)"></div>' +
      '<div class="hxp-f"><label for="hxpDies">' + esc(t('diesMes')) + '</label><input id="hxpDies" type="number" min="1" max="31" step="1" value="' + C.dies + '" oninput="hxpCalc(\'dies\',this.value)"></div></div>' +
      '<hr class="hxp-sep"><div class="hxp-lbl" style="margin:.6rem 0">' + esc(t('compara')) + '</div>' +
      '<div class="hxp-row"><div class="hxp-f"><label for="hxpPreu">' + esc(t('preuActual')) + '</label><input id="hxpPreu" type="number" min="0" step="0.05" value="' + C.preu + '" oninput="hxpCalc(\'preu\',this.value)"></div>' +
      '<div class="hxp-f"><label for="hxpDosi">' + esc(t('dosiActual')) + '</label><input id="hxpDosi" type="number" min="1" step="1" value="' + C.dosi + '" oninput="hxpCalc(\'dosi\',this.value)"></div></div>' +
      '</div><div class="hxp-card hxp-res" id="hxpRes" aria-live="polite"></div></div>' +
      (cmp && !cp.rtu ? '<p class="hxp-nota" style="text-align:center">' + esc(t('concNota', cmp.concentracio)) + '</p>' : '');
    pintarResultat();
  }
  function pintarResultat() {
    var r = calcular(), box = document.getElementById('hxpRes');
    if (!box) return;
    var pct = r.actualMes > 0 ? Math.round((r.estalvi / r.actualMes) * 100) : 0;
    box.innerHTML =
      '<div><div class="hxp-lbl">' + esc(t('dosi')) + '</div><div class="hxp-big">' + esc(r.rtu ? t('senseDiluir') : t('mlL', num(r.dosi, 0))) + '</div></div>' +
      '<div><div class="hxp-lbl">' + esc(t('perUs')) + '</div><div class="hxp-big">' + esc(money(r.costUs)) + '</div><div class="hxp-sub">' + esc(t('mlProducte', num(r.mlUs, 0))) + '</div></div>' +
      '<div><div class="hxp-lbl">' + esc(t('alMes')) + '</div><div class="hxp-big">' + esc(money(r.costMes)) + '</div><div class="hxp-sub">' + esc(t('garrafes', num(r.litresMes), r.garrafes)) + '</div></div>' +
      (r.estalvi > 0
        ? '<div class="hxp-good">' + esc(t('estalvi', money(r.estalvi))) + '<div style="font-weight:500;font-size:.84rem;margin-top:.2rem">' + esc(t('estalviAny', money(r.estalvi * 12), pct + ' %')) + ' · ' + esc(t('actualMes', money(r.actualMes))) + '</div></div>'
        : '<div class="hxp-warn">' + esc(t('mesCar', money(-r.estalvi))) + '</div>') +
      '<button type="button" class="hxp-btn" onclick="hxpCalcAlCistell()">🛒 ' + esc(t('afegirGarrafes', r.garrafes)) + '</button>';
  }
  window.hxpCalc = function (camp, v) {
    if (camp === 'prod') {
      C.prod = v;
      var cp = CALC_PROD[v];
      if (cp.usos.indexOf(C.uso) < 0) C.uso = cp.usos[0];
      C.litres = cp.rtu ? LITRES_RTU : 8;
      C.dosi = cp.rtu ? 1000 : CONV[C.uso];
      C.preu = cp.rtu ? PREU_RTU : PREU_CONV;
      pintarCalc();
      return;
    }
    if (camp === 'uso') {
      C.uso = v;
      if (!CALC_PROD[C.prod].rtu) C.dosi = CONV[v];
      pintarCalc();
      return;
    }
    var n = parseFloat(String(v).replace(',', '.'));
    if (!isFinite(n) || n < 0) return;
    C[camp] = n;
    pintarResultat();
  };
  window.hxpCalcAlCistell = function () {
    var r = calcular();
    afegirAlCistell(C.prod, r.garrafes, preuDe(C.prod));
    toast(t('afegit') + ': ' + C.prod + ' × ' + r.garrafes, '🛒');
    if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
  };
  function afegirAlCistell(nom, qty, preu) {
    if (typeof window.cart === 'undefined' && typeof cart === 'undefined') return;
    var c = window.cart || cart;
    if (c[nom]) c[nom].qty += qty;
    else c[nom] = { qty: qty, price: preu };
    if (typeof window.recalcCartLine === 'function') window.recalcCartLine(nom);
    if (typeof window.guardarCarret === 'function') window.guardarCarret();
    if (typeof window.renderCart === 'function') window.renderCart();
  }

  /* ============================================================
     CITA
     ============================================================ */
  var CT = { kind: 'visita', date: '', time: '', slots: ['09:00', '10:30', '12:00', '15:30', '17:00'], ocupats: [], fet: null, enviant: false, error: '' };
  function diesCita() {
    var out = [], d = sumaDies(avui(), 1);
    while (out.length < 20) {
      var w = new Date(d + 'T12:00:00Z').getUTCDay();
      if (w >= 1 && w <= 5) out.push(d);
      d = sumaDies(d, 1);
    }
    return out;
  }
  function lliure(date, time) { return CT.ocupats.indexOf(date + ' ' + time) < 0; }
  function carregarHuecos() {
    api('/citas/huecos').then(function (d) {
      CT.slots = d.slots || CT.slots;
      CT.ocupats = d.ocupados || [];
      pintarCita();
    }).catch(function (e) { console.warn('Horaris de cites no disponibles:', e); });
  }
  function pintarCita() {
    var box = document.getElementById('hxCita');
    if (!box) return;
    var head = '<span class="section-tag">' + esc(t('citaTag')) + '</span><h2>' + esc(t('citaTitle')) + '</h2><p class="section-sub">' + esc(t('citaSub')) + '</p>';
    if (CT.fet) {
      box.innerHTML = head + '<div class="hxp-card" style="max-width:560px;margin:1.8rem auto 0;text-align:left"><h3 style="margin:0 0 .5rem;color:#0B3D6B">✅ ' + esc(t('citaOk')) + '</h3><p class="hxp-sub">' +
        esc(t('citaOkTxt', t(CT.fet.kind), dataLlarga(CT.fet.date), CT.fet.time, CT.fet.email)) + '</p><div class="hxp-acc" style="justify-content:flex-start">' +
        '<button type="button" class="hxp-btn" onclick="hxpCitaIcs()">' + esc(t('calendari')) + '</button><button type="button" class="hxp-ghost" onclick="hxpCitaNova()">' + esc(t('altraCita')) + '</button></div></div>';
      return;
    }
    var u = window.HX_USER || {};
    var dies = diesCita();
    var cal = '';
    var w0 = new Date(dies[0] + 'T12:00:00Z').getUTCDay();
    var noms = [1, 2, 3, 4, 5].map(function (i) {
      var d = new Date(Date.UTC(2024, 0, i)); // 1 gen 2024 = dilluns
      return d.toLocaleDateString(LOCALE[lang()], { weekday: 'short', timeZone: 'UTC' });
    });
    cal += noms.map(function (n) { return '<div class="h">' + esc(n) + '</div>'; }).join('');
    for (var b = 1; b < w0; b++) cal += '<button type="button" class="buit" tabindex="-1" aria-hidden="true"></button>';
    dies.forEach(function (d) {
      var ple = CT.slots.every(function (h) { return !lliure(d, h); });
      var dd = new Date(d + 'T12:00:00Z');
      cal += '<button type="button"' + (ple ? ' disabled' : '') + ' aria-pressed="' + (CT.date === d) + '" onclick="hxpCitaDia(\'' + d + '\')" aria-label="' + esc(dataLlarga(d)) + '">' + dd.getUTCDate() +
        '<small>' + esc(ple ? t('ple') : dd.toLocaleDateString(LOCALE[lang()], { month: 'short', timeZone: 'UTC' })) + '</small></button>';
    });
    var hores = CT.date
      ? '<div class="hxp-hores" role="group" aria-label="' + esc(t('hora')) + '">' + CT.slots.map(function (h) {
          return '<button type="button"' + (lliure(CT.date, h) ? '' : ' disabled') + ' aria-pressed="' + (CT.time === h) + '" onclick="hxpCitaHora(\'' + h + '\')">' + h + '</button>';
        }).join('') + '</div>'
      : '<p class="hxp-nota">' + esc(t('triaDia')) + '</p>';
    var tipus = ['visita', 'formacion', 'auditoria'].map(function (k) {
      return '<button type="button" aria-pressed="' + (CT.kind === k) + '" onclick="hxpCitaTipus(\'' + k + '\')"><b>' + esc(t(k)) + '</b><span>' + esc(t(k + 'D')) + '</span></button>';
    }).join('');
    var camp = function (id, et, tipusInput, val, extra) {
      return '<div class="hxp-f"><label for="' + id + '">' + esc(et) + '</label><input id="' + id + '" type="' + tipusInput + '" value="' + esc(val || '') + '"' + (extra || '') + '></div>';
    };
    box.innerHTML = head + '<div class="hxp-cita"><div class="hxp-card"><div class="hxp-lbl">' + esc(t('tipus')) + '</div><div class="hxp-tipus">' + tipus + '</div>' +
      '<div class="hxp-lbl">' + esc(t('dia')) + '</div><div class="hxp-cal">' + cal + '</div>' +
      (CT.date ? '<div class="hxp-lbl" style="margin-top:1rem">' + esc(t('hora')) + ' · ' + esc(dataLlarga(CT.date)) + '</div>' : '') + hores + '</div>' +
      '<form class="hxp-card" onsubmit="hxpCitaEnviar(event)" novalidate>' +
      camp('hxpCNom', t('nom'), 'text', u.name, ' autocomplete="name" required') +
      camp('hxpCEmpresa', t('empresa'), 'text', u.company, ' autocomplete="organization"') +
      '<div class="hxp-row">' + camp('hxpCEmail', t('email'), 'email', u.email, ' autocomplete="email" required') + camp('hxpCTel', t('telefon'), 'tel', '', ' autocomplete="tel"') + '</div>' +
      '<div class="hxp-f"><label for="hxpCNotes">' + esc(t('notes')) + '</label><textarea id="hxpCNotes" rows="3"></textarea></div>' +
      (CT.error ? '<div class="hxp-warn" role="alert" style="margin-bottom:.8rem">' + esc(CT.error) + '</div>' : '') +
      '<button type="submit" class="hxp-btn" style="width:100%"' + (CT.enviant ? ' disabled' : '') + '>' + esc(CT.enviant ? t('reservant') : t('reservar')) +
      (CT.date && CT.time ? ' · ' + esc(dataCurta(CT.date)) + ' ' + CT.time : '') + '</button></form></div>';
  }
  // Conserva el que s'ha escrit al formulari quan es repinta
  function llegirForm() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value : undefined; };
    return { name: g('hxpCNom'), company: g('hxpCEmpresa'), email: g('hxpCEmail'), phone: g('hxpCTel'), notes: g('hxpCNotes') };
  }
  function restaurarForm(f) {
    var s = function (id, v) { var e = document.getElementById(id); if (e && v !== undefined) e.value = v; };
    s('hxpCNom', f.name); s('hxpCEmpresa', f.company); s('hxpCEmail', f.email); s('hxpCTel', f.phone); s('hxpCNotes', f.notes);
  }
  function repintarCita() { var f = llegirForm(); pintarCita(); restaurarForm(f); }
  window.hxpCitaTipus = function (k) { CT.kind = k; repintarCita(); };
  window.hxpCitaDia = function (d) { CT.date = d; if (!lliure(d, CT.time)) CT.time = ''; CT.error = ''; repintarCita(); };
  window.hxpCitaHora = function (h) { CT.time = h; CT.error = ''; repintarCita(); };
  window.hxpCitaNova = function () { CT.fet = null; CT.date = ''; CT.time = ''; pintarCita(); };
  window.hxpCitaEnviar = function (ev) {
    ev.preventDefault();
    var f = llegirForm();
    if (!CT.date || !CT.time) { CT.error = t('errHora'); repintarCita(); return; }
    if (!f.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email || '')) { CT.error = t('errCampos'); repintarCita(); return; }
    CT.enviant = true; CT.error = ''; repintarCita();
    api('/citas', { method: 'POST', body: { date: CT.date, time: CT.time, kind: CT.kind, name: f.name, company: f.company, email: f.email, phone: f.phone, notes: f.notes, lang: lang() } })
      .then(function () {
        CT.enviant = false;
        CT.fet = { kind: CT.kind, date: CT.date, time: CT.time, email: f.email };
        CT.ocupats.push(CT.date + ' ' + CT.time);
        pintarCita();
        var box = document.getElementById('cita'); if (box) box.scrollIntoView({ block: 'start' });
      })
      .catch(function (e) {
        CT.enviant = false;
        CT.error = e.message === 'taken' ? t('errTaken') : e.message === 'limit' ? t('errLimit') : e.message === 'contact' ? t('errCampos') : t('errXarxa');
        if (e.message === 'taken') { CT.ocupats.push(CT.date + ' ' + CT.time); CT.time = ''; carregarHuecos(); }
        repintarCita();
      });
  };
  window.hxpCitaIcs = function () {
    var c = CT.fet; if (!c) return;
    var ini = c.date.replace(/-/g, '') + 'T' + c.time.replace(':', '') + '00';
    var h = +c.time.slice(0, 2) + (c.kind === 'formacion' ? 2 : 1);
    var fi = c.date.replace(/-/g, '') + 'T' + String(h).padStart(2, '0') + c.time.slice(3) + '00';
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HIGIENEX//Cites//CA', 'BEGIN:VEVENT', 'UID:' + ini + '-' + Date.now() + '@higienexvalencia.es',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;TZID=Europe/Madrid:' + ini, 'DTEND;TZID=Europe/Madrid:' + fi,
      'SUMMARY:HIGIENEX · ' + t(c.kind), 'DESCRIPTION:' + t(c.kind) + ' — HIGIENEX S.L. · 631 706 398', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'cita-higienex-' + c.date + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
  };

  /* ============================================================
     ÀREA DE CLIENT: repetir, programar, reposició i seus
     ============================================================ */
  var A = { sites: [], totals: [], recurring: [], restock: [], carregat: false };
  function carregarArea() {
    if (!logat() || !window.hxApiToken || !window.hxApiToken()) return Promise.resolve();
    return Promise.all([
      api('/sites').catch(function () { return {}; }),
      api('/recurring').catch(function () { return {}; }),
      api('/restock').catch(function () { return {}; }),
    ]).then(function (r) {
      A.sites = r[0].sites || []; A.totals = r[0].totals || [];
      A.recurring = r[1].recurring || []; A.restock = r[2].prevision || [];
      A.carregat = true;
      pintarArea();
    });
  }
  function opcionsSeu(sel) {
    return '<option value="">' + esc(t('seuPrincipal')) + '</option>' + A.sites.map(function (s) {
      return '<option value="' + esc(s.name) + '"' + (s.name === sel ? ' selected' : '') + '>' + esc(s.name) + '</option>';
    }).join('');
  }
  function pintarArea() {
    var sedeBox = document.getElementById('hxSedeCart');
    if (sedeBox) {
      sedeBox.innerHTML = logat() && A.sites.length
        ? '<div class="hxp-f" style="margin-top:1rem"><label for="hxpSedeSel">📍 ' + esc(t('enviarA')) + '</label><select id="hxpSedeSel" onchange="window.HX_SEDE_SEL=this.value">' + opcionsSeu(window.HX_SEDE_SEL || '') + '</select></div>'
        : '';
    }
    var box = document.getElementById('hxPlusArea');
    if (!box) return;
    if (!logat()) { box.innerHTML = ''; return; }
    var h = '<div class="hxp-area">';
    if (A.restock.length) {
      h += '<h3>' + esc(t('reposicio')) + '</h3><p class="aj">' + esc(t('reposicioAj')) + '</p>' + A.restock.slice(0, 6).map(function (p) {
        return '<div class="hxp-item"><div class="tx"><b>' + esc(p.name) + '</b> · ' + esc(p.dias > 0 ? t('queden', p.dias) : t('jaToca')) + ' (' + esc(dataCurta(p.proxima)) + ')</div>' +
          '<div class="bt"><button type="button" class="hxp-ghost" onclick="hxpReposar(\'' + esc(p.name).replace(/'/g, '&#39;') + '\',' + (+p.qty || 1) + ')">🛒 ' + esc(t('afegir')) + ' × ' + (+p.qty || 1) + '</button></div></div>';
      }).join('');
    }
    h += '<h3>' + esc(t('programades')) + '</h3>';
    h += A.recurring.length ? A.recurring.map(function (r) {
      var items = r.items.map(function (it) { return it.name + ' ×' + it.qty; }).join(', ');
      return '<div class="hxp-item"><div class="tx"><b>' + esc(t('cada') + ' ' + (r.every_days === 7 ? t('setmana') : t('setmanes', r.every_days / 7))) + '</b> · ' + esc(money(r.total)) + ' ' + esc(t('senseIva')) + '<br>' + esc(items) +
        '<br><span style="color:#6b7785">' + esc(r.active ? t('propera', dataLlarga(r.next_date)) : t('aturada')) + (r.site ? ' · 📍 ' + esc(r.site) : '') + '</span></div>' +
        '<div class="bt"><button type="button" class="hxp-ghost" onclick="hxpProgEstat(' + r.id + ',' + (r.active ? 0 : 1) + ')">' + esc(r.active ? t('aturar') : t('reprendre')) + '</button>' +
        '<button type="button" class="hxp-ghost" onclick="hxpProgEliminar(' + r.id + ')">' + esc(t('eliminar')) + '</button></div></div>';
    }).join('') : '<p class="aj">' + esc(t('capProg')) + '</p>';
    h += '<h3>' + esc(t('seus')) + '</h3><p class="aj">' + esc(t('seusAj')) + '</p>';
    var tot = {}; A.totals.forEach(function (x) { tot[x.site || ''] = x; });
    h += A.sites.map(function (s) {
      var x = tot[s.name] || { n: 0, t: 0 };
      return '<div class="hxp-item"><div class="tx"><b>' + esc(s.name) + '</b>' + (s.address ? '<br>' + esc(s.address) : '') + (s.contact ? ' · ' + esc(s.contact) : '') +
        '<br><span style="color:#6b7785">' + esc(t('comandes', x.n, money(x.t))) + '</span></div><div class="bt"><button type="button" class="hxp-ghost" onclick="hxpSeuEliminar(' + s.id + ')">' + esc(t('eliminar')) + '</button></div></div>';
    }).join('');
    if (A.sites.length && tot['']) h += '<p class="aj">' + esc(t('sedeTotal')) + ': ' + esc(t('comandes', tot[''].n, money(tot[''].t))) + '</p>';
    h += '<details style="margin-top:.4rem"><summary style="cursor:pointer;font-weight:700;color:#0B3D6B;font-size:.86rem">' + esc(t('novaSeu')) + '</summary>' +
      '<form onsubmit="hxpSeuDesar(event)" style="margin-top:.7rem">' +
      '<div class="hxp-f"><label for="hxpSNom">' + esc(t('nomSeu')) + '</label><input id="hxpSNom" required maxlength="80"></div>' +
      '<div class="hxp-f"><label for="hxpSAdr">' + esc(t('adreca')) + '</label><input id="hxpSAdr" maxlength="200" autocomplete="street-address"></div>' +
      '<div class="hxp-row"><div class="hxp-f"><label for="hxpSCon">' + esc(t('contacte')) + '</label><input id="hxpSCon" maxlength="80"></div>' +
      '<div class="hxp-f"><label for="hxpSTel">' + esc(t('telefon')) + '</label><input id="hxpSTel" type="tel" maxlength="30"></div></div>' +
      '<button type="submit" class="hxp-btn">' + esc(t('desar')) + '</button></form></details></div>';
    box.innerHTML = h;
  }
  window.hxpBotonsComanda = function (idx) {
    return '<div class="hxp-acc"><button type="button" class="hxp-ghost" onclick="hxpRepetir(' + idx + ')">' + esc(t('repetir')) + '</button>' +
      '<button type="button" class="hxp-ghost" onclick="hxpProgramar(' + idx + ')">' + esc(t('programar')) + '</button></div>';
  };
  function comandaDe(idx) {
    var list = typeof window.loadOrderHistory === 'function' ? window.loadOrderHistory() : [];
    return list[idx];
  }
  function copiarAlCistell(o) {
    (o.items || []).forEach(function (it) {
      var preu = preuDe(it.name) || (it.qty ? (it.rawTotal || it.total) / it.qty : 0);
      afegirAlCistell(it.name, +it.qty || 1, preu);
    });
    if (o.site !== undefined) window.HX_SEDE_SEL = o.site || '';
    toast(t('repetit'), '🔁');
    if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
  }
  window.hxpRepetir = function (idx) { var o = comandaDe(idx); if (o) copiarAlCistell(o); };
  window.hxpReposar = function (nom, qty) {
    afegirAlCistell(nom, qty, preuDe(nom));
    toast(t('afegit') + ': ' + nom + ' × ' + qty, '🛒');
  };
  window.hxpProgramar = function (idx) {
    var o = comandaDe(idx);
    if (!o) return;
    if (!logat()) { toast(t('errLogin'), '🔐'); return; }
    var m = document.createElement('div');
    m.className = 'hxp-modal';
    m.id = 'hxpModalProg';
    m.innerHTML = '<div role="dialog" aria-modal="true" aria-labelledby="hxpProgT"><h3 id="hxpProgT">' + esc(t('progTitol')) + '</h3><p>' + esc(t('progTxt')) + '</p>' +
      '<div class="hxp-f"><label for="hxpPFreq">' + esc(t('cada')) + '</label><select id="hxpPFreq" onchange="hxpProgData()">' +
      [7, 14, 28, 56].map(function (d) { return '<option value="' + d + '"' + (d === 28 ? ' selected' : '') + '>' + esc(d === 7 ? '1 ' + t('setmana') : t('setmanes', d / 7)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="hxp-f"><label for="hxpPData">' + esc(t('primera')) + '</label><input id="hxpPData" type="date" min="' + sumaDies(avui(), 1) + '" value="' + sumaDies(avui(), 28) + '"></div>' +
      (A.sites.length ? '<div class="hxp-f"><label for="hxpPSeu">' + esc(t('seu')) + '</label><select id="hxpPSeu">' + opcionsSeu(o.site || '') + '</select></div>' : '') +
      '<div class="hxp-acc"><button type="button" class="hxp-ghost" onclick="hxpProgTancar()">' + esc(t('cancelar')) + '</button><button type="button" class="hxp-btn" onclick="hxpProgDesar(' + idx + ')">' + esc(t('confirmar')) + '</button></div></div>';
    m.addEventListener('click', function (e) { if (e.target === m) window.hxpProgTancar(); });
    document.body.appendChild(m);
    document.getElementById('hxpPFreq').focus();
  };
  window.hxpProgData = function () {
    var f = +document.getElementById('hxpPFreq').value;
    document.getElementById('hxpPData').value = sumaDies(avui(), f);
  };
  window.hxpProgTancar = function () { var m = document.getElementById('hxpModalProg'); if (m) m.remove(); };
  window.hxpProgDesar = function (idx) {
    var o = comandaDe(idx);
    var seu = document.getElementById('hxpPSeu');
    var body = {
      every_days: +document.getElementById('hxpPFreq').value,
      start: document.getElementById('hxpPData').value,
      site: seu ? seu.value : '',
      lang: lang(),
      items: (o.items || []).map(function (it) { return { name: it.name, qty: it.qty, total: it.total }; }),
    };
    api('/recurring', { method: 'POST', body: body }).then(function (d) {
      window.hxpProgTancar();
      toast(t('programada', dataLlarga(d.next_date)), '📅');
      carregarArea();
    }).catch(function () { toast(t('errGen'), '⚠️'); });
  };
  window.hxpProgEstat = function (id, actiu) {
    api('/recurring', { method: 'PATCH', body: { id: id, active: !!actiu } }).then(carregarArea).catch(function () { toast(t('errGen'), '⚠️'); });
  };
  window.hxpProgEliminar = function (id) {
    api('/recurring?id=' + id, { method: 'DELETE' }).then(carregarArea).catch(function () { toast(t('errGen'), '⚠️'); });
  };
  window.hxpSeuDesar = function (ev) {
    ev.preventDefault();
    var g = function (id) { return (document.getElementById(id) || {}).value || ''; };
    if (!g('hxpSNom').trim()) return;
    api('/sites', { method: 'POST', body: { name: g('hxpSNom'), address: g('hxpSAdr'), contact: g('hxpSCon'), phone: g('hxpSTel') } })
      .then(carregarArea).catch(function () { toast(t('errGen'), '⚠️'); });
  };
  window.hxpSeuEliminar = function (id) {
    api('/sites?id=' + id, { method: 'DELETE' }).then(carregarArea).catch(function () { toast(t('errGen'), '⚠️'); });
  };

  /* ---------- enllaç ?repetir=NUM dels emails d'avís de reposició ---------- */
  function enllacRepetir() {
    var num;
    try { num = new URLSearchParams(location.search).get('repetir'); } catch (e) { return; }
    if (!num) return;
    var intents = 0, avisat = false;
    var tmr = setInterval(function () {
      intents++;
      if (intents > 120) { clearInterval(tmr); return; }
      if (!logat()) {
        if (intents === 4 && !avisat && typeof window.openAuthModal === 'function') {
          avisat = true;
          window.openAuthModal();
          if (typeof window.switchTab === 'function') window.switchTab('login');
          toast(t('loginRepetir'), '🔐');
        }
        return;
      }
      if (!window.HX_SERVER_ORDERS) { if (typeof window.hxFetchOrders === 'function') window.hxFetchOrders(); return; }
      clearInterval(tmr);
      var o = window.HX_SERVER_ORDERS.filter(function (x) { return String(x.invoiceNum).toUpperCase() === num.toUpperCase(); })[0];
      if (o) copiarAlCistell(o);
      try { var q = new URLSearchParams(location.search); q.delete('repetir'); history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '')); } catch (e) { /* adreça sense canviar */ }
    }, 1000);
  }

  /* ============================================================
     QR DE PRODUCTE: idioma del mòbil, FDS i etiqueta
     ============================================================ */
  function idiomaDelMobil() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (!q.get('producte')) return;
    var desat = null;
    try { desat = localStorage.getItem('hx_lang'); } catch (e) { /* sense emmagatzematge */ }
    if (desat) return;
    var l = String((navigator.languages && navigator.languages[0]) || navigator.language || 'ca').slice(0, 2).toLowerCase();
    if (LANGS.indexOf(l) >= 0 && l !== 'ca' && typeof window.hxSetLang === 'function') window.hxSetLang(l);
  }
  function botonsFitxa() {
    var acc = document.querySelector('#fitxa-producte-sec .fp-actions');
    if (!acc) return;
    var fds = document.getElementById('hxpFdsBtn'), et = document.getElementById('hxpEtiqBtn');
    if (!fds) {
      fds = document.createElement('button');
      fds.type = 'button'; fds.id = 'hxpFdsBtn'; fds.className = 'btn-fp-outline';
      fds.onclick = function () { window.fpDescarregarFDS(document.getElementById('fpName').textContent); };
      acc.appendChild(fds);
      et = document.createElement('button');
      et.type = 'button'; et.id = 'hxpEtiqBtn'; et.className = 'btn-fp-outline';
      et.onclick = function () { etiquetaQR(document.getElementById('fpName').textContent); };
      acc.appendChild(et);
    }
    fds.textContent = t('fds');
    et.textContent = t('etiqueta');
  }
  function etiquetaQR(nom) {
    if (!window.jspdf || !window.QRCode) return;
    var url = WEB + '?producte=' + encodeURIComponent(nom) + '&doc=fitxa';
    var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a6' });
    var W = 297.64, H = 419.53;
    doc.setFillColor(11, 61, 107); doc.rect(0, 0, W, 64, 'F');
    doc.setFillColor(201, 154, 46); doc.rect(0, 64, W, 3, 'F');
    doc.setFont('times', 'bold'); doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.text('HIGIENE', 22, 42);
    doc.setFont('times', 'bolditalic'); doc.setTextColor(242, 169, 0); doc.text('X', 22 + doc.getTextWidth('HIGIENE') + 1, 42);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(14, 42, 63);
    doc.text(doc.splitTextToSize(nom, W - 44), W / 2, 96, { align: 'center' });
    var q = window.QRCode.create(url, { errorCorrectionLevel: 'M' }), n = q.modules.size, data = q.modules.data;
    var mida = 190, pas = mida / n, ox = (W - mida) / 2, oy = 122;
    doc.setFillColor(11, 61, 107);
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) if (data[j * n + i]) doc.rect(ox + i * pas, oy + j * pas, pas + 0.05, pas + 0.05, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(14, 42, 63);
    doc.text(t('etiquetaTxt'), W / 2, oy + mida + 30, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(110, 125, 142);
    doc.text(t('etiquetaIdioma'), W / 2, oy + mida + 46, { align: 'center' });
    doc.text('HIGIENEX S.L. · 631 706 398 · contacto@higienexvalencia.es', W / 2, H - 22, { align: 'center' });
    doc.save('Etiqueta_QR_' + nom.replace(/[^A-Za-z0-9]+/g, '_') + '.pdf');
  }
  function destacarFds() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (q.get('doc') !== 'fds') return;
    setTimeout(function () {
      var b = document.getElementById('hxpFdsBtn');
      if (b) { b.scrollIntoView({ block: 'center' }); b.classList.add('hxp-pulse'); }
    }, 900);
  }

  /* ============================================================
     IDIOMA: repintar en canviar-lo i desar-lo al servidor
     ============================================================ */
  function pintarMenu() {
    document.querySelectorAll('[data-hxp]').forEach(function (el) { el.textContent = t(el.getAttribute('data-hxp')); });
  }
  function enviarIdioma() {
    if (window.hxApiToken && window.hxApiToken()) api('/lang', { method: 'POST', body: { lang: lang() } }).catch(function () { /* no és crític */ });
  }
  function pintarTot() { pintarMenu(); pintarCalc(); repintarCita(); pintarArea(); botonsFitxa(); }

  function iniciar() {
    if (typeof window.hxSetLang === 'function' && !window.hxSetLang._hxp) {
      var orig = window.hxSetLang;
      window.hxSetLang = function () { var r = orig.apply(this, arguments); pintarTot(); enviarIdioma(); return r; };
      window.hxSetLang._hxp = true;
    }
    if (typeof window.hxSetApiToken === 'function' && !window.hxSetApiToken._hxp) {
      var origTok = window.hxSetApiToken;
      window.hxSetApiToken = function (tok) {
        var r = origTok.apply(this, arguments);
        if (tok) setTimeout(function () { enviarIdioma(); carregarArea(); }, 300);
        else { A = { sites: [], totals: [], recurring: [], restock: [], carregat: false }; pintarArea(); }
        return r;
      };
      window.hxSetApiToken._hxp = true;
    }
    if (typeof window.renderOrderHistory === 'function' && !window.renderOrderHistory._hxp) {
      var origHist = window.renderOrderHistory;
      window.renderOrderHistory = function () {
        var r = origHist.apply(this, arguments);
        if (logat() && !A.carregat) carregarArea(); else pintarArea();
        return r;
      };
      window.renderOrderHistory._hxp = true;
    }
    if (typeof window.obrirFitxaProducte === 'function' && !window.obrirFitxaProducte._hxp) {
      var origFitxa = window.obrirFitxaProducte;
      window.obrirFitxaProducte = function () { var r = origFitxa.apply(this, arguments); botonsFitxa(); return r; };
      window.obrirFitxaProducte._hxp = true;
    }
    idiomaDelMobil();
    pintarTot();
    carregarHuecos();
    if (logat()) carregarArea();
    enllacRepetir();
    destacarFds();
  }
  if (document.readyState === 'complete') setTimeout(iniciar, 0);
  else window.addEventListener('load', function () { setTimeout(iniciar, 0); });
})();
