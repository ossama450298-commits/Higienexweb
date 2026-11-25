/* ============================================================
   HIGIENEX — Área de cliente (area-cliente.js)
   Una sola área con la cuenta de la web (sin segunda contraseña):
   · Inicio: último pedido, facturas pendientes, próximo pedido programado,
     próxima cita y acciones rápidas.
   · Pedidos: buscar, filtrar, seguimiento, PDF, repetir y programar.
   · Facturas: pendientes y pagadas por separado, PDF y pago con tarjeta
     en modo de prueba (no se cobra nada).
   · Mis datos: datos de la empresa, contraseña y sesiones abiertas.
   · Ayuda: contacto y preguntas frecuentes.
   En el ordenador, menú a la izquierda; en el móvil, barra inferior.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
  var LOC = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' };
  var TX = {
    area: ['Àrea de clients', 'Área de clientes', 'Client area', 'Espace client', 'Kundenbereich', 'منطقة العملاء'],
    inici: ['Inici', 'Inicio', 'Home', 'Accueil', 'Start', 'الرئيسية'],
    comandes: ['Comandes', 'Pedidos', 'Orders', 'Commandes', 'Bestellungen', 'الطلبات'],
    factures: ['Factures', 'Facturas', 'Invoices', 'Factures', 'Rechnungen', 'الفواتير'],
    facturacio: ['Dades de facturació', 'Datos de facturación', 'Billing details', 'Données de facturation', 'Rechnungsdaten', 'بيانات الفوترة'],
    dades: ['Les meves dades', 'Mis datos', 'My details', 'Mes données', 'Meine Daten', 'بياناتي'],
    dadesCurt: ['Dades', 'Datos', 'Details', 'Données', 'Daten', 'بياناتي'],
    ajuda: ['Ajuda', 'Ayuda', 'Help', 'Aide', 'Hilfe', 'مساعدة'],
    botiga: ['Tornar a la botiga', 'Volver a la tienda', 'Back to the shop', 'Retour à la boutique', 'Zurück zum Shop', 'العودة إلى المتجر'],
    sortir: ['Tancar sessió', 'Cerrar sesión', 'Log out', 'Se déconnecter', 'Abmelden', 'تسجيل الخروج'],
    tancar: ['Tancar', 'Cerrar', 'Close', 'Fermer', 'Schließen', 'إغلاق'],
    hola: ['Hola, {0}', 'Hola, {0}', 'Hello, {0}', 'Bonjour, {0}', 'Hallo, {0}', 'مرحبًا، {0}'],
    resum: ['Així van les teves comandes i factures.', 'Así van tus pedidos y facturas.', 'Here is how your orders and invoices are doing.', 'Voici où en sont vos commandes et factures.', 'So stehen Ihre Bestellungen und Rechnungen.', 'هذه حالة طلباتك وفواتيرك.'],
    darrera: ['Última comanda', 'Último pedido', 'Latest order', 'Dernière commande', 'Letzte Bestellung', 'آخر طلب'],
    capComanda: ['Encara no has fet cap comanda.', 'Todavía no has hecho ningún pedido.', "You haven't placed any orders yet.", "Vous n'avez pas encore passé de commande.", 'Sie haben noch keine Bestellung aufgegeben.', 'لم تقدّم أي طلب بعد.'],
    ferComanda: ['Fer una comanda', 'Hacer un pedido', 'Place an order', 'Passer commande', 'Bestellen', 'قدّم طلبًا'],
    seguiment: ['Seguiment', 'Seguimiento', 'Tracking', 'Suivi', 'Sendungsverfolgung', 'التتبع'],
    repetir: ['Repetir', 'Repetir', 'Reorder', 'Recommander', 'Erneut bestellen', 'كرّر الطلب'],
    programar: ['Programar', 'Programar', 'Schedule', 'Programmer', 'Planen', 'جدولة'],
    pendents: ['Factures pendents', 'Facturas pendientes', 'Unpaid invoices', 'Factures à payer', 'Offene Rechnungen', 'فواتير غير مدفوعة'],
    totAlDia: ['Ho tens tot pagat.', 'Lo tienes todo pagado.', 'Everything is paid.', 'Tout est payé.', 'Alles ist bezahlt.', 'كل شيء مدفوع.'],
    nPendents: ['{0} per pagar', '{0} por pagar', '{0} to pay', '{0} à payer', '{0} offen', '{0} للدفع'],
    nVencudes: ['{0} vençudes', '{0} vencidas', '{0} overdue', '{0} échues', '{0} überfällig', '{0} متأخرة'],
    pagar: ['Pagar', 'Pagar', 'Pay', 'Payer', 'Bezahlen', 'ادفع'],
    veure: ['Veure-les', 'Verlas', 'View them', 'Les voir', 'Ansehen', 'عرضها'],
    propera: ['Pròxima comanda programada', 'Próximo pedido programado', 'Next scheduled order', 'Prochaine commande programmée', 'Nächste geplante Bestellung', 'الطلب المجدول القادم'],
    capProg: ['Cap comanda programada. Programa la que fas cada mes i no t’hauràs de recordar.', 'Ningún pedido programado. Programa el que haces cada mes y no tendrás que acordarte.', 'No scheduled orders. Schedule the one you place every month and forget about it.', 'Aucune commande programmée. Programmez celle de chaque mois et n’y pensez plus.', 'Keine geplanten Bestellungen. Planen Sie Ihre monatliche Bestellung und vergessen Sie sie.', 'لا توجد طلبات مجدولة. جدوِل طلبك الشهري ولن تحتاج لتذكّره.'],
    cita: ['Pròxima cita', 'Próxima cita', 'Next appointment', 'Prochain rendez-vous', 'Nächster Termin', 'الموعد القادم'],
    capCita: ['No tens cap cita. Demana una visita o una formació per al teu equip.', 'No tienes ninguna cita. Pide una visita o una formación para tu equipo.', 'No appointments. Book a visit or a training session for your team.', 'Aucun rendez-vous. Demandez une visite ou une formation pour votre équipe.', 'Keine Termine. Buchen Sie einen Besuch oder eine Schulung für Ihr Team.', 'لا توجد مواعيد. اطلب زيارة أو تدريبًا لفريقك.'],
    demanarCita: ['Demanar cita', 'Pedir cita', 'Book', 'Prendre rendez-vous', 'Termin buchen', 'احجز موعدًا'],
    visita: ['Visita', 'Visita', 'Visit', 'Visite', 'Besuch', 'زيارة'],
    auditoria: ['Auditoria', 'Auditoría', 'Audit', 'Audit', 'Audit', 'تدقيق'],
    formacio: ['Formació', 'Formación', 'Training', 'Formation', 'Schulung', 'تدريب'],
    rapid: ['Accions ràpides', 'Acciones rápidas', 'Quick actions', 'Actions rapides', 'Schnellaktionen', 'إجراءات سريعة'],
    repetirDarrera: ['Repetir l’última comanda', 'Repetir el último pedido', 'Repeat the latest order', 'Refaire la dernière commande', 'Letzte Bestellung wiederholen', 'كرّر آخر طلب'],
    pressupost: ['Demanar pressupost', 'Pedir presupuesto', 'Request a quote', 'Demander un devis', 'Angebot anfordern', 'اطلب عرض سعر'],
    cistell: ['Veure el cistell', 'Ver la cesta', 'View cart', 'Voir le panier', 'Warenkorb ansehen', 'عرض السلة'],
    cercar: ['Cerca per número o producte', 'Busca por número o producto', 'Search by number or product', 'Rechercher par numéro ou produit', 'Nach Nummer oder Produkt suchen', 'ابحث بالرقم أو المنتج'],
    totes: ['Totes', 'Todos', 'All', 'Toutes', 'Alle', 'الكل'],
    enCurs: ['En curs', 'En curso', 'In progress', 'En cours', 'In Bearbeitung', 'قيد التنفيذ'],
    entregades: ['Entregades', 'Entregados', 'Delivered', 'Livrées', 'Zugestellt', 'تم التسليم'],
    cancelades: ['Cancel·lades', 'Cancelados', 'Cancelled', 'Annulées', 'Storniert', 'ملغاة'],
    capResultat: ['No hi ha res amb aquests filtres.', 'No hay nada con estos filtros.', 'Nothing matches these filters.', 'Rien ne correspond à ces filtres.', 'Keine Treffer mit diesen Filtern.', 'لا نتائج بهذه المرشحات.'],
    pdf: ['PDF', 'PDF', 'PDF', 'PDF', 'PDF', 'PDF'],
    productes: ['productes', 'productos', 'products', 'produits', 'Produkte', 'منتجات'],
    altres: ['Reposició, programades i seus', 'Reposición, programados y sedes', 'Restock, scheduled orders and sites', 'Réassort, programmées et sites', 'Nachschub, geplante Bestellungen und Standorte', 'إعادة التزويد والطلبات المجدولة والفروع'],
    perPagar: ['Per pagar', 'Por pagar', 'To pay', 'À payer', 'Offen', 'للدفع'],
    pagades: ['Pagades', 'Pagadas', 'Paid', 'Payées', 'Bezahlt', 'مدفوعة'],
    capPendent: ['No tens cap factura pendent.', 'No tienes ninguna factura pendiente.', 'You have no unpaid invoices.', 'Vous n’avez aucune facture à payer.', 'Sie haben keine offenen Rechnungen.', 'ليس لديك فواتير غير مدفوعة.'],
    capPagada: ['Encara no hi ha factures pagades.', 'Todavía no hay facturas pagadas.', 'No paid invoices yet.', 'Pas encore de factures payées.', 'Noch keine bezahlten Rechnungen.', 'لا توجد فواتير مدفوعة بعد.'],
    capFactura: ['Encara no tens factures. Les factures surten aquí quan HIGIENEX les emet.', 'Todavía no tienes facturas. Las facturas aparecen aquí cuando HIGIENEX las emite.', 'No invoices yet. They appear here when HIGIENEX issues them.', 'Pas encore de factures. Elles apparaissent ici dès que HIGIENEX les émet.', 'Noch keine Rechnungen. Sie erscheinen hier, sobald HIGIENEX sie ausstellt.', 'لا توجد فواتير بعد. تظهر هنا عندما تصدرها HIGIENEX.'],
    totalPendent: ['Total per pagar', 'Total por pagar', 'Total to pay', 'Total à payer', 'Offener Betrag', 'إجمالي المستحق'],
    venc: ['Venç el {0}', 'Vence el {0}', 'Due {0}', 'Échéance le {0}', 'Fällig am {0}', 'تستحق في {0}'],
    vencuda: ['Vençuda', 'Vencida', 'Overdue', 'Échue', 'Überfällig', 'متأخرة'],
    pendent: ['Pendent', 'Pendiente', 'Unpaid', 'À payer', 'Offen', 'غير مدفوعة'],
    pagada: ['Pagada', 'Pagada', 'Paid', 'Payée', 'Bezahlt', 'مدفوعة'],
    pagadaTargeta: ['Pagada amb targeta', 'Pagada con tarjeta', 'Paid by card', 'Payée par carte', 'Mit Karte bezahlt', 'مدفوعة بالبطاقة'],
    pagarFactura: ['Pagar la factura {0}', 'Pagar la factura {0}', 'Pay invoice {0}', 'Payer la facture {0}', 'Rechnung {0} bezahlen', 'دفع الفاتورة {0}'],
    modeProva: ['Mode de prova: no es cobra res.', 'Modo de prueba: no se cobra nada.', 'Test mode: nothing is charged.', 'Mode test : rien n’est débité.', 'Testmodus: Es wird nichts belastet.', 'وضع الاختبار: لن يُخصم أي مبلغ.'],
    targetaProva: ['Targetes de prova:', 'Tarjetas de prueba:', 'Test cards:', 'Cartes de test :', 'Testkarten:', 'بطاقات اختبار:'],
    aprovada: ['Aprovada', 'Aprobada', 'Approved', 'Acceptée', 'Genehmigt', 'مقبولة'],
    rebutjada: ['Rebutjada', 'Rechazada', 'Declined', 'Refusée', 'Abgelehnt', 'مرفوضة'],
    numTargeta: ['Número de targeta', 'Número de tarjeta', 'Card number', 'Numéro de carte', 'Kartennummer', 'رقم البطاقة'],
    caducitat: ['Caducitat (MM/AA)', 'Caducidad (MM/AA)', 'Expiry (MM/YY)', 'Expiration (MM/AA)', 'Ablauf (MM/JJ)', 'الانتهاء (MM/YY)'],
    titular: ['Titular', 'Titular', 'Cardholder', 'Titulaire', 'Karteninhaber', 'حامل البطاقة'],
    pagarImport: ['Pagar {0}', 'Pagar {0}', 'Pay {0}', 'Payer {0}', '{0} bezahlen', 'ادفع {0}'],
    pagant: ['Pagant…', 'Pagando…', 'Paying…', 'Paiement…', 'Zahlung läuft…', 'جارٍ الدفع…'],
    numMal: ['El número de targeta no és vàlid.', 'El número de tarjeta no es válido.', 'The card number is not valid.', 'Le numéro de carte n’est pas valide.', 'Die Kartennummer ist ungültig.', 'رقم البطاقة غير صالح.'],
    expMal: ['La data de caducitat no és vàlida o ja ha passat.', 'La fecha de caducidad no es válida o ya ha pasado.', 'The expiry date is invalid or has passed.', 'La date d’expiration est invalide ou dépassée.', 'Das Ablaufdatum ist ungültig oder abgelaufen.', 'تاريخ الانتهاء غير صالح أو منتهٍ.'],
    cvvMal: ['El CVV ha de tenir 3 o 4 xifres.', 'El CVV debe tener 3 o 4 cifras.', 'The CVV must have 3 or 4 digits.', 'Le CVV doit comporter 3 ou 4 chiffres.', 'Der CVV muss 3 oder 4 Ziffern haben.', 'يجب أن يتكوّن CVV من 3 أو 4 أرقام.'],
    denegada: ['El banc ha rebutjat la targeta (simulat). Prova amb una altra.', 'El banco ha rechazado la tarjeta (simulado). Prueba con otra.', 'The bank declined the card (simulated). Try another one.', 'La banque a refusé la carte (simulé). Essayez-en une autre.', 'Die Bank hat die Karte abgelehnt (simuliert). Versuchen Sie eine andere.', 'رفض البنك البطاقة (محاكاة). جرّب بطاقة أخرى.'],
    pagatOk: ['Factura {0} pagada. Referència: {1}', 'Factura {0} pagada. Referencia: {1}', 'Invoice {0} paid. Reference: {1}', 'Facture {0} payée. Référence : {1}', 'Rechnung {0} bezahlt. Referenz: {1}', 'تم دفع الفاتورة {0}. المرجع: {1}'],
    errPagar: ['No s’ha pogut registrar el pagament. Torna-ho a provar.', 'No se ha podido registrar el pago. Vuelve a intentarlo.', 'The payment could not be recorded. Please try again.', 'Le paiement n’a pas pu être enregistré. Réessayez.', 'Die Zahlung konnte nicht gespeichert werden. Bitte erneut versuchen.', 'تعذّر تسجيل الدفع. حاول مجددًا.'],
    jaPagada: ['Aquesta factura ja està pagada.', 'Esta factura ya está pagada.', 'This invoice is already paid.', 'Cette facture est déjà payée.', 'Diese Rechnung ist bereits bezahlt.', 'هذه الفاتورة مدفوعة بالفعل.'],
    editar: ['Editar les dades', 'Editar datos', 'Edit details', 'Modifier', 'Daten bearbeiten', 'تعديل البيانات'],
    seguretat: ['Seguretat', 'Seguridad', 'Security', 'Sécurité', 'Sicherheit', 'الأمان'],
    canviarClau: ['Canviar la contrasenya', 'Cambiar la contraseña', 'Change password', 'Changer le mot de passe', 'Passwort ändern', 'تغيير كلمة المرور'],
    clauActual: ['Contrasenya actual', 'Contraseña actual', 'Current password', 'Mot de passe actuel', 'Aktuelles Passwort', 'كلمة المرور الحالية'],
    clauNova: ['Contrasenya nova (mínim 6 caràcters)', 'Contraseña nueva (mínimo 6 caracteres)', 'New password (at least 6 characters)', 'Nouveau mot de passe (6 caractères min.)', 'Neues Passwort (mind. 6 Zeichen)', 'كلمة مرور جديدة (6 أحرف على الأقل)'],
    clauRepetir: ['Repeteix la contrasenya nova', 'Repite la contraseña nueva', 'Repeat the new password', 'Répétez le nouveau mot de passe', 'Neues Passwort wiederholen', 'كرّر كلمة المرور الجديدة'],
    desarClau: ['Desar la contrasenya', 'Guardar contraseña', 'Save password', 'Enregistrer', 'Passwort speichern', 'حفظ كلمة المرور'],
    clauDesada: ['Contrasenya canviada. Hem tancat la sessió als altres dispositius.', 'Contraseña cambiada. Hemos cerrado la sesión en los demás dispositivos.', 'Password changed. You have been logged out on your other devices.', 'Mot de passe modifié. Vos autres appareils ont été déconnectés.', 'Passwort geändert. Ihre anderen Geräte wurden abgemeldet.', 'تم تغيير كلمة المرور وتسجيل الخروج من أجهزتك الأخرى.'],
    clauMal: ['La contrasenya actual no és correcta.', 'La contraseña actual no es correcta.', 'The current password is incorrect.', 'Le mot de passe actuel est incorrect.', 'Das aktuelle Passwort ist falsch.', 'كلمة المرور الحالية غير صحيحة.'],
    clauCurta: ['La contrasenya nova ha de tenir mínim 6 caràcters.', 'La contraseña nueva debe tener mínimo 6 caracteres.', 'The new password must have at least 6 characters.', 'Le nouveau mot de passe doit comporter au moins 6 caractères.', 'Das neue Passwort muss mindestens 6 Zeichen haben.', 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.'],
    clauDiferent: ['Les dues contrasenyes noves no coincideixen.', 'Las dos contraseñas nuevas no coinciden.', 'The two new passwords do not match.', 'Les deux nouveaux mots de passe ne correspondent pas.', 'Die beiden neuen Passwörter stimmen nicht überein.', 'كلمتا المرور الجديدتان غير متطابقتين.'],
    clauIgual: ['La contrasenya nova ha de ser diferent de l’actual.', 'La contraseña nueva debe ser distinta de la actual.', 'The new password must be different from the current one.', 'Le nouveau mot de passe doit être différent de l’actuel.', 'Das neue Passwort muss sich vom aktuellen unterscheiden.', 'يجب أن تختلف كلمة المرور الجديدة عن الحالية.'],
    sessions: ['Sessions obertes', 'Sesiones abiertas', 'Open sessions', 'Sessions ouvertes', 'Offene Sitzungen', 'الجلسات المفتوحة'],
    nSessions: ['La teva compte està oberta en {0} dispositius.', 'Tu cuenta está abierta en {0} dispositivos.', 'Your account is open on {0} devices.', 'Votre compte est ouvert sur {0} appareils.', 'Ihr Konto ist auf {0} Geräten geöffnet.', 'حسابك مفتوح على {0} أجهزة.'],
    unaSessio: ['Només tens la sessió oberta en aquest dispositiu.', 'Solo tienes la sesión abierta en este dispositivo.', 'You are only logged in on this device.', 'Vous n’êtes connecté que sur cet appareil.', 'Sie sind nur auf diesem Gerät angemeldet.', 'أنت مسجّل الدخول على هذا الجهاز فقط.'],
    tancarAltres: ['Tancar la sessió als altres dispositius', 'Cerrar sesión en los demás dispositivos', 'Log out on other devices', 'Déconnecter les autres appareils', 'Auf anderen Geräten abmelden', 'تسجيل الخروج من الأجهزة الأخرى'],
    altresTancades: ['Fet. Només queda oberta aquesta sessió.', 'Hecho. Solo queda abierta esta sesión.', 'Done. Only this session remains open.', 'C’est fait. Seule cette session reste ouverte.', 'Erledigt. Nur diese Sitzung ist noch offen.', 'تم. بقيت هذه الجلسة فقط مفتوحة.'],
    errGen: ['No s’ha pogut fer. Torna-ho a provar.', 'No se ha podido hacer. Vuelve a intentarlo.', 'That didn’t work. Please try again.', 'Cela n’a pas fonctionné. Réessayez.', 'Das hat nicht geklappt. Bitte erneut versuchen.', 'لم ينجح ذلك. حاول مجددًا.'],
    sessioCaducada: ['La sessió ha caducat. Torna a iniciar sessió.', 'La sesión ha caducado. Vuelve a iniciar sesión.', 'Your session has expired. Please log in again.', 'Votre session a expiré. Reconnectez-vous.', 'Ihre Sitzung ist abgelaufen. Bitte erneut anmelden.', 'انتهت الجلسة. سجّل الدخول مجددًا.'],
    contacte: ['Parla amb nosaltres', 'Habla con nosotros', 'Talk to us', 'Contactez-nous', 'Sprechen Sie mit uns', 'تحدّث معنا'],
    contacteTxt: ['Responem de dilluns a divendres, de 8 a 18 h.', 'Respondemos de lunes a viernes, de 8 a 18 h.', 'We answer Monday to Friday, 8 am to 6 pm.', 'Nous répondons du lundi au vendredi, de 8 h à 18 h.', 'Wir antworten Montag bis Freitag, 8–18 Uhr.', 'نرد من الاثنين إلى الجمعة، من 8 إلى 18.'],
    whatsapp: ['WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp', 'واتساب'],
    correu: ['Correu', 'Correo', 'Email', 'E-mail', 'E-Mail', 'البريد'],
    preguntes: ['Preguntes freqüents', 'Preguntas frecuentes', 'Frequently asked questions', 'Questions fréquentes', 'Häufige Fragen', 'أسئلة شائعة'],
    q1: ['Quan arriba la meva comanda?', '¿Cuándo llega mi pedido?', 'When will my order arrive?', 'Quand arrive ma commande ?', 'Wann kommt meine Bestellung an?', 'متى يصل طلبي؟'],
    a1: ['Normalment en 2 o 3 dies laborables. A Comandes, toca Seguiment per veure en quin pas és.', 'Normalmente en 2 o 3 días laborables. En Pedidos, toca Seguimiento para ver en qué paso está.', 'Usually within 2–3 working days. In Orders, tap Tracking to see which step it is at.', 'En général sous 2 à 3 jours ouvrés. Dans Commandes, touchez Suivi pour voir l’étape.', 'In der Regel in 2–3 Werktagen. Unter Bestellungen zeigt Sendungsverfolgung den aktuellen Schritt.', 'عادةً خلال 2–3 أيام عمل. في «الطلبات» اضغط «التتبع» لمعرفة المرحلة.'],
    q2: ['Com pago una factura?', '¿Cómo pago una factura?', 'How do I pay an invoice?', 'Comment payer une facture ?', 'Wie bezahle ich eine Rechnung?', 'كيف أدفع فاتورة؟'],
    a2: ['A Factures, toca Pagar i fes servir una targeta. També pots pagar per transferència indicant el número de factura.', 'En Facturas, toca Pagar y usa una tarjeta. También puedes pagar por transferencia indicando el número de factura.', 'In Invoices, tap Pay and use a card. You can also pay by bank transfer quoting the invoice number.', 'Dans Factures, touchez Payer et utilisez une carte. Vous pouvez aussi payer par virement en indiquant le numéro.', 'Unter Rechnungen auf Bezahlen tippen und eine Karte verwenden. Auch Überweisung mit Rechnungsnummer ist möglich.', 'في «الفواتير» اضغط «ادفع» واستخدم بطاقة. ويمكنك الدفع بتحويل مع ذكر رقم الفاتورة.'],
    q3: ['Com repeteixo una comanda?', '¿Cómo repito un pedido?', 'How do I reorder?', 'Comment refaire une commande ?', 'Wie bestelle ich erneut?', 'كيف أكرر طلبًا؟'],
    a3: ['A Inici o a Comandes, toca Repetir: els productes passen al cistell i només has de confirmar.', 'En Inicio o en Pedidos, toca Repetir: los productos pasan a la cesta y solo tienes que confirmar.', 'In Home or Orders, tap Reorder: the products go into your cart and you just confirm.', 'Dans Accueil ou Commandes, touchez Recommander : les produits passent au panier.', 'Unter Start oder Bestellungen auf Erneut bestellen tippen: Die Produkte kommen in den Warenkorb.', 'في «الرئيسية» أو «الطلبات» اضغط «كرّر الطلب» فتنتقل المنتجات إلى السلة.'],
    q4: ['Com canvio les dades de facturació?', '¿Cómo cambio los datos de facturación?', 'How do I change my billing details?', 'Comment modifier mes données de facturation ?', 'Wie ändere ich meine Rechnungsdaten?', 'كيف أغيّر بيانات الفوترة؟'],
    a4: ['A Les meves dades, toca Editar les dades. Les noves dades surten a les comandes i factures següents.', 'En Mis datos, toca Editar datos. Los datos nuevos salen en los siguientes pedidos y facturas.', 'In My details, tap Edit details. New details appear on your next orders and invoices.', 'Dans Mes données, touchez Modifier. Les nouvelles données figureront sur les prochains documents.', 'Unter Meine Daten auf Daten bearbeiten tippen. Neue Daten erscheinen auf den nächsten Dokumenten.', 'في «بياناتي» اضغط «تعديل البيانات». تظهر البيانات الجديدة في الطلبات والفواتير التالية.'],
    seguirAltra: ['Seguir una comanda amb el número', 'Seguir un pedido con el número', 'Track an order by number', 'Suivre une commande par numéro', 'Bestellung per Nummer verfolgen', 'تتبع طلبًا بالرقم'],
    carregant: ['Carregant…', 'Cargando…', 'Loading…', 'Chargement…', 'Wird geladen…', 'جارٍ التحميل…'],
    cada: ['Cada {0} setmanes', 'Cada {0} semanas', 'Every {0} weeks', 'Toutes les {0} semaines', 'Alle {0} Wochen', 'كل {0} أسابيع'],
    cadaSetmana: ['Cada setmana', 'Cada semana', 'Every week', 'Chaque semaine', 'Jede Woche', 'كل أسبوع'],
    progLink: ['Gestionar', 'Gestionar', 'Manage', 'Gérer', 'Verwalten', 'إدارة'],
  };
  var ESTATS = {
    'Pendent de confirmació': ['Rebuda', 'Recibido', 'Received', 'Reçue', 'Eingegangen', 'تم الاستلام'],
    Confirmada: ['Confirmada', 'Confirmado', 'Confirmed', 'Confirmée', 'Bestätigt', 'مؤكَّد'],
    'En preparació': ['En preparació', 'En preparación', 'Being prepared', 'En préparation', 'In Vorbereitung', 'قيد التجهيز'],
    Enviada: ['Enviada', 'Enviado', 'Shipped', 'Expédiée', 'Versandt', 'تم الشحن'],
    Entregada: ['Entregada', 'Entregado', 'Delivered', 'Livrée', 'Zugestellt', 'تم التسليم'],
    'Cancel·lada': ['Cancel·lada', 'Cancelado', 'Cancelled', 'Annulée', 'Storniert', 'ملغى'],
  };
  var PASSOS = ['Pendent de confirmació', 'Confirmada', 'En preparació', 'Enviada', 'Entregada'];
  var ICON = {
    inici: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    comandes: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    factures: '<path d="M6 2h9l5 5v15l-3-2-3 2-3-2-3 2-2-2z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
    dades: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
    ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7M12 17h.01"/>',
  };
  var SECCIONS = ['inici', 'comandes', 'factures', 'dades', 'ajuda'];

  var S = { sec: 'inici', comandes: null, factures: null, prog: null, cites: null, filtre: 'totes', cerca: '', fTab: 'pendents', fCerca: '', obert: null, sessions: null };

  function lang() { try { var l = localStorage.getItem('hx_lang') || 'ca'; return LANGS.indexOf(l) >= 0 ? l : 'ca'; } catch (e) { return 'ca'; } }
  function t(k) {
    var v = (TX[k] || [k])[LANGS.indexOf(lang())] || TX[k][0];
    for (var i = 1; i < arguments.length; i++) v = v.split('{' + (i - 1) + '}').join(arguments[i]);
    return v;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function eur(n) { return typeof window.hxFormatPrice === 'function' ? window.hxFormatPrice(n) : (Number(n) || 0).toFixed(2).replace('.', ',') + ' €'; }
  function data(d, llarga) {
    if (!d) return '';
    var x = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T12:00:00') : new Date(d);
    if (isNaN(x)) return String(d);
    return x.toLocaleDateString(LOC[lang()], llarga ? { weekday: 'long', day: 'numeric', month: 'long' } : { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function estat(s) { return (ESTATS[s] || [s])[LANGS.indexOf(lang())] || s; }
  function tipusEstat(s) { return s === 'Entregada' ? 'ok' : s === 'Cancel·lada' ? 'ko' : 'curs'; }
  function icona(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICON[k] + '</svg>'; }
  function toast(m, i) { if (typeof window.showToast === 'function') window.showToast(m, i || '✅'); }
  function api(p, o) { return window.hxApi(p, o); }
  function client() { return window.HX_USER && window.HX_USER.role !== 'admin' && typeof window.hxApiToken === 'function' && window.hxApiToken(); }
  function caducada(e) { if (e && e.status === 401) { toast(t('sessioCaducada'), '🔐'); tancar(); if (typeof window.logout === 'function') window.logout(); return true; } return false; }

  /* ---------- carrega de dades ---------- */
  function carregar() {
    api('/orders').then(function (d) {
      S.comandes = d.orders || [];
      // hx-plus.js (repetir / programar) llegeix la llista del mateix format que hxFetchOrders
      window.HX_SERVER_ORDERS = S.comandes.map(function (o) {
        return { invoiceNum: o.invoiceNum, date: new Date(o.date).toLocaleString(LOC[lang()]), total: o.total, items: o.items, status: o.status, site: o.site || '' };
      });
      pintar();
    }).catch(function (e) { if (!caducada(e)) { S.comandes = S.comandes || []; pintar(); } });
    api('/mis-facturas').then(function (d) { S.factures = d.facturas || []; pintar(); }).catch(function () { S.factures = S.factures || []; pintar(); });
    api('/recurring').then(function (d) { S.prog = d.recurring || []; pintar(); }).catch(function () { S.prog = S.prog || []; pintar(); });
    api('/cuenta/citas').then(function (d) { S.cites = d.citas || []; pintar(); }).catch(function () { S.cites = S.cites || []; pintar(); });
  }

  /* ---------- estructura ---------- */
  function arrel() {
    var a = document.getElementById('hxArea');
    if (a) return a;
    a = document.createElement('div');
    a.id = 'hxArea';
    a.setAttribute('role', 'dialog');
    a.setAttribute('aria-modal', 'true');
    a.setAttribute('aria-labelledby', 'hxaTitol');
    a.hidden = true;
    document.body.appendChild(a);
    a.addEventListener('click', clic);
    a.addEventListener('input', entrada);
    a.addEventListener('submit', enviar);
    a.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.getElementById('hxaPag')) tancar(); });
    return a;
  }
  function marc() {
    var u = window.HX_PROFILE || window.HX_USER || {};
    var nav = SECCIONS.map(function (k) {
      return '<button type="button" class="hxa-nav' + (S.sec === k ? ' on' : '') + '" data-sec="' + k + '"' + (S.sec === k ? ' aria-current="page"' : '') + '>' +
        icona(k) + '<span>' + esc(t(k === 'dades' ? 'dadesCurt' : k)) + '</span></button>';
    }).join('');
    return '<aside class="hxa-side"><div class="hxa-marca">HIGIENE<span>X</span></div>' +
      '<div class="hxa-qui"><b>' + esc(u.name || '') + '</b><small>' + esc(u.company || u.email || '') + '</small></div>' +
      '<nav class="hxa-menu" aria-label="' + esc(t('area')) + '">' + nav + '</nav>' +
      '<div class="hxa-peu"><button type="button" class="hxa-link" data-acc="botiga">← ' + esc(t('botiga')) + '</button>' +
      '<button type="button" class="hxa-link hxa-surt" data-acc="sortir">' + esc(t('sortir')) + '</button></div></aside>' +
      '<div class="hxa-top"><div class="hxa-marca">HIGIENE<span>X</span></div><button type="button" class="hxa-x" data-acc="botiga" aria-label="' + esc(t('tancar')) + '">✕</button></div>' +
      '<main class="hxa-main" id="hxaMain" tabindex="-1"></main>' +
      '<nav class="hxa-baix" aria-label="' + esc(t('area')) + '">' + nav + '</nav>';
  }

  function pintar() {
    var a = document.getElementById('hxArea');
    if (!a || a.hidden) return;
    var main = document.getElementById('hxaMain');
    if (!main) { a.innerHTML = marc(); main = document.getElementById('hxaMain'); }
    [].forEach.call(a.querySelectorAll('.hxa-nav'), function (b) {
      var on = b.getAttribute('data-sec') === S.sec;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    // conservar el focus del cercador mentre s'escriu
    var act = document.activeElement, id = act && act.id, pos = act && act.selectionStart;
    var plus = document.getElementById('hxPlusArea');
    if (plus && main.contains(plus)) tornarPlus(plus);
    main.innerHTML = ({ inici: inici, comandes: comandes, factures: factures, dades: dades, ajuda: ajuda }[S.sec])();
    if (S.sec === 'comandes') { muntarPlus(); pintarSeguiment(); }
    if (S.sec === 'dades') carregarSessions();
    if (id) { var el = document.getElementById(id); if (el && el !== act) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* no és un camp de text */ } } }
  }

  function titol(txt, sub) { return '<header class="hxa-cap"><h1 id="hxaTitol">' + esc(txt) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</header>'; }
  function carregant() { return '<p class="hxa-buit">' + esc(t('carregant')) + '</p>'; }
  function chip(s) { return '<span class="hxa-chip ' + tipusEstat(s) + '">' + esc(estat(s)) + '</span>'; }
  function progres(s) {
    if (s === 'Cancel·lada') return '';
    var i = Math.max(0, PASSOS.indexOf(s));
    return '<div class="hxa-prog" role="img" aria-label="' + esc(estat(s)) + '">' + PASSOS.map(function (p, k) { return '<i class="' + (k <= i ? 'fet' : '') + '"></i>'; }).join('') + '</div>';
  }
  function pendents() { return (S.factures || []).filter(function (f) { return f.estado !== 'pagada'; }); }

  /* ---------- Inici ---------- */
  function inici() {
    var u = window.HX_PROFILE || window.HX_USER || {};
    var h = titol(t('hola', String(u.name || '').split(' ')[0]), t('resum'));
    h += '<div class="hxa-grid">';
    // última comanda
    var o = S.comandes && S.comandes[0];
    h += '<div role="group" class="hxa-card hxa-gran" aria-labelledby="hxaC1"><h2 id="hxaC1">' + esc(t('darrera')) + '</h2>';
    if (!S.comandes) h += carregant();
    else if (!o) h += '<p class="hxa-buit">' + esc(t('capComanda')) + '</p><button type="button" class="hxa-btn" data-acc="botiga-productes">' + esc(t('ferComanda')) + '</button>';
    else {
      h += '<div class="hxa-ult"><div><b class="hxa-num">' + esc(o.invoiceNum) + '</b><small>' + esc(data(o.date)) + ' · ' + o.items.length + ' ' + esc(t('productes')) + '</small></div>' +
        '<div class="hxa-dreta">' + chip(o.status) + '<b>' + esc(eur(o.total)) + '</b></div></div>' + progres(o.status) +
        '<div class="hxa-acc"><button type="button" class="hxa-btn" data-acc="seguir" data-num="' + esc(o.invoiceNum) + '">' + esc(t('seguiment')) + '</button>' +
        '<button type="button" class="hxa-btn sec" data-acc="repetir" data-num="' + esc(o.invoiceNum) + '">' + esc(t('repetir')) + '</button></div>';
    }
    h += '</div>';
    // factures pendents
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaC2"><h2 id="hxaC2">' + esc(t('pendents')) + '</h2>';
    if (!S.factures) h += carregant();
    else {
      var p = pendents(), venc = p.filter(function (f) { return f.estado === 'vencida'; }).length;
      var tot = p.reduce(function (s, f) { return s + (+f.total || 0); }, 0);
      if (!p.length) h += '<p class="hxa-ok">✓ ' + esc(t('totAlDia')) + '</p>';
      else {
        h += '<p class="hxa-xifra' + (venc ? ' ko' : '') + '">' + esc(eur(tot)) + '</p><p class="hxa-meta">' + esc(t('nPendents', p.length)) +
          (venc ? ' · <b class="hxa-vermell">' + esc(t('nVencudes', venc)) + '</b>' : '') + '</p>' +
          '<button type="button" class="hxa-btn" data-sec="factures">' + esc(t('pagar')) + '</button>';
      }
    }
    h += '</div>';
    // pròxima programada
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaC3"><h2 id="hxaC3">' + esc(t('propera')) + '</h2>';
    var r = (S.prog || []).filter(function (x) { return x.active; }).sort(function (a, b) { return String(a.next_date).localeCompare(String(b.next_date)); })[0];
    if (!S.prog) h += carregant();
    else if (!r) h += '<p class="hxa-meta">' + esc(t('capProg')) + '</p>' + (o ? '<button type="button" class="hxa-btn sec" data-acc="programar" data-num="' + esc(o.invoiceNum) + '">' + esc(t('programar')) + '</button>' : '');
    else h += '<p class="hxa-data">' + esc(data(r.next_date, true)) + '</p><p class="hxa-meta">' + esc(r.every_days === 7 ? t('cadaSetmana') : t('cada', r.every_days / 7)) + ' · ' + esc(eur(r.total)) + '</p>' +
      '<button type="button" class="hxa-btn sec" data-sec="comandes" data-ancla="hxPlusArea">' + esc(t('progLink')) + '</button>';
    h += '</div>';
    // pròxima cita
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaC4"><h2 id="hxaC4">' + esc(t('cita')) + '</h2>';
    var c = S.cites && S.cites[0];
    if (!S.cites) h += carregant();
    else if (!c) h += '<p class="hxa-meta">' + esc(t('capCita')) + '</p><button type="button" class="hxa-btn sec" data-acc="cita">' + esc(t('demanarCita')) + '</button>';
    else h += '<p class="hxa-data">' + esc(data(c.date, true)) + ' · ' + esc(c.time) + '</p><p class="hxa-meta">' + esc(t(c.kind === 'formacion' ? 'formacio' : c.kind === 'auditoria' ? 'auditoria' : 'visita')) + '</p>';
    h += '</div></div>';
    // accions ràpides
    h += '<div role="group" class="hxa-rapid" aria-labelledby="hxaR"><h2 id="hxaR">' + esc(t('rapid')) + '</h2><div>' +
      (o ? '<button type="button" data-acc="repetir" data-num="' + esc(o.invoiceNum) + '">↻ ' + esc(t('repetirDarrera')) + '</button>' : '') +
      '<button type="button" data-acc="pressupost">✎ ' + esc(t('pressupost')) + '</button>' +
      '<button type="button" data-acc="cistell">🛒 ' + esc(t('cistell')) + '</button>' +
      '<button type="button" data-acc="botiga-productes">＋ ' + esc(t('ferComanda')) + '</button></div></div>';
    return h;
  }

  /* ---------- Comandes ---------- */
  function filtrades() {
    var q = S.cerca.trim().toLowerCase();
    return (S.comandes || []).filter(function (o) {
      var f = S.filtre;
      if (f === 'curs' && (o.status === 'Entregada' || o.status === 'Cancel·lada')) return false;
      if (f === 'ok' && o.status !== 'Entregada') return false;
      if (f === 'ko' && o.status !== 'Cancel·lada') return false;
      if (!q) return true;
      return String(o.invoiceNum).toLowerCase().indexOf(q) >= 0 || o.items.some(function (it) { return String(it.name).toLowerCase().indexOf(q) >= 0; });
    });
  }
  function filtres(actual, opcions, attr) {
    return '<div class="hxa-filtres" role="group">' + opcions.map(function (x) {
      return '<button type="button" ' + attr + '="' + x[0] + '" aria-pressed="' + (actual === x[0]) + '">' + esc(x[1]) + (x[2] != null ? ' <span>' + x[2] + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function comandes() {
    var h = titol(t('comandes'));
    h += '<div class="hxa-eines"><label class="hxa-cerca"><span class="hxa-sr">' + esc(t('cercar')) + '</span>' +
      '<input id="hxaCerca" type="search" placeholder="' + esc(t('cercar')) + '" value="' + esc(S.cerca) + '" autocomplete="off"></label>' +
      filtres(S.filtre, [['totes', t('totes')], ['curs', t('enCurs')], ['ok', t('entregades')], ['ko', t('cancelades')]], 'data-filtre') + '</div>';
    if (!S.comandes) return h + carregant();
    if (!S.comandes.length) return h + '<div class="hxa-card"><p class="hxa-buit">' + esc(t('capComanda')) + '</p><button type="button" class="hxa-btn" data-acc="botiga-productes">' + esc(t('ferComanda')) + '</button></div>' + plusCaixa();
    var l = filtrades();
    h += '<ul class="hxa-llista">' + (l.length ? l.map(function (o) {
      var obert = S.obert === o.invoiceNum;
      var items = o.items.map(function (it) { return it.name + ' ×' + it.qty; }).join(', ');
      return '<li class="hxa-fila' + (obert ? ' obert' : '') + '"><div class="hxa-fcap"><div><b class="hxa-num">' + esc(o.invoiceNum) + '</b><small>' + esc(data(o.date)) + (o.site ? ' · 📍 ' + esc(o.site) : '') + '</small></div>' +
        '<div class="hxa-dreta">' + chip(o.status) + '<b>' + esc(eur(o.total)) + '</b></div></div>' +
        '<p class="hxa-items">' + esc(items) + '</p>' +
        '<div class="hxa-acc"><button type="button" class="hxa-btn sec" data-acc="seguir" data-num="' + esc(o.invoiceNum) + '" aria-expanded="' + obert + '">' + esc(t('seguiment')) + '</button>' +
        '<button type="button" class="hxa-btn sec" data-acc="pdf-comanda" data-num="' + esc(o.invoiceNum) + '">⬇ ' + esc(t('pdf')) + '</button>' +
        '<button type="button" class="hxa-btn sec" data-acc="repetir" data-num="' + esc(o.invoiceNum) + '">' + esc(t('repetir')) + '</button>' +
        '<button type="button" class="hxa-btn sec" data-acc="programar" data-num="' + esc(o.invoiceNum) + '">' + esc(t('programar')) + '</button></div>' +
        (obert ? '<div class="hxa-seg" id="hxaSeg"></div>' : '') + '</li>';
    }).join('') : '<li class="hxa-buit">' + esc(t('capResultat')) + '</li>') + '</ul>';
    return h + plusCaixa();
  }
  function plusCaixa() { return '<div role="group" class="hxa-card hxa-plus" aria-labelledby="hxaPl"><h2 id="hxaPl">' + esc(t('altres')) + '</h2><div id="hxaPlusLloc"></div></div>'; }
  // El bloc de reposició / programades / seus (hx-plus.js) es mou aquí mentre l'àrea és oberta
  function muntarPlus() {
    var lloc = document.getElementById('hxaPlusLloc'), plus = document.getElementById('hxPlusArea');
    if (lloc && plus) lloc.appendChild(plus);
  }
  function tornarPlus(plus) {
    var casa = document.getElementById('orderHistory');
    plus = plus || document.getElementById('hxPlusArea');
    if (plus && casa && casa.parentNode && !casa.parentNode.contains(plus)) casa.parentNode.appendChild(plus);
  }
  function pintarSeguiment() {
    var box = document.getElementById('hxaSeg');
    if (!box || typeof window.hxShowTrackedOrder !== 'function') return;
    var o = (S.comandes || []).filter(function (x) { return x.invoiceNum === S.obert; })[0];
    if (o) window.hxShowTrackedOrder(box, o);
  }

  /* ---------- Factures ---------- */
  function factures() {
    var h = titol(t('factures'));
    if (!S.factures) return h + carregant();
    if (!S.factures.length) return h + '<div class="hxa-card"><p class="hxa-buit">' + esc(t('capFactura')) + '</p></div>';
    var p = pendents(), pg = S.factures.filter(function (f) { return f.estado === 'pagada'; });
    var tot = p.reduce(function (s, f) { return s + (+f.total || 0); }, 0);
    if (p.length) h += '<div class="hxa-total"><span>' + esc(t('totalPendent')) + '</span><b>' + esc(eur(tot)) + '</b></div>';
    h += '<div class="hxa-eines"><label class="hxa-cerca"><span class="hxa-sr">' + esc(t('cercar')) + '</span>' +
      '<input id="hxaFCerca" type="search" placeholder="' + esc(t('cercar')) + '" value="' + esc(S.fCerca) + '" autocomplete="off"></label>' +
      filtres(S.fTab, [['pendents', t('perPagar'), p.length], ['pagades', t('pagades'), pg.length]], 'data-ftab') + '</div>';
    var q = S.fCerca.trim().toLowerCase();
    var l = (S.fTab === 'pendents' ? p : pg).filter(function (f) {
      return !q || String(f.num).toLowerCase().indexOf(q) >= 0 || (f.lineas || []).some(function (x) { return String(x.nom).toLowerCase().indexOf(q) >= 0; });
    });
    if (!l.length) return h + '<div class="hxa-card"><p class="hxa-buit">' + esc(q ? t('capResultat') : S.fTab === 'pendents' ? t('capPendent') : t('capPagada')) + '</p></div>';
    return h + '<ul class="hxa-llista">' + l.map(function (f) {
      var e = f.estado === 'pagada' ? 'ok' : f.estado === 'vencida' ? 'ko' : 'curs';
      var txt = f.estado === 'pagada' ? (f.pagoWeb ? t('pagadaTargeta') : t('pagada')) : f.estado === 'vencida' ? t('vencuda') : t('pendent');
      return '<li class="hxa-fila"><div class="hxa-fcap"><div><b class="hxa-num">' + esc(f.num) + '</b><small>' + esc(data(f.fecha)) +
        (f.venc && f.estado !== 'pagada' ? ' · ' + esc(t('venc', data(f.venc))) : '') + '</small></div>' +
        '<div class="hxa-dreta"><span class="hxa-chip ' + e + '">' + esc(txt) + '</span><b>' + esc(eur(f.total)) + '</b></div></div>' +
        '<div class="hxa-acc">' + (f.estado !== 'pagada' ? '<button type="button" class="hxa-btn" data-acc="pagar" data-num="' + esc(f.num) + '">' + esc(t('pagar')) + '</button>' : '') +
        '<button type="button" class="hxa-btn sec" data-acc="pdf-factura" data-num="' + esc(f.num) + '">⬇ ' + esc(t('pdf')) + '</button></div></li>';
    }).join('') + '</ul>';
  }

  /* ---------- Les meves dades ---------- */
  function dades() {
    var h = titol(t('dades'));
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaD1"><div class="hxa-dcap"><h2 id="hxaD1">' + esc(t('facturacio')) + '</h2>' +
      '<button type="button" class="hxa-btn sec" data-acc="editar">✏️ ' + esc(t('editar')) + '</button></div><div id="hxaDl"></div></div>';
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaD2"><h2 id="hxaD2">' + esc(t('seguretat')) + '</h2>' +
      '<form class="hxa-form" id="hxaClau" novalidate><h3>' + esc(t('canviarClau')) + '</h3>' +
      camp('hxaCA', t('clauActual'), 'current-password') + camp('hxaCN', t('clauNova'), 'new-password') + camp('hxaCR', t('clauRepetir'), 'new-password') +
      '<p class="hxa-err" id="hxaClauErr" role="alert"></p><button type="submit" class="hxa-btn">' + esc(t('desarClau')) + '</button></form>' +
      '<div class="hxa-sess"><h3>' + esc(t('sessions')) + '</h3><p id="hxaSessTxt" class="hxa-meta">' + esc(S.sessions == null ? t('carregant') : S.sessions > 1 ? t('nSessions', S.sessions) : t('unaSessio')) + '</p>' +
      '<button type="button" class="hxa-btn sec" data-acc="tancar-altres"' + (S.sessions === 1 ? ' disabled' : '') + '>' + esc(t('tancarAltres')) + '</button></div></div>';
    setTimeout(pintarDl, 0);
    return h;
  }
  function camp(id, txt, ac) { return '<label for="' + id + '">' + esc(txt) + '</label><input id="' + id + '" type="password" autocomplete="' + ac + '" minlength="6" maxlength="200" required>'; }
  // Reaprofita la fitxa de perfil-empresa.js (mateixos textos i camps)
  function pintarDl() {
    var dl = document.getElementById('hxaDl');
    if (!dl) return;
    if (typeof window.hxPintarDades === 'function') window.hxPintarDades();
    var orig = document.getElementById('hxMisDades');
    var d = orig && orig.querySelector('dl');
    dl.innerHTML = d ? d.outerHTML : '';
  }
  function carregarSessions() {
    api('/cuenta/sesiones').then(function (d) {
      var canvi = S.sessions !== d.abiertas;
      S.sessions = d.abiertas;
      if (canvi && S.sec === 'dades') {
        var p = document.getElementById('hxaSessTxt'), b = document.querySelector('[data-acc="tancar-altres"]');
        if (p) p.textContent = S.sessions > 1 ? t('nSessions', S.sessions) : t('unaSessio');
        if (b) b.disabled = S.sessions <= 1;
      }
    }).catch(caducada);
  }

  /* ---------- Ajuda ---------- */
  function ajuda() {
    var h = titol(t('ajuda'));
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaA1"><h2 id="hxaA1">' + esc(t('contacte')) + '</h2><p class="hxa-meta">' + esc(t('contacteTxt')) + '</p>' +
      '<div class="hxa-acc"><a class="hxa-btn" href="https://wa.me/34631706398" target="_blank" rel="noopener">' + esc(t('whatsapp')) + ' · 631 706 398</a>' +
      '<a class="hxa-btn sec" href="mailto:contacto@higienexvalencia.es">' + esc(t('correu')) + ' · contacto@higienexvalencia.es</a></div></div>';
    h += '<div role="group" class="hxa-card" aria-labelledby="hxaA2"><h2 id="hxaA2">' + esc(t('preguntes')) + '</h2>' + [1, 2, 3, 4].map(function (i) {
      return '<details class="hxa-faq"><summary>' + esc(t('q' + i)) + '</summary><p>' + esc(t('a' + i)) + '</p></details>';
    }).join('') + '</div>';
    h += '<div class="hxa-acc"><button type="button" class="hxa-btn sec" data-acc="seguir-num">' + esc(t('seguirAltra')) + '</button>' +
      '<button type="button" class="hxa-btn sec" data-acc="cita">' + esc(t('demanarCita')) + '</button></div>';
    return h;
  }

  /* ---------- pagament de factura (mode de prova) ---------- */
  var OK = '4242424242424242', KO = '4000000000000002';
  function obrirPagament(num) {
    var f = (S.factures || []).filter(function (x) { return x.num === num; })[0];
    if (!f) return;
    var m = document.createElement('div');
    m.id = 'hxaPag';
    m.innerHTML = '<form class="hxa-modal" role="dialog" aria-modal="true" aria-labelledby="hxaPagT" novalidate>' +
      '<button type="button" class="hxa-x" data-pag="tancar" aria-label="' + esc(t('tancar')) + '">✕</button>' +
      '<h2 id="hxaPagT">' + esc(t('pagarFactura', f.num)) + '</h2><p class="hxa-xifra">' + esc(eur(f.total)) + '</p>' +
      '<div class="hxa-prova"><b>🧪 ' + esc(t('modeProva')) + '</b> ' + esc(t('targetaProva')) +
      '<div><button type="button" data-targeta="' + OK + '">4242 4242 4242 4242 <span class="ok">' + esc(t('aprovada')) + '</span></button>' +
      '<button type="button" data-targeta="' + KO + '">4000 0000 0000 0002 <span class="ko">' + esc(t('rebutjada')) + '</span></button></div></div>' +
      '<label for="hxaPN">' + esc(t('numTargeta')) + '</label><input id="hxaPN" inputmode="numeric" autocomplete="cc-number" maxlength="23" required>' +
      '<div class="hxa-dos"><div><label for="hxaPE">' + esc(t('caducitat')) + '</label><input id="hxaPE" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="MM/AA" required></div>' +
      '<div><label for="hxaPC">CVV</label><input id="hxaPC" inputmode="numeric" autocomplete="cc-csc" maxlength="4" required></div></div>' +
      '<label for="hxaPT">' + esc(t('titular')) + '</label><input id="hxaPT" autocomplete="cc-name" value="' + esc((window.HX_PROFILE || {}).name || '') + '">' +
      '<p class="hxa-err" id="hxaPagErr" role="alert"></p>' +
      '<button type="submit" class="hxa-btn hxa-ple">' + esc(t('pagarImport', eur(f.total))) + '</button></form>';
    document.body.appendChild(m);
    var form = m.querySelector('form');
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('[data-pag="tancar"]')) { m.remove(); return; }
      var b = e.target.closest('[data-targeta]');
      if (b) {
        document.getElementById('hxaPN').value = b.getAttribute('data-targeta').replace(/(.{4})/g, '$1 ').trim();
        var d = new Date(); document.getElementById('hxaPE').value = ('0' + (d.getMonth() + 1)).slice(-2) + '/' + String(d.getFullYear() + 3).slice(-2);
        document.getElementById('hxaPC').value = '123';
        form.querySelector('[type=submit]').focus();
      }
    });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') m.remove(); });
    document.getElementById('hxaPE').addEventListener('input', function (e) {
      var v = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); pagar(f, form); });
    document.getElementById('hxaPN').focus();
  }
  function pagar(f, form) {
    var err = document.getElementById('hxaPagErr'), btn = form.querySelector('[type=submit]');
    var n = document.getElementById('hxaPN').value.replace(/\D/g, ''), ex = document.getElementById('hxaPE').value, cvv = document.getElementById('hxaPC').value;
    var P = window.HXPagamentProva || {};
    var m = /^(\d{2})\/(\d{2})$/.exec(ex);
    err.textContent = '';
    if (!(P.luhn ? P.luhn(n) : n.length >= 13)) { err.textContent = t('numMal'); return; }
    if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 1) <= new Date()) { err.textContent = t('expMal'); return; }
    if (!/^\d{3,4}$/.test(cvv)) { err.textContent = t('cvvMal'); return; }
    if (n === KO) { err.textContent = t('denegada'); return; }
    btn.disabled = true; btn.textContent = t('pagant');
    api('/cuenta/pagar', { method: 'POST', body: { num: f.num, marca: P.marca ? P.marca(n) : 'Visa', ultimas: n.slice(-4) } })
      .then(function (d) {
        var w = document.getElementById('hxaPag'); if (w) w.remove();
        toast(t('pagatOk', f.num, d.ref), '💳');
        f.estado = 'pagada'; f.pagoWeb = true;
        pintar();
        if (window.hxMisFacturas) window.hxMisFacturas.carregar(true);
      })
      .catch(function (e) {
        if (caducada(e)) return;
        err.textContent = e.status === 409 ? t('jaPagada') : t('errPagar');
        btn.disabled = false; btn.textContent = t('pagarImport', eur(f.total));
      });
  }

  /* ---------- accions ---------- */
  function comanda(num) { return (S.comandes || []).filter(function (o) { return o.invoiceNum === num; })[0]; }
  // hx-plus.js treballa amb l'índex dins de loadOrderHistory()
  function idxHistorial(num) {
    var l = typeof window.loadOrderHistory === 'function' ? window.loadOrderHistory() : [];
    for (var i = 0; i < l.length; i++) if (l[i].invoiceNum === num) return i;
    return -1;
  }
  function anarA(id) {
    tancar();
    var el = document.getElementById(id);
    if (!el) return;
    // la web ensenya les seccions per pàgines (navTo); després es baixa fins a l'element
    var sec = el.closest('section[id]');
    if (sec && typeof window.navTo === 'function') window.navTo(sec.id);
    setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
  }
  function pdfComanda(o) {
    if (!(window.HXPDF_DOCS && window.HXPDF && window.HXPDF.disponible())) { toast(t('errGen'), '⚠️'); return; }
    var u = window.HX_PROFILE || window.HX_USER || {};
    var d = new Date(o.date), e = new Date(d);
    for (var n = 3; n > 0;) { e.setDate(e.getDate() + 1); if (e.getDay() % 6) n--; }
    var f = function () {
      window.HXPDF_DOCS.comanda({ invoiceNum: o.invoiceNum, dateStr: window.HXPDF.dd(d), entregaStr: window.HXPDF.dd(e), total: o.total },
        o.items.map(function (it) { return { name: it.name, qty: it.qty || 1, total: +it.total || 0 }; }), { name: u.name, company: u.company, email: u.email });
    };
    if (window.hxAmbIdiomaDocs) window.hxAmbIdiomaDocs(f); else f();
  }
  function accio(a, num) {
    var o = num && comanda(num);
    if (a === 'botiga') { tancar(); return; }
    if (a === 'sortir') { tancar(); if (typeof window.logout === 'function') window.logout(); return; }
    if (a === 'botiga-productes') { anarA('productes'); return; }
    if (a === 'pressupost') { anarA('pressupost'); return; }
    if (a === 'cita') { anarA('hxCita'); return; }
    if (a === 'cistell') { tancar(); if (typeof window.openCartDrawer === 'function') window.openCartDrawer(); return; }
    if (a === 'seguir-num') { anarA('seguiment-comanda'); return; }
    if (a === 'seguir') { S.sec = 'comandes'; S.obert = S.obert === num ? null : num; pintar(); var s = document.getElementById('hxaSeg'); if (s) s.scrollIntoView({ block: 'nearest' }); return; }
    if (a === 'repetir') {
      var i = idxHistorial(num);
      tancar();
      if (i >= 0 && typeof window.hxpRepetir === 'function') window.hxpRepetir(i);
      return;
    }
    if (a === 'programar') { var j = idxHistorial(num); if (j >= 0 && typeof window.hxpProgramar === 'function') window.hxpProgramar(j); return; }
    if (a === 'pdf-comanda' && o) { pdfComanda(o); return; }
    if (a === 'pdf-factura') {
      var f = (S.factures || []).filter(function (x) { return x.num === num; })[0];
      if (f && window.hxMisFacturas) (window.hxAmbIdiomaDocs ? window.hxAmbIdiomaDocs(function () { window.hxMisFacturas.pdf(f); }) : window.hxMisFacturas.pdf(f));
      return;
    }
    if (a === 'pagar') { obrirPagament(num); return; }
    if (a === 'editar') { if (typeof window.hxEditarPerfil === 'function') window.hxEditarPerfil(); return; }
    if (a === 'tancar-altres') {
      api('/cuenta/cerrar-otras', { method: 'POST' }).then(function () { S.sessions = 1; toast(t('altresTancades'), '🔒'); pintar(); })
        .catch(function (e) { if (!caducada(e)) toast(t('errGen'), '⚠️'); });
    }
  }
  function clic(e) {
    var s = e.target.closest('[data-sec]');
    if (s) {
      S.sec = s.getAttribute('data-sec');
      pintar();
      var anc = s.getAttribute('data-ancla'), el = anc && document.getElementById(anc);
      if (el) el.scrollIntoView({ block: 'start' });
      else { var m = document.getElementById('hxaMain'); if (m) { m.scrollTop = 0; m.focus({ preventScroll: true }); } }
      return;
    }
    var b = e.target.closest('[data-acc]');
    if (b) { accio(b.getAttribute('data-acc'), b.getAttribute('data-num')); return; }
    var fl = e.target.closest('[data-filtre]');
    if (fl) { S.filtre = fl.getAttribute('data-filtre'); pintar(); return; }
    var ft = e.target.closest('[data-ftab]');
    if (ft) { S.fTab = ft.getAttribute('data-ftab'); pintar(); }
  }
  function entrada(e) {
    if (e.target.id === 'hxaCerca') { S.cerca = e.target.value; pintar(); }
    if (e.target.id === 'hxaFCerca') { S.fCerca = e.target.value; pintar(); }
  }
  function enviar(e) {
    if (e.target.id !== 'hxaClau') return;
    e.preventDefault();
    var g = function (id) { return document.getElementById(id).value; };
    var err = document.getElementById('hxaClauErr');
    var a = g('hxaCA'), n = g('hxaCN'), r = g('hxaCR');
    err.textContent = '';
    if (n.length < 6) { err.textContent = t('clauCurta'); return; }
    if (n !== r) { err.textContent = t('clauDiferent'); return; }
    if (n === a) { err.textContent = t('clauIgual'); return; }
    var btn = e.target.querySelector('[type=submit]'); btn.disabled = true;
    api('/cuenta/clave', { method: 'POST', body: { actual: a, nueva: n } })
      .then(function () { e.target.reset(); S.sessions = 1; toast(t('clauDesada'), '🔒'); pintar(); })
      .catch(function (x) {
        if (x.status === 401) { caducada(x); return; }
        err.textContent = x.status === 403 ? t('clauMal') : x.message === 'igual' ? t('clauIgual') : x.message === 'corta' ? t('clauCurta') : t('errGen');
      })
      .then(function () { btn.disabled = false; });
  }

  /* ---------- obrir / tancar ---------- */
  var tornarFocus = null;
  function obrir(sec) {
    if (!client()) { if (typeof window.openAuthModal === 'function') { window.openAuthModal(); if (window.switchTab) window.switchTab('login'); } return; }
    var a = arrel();
    if (SECCIONS.indexOf(sec) >= 0) S.sec = sec;
    tornarFocus = document.activeElement;
    a.innerHTML = '';
    a.hidden = false;
    document.documentElement.classList.add('hxa-oberta');
    if (typeof window.closePedidosSection === 'function') window.closePedidosSection();
    pintar();
    carregar();
    var m = document.getElementById('hxaMain'); if (m) m.focus({ preventScroll: true });
  }
  function tancar() {
    var a = document.getElementById('hxArea');
    if (!a || a.hidden) return;
    tornarPlus();
    a.hidden = true;
    a.innerHTML = '';
    document.documentElement.classList.remove('hxa-oberta');
    if (tornarFocus && tornarFocus.focus) try { tornarFocus.focus(); } catch (e) { /* element ja no hi és */ }
  }
  window.hxArea = { obrir: obrir, tancar: tancar, refrescar: function () { if (document.getElementById('hxArea') && !document.getElementById('hxArea').hidden) carregar(); } };

  /* ---------- enllaços amb la resta de la web ---------- */
  function iniciar() {
    // Botó del compte (👤 Nom) i botó del panell (📊): obren l'àrea
    var cp = window.cpNavAction;
    if (typeof cp === 'function' && !cp._hxa) {
      var w = function () { if (client()) return obrir('inici'); if (window.CP_LOGGED_IN) return cp.apply(this, arguments); obrir('inici'); };
      w._hxa = true; window.cpNavAction = w;
    }
    var sl = window.setLoggedInUser;
    if (typeof sl === 'function' && !sl._hxa) {
      var w2 = function (name, avatar, role) {
        var r = sl.apply(this, arguments);
        var b = document.getElementById('userNavBtn');
        if (b && role !== 'admin') { b.onclick = function () { obrir('inici'); }; b.setAttribute('aria-label', t('area')); }
        return r;
      };
      w2._hxa = true; window.setLoggedInUser = w2;
      var b0 = document.getElementById('userNavBtn');
      if (b0 && window.HX_USER && window.HX_USER.role !== 'admin') b0.onclick = function () { obrir('inici'); };
    }
    var lo = window.logout;
    if (typeof lo === 'function' && !lo._hxa) {
      var w3 = function () { tancar(); S.comandes = S.factures = S.prog = S.cites = null; S.sessions = null; S.obert = null; return lo.apply(this, arguments); };
      w3._hxa = true; window.logout = w3;
    }
    var al = window.hxApplyLang;
    if (typeof al === 'function' && !al._hxa) {
      var w4 = function () {
        var r = al.apply(this, arguments);
        var a = document.getElementById('hxArea');
        if (a && !a.hidden) { tornarPlus(); a.innerHTML = ''; pintar(); }
        return r;
      };
      w4._hxa = true; window.hxApplyLang = w4;
    }
    // Al cistell, un botó porta a les comandes i factures (que ara són a l'àrea)
    var oc = window.openCartDrawer;
    if (typeof oc === 'function' && !oc._hxa) {
      var w5 = function () { var r = oc.apply(this, arguments); botoCistell(); return r; };
      w5._hxa = true; window.openCartDrawer = w5;
    }
    // Enllaç directe: ?area=factures (p. ex. des d'un correu)
    var q = null;
    try { q = new URLSearchParams(location.search).get('area'); } catch (e) { q = null; }
    if (q) {
      var n = 0, tmr = setInterval(function () {
        if (client()) { clearInterval(tmr); obrir(q); } else if (++n > 20) clearInterval(tmr);
      }, 500);
    }
  }
  function botoCistell() {
    var h = document.getElementById('orderHistory');
    if (!h) return;
    var b = document.getElementById('hxaCartLink');
    if (!client()) { if (b) b.remove(); return; }
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'hxaCartLink';
      b.onclick = function () { obrir('comandes'); };
      h.parentNode.insertBefore(b, h);
    }
    b.textContent = '📦 ' + t('comandes') + ' · ' + t('factures');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
