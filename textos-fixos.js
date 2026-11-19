/* ============================================================
   HIGIENEX — Textos fixos sense clau de traducció (textos-fixos.js)
   Alguns textos de index.html (peu, barra de certificacions, taules
   d'Operacions, formularis de Contacte…) no tenien data-i18n-key i
   sortien sempre en català. Aquí es tradueixen pel text original:
   en canviar d'idioma, cada text en català es substitueix pel seu
   equivalent, i en tornar al català es recupera l'original.
   Cada entrada: 'text en català': [es, en, fr, de, ar]
   ============================================================ */
(function () {
  'use strict';
  var T = {
    "Saltar al contingut principal": [
      "Saltar al contenido principal",
      "Skip to main content",
      "Aller au contenu principal",
      "Zum Hauptinhalt springen",
      "انتقل إلى المحتوى الرئيسي"
    ],
    "Treballa amb Nosaltres": [
      "Trabaja con nosotros",
      "Work with us",
      "Travaillez avec nous",
      "Arbeiten Sie mit uns",
      "اعمل معنا"
    ],
    "Programa de Fidelització": [
      "Programa de fidelización",
      "Loyalty programme",
      "Programme de fidélité",
      "Treueprogramm",
      "برنامج الولاء"
    ],
    "Garanties i Devolucions": [
      "Garantías y devoluciones",
      "Warranty and returns",
      "Garanties et retours",
      "Garantie und Rückgabe",
      "الضمان والإرجاع"
    ],
    "📋 Fes un Pressupost": [
      "📋 Haz un presupuesto",
      "📋 Build a quote",
      "📋 Faire un devis",
      "📋 Angebot erstellen",
      "📋 أعدّ عرض سعر"
    ],
    "Gestió ambiental certificada": [
      "Gestión ambiental certificada",
      "Certified environmental management",
      "Gestion environnementale certifiée",
      "Zertifiziertes Umweltmanagement",
      "إدارة بيئية معتمدة"
    ],
    "ECO Certificat": [
      "ECO certificado",
      "Certified ECO",
      "ECO certifié",
      "Zertifiziert ECO",
      "منتجات بيئية معتمدة"
    ],
    "Productes ecològics": [
      "Productos ecológicos",
      "Eco-friendly products",
      "Produits écologiques",
      "Umweltfreundliche Produkte",
      "منتجات صديقة للبيئة"
    ],
    "19 Patents": [
      "19 patentes",
      "19 patents",
      "19 brevets",
      "19 Patente",
      "19 براءة اختراع"
    ],
    "Innovació pròpia": [
      "Innovación propia",
      "In-house innovation",
      "Innovation propre",
      "Eigene Innovation",
      "ابتكار ذاتي"
    ],
    "Des de 2015": [
      "Desde 2015",
      "Since 2015",
      "Depuis 2015",
      "Seit 2015",
      "منذ 2015"
    ],
    "Experiència garantida": [
      "Experiencia garantizada",
      "Proven experience",
      "Expérience garantie",
      "Bewährte Erfahrung",
      "خبرة مضمونة"
    ],
    "👔 Direcció General": [
      "👔 Dirección general",
      "👔 Management",
      "👔 Direction générale",
      "👔 Geschäftsführung",
      "👔 الإدارة العامة"
    ],
    "⚙️ Producció": [
      "⚙️ Producción",
      "⚙️ Production",
      "⚙️ Production",
      "⚙️ Produktion",
      "⚙️ الإنتاج"
    ],
    "✅ Qualitat": [
      "✅ Calidad",
      "✅ Quality",
      "✅ Qualité",
      "✅ Qualität",
      "✅ الجودة"
    ],
    "🚛 Logística": [
      "🚛 Logística",
      "🚛 Logistics",
      "🚛 Logistique",
      "🚛 Logistik",
      "🚛 اللوجستيات"
    ],
    "💼 Comercial": [
      "💼 Comercial",
      "💼 Sales",
      "💼 Commercial",
      "💼 Vertrieb",
      "💼 المبيعات"
    ],
    "📱 Màrqueting": [
      "📱 Marketing",
      "📱 Marketing",
      "📱 Marketing",
      "📱 Marketing",
      "📱 التسويق"
    ],
    "👥 RRHH": [
      "👥 RR. HH.",
      "👥 HR",
      "👥 RH",
      "👥 Personal",
      "👥 الموارد البشرية"
    ],
    "📑 Administració": [
      "📑 Administración",
      "📑 Administration",
      "📑 Administration",
      "📑 Verwaltung",
      "📑 الإدارة"
    ],
    "🔬 R+D Independent": [
      "🔬 I+D independiente",
      "🔬 Independent R&D",
      "🔬 R&D indépendante",
      "🔬 Unabhängige F&E",
      "🔬 بحث وتطوير مستقل"
    ],
    "📍 València · Jornada completa": [
      "📍 Valencia · Jornada completa",
      "📍 Valencia · Full-time",
      "📍 Valence · Temps plein",
      "📍 Valencia · Vollzeit",
      "📍 فالنسيا · دوام كامل"
    ],
    "Deixa aquest camp buit": [
      "Deja este campo vacío",
      "Leave this field empty",
      "Laissez ce champ vide",
      "Dieses Feld leer lassen",
      "اترك هذا الحقل فارغًا"
    ],
    "Email *": [
      "Email *",
      "Email *",
      "E-mail *",
      "E-Mail *",
      "البريد الإلكتروني *"
    ],
    "Màxim 5 MB · PDF o Word": [
      "Máximo 5 MB · PDF o Word",
      "Max. 5 MB · PDF or Word",
      "5 Mo max. · PDF ou Word",
      "Max. 5 MB · PDF oder Word",
      "بحد أقصى 5 ميغابايت · PDF أو Word"
    ],
    "🕒 Preus actualitzats el 1 d’agost del 2026": [
      "🕒 Precios actualizados el 1 de agosto de 2026",
      "🕒 Prices updated on 1 August 2026",
      "🕒 Prix mis à jour le 1er août 2026",
      "🕒 Preise aktualisiert am 1. August 2026",
      "🕒 الأسعار محدّثة بتاريخ 1 أغسطس 2026"
    ],
    "-5% des de 5 unitats · -10% des de 10 · -15% des de 20 (s'aplica automàticament al cistell).": [
      "-5 % desde 5 unidades · -10 % desde 10 · -15 % desde 20 (se aplica automáticamente en el carrito).",
      "-5% from 5 units · -10% from 10 · -15% from 20 (applied automatically in your cart).",
      "-5 % dès 5 unités · -10 % dès 10 · -15 % dès 20 (appliqué automatiquement au panier).",
      "-5 % ab 5 Stück · -10 % ab 10 · -15 % ab 20 (wird im Warenkorb automatisch angewendet).",
      "-5% من 5 وحدات · -10% من 10 · -15% من 20 (يُطبَّق تلقائيًا في السلة)."
    ],
    "Concentrats biodegradables ×3": [
      "Concentrados biodegradables ×3",
      "Biodegradable ×3 concentrates",
      "Concentrés biodégradables ×3",
      "Biologisch abbaubare 3-fach-Konzentrate",
      "مركّزات قابلة للتحلل الحيوي ×3"
    ],
    "Virucides d'ampli espectre": [
      "Virucidas de amplio espectro",
      "Broad-spectrum virucides",
      "Virucides à large spectre",
      "Breitband-Viruzide",
      "مضادات فيروسات واسعة الطيف"
    ],
    "HACCP i contacte alimentari": [
      "HACCP y contacto alimentario",
      "HACCP and food contact",
      "HACCP et contact alimentaire",
      "HACCP und Lebensmittelkontakt",
      "HACCP والتلامس مع الأغذية"
    ],
    "Superfícies antimicrobianes": [
      "Superficies antimicrobianas",
      "Antimicrobial surfaces",
      "Surfaces antimicrobiennes",
      "Antimikrobielle Oberflächen",
      "أسطح مضادة للميكروبات"
    ],
    "Traçabilitat digital de lot": [
      "Trazabilidad digital de lote",
      "Digital batch traceability",
      "Traçabilité numérique des lots",
      "Digitale Chargenrückverfolgung",
      "تتبّع رقمي للدفعات"
    ],
    "En fases de concessió": [
      "En fase de concesión",
      "Pending approval",
      "En cours d'obtention",
      "Im Erteilungsverfahren",
      "قيد المنح"
    ],
    "Patentes registrades i en curs": [
      "Patentes registradas y en curso",
      "Patents granted and pending",
      "Brevets déposés et en cours",
      "Erteilte und angemeldete Patente",
      "براءات اختراع مسجّلة وقيد التسجيل"
    ],
    "Reducció costos operatius estimada gràcies a la digitalització": [
      "Reducción estimada de costes operativos gracias a la digitalización",
      "Estimated operating cost reduction thanks to digitalisation",
      "Réduction estimée des coûts d'exploitation grâce à la numérisation",
      "Geschätzte Senkung der Betriebskosten durch Digitalisierung",
      "خفض متوقع لتكاليف التشغيل بفضل الرقمنة"
    ],
    "Increment vendes": [
      "Incremento de ventas",
      "Sales growth",
      "Hausse des ventes",
      "Umsatzsteigerung",
      "زيادة المبيعات"
    ],
    "Horitzó complet": [
      "Horizonte completo",
      "Full timeframe",
      "Horizon complet",
      "Gesamtzeitraum",
      "المدى الكامل"
    ],
    "% Ingressos nous productes": [
      "% ingresos de nuevos productos",
      "% revenue from new products",
      "% de revenus des nouveaux produits",
      "% Umsatz mit neuen Produkten",
      "% الإيرادات من المنتجات الجديدة"
    ],
    "Taxa creixement anual producció": [
      "Tasa de crecimiento anual de la producción",
      "Annual production growth rate",
      "Taux de croissance annuel de la production",
      "Jährliche Produktionswachstumsrate",
      "معدل النمو السنوي للإنتاج"
    ],
    "Inversió R+D sobre vendes": [
      "Inversión en I+D sobre ventas",
      "R&D spend as % of sales",
      "Investissement R&D sur les ventes",
      "F&E-Ausgaben im Verhältnis zum Umsatz",
      "الاستثمار في البحث والتطوير من المبيعات"
    ],
    "Noves innovacions anuals": [
      "Nuevas innovaciones anuales",
      "New innovations per year",
      "Nouvelles innovations par an",
      "Neue Innovationen pro Jahr",
      "ابتكارات جديدة سنويًا"
    ],
    "Temps dev. nous productes": [
      "Tiempo de desarrollo de nuevos productos",
      "New product development time",
      "Délai de développement des nouveaux produits",
      "Entwicklungszeit neuer Produkte",
      "مدة تطوير المنتجات الجديدة"
    ],
    "Mercats geogràfics actius": [
      "Mercados geográficos activos",
      "Active geographic markets",
      "Marchés géographiques actifs",
      "Aktive geografische Märkte",
      "الأسواق الجغرافية النشطة"
    ],
    "Biocida UE (TP2/TP4)": [
      "Biocida UE (TP2/TP4)",
      "EU biocide (TP2/TP4)",
      "Biocide UE (TP2/TP4)",
      "EU-Biozid (TP2/TP4)",
      "مبيد حيوي أوروبي (TP2/TP4)"
    ],
    "HACCP · Contacte alimentari": [
      "HACCP · Contacto alimentario",
      "HACCP · Food contact",
      "HACCP · Contact alimentaire",
      "HACCP · Lebensmittelkontakt",
      "HACCP · التلامس مع الأغذية"
    ],
    "ISO 14001 · QR traçabilitat": [
      "ISO 14001 · Trazabilidad QR",
      "ISO 14001 · QR traceability",
      "ISO 14001 · Traçabilité QR",
      "ISO 14001 · QR-Rückverfolgung",
      "ISO 14001 · تتبّع بالرمز QR"
    ],
    "Biocida UE · Col·lab. OfiNova": [
      "Biocida UE · Colab. OfiNova",
      "EU biocide · OfiNova collab.",
      "Biocide UE · Collab. OfiNova",
      "EU-Biozid · Kooperation OfiNova",
      "مبيد حيوي أوروبي · تعاون مع OfiNova"
    ],
    "Magatzem automatitzat amb gestió d'estocs en temps real via ERP corporatiu": [
      "Almacén automatizado con gestión de existencias en tiempo real mediante el ERP corporativo",
      "Automated warehouse with real-time stock management through the company ERP",
      "Entrepôt automatisé avec gestion des stocks en temps réel via l'ERP de l'entreprise",
      "Automatisiertes Lager mit Bestandsführung in Echtzeit über das ERP",
      "مستودع مؤتمت بإدارة مخزون فورية عبر نظام ERP للشركة"
    ],
    "100% Elèctric": [
      "100 % eléctrico",
      "100% electric",
      "100 % électrique",
      "100 % elektrisch",
      "كهربائي بالكامل"
    ],
    "Flota de vehicles 0 emissions CO₂. Reducció de la petjada de carboni de la distribució": [
      "Flota de vehículos con 0 emisiones de CO₂. Reducción de la huella de carbono de la distribución",
      "Zero-emission vehicle fleet. Lower carbon footprint in distribution",
      "Flotte de véhicules zéro émission de CO₂. Empreinte carbone de la distribution réduite",
      "Fahrzeugflotte ohne CO₂-Emissionen. Geringerer CO₂-Fußabdruck im Vertrieb",
      "أسطول مركبات بلا انبعاثات كربونية. بصمة كربونية أقل في التوزيع"
    ],
    "Coordinació": [
      "Coordinación",
      "Coordination",
      "Coordination",
      "Koordination",
      "التنسيق"
    ],
    "Reunions periòdiques Logística-Comercial per alinear terminis i evitar incidències amb clients": [
      "Reuniones periódicas entre Logística y Comercial para alinear plazos y evitar incidencias con clientes",
      "Regular Logistics–Sales meetings to align timelines and avoid issues with customers",
      "Réunions régulières Logistique–Commercial pour aligner les délais et éviter les incidents clients",
      "Regelmäßige Treffen von Logistik und Vertrieb, um Termine abzustimmen und Probleme mit Kunden zu vermeiden",
      "اجتماعات دورية بين اللوجستيات والمبيعات لتنسيق المواعيد وتجنّب المشكلات مع العملاء"
    ],
    "✅ Estocs de seguretat + proveïdors alternatius = continuïtat de servei garantida": [
      "✅ Existencias de seguridad + proveedores alternativos = continuidad del servicio garantizada",
      "✅ Safety stock + alternative suppliers = guaranteed service continuity",
      "✅ Stocks de sécurité + fournisseurs alternatifs = continuité de service garantie",
      "✅ Sicherheitsbestand + alternative Lieferanten = garantierte Lieferfähigkeit",
      "✅ مخزون أمان + موردون بدلاء = استمرارية خدمة مضمونة"
    ],
    "Espanya": [
      "España",
      "Spain",
      "Espagne",
      "Spanien",
      "إسبانيا"
    ],
    "Actual": [
      "Actual",
      "Current",
      "Actuel",
      "Aktuell",
      "حاليًا"
    ],
    "Portugal": [
      "Portugal",
      "Portugal",
      "Portugal",
      "Portugal",
      "البرتغال"
    ],
    "França": [
      "Francia",
      "France",
      "France",
      "Frankreich",
      "فرنسا"
    ],
    "Alemanya": [
      "Alemania",
      "Germany",
      "Allemagne",
      "Deutschland",
      "ألمانيا"
    ],
    "📋 Portugal: risc moderat, similitud cultural, UE sense barreres regulatòries. Estratègia de risc controlat: distribuïdors primer, filial quan el mercat estigui consolidat.": [
      "📋 Portugal: riesgo moderado, similitud cultural, UE sin barreras regulatorias. Estrategia de riesgo controlado: primero distribuidores, filial cuando el mercado esté consolidado.",
      "📋 Portugal: moderate risk, cultural similarity, EU with no regulatory barriers. Controlled-risk strategy: distributors first, a subsidiary once the market is established.",
      "📋 Portugal : risque modéré, proximité culturelle, UE sans barrières réglementaires. Stratégie à risque maîtrisé : d'abord des distributeurs, puis une filiale une fois le marché consolidé.",
      "📋 Portugal: mäßiges Risiko, kulturelle Nähe, EU ohne regulatorische Hürden. Strategie mit kontrolliertem Risiko: zuerst Händler, eine Tochtergesellschaft, sobald der Markt gefestigt ist.",
      "📋 البرتغال: مخاطر معتدلة، تقارب ثقافي، سوق أوروبية بلا عوائق تنظيمية. استراتيجية مخاطر مضبوطة: الموزّعون أولًا، ثم فرع عند ترسّخ السوق."
    ],
    "Facturació objectiu any 1": [
      "Facturación objetivo año 1",
      "Target revenue, year 1",
      "Chiffre d'affaires visé, année 1",
      "Umsatzziel Jahr 1",
      "الإيرادات المستهدفة للسنة الأولى"
    ],
    "Clients actius objectiu any 1": [
      "Clientes activos objetivo año 1",
      "Target active customers, year 1",
      "Clients actifs visés, année 1",
      "Ziel aktive Kunden Jahr 1",
      "العملاء النشطون المستهدفون للسنة الأولى"
    ],
    "Distribuïdors (Lisboa i Porto)": [
      "Distribuidores (Lisboa y Oporto)",
      "Distributors (Lisbon and Porto)",
      "Distributeurs (Lisbonne et Porto)",
      "Händler (Lissabon und Porto)",
      "موزّعون (لشبونة وبورتو)"
    ],
    "Mesos fins a punt d'equilibri": [
      "Meses hasta el punto de equilibrio",
      "Months to break even",
      "Mois jusqu'au seuil de rentabilité",
      "Monate bis zur Gewinnschwelle",
      "الأشهر حتى نقطة التعادل"
    ],
    "💶 Pressupost estimat (any 1)": [
      "💶 Presupuesto estimado (año 1)",
      "💶 Estimated budget (year 1)",
      "💶 Budget estimé (année 1)",
      "💶 Geschätztes Budget (Jahr 1)",
      "💶 الميزانية التقديرية (السنة الأولى)"
    ],
    "Adaptació d'etiquetatge i documentació (PT)": [
      "Adaptación de etiquetado y documentación (PT)",
      "Labelling and documentation adaptation (PT)",
      "Adaptation de l'étiquetage et de la documentation (PT)",
      "Anpassung von Etiketten und Unterlagen (PT)",
      "تكييف الملصقات والوثائق (PT)"
    ],
    "Prospecció i acords amb distribuïdors": [
      "Prospección y acuerdos con distribuidores",
      "Prospecting and distributor agreements",
      "Prospection et accords avec les distributeurs",
      "Akquise und Händlerverträge",
      "استكشاف السوق واتفاقيات الموزّعين"
    ],
    "Logística i primer estoc a Portugal": [
      "Logística y primer stock en Portugal",
      "Logistics and initial stock in Portugal",
      "Logistique et premier stock au Portugal",
      "Logistik und Erstbestand in Portugal",
      "اللوجستيات والمخزون الأول في البرتغال"
    ],
    "Màrqueting i fires sectorials (Lisboa/Porto)": [
      "Marketing y ferias sectoriales (Lisboa/Oporto)",
      "Marketing and trade fairs (Lisbon/Porto)",
      "Marketing et salons professionnels (Lisbonne/Porto)",
      "Marketing und Fachmessen (Lissabon/Porto)",
      "التسويق والمعارض القطاعية (لشبونة/بورتو)"
    ],
    "Assessoria legal i fiscal transfronterera": [
      "Asesoría legal y fiscal transfronteriza",
      "Cross-border legal and tax advice",
      "Conseil juridique et fiscal transfrontalier",
      "Grenzüberschreitende Rechts- und Steuerberatung",
      "استشارات قانونية وضريبية عابرة للحدود"
    ],
    "Total estimat": [
      "Total estimado",
      "Estimated total",
      "Total estimé",
      "Geschätzte Summe",
      "الإجمالي التقديري"
    ],
    "⚠️ Risc: dependència del distribuïdor": [
      "⚠️ Riesgo: dependencia del distribuidor",
      "⚠️ Risk: reliance on the distributor",
      "⚠️ Risque : dépendance au distributeur",
      "⚠️ Risiko: Abhängigkeit vom Händler",
      "⚠️ الخطر: الاعتماد على الموزّع"
    ],
    "Mitigació: acord de distribució no exclusiu els primers 12 mesos i objectius de venda revisables trimestralment.": [
      "Mitigación: acuerdo de distribución no exclusivo los primeros 12 meses y objetivos de venta revisables cada trimestre.",
      "Mitigation: a non-exclusive distribution agreement for the first 12 months and sales targets reviewed every quarter.",
      "Atténuation : accord de distribution non exclusif les 12 premiers mois et objectifs de vente révisés chaque trimestre.",
      "Gegenmaßnahme: nicht exklusiver Vertriebsvertrag in den ersten 12 Monaten und vierteljährlich überprüfte Verkaufsziele.",
      "التخفيف: اتفاقية توزيع غير حصرية في الأشهر الاثني عشر الأولى وأهداف مبيعات تُراجع كل ثلاثة أشهر."
    ],
    "⚠️ Risc: diferències normatives locals": [
      "⚠️ Riesgo: diferencias normativas locales",
      "⚠️ Risk: local regulatory differences",
      "⚠️ Risque : différences réglementaires locales",
      "⚠️ Risiko: lokale regulatorische Unterschiede",
      "⚠️ الخطر: اختلافات تنظيمية محلية"
    ],
    "Mitigació: assessoria especialitzada en registre de biocides a Portugal abans del llançament comercial.": [
      "Mitigación: asesoría especializada en registro de biocidas en Portugal antes del lanzamiento comercial.",
      "Mitigation: specialist advice on biocide registration in Portugal before the commercial launch.",
      "Atténuation : conseil spécialisé en enregistrement des biocides au Portugal avant le lancement commercial.",
      "Gegenmaßnahme: Fachberatung zur Biozid-Registrierung in Portugal vor dem Markteintritt.",
      "التخفيف: استشارة متخصصة في تسجيل المبيدات الحيوية في البرتغال قبل الإطلاق التجاري."
    ],
    "⚠️ Risc: costos logístics transfronterers": [
      "⚠️ Riesgo: costes logísticos transfronterizos",
      "⚠️ Risk: cross-border logistics costs",
      "⚠️ Risque : coûts logistiques transfrontaliers",
      "⚠️ Risiko: grenzüberschreitende Logistikkosten",
      "⚠️ الخطر: تكاليف لوجستية عابرة للحدود"
    ],
    "Mitigació: consolidació de comandes i ús de la mateixa flota que ja cobreix Extremadura per reduir el cost per enviament.": [
      "Mitigación: consolidación de pedidos y uso de la misma flota que ya cubre Extremadura para reducir el coste por envío.",
      "Mitigation: consolidating orders and using the same fleet that already covers Extremadura to cut the cost per shipment.",
      "Atténuation : regroupement des commandes et utilisation de la flotte qui dessert déjà l'Estrémadure pour réduire le coût par envoi.",
      "Gegenmaßnahme: Bündelung von Bestellungen und Nutzung der Flotte, die bereits die Extremadura abdeckt, um die Kosten pro Sendung zu senken.",
      "التخفيف: تجميع الطلبات واستخدام الأسطول نفسه الذي يغطي إكستريمادورا لخفض تكلفة كل شحنة."
    ],
    "Lab R+D 2018": [
      "Lab. I+D 2018",
      "R&D lab 2018",
      "Labo R&D 2018",
      "F&E-Labor 2018",
      "مختبر بحث وتطوير 2018"
    ],
    "Corporatiu": [
      "Corporativo",
      "Corporate",
      "Corporate",
      "Unternehmen",
      "مؤسسي"
    ],
    "Ecològic": [
      "Ecológico",
      "Eco",
      "Écologique",
      "Ökologisch",
      "بيئي"
    ],
    "Múltiples": [
      "Múltiples",
      "Multiple",
      "Multiples",
      "Mehrere",
      "متعددة"
    ],
    "Variable": [
      "Variable",
      "Varies",
      "Variable",
      "Variabel",
      "متغيّرة"
    ],
    "×3 concentrat": [
      "×3 concentrado",
      "×3 concentrated",
      "×3 concentré",
      "3-fach konzentriert",
      "مركّز ×3"
    ],
    "Directe": [
      "Directo",
      "Direct",
      "Direct",
      "Direkt",
      "مباشر"
    ],
    "19 patentes": [
      "19 patentes",
      "19 patents",
      "19 brevets",
      "19 Patente",
      "19 براءة اختراع"
    ],
    "Milers": [
      "Miles",
      "Thousands",
      "Des milliers",
      "Tausende",
      "الآلاف"
    ],
    "📋 Normativa · Destacat": [
      "📋 Normativa · Destacado",
      "📋 Regulations · Featured",
      "📋 Réglementation · À la une",
      "📋 Vorschriften · Im Fokus",
      "📋 اللوائح · مميّز"
    ],
    "🧪 Laboratori": [
      "🧪 Laboratorio",
      "🧪 Laboratory",
      "🧪 Laboratoire",
      "🧪 Labor",
      "🧪 المختبر"
    ],
    "♻️ Sostenibilitat": [
      "♻️ Sostenibilidad",
      "♻️ Sustainability",
      "♻️ Durabilité",
      "♻️ Nachhaltigkeit",
      "♻️ الاستدامة"
    ],
    "💡 Innovació": [
      "💡 Innovación",
      "💡 Innovation",
      "💡 Innovation",
      "💡 Innovation",
      "💡 الابتكار"
    ],
    "📋 Normativa": [
      "📋 Normativa",
      "📋 Regulations",
      "📋 Réglementation",
      "📋 Vorschriften",
      "📋 اللوائح"
    ],
    "🧪 Formació": [
      "🧪 Formación",
      "🧪 Training",
      "🧪 Formation",
      "🧪 Schulung",
      "🧪 التدريب"
    ],
    "Genera el teu pressupost a l'instant": [
      "Genera tu presupuesto al instante",
      "Get your quote instantly",
      "Obtenez votre devis instantanément",
      "Erstellen Sie Ihr Angebot sofort",
      "احصل على عرض سعرك فورًا"
    ],
    "Tria els productes i les quantitats que necessites. El pressupost es calcula en temps real, amb els descomptes per volum i l'IVA ja aplicats, llest per descarregar en PDF o rebre per email.": [
      "Elige los productos y las cantidades que necesitas. El presupuesto se calcula en tiempo real, con los descuentos por volumen y el IVA ya aplicados, y lo recibes por email.",
      "Choose the products and quantities you need. The quote is calculated in real time, with volume discounts and VAT already applied, and sent to you by email.",
      "Choisissez les produits et les quantités dont vous avez besoin. Le devis est calculé en temps réel, remises sur volume et TVA comprises, et vous est envoyé par e-mail.",
      "Wählen Sie Produkte und Mengen. Das Angebot wird in Echtzeit berechnet, mit Mengenrabatten und MwSt., und Ihnen per E-Mail geschickt.",
      "اختر المنتجات والكميات التي تحتاجها. يُحسب عرض السعر فورًا مع تطبيق خصومات الكميات والضريبة، ويصلك عبر البريد الإلكتروني."
    ],
    "📋 Resum del pressupost": [
      "📋 Resumen del presupuesto",
      "📋 Quote summary",
      "📋 Récapitulatif du devis",
      "📋 Angebotsübersicht",
      "📋 ملخص عرض السعر"
    ],
    "Encara no has afegit cap producte. Tria quantitats a l'esquerra per veure el càlcul.": [
      "Aún no has añadido ningún producto. Elige cantidades a la izquierda para ver el cálculo.",
      "You haven't added any products yet. Choose quantities on the left to see the calculation.",
      "Vous n'avez encore ajouté aucun produit. Choisissez des quantités à gauche pour voir le calcul.",
      "Sie haben noch keine Produkte hinzugefügt. Wählen Sie links Mengen, um die Berechnung zu sehen.",
      "لم تُضف أي منتج بعد. اختر الكميات من القائمة لرؤية الحساب."
    ],
    "Empresa": [
      "Empresa",
      "Company",
      "Entreprise",
      "Unternehmen",
      "الشركة"
    ],
    "CIF/NIF": [
      "CIF/NIF",
      "Tax ID",
      "N° fiscal",
      "Steuernummer",
      "الرقم الضريبي"
    ],
    "Persona de contacte": [
      "Persona de contacto",
      "Contact person",
      "Personne de contact",
      "Ansprechpartner",
      "الشخص المسؤول"
    ],
    "Email": [
      "Email",
      "Email",
      "E-mail",
      "E-Mail",
      "البريد الإلكتروني"
    ],
    "✉️ Enviar-me'l per email": [
      "✉️ Enviármelo por email",
      "✉️ Email it to me",
      "✉️ Me l'envoyer par e-mail",
      "✉️ Per E-Mail senden",
      "✉️ أرسله إلى بريدي"
    ],
    "Pressupost sense compromís, vàlid durant 30 dies.": [
      "Presupuesto sin compromiso, válido durante 30 días.",
      "Non-binding quote, valid for 30 days.",
      "Devis sans engagement, valable 30 jours.",
      "Unverbindliches Angebot, 30 Tage gültig.",
      "عرض سعر غير ملزم، صالح لمدة 30 يومًا."
    ],
    "Sol·licita una auditoria d'higiene gratuïta": [
      "Solicita una auditoría de higiene gratuita",
      "Request a free hygiene audit",
      "Demandez un audit d'hygiène gratuit",
      "Fordern Sie ein kostenloses Hygiene-Audit an",
      "اطلب تدقيق نظافة مجانيًا"
    ],
    "Un tècnic visita les teves instal·lacions, avalua les necessitats reals i et proposa un pla d'higiene a mida — sense cap compromís.": [
      "Un técnico visita tus instalaciones, evalúa las necesidades reales y te propone un plan de higiene a medida, sin ningún compromiso.",
      "A technician visits your premises, assesses your real needs and proposes a tailored hygiene plan, with no obligation.",
      "Un technicien visite vos locaux, évalue vos besoins réels et vous propose un plan d'hygiène sur mesure, sans engagement.",
      "Ein Techniker besucht Ihren Betrieb, ermittelt den tatsächlichen Bedarf und schlägt einen maßgeschneiderten Hygieneplan vor – unverbindlich.",
      "يزور فنّي منشأتك ويقيّم احتياجاتك الفعلية ويقترح خطة نظافة مخصصة دون أي التزام."
    ],
    "Què inclou": [
      "Qué incluye",
      "What's included",
      "Ce qui est inclus",
      "Was enthalten ist",
      "ماذا يشمل"
    ],
    "Visita presencial, informe amb recomanacions i pressupost orientatiu, en menys de 5 dies laborables.": [
      "Visita presencial, informe con recomendaciones y presupuesto orientativo, en menos de 5 días laborables.",
      "An on-site visit, a report with recommendations and an estimated quote, within 5 working days.",
      "Visite sur place, rapport avec recommandations et devis indicatif, en moins de 5 jours ouvrés.",
      "Besuch vor Ort, Bericht mit Empfehlungen und Richtangebot innerhalb von 5 Werktagen.",
      "زيارة ميدانية وتقرير بالتوصيات وعرض سعر تقديري خلال أقل من 5 أيام عمل."
    ],
    "Sense compromís": [
      "Sin compromiso",
      "No obligation",
      "Sans engagement",
      "Unverbindlich",
      "دون التزام"
    ],
    "L'auditoria és gratuïta i no suposa cap obligació de contractació.": [
      "La auditoría es gratuita y no supone ninguna obligación de contratación.",
      "The audit is free and you are under no obligation to buy.",
      "L'audit est gratuit et ne vous engage à rien.",
      "Das Audit ist kostenlos und verpflichtet Sie zu nichts.",
      "التدقيق مجاني ولا يُلزمك بأي تعاقد."
    ],
    "Nom i Cognoms *": [
      "Nombre y apellidos *",
      "Full name *",
      "Nom et prénom *",
      "Vor- und Nachname *",
      "الاسم الكامل *"
    ],
    "Empresa *": [
      "Empresa *",
      "Company *",
      "Entreprise *",
      "Unternehmen *",
      "الشركة *"
    ],
    "Telèfon *": [
      "Teléfono *",
      "Phone *",
      "Téléphone *",
      "Telefon *",
      "الهاتف *"
    ],
    "Sector *": [
      "Sector *",
      "Sector *",
      "Secteur *",
      "Branche *",
      "القطاع *"
    ],
    "Franja horària preferida": [
      "Franja horaria preferida",
      "Preferred time slot",
      "Créneau horaire préféré",
      "Bevorzugte Uhrzeit",
      "الفترة الزمنية المفضلة"
    ],
    "Mida de les instal·lacions (m², habitacions o llits)": [
      "Tamaño de las instalaciones (m², habitaciones o camas)",
      "Size of the premises (m², rooms or beds)",
      "Taille des installations (m², chambres ou lits)",
      "Größe der Einrichtung (m², Zimmer oder Betten)",
      "حجم المنشأة (م² أو الغرف أو الأسرّة)"
    ],
    "Sol·licitar auditoria gratuïta →": [
      "Solicitar auditoría gratuita →",
      "Request a free audit →",
      "Demander un audit gratuit →",
      "Kostenloses Audit anfordern →",
      "اطلب تدقيقًا مجانيًا ←"
    ],
    "Telèfon": [
      "Teléfono",
      "Phone",
      "Téléphone",
      "Telefon",
      "الهاتف"
    ],
    "Contactar →": [
      "Contactar →",
      "Contact us →",
      "Nous contacter →",
      "Kontakt →",
      "تواصل معنا ←"
    ],
    "🌿 ECO": [
      "🌿 ECO",
      "🌿 ECO",
      "🌿 ECO",
      "🌿 ECO",
      "🌿 ECO"
    ]
  };
  var IDX = { es: 0, en: 1, fr: 2, de: 3, ar: 4 };
  var original = new WeakMap();
  var SALTA = 'script,style,textarea,#hxChatWindow,#adminPanel,[data-i18n-key],[data-hxm],[data-hxp]';
  function lang() {
    try { return localStorage.getItem('hx_lang') || 'ca'; } catch (e) { return 'ca'; }
  }
  function aplicar() {
    var l = lang(), i = IDX[l];
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      var el = n.parentElement;
      if (!el || el.closest(SALTA)) continue;
      var orig = original.has(n) ? original.get(n) : n.nodeValue;
      var clau = orig.replace(/\s+/g, ' ').trim();
      // «FDS · Producte»: només es tradueix l'abreviatura de la fitxa de seguretat.
      if (!T[clau] && /^FDS · /.test(clau)) T[clau] = ['FDS', 'SDS', 'FDS', 'SDB', 'ورقة السلامة'].map(function (a) { return a + ' · ' + clau.slice(6); });
      if (!T[clau]) continue;
      if (!original.has(n)) original.set(n, orig);
      var m = /^(\s*)[\s\S]*?(\s*)$/.exec(orig);
      n.nodeValue = i == null ? orig : m[1] + T[clau][i] + m[2];
    }
  }
  // Alguns blocs es tornen a pintar amb JavaScript (resum del pressupost, etc.):
  // quan apareix contingut nou es tradueix també, si l'idioma no és el català.
  var pendent = null;
  function observar() {
    if (!window.MutationObserver) return;
    new MutationObserver(function () {
      if (lang() === 'ca' || pendent) return;
      pendent = setTimeout(function () { pendent = null; aplicar(); }, 150);
    }).observe(document.body, { childList: true, subtree: true });
  }
  function iniciar() {
    aplicar();
    observar();
    var orig = window.hxApplyLang;
    if (typeof orig === 'function' && !orig._hxFixos) {
      var nou = function () { var r = orig.apply(this, arguments); aplicar(); return r; };
      nou._hxFixos = true;
      window.hxApplyLang = nou;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  window.HXTextosFixos = { aplicar: aplicar };
})();
