/* ============================================================
   HIGIENEX — Sistema d'idiomes (i18n.js)
   ============================================================
   Aquest fitxer conté TOTES les traduccions de la web pública
   (index.html) als 5 idiomes disponibles: català (ca), castellà
   (es), anglès (en), francès (fr) i alemany (de).

   Com funciona: cada text traduïble de index.html porta un atribut
   data-i18n-key="tXXX" (per exemple data-i18n-key="t001"). Aquest
   fitxer tradueix aquesta clau a un objecte amb les 5 traduccions
   (HX_I18N.t001 = { ca:..., es:..., en:..., fr:..., de:... }).

   Per afegir o corregir una traducció: busca la clau corresponent
   aquí sota i edita el text de l'idioma que vulguis. No cal tocar
   index.html per canviar cap traducció.

   El català és l'idioma per defecte i també la reserva (fallback)
   si mai falta la traducció d'un text en algun altre idioma.
   ============================================================ */

var HX_I18N = {
  t001: { ca: 'Accedir', es: 'Acceder', en: 'Log In', fr: 'Connexion', de: 'Anmelden' },
  t002: { ca: 'Registrar-me', es: 'Registrarme', en: 'Sign Up', fr: 'S\'inscrire', de: 'Registrieren' },
  t003: { ca: 'Higiene impecable, futur sostenible', es: 'Higiene impecable, futuro sostenible', en: 'Impeccable hygiene, sustainable future', fr: 'Hygiène impeccable, avenir durable', de: 'Makellose Hygiene, nachhaltige Zukunft' },
  t004: { ca: 'Des de 2015 fabricant i distribuint productes de neteja i higiene professional per a hospitals, hotels i indústria.', es: 'Desde 2015 fabricando y distribuyendo productos de limpieza e higiene profesional para hospitales, hoteles e industria.', en: 'Manufacturing and distributing professional cleaning and hygiene products for hospitals, hotels and industry since 2015.', fr: 'Fabricant et distribuant des produits professionnels d\'hygiène et de nettoyage pour hôpitaux, hôtels et industries depuis 2015.', de: 'Seit 2015 Herstellung und Vertrieb professioneller Reinigungs- und Hygieneprodukte für Krankenhäuser, Hotels und Industrie.' },
  t005: { ca: 'Descobreix HIGIENEX →', es: 'Descubre HIGIENEX →', en: 'Discover HIGIENEX →', fr: 'Découvrir HIGIENEX →', de: 'HIGIENEX entdecken →' },
  t006: { ca: 'Contactar Ara', es: 'Contactar Ahora', en: 'Contact Us Now', fr: 'Contactez-nous', de: 'Jetzt kontaktieren' },
  t007: { ca: 'Treballadors', es: 'Trabajadores', en: 'Employees', fr: 'Employés', de: 'Mitarbeiter' },
  t008: { ca: 'Patentes', es: 'Patentes', en: 'Patents', fr: 'Brevets', de: 'Patente' },
  t009: { ca: 'Fundació', es: 'Fundación', en: 'Founded', fr: 'Fondation', de: 'Gründung' },
  t010: { ca: 'Empresa', es: 'Empresa', en: 'Company', fr: 'Entreprise', de: 'Unternehmen' },
  t011: { ca: 'Història, missió i equip humà', es: 'Historia, misión y equipo humano', en: 'History, mission and team', fr: 'Histoire, mission et équipe', de: 'Geschichte, Mission und Team' },
  t012: { ca: 'La Nostra Història', es: 'Nuestra Historia', en: 'Our History', fr: 'Notre Histoire', de: 'Unsere Geschichte' },
  t013: { ca: 'Missió, Visió i Valors', es: 'Misión, Visión y Valores', en: 'Mission, Vision & Values', fr: 'Mission, Vision et Valeurs', de: 'Mission, Vision & Werte' },
  t014: { ca: 'Missió', es: 'Misión', en: 'Mission', fr: 'Mission', de: 'Mission' },
  t015: { ca: 'Visió', es: 'Visión', en: 'Vision', fr: 'Vision', de: 'Vision' },
  t016: { ca: 'Valors', es: 'Valores', en: 'Values', fr: 'Valeurs', de: 'Werte' },
  t017: { ca: 'Estructura Organitzativa', es: 'Estructura Organizativa', en: 'Organizational Structure', fr: 'Structure Organisationnelle', de: 'Organisationsstruktur' },
  t018: { ca: '🔬 R+D Independent', es: '🔬 I+D Independiente', en: '🔬 Independent R&D', fr: '🔬 R&D Indépendante', de: '🔬 Unabhängige F&E' },
  t019: { ca: '🤝 Coordinació Log-Comercial', es: '🤝 Coordinación Log-Comercial', en: '🤝 Logistics-Sales Coordination', fr: '🤝 Coordination Log-Commerciale', de: '🤝 Logistik-Vertrieb-Koordination' },
  t020: { ca: '✅ Qualitat Autònoma', es: '✅ Calidad Autónoma', en: '✅ Independent Quality', fr: '✅ Qualité Autonome', de: '✅ Eigenständige Qualität' },
  t021: { ca: 'El Nostre Equip', es: 'Nuestro Equipo', en: 'Our Team', fr: 'Notre Équipe', de: 'Unser Team' },
  t022: { ca: '🎯 Perfil Fundadors', es: '🎯 Perfil Fundadores', en: '🎯 Founders Profile', fr: '🎯 Profil des Fondateurs', de: '🎯 Gründerprofil' },
  t023: { ca: '💼 Polítiques de RRHH', es: '💼 Políticas de RRHH', en: '💼 HR Policies', fr: '💼 Politiques RH', de: '💼 Personalrichtlinien' },
  t024: { ca: 'Casos d\'Èxit Reals', es: 'Casos de Éxito Reales', en: 'Real Success Stories', fr: 'Cas de Réussite Réels', de: 'Echte Erfolgsgeschichten' },
  t025: { ca: 'Reducció cost higiene · Xarxa hospitals', es: 'Reducción coste higiene · Red hospitales', en: 'Hygiene Cost Reduction · Hospital Network', fr: 'Réduction coût hygiène · Réseau hospitalier', de: 'Hygienekostensenkung · Krankenhausnetzwerk' },
  t026: { ca: 'Reducció envasos · Cadena hotelera', es: 'Reducción envases · Cadena hotelera', en: 'Packaging Reduction · Hotel Chain', fr: 'Réduction des emballages · Chaîne hôtelière', de: 'Verpackungsreduzierung · Hotelkette' },
  t027: { ca: 'Capacitat productiva triplicada', es: 'Capacidad productiva triplicada', en: 'Production Capacity Tripled', fr: 'Capacité de production triplée', de: 'Produktionskapazität verdreifacht' },
  t028: { ca: 'El que diuen els nostres clients', es: 'Lo que dicen nuestros clientes', en: 'What Our Clients Say', fr: 'Ce que disent nos clients', de: 'Was unsere Kunden sagen' },
  t029: { ca: 'Productes i Innovació', es: 'Productos e Innovación', en: 'Products & Innovation', fr: 'Produits et Innovation', de: 'Produkte & Innovation' },
  t030: { ca: 'Catàleg, R+D i transformació digital', es: 'Catálogo, I+D y transformación digital', en: 'Catalogue, R&D and digital transformation', fr: 'Catalogue, R&D et transformation numérique', de: 'Katalog, F&E und digitale Transformation' },
  t031: { ca: 'Catàleg de Productes Professionals', es: 'Catálogo de Productos Profesionales', en: 'Professional Product Catalogue', fr: 'Catalogue de Produits Professionnels', de: 'Katalog professioneller Produkte' },
  t032: { ca: '🛒 Compra Online — Afegeix al Cistell', es: '🛒 Compra Online — Añadir al Carrito', en: '🛒 Buy Online — Add to Cart', fr: '🛒 Achat en ligne — Ajouter au panier', de: '🛒 Online kaufen — In den Warenkorb' },
  t033: { ca: 'Laboratori de Recerca i Desenvolupament', es: 'Laboratorio de Investigación y Desarrollo', en: 'Research & Development Lab', fr: 'Laboratoire de Recherche et Développement', de: 'Forschungs- und Entwicklungslabor' },
  t034: { ca: 'Innovació com a Motor Competitiu', es: 'Innovación como Motor Competitivo', en: 'Innovation as a Competitive Engine', fr: 'L\'Innovation comme Moteur Compétitif', de: 'Innovation als Wettbewerbsmotor' },
  t035: { ca: '🤝 Projecte WorkSafe Smart Space', es: '🤝 Proyecto WorkSafe Smart Space', en: '🤝 WorkSafe Smart Space Project', fr: '🤝 Projet WorkSafe Smart Space', de: '🤝 Projekt WorkSafe Smart Space' },
  t036: { ca: '🔬 Laboratori R+D Independent', es: '🔬 Laboratorio I+D Independiente', en: '🔬 Independent R&D Lab', fr: '🔬 Laboratoire R&D Indépendant', de: '🔬 Unabhängiges F&E-Labor' },
  t037: { ca: 'Pla de Transformació Digital', es: 'Plan de Transformación Digital', en: 'Digital Transformation Plan', fr: 'Plan de Transformation Numérique', de: 'Plan zur digitalen Transformation' },
  t038: { ca: 'ERP Integrat — Fase 1 (0-6 mesos)', es: 'ERP Integrado — Fase 1 (0-6 meses)', en: 'Integrated ERP — Phase 1 (0-6 months)', fr: 'ERP Intégré — Phase 1 (0-6 mois)', de: 'Integriertes ERP — Phase 1 (0-6 Monate)' },
  t039: { ca: 'CRM Comercial — Fase 2 (6-12 mesos)', es: 'CRM Comercial — Fase 2 (6-12 meses)', en: 'Sales CRM — Phase 2 (6-12 months)', fr: 'CRM Commercial — Phase 2 (6-12 mois)', de: 'Vertriebs-CRM — Phase 2 (6-12 Monate)' },
  t040: { ca: 'Business Intelligence — Fase 3 (12-18 mesos)', es: 'Business Intelligence — Fase 3 (12-18 meses)', en: 'Business Intelligence — Phase 3 (12-18 months)', fr: 'Business Intelligence — Phase 3 (12-18 mois)', de: 'Business Intelligence — Phase 3 (12-18 Monate)' },
  t041: { ca: 'Analítica Predictiva — Fase 4 (18-24 mesos)', es: 'Analítica Predictiva — Fase 4 (18-24 meses)', en: 'Predictive Analytics — Phase 4 (18-24 months)', fr: 'Analytique Prédictive — Phase 4 (18-24 mois)', de: 'Prädiktive Analytik — Phase 4 (18-24 Monate)' },
  t042: { ca: 'Pla Estratègic de Futur', es: 'Plan Estratégico de Futuro', en: 'Strategic Future Plan', fr: 'Plan Stratégique d\'Avenir', de: 'Strategischer Zukunftsplan' },
  t043: { ca: 'Digitalització Completa', es: 'Digitalización Completa', en: 'Full Digitalization', fr: 'Digitalisation Complète', de: 'Vollständige Digitalisierung' },
  t044: { ca: 'Entrada a Portugal', es: 'Entrada en Portugal', en: 'Entry into Portugal', fr: 'Entrée au Portugal', de: 'Eintritt in Portugal' },
  t045: { ca: 'WorkSafe Expansion', es: 'WorkSafe Expansion', en: 'WorkSafe Expansion', fr: 'WorkSafe Expansion', de: 'WorkSafe Expansion' },
  t046: { ca: 'Mercat Europeu UE', es: 'Mercado Europeo UE', en: 'European EU Market', fr: 'Marché Européen UE', de: 'Europäischer EU-Markt' },
  t047: { ca: '📊 Indicadors clau de mesura del creixement', es: '📊 Indicadores clave de medición del crecimiento', en: '📊 Key Growth Metrics', fr: '📊 Indicateurs clés de croissance', de: '📊 Wichtige Wachstumsindikatoren' },
  t048: { ca: 'Sol·licita una mostra gratuïta', es: 'Solicita una muestra gratuita', en: 'Request a Free Sample', fr: 'Demandez un échantillon gratuit', de: 'Kostenlose Probe anfordern' },
  t049: { ca: 'Operacions', es: 'Operaciones', en: 'Operations', fr: 'Opérations', de: 'Betrieb' },
  t050: { ca: 'Producció, logística i internacionalització', es: 'Producción, logística e internacionalización', en: 'Production, logistics and internationalization', fr: 'Production, logistique et internationalisation', de: 'Produktion, Logistik und Internationalisierung' },
  t051: { ca: 'Processos de Producció', es: 'Procesos de Producción', en: 'Production Processes', fr: 'Processus de Production', de: 'Produktionsprozesse' },
  t052: { ca: 'Recerca R+D', es: 'Investigación I+D', en: 'R&D Research', fr: 'Recherche R&D', de: 'F&E-Forschung' },
  t053: { ca: 'Aprovació Qualitat', es: 'Aprobación Calidad', en: 'Quality Approval', fr: 'Approbation Qualité', de: 'Qualitätsfreigabe' },
  t054: { ca: 'Formulació', es: 'Formulación', en: 'Formulation', fr: 'Formulation', de: 'Formulierung' },
  t055: { ca: 'Control Final', es: 'Control Final', en: 'Final Check', fr: 'Contrôle Final', de: 'Endkontrolle' },
  t056: { ca: 'Envasat ECO', es: 'Envasado ECO', en: 'ECO Packaging', fr: 'Conditionnement ECO', de: 'ECO-Verpackung' },
  t057: { ca: 'Distribució', es: 'Distribución', en: 'Distribution', fr: 'Distribution', de: 'Vertrieb' },
  t058: { ca: '📋 Pla de Contingència en 3 Escenaris', es: '📋 Plan de Contingencia en 3 Escenarios', en: '📋 Contingency Plan in 3 Scenarios', fr: '📋 Plan de Contingence en 3 Scénarios', de: '📋 Notfallplan mit 3 Szenarien' },
  t059: { ca: 'Logística i Distribució', es: 'Logística y Distribución', en: 'Logistics & Distribution', fr: 'Logistique et Distribution', de: 'Logistik & Vertrieb' },
  t060: { ca: '🚚 Logística Verda', es: '🚚 Logística Verde', en: '🚚 Green Logistics', fr: '🚚 Logistique Verte', de: '🚚 Grüne Logistik' },
  t061: { ca: 'Pla d\'Internacionalització', es: 'Plan de Internacionalización', en: 'Internationalization Plan', fr: 'Plan d\'Internationalisation', de: 'Internationalisierungsplan' },
  t062: { ca: 'Compromís i Mercat', es: 'Compromiso y Mercado', en: 'Commitment & Market', fr: 'Engagement et Marché', de: 'Engagement & Markt' },
  t063: { ca: 'Sostenibilitat, RSC, clients i màrqueting', es: 'Sostenibilidad, RSC, clientes y marketing', en: 'Sustainability, CSR, clients and marketing', fr: 'Durabilité, RSE, clients et marketing', de: 'Nachhaltigkeit, CSR, Kunden und Marketing' },
  t064: { ca: 'Compromís Ambiental Real', es: 'Compromiso Ambiental Real', en: 'Real Environmental Commitment', fr: 'Engagement Environnemental Réel', de: 'Echtes Umweltengagement' },
  t065: { ca: 'ISO 14001 Certificat', es: 'ISO 14001 Certificado', en: 'ISO 14001 Certified', fr: 'ISO 14001 Certifié', de: 'ISO 14001 zertifiziert' },
  t066: { ca: 'Economia Circular', es: 'Economía Circular', en: 'Circular Economy', fr: 'Économie Circulaire', de: 'Kreislaufwirtschaft' },
  t067: { ca: 'Formulació Biodegradable', es: 'Formulación Biodegradable', en: 'Biodegradable Formulation', fr: 'Formulation Biodégradable', de: 'Biologisch abbaubare Formulierung' },
  t068: { ca: 'Logística Verda', es: 'Logística Verde', en: 'Green Logistics', fr: 'Logistique Verte', de: 'Grüne Logistik' },
  t069: { ca: 'Memòria de Sostenibilitat', es: 'Memoria de Sostenibilidad', en: 'Sustainability Report', fr: 'Rapport de Durabilité', de: 'Nachhaltigkeitsbericht' },
  t070: { ca: 'Proveïdors Responsables', es: 'Proveedores Responsables', en: 'Responsible Suppliers', fr: 'Fournisseurs Responsables', de: 'Verantwortungsvolle Lieferanten' },
  t071: { ca: 'Responsabilitat Social Corporativa', es: 'Responsabilidad Social Corporativa', en: 'Corporate Social Responsibility', fr: 'Responsabilité Sociale des Entreprises', de: 'Soziale Unternehmensverantwortung' },
  t072: { ca: '🌿 Productes ECO Certificats', es: '🌿 Productos ECO Certificados', en: '🌿 Certified ECO Products', fr: '🌿 Produits ECO Certifiés', de: '🌿 Zertifizierte ECO-Produkte' },
  t073: { ca: '♻️ Economia Circular Activa', es: '♻️ Economía Circular Activa', en: '♻️ Active Circular Economy', fr: '♻️ Économie Circulaire Active', de: '♻️ Aktive Kreislaufwirtschaft' },
  t074: { ca: '👥 Compromís amb l\'Equip', es: '👥 Compromiso con el Equipo', en: '👥 Commitment to Our Team', fr: '👥 Engagement envers l\'Équipe', de: '👥 Engagement für das Team' },
  t075: { ca: '📋 Compliment Normatiu Proactiu', es: '📋 Cumplimiento Normativo Proactivo', en: '📋 Proactive Regulatory Compliance', fr: '📋 Conformité Réglementaire Proactive', de: '📋 Proaktive Regelkonformität' },
  t076: { ca: '🏪 Ajudes i Subvencions', es: '🏪 Ayudas y Subvenciones', en: '🏪 Grants & Subsidies', fr: '🏪 Aides et Subventions', de: '🏪 Zuschüsse & Förderungen' },
  t077: { ca: '🤝 Aliances Estratègiques', es: '🤝 Alianzas Estratégicas', en: '🤝 Strategic Alliances', fr: '🤝 Alliances Stratégiques', de: '🤝 Strategische Allianzen' },
  t078: { ca: 'Clients i Mercat', es: 'Clientes y Mercado', en: 'Clients & Market', fr: 'Clients et Marché', de: 'Kunden & Markt' },
  t079: { ca: 'Sector Sanitari', es: 'Sector Sanitario', en: 'Healthcare Sector', fr: 'Secteur Sanitaire', de: 'Gesundheitssektor' },
  t080: { ca: 'Hotels i Turisme', es: 'Hoteles y Turismo', en: 'Hotels & Tourism', fr: 'Hôtels et Tourisme', de: 'Hotels & Tourismus' },
  t081: { ca: 'Indústria Alimentària', es: 'Industria Alimentaria', en: 'Food Industry', fr: 'Industrie Alimentaire', de: 'Lebensmittelindustrie' },
  t082: { ca: 'Administracions Públiques', es: 'Administraciones Públicas', en: 'Public Administration', fr: 'Administrations Publiques', de: 'Öffentliche Verwaltung' },
  t083: { ca: 'Oficines i Empreses', es: 'Oficinas y Empresas', en: 'Offices & Businesses', fr: 'Bureaux et Entreprises', de: 'Büros & Unternehmen' },
  t084: { ca: 'Gimnasos i Esports', es: 'Gimnasios y Deportes', en: 'Gyms & Sports', fr: 'Salles de Sport', de: 'Fitnessstudios & Sport' },
  t085: { ca: '🌍 Expansió a Portugal 2026', es: '🌍 Expansión a Portugal 2026', en: '🌍 Expansion into Portugal 2026', fr: '🌍 Expansion au Portugal 2026', de: '🌍 Expansion nach Portugal 2026' },
  t086: { ca: 'Estratègia Comercial B2B', es: 'Estrategia Comercial B2B', en: 'B2B Sales Strategy', fr: 'Stratégie Commerciale B2B', de: 'B2B-Vertriebsstrategie' },
  t087: { ca: '🌐 Web Corporativa B2B', es: '🌐 Web Corporativa B2B', en: '🌐 B2B Corporate Website', fr: '🌐 Site Web Corporatif B2B', de: '🌐 B2B-Unternehmenswebsite' },
  t088: { ca: '💼 LinkedIn Professional', es: '💼 LinkedIn Profesional', en: '💼 Professional LinkedIn', fr: '💼 LinkedIn Professionnel', de: '💼 Professionelles LinkedIn' },
  t089: { ca: '🎯 Campanyes Sectorials', es: '🎯 Campañas Sectoriales', en: '🎯 Sector Campaigns', fr: '🎯 Campagnes Sectorielles', de: '🎯 Branchenkampagnen' },
  t090: { ca: '📧 Email Màrqueting', es: '📧 Email Marketing', en: '📧 Email Marketing', fr: '📧 E-mail Marketing', de: '📧 E-Mail-Marketing' },
  t091: { ca: '📝 Blog Tècnic Especialitzat', es: '📝 Blog Técnico Especializado', en: '📝 Specialized Technical Blog', fr: '📝 Blog Technique Spécialisé', de: '📝 Spezialisierter Fachblog' },
  t092: { ca: '🏆 Fires i Events del Sector', es: '🏆 Ferias y Eventos del Sector', en: '🏆 Trade Fairs & Industry Events', fr: '🏆 Salons et Événements du Secteur', de: '🏆 Messen & Branchenveranstaltungen' },
  t093: { ca: 'Anàlisi Competitiu i Mercat', es: 'Análisis Competitivo y de Mercado', en: 'Competitive & Market Analysis', fr: 'Analyse Concurrentielle et de Marché', de: 'Wettbewerbs- und Marktanalyse' },
  t094: { ca: '💪 Avantatge diferencial', es: '💪 Ventaja diferencial', en: '💪 Differential Advantage', fr: '💪 Avantage Différentiel', de: '💪 Differenzierungsvorteil' },
  t095: { ca: '⚠️ Risc principal', es: '⚠️ Riesgo principal', en: '⚠️ Main Risk', fr: '⚠️ Risque Principal', de: '⚠️ Hauptrisiko' },
  t096: { ca: 'Contingut Tècnic Professional', es: 'Contenido Técnico Profesional', en: 'Professional Technical Content', fr: 'Contenu Technique Professionnel', de: 'Professionelle technische Inhalte' },
  t097: { ca: 'Concentrats ECO: per què reduir envasos és el futur de la higiene professional', es: 'Concentrados ECO: por qué reducir envases es el futuro de la higiene profesional', en: 'ECO Concentrates: why reducing packaging is the future of professional hygiene', fr: 'Concentrés ECO : pourquoi réduire les emballages est l\'avenir de l\'hygiène professionnelle', de: 'ECO-Konzentrate: Warum weniger Verpackung die Zukunft der professionellen Hygiene ist' },
  t098: { ca: 'WorkSafe Smart Space: el futur dels espais de treball segurs i intel·ligents', es: 'WorkSafe Smart Space: el futuro de los espacios de trabajo seguros e inteligentes', en: 'WorkSafe Smart Space: the future of safe, smart workspaces', fr: 'WorkSafe Smart Space : l\'avenir des espaces de travail sûrs et intelligents', de: 'WorkSafe Smart Space: die Zukunft sicherer, intelligenter Arbeitsräume' },
  t099: { ca: 'Normativa europea de biocides 2025: tot el que has de saber com a professional', es: 'Normativa europea de biocidas 2025: todo lo que debes saber como profesional', en: '2025 European Biocides Regulation: everything professionals need to know', fr: 'Réglementation européenne des biocides 2025 : tout savoir en tant que professionnel', de: 'Europäische Biozidverordnung 2025: Alles, was Profis wissen müssen' },
  t100: { ca: 'Nom del producte', es: 'Nombre del producto', en: 'Product Name', fr: 'Nom du produit', de: 'Produktname' },
  t101: { ca: 'Altres productes', es: 'Otros productos', en: 'Other Products', fr: 'Autres produits', de: 'Andere Produkte' },
  t102: { ca: 'Actualitat del sector de la higiene professional', es: 'Actualidad del sector de la higiene profesional', en: 'Professional Hygiene Industry News', fr: 'Actualité du secteur de l\'hygiène professionnelle', de: 'Neuigkeiten aus der professionellen Hygienebranche' },
  t103: { ca: 'Del laboratori al sector', es: 'Del laboratorio al sector', en: 'From the Lab to the Industry', fr: 'Du laboratoire au secteur', de: 'Vom Labor in die Branche' },
  t104: { ca: 'Reglament de Biocides (BPR): què canvia per a fabricants de desinfectants el 2026', es: 'Reglamento de Biocidas (BPR): qué cambia para fabricantes de desinfectantes en 2026', en: 'Biocidal Products Regulation (BPR): what changes for disinfectant makers in 2026', fr: 'Règlement sur les Biocides (BPR) : ce qui change pour les fabricants de désinfectants en 2026', de: 'Biozidverordnung (BPR): Was sich 2026 für Desinfektionsmittelhersteller ändert' },
  t105: { ca: 'Nous tensioactius d\'origen vegetal: menys residu, mateixa eficàcia bactericida', es: 'Nuevos tensioactivos de origen vegetal: menos residuo, misma eficacia bactericida', en: 'New plant-based surfactants: less waste, same bactericidal efficacy', fr: 'Nouveaux tensioactifs d\'origine végétale : moins de résidus, même efficacité bactéricide', de: 'Neue pflanzliche Tenside: weniger Rückstände, gleiche bakterizide Wirkung' },
  t106: { ca: 'El sector de la neteja professional accelera cap a l\'envàs 100% reciclat', es: 'El sector de la limpieza profesional acelera hacia el envase 100% reciclado', en: 'Professional cleaning industry accelerates towards 100% recycled packaging', fr: 'Le secteur du nettoyage professionnel accélère vers l\'emballage 100% recyclé', de: 'Die professionelle Reinigungsbranche beschleunigt den Wandel zu 100% recycelter Verpackung' },
  t107: { ca: 'Dosificació intel·ligent: com els sensors IoT redueixen fins a un 30% el consum de producte', es: 'Dosificación inteligente: cómo los sensores IoT reducen hasta un 30% el consumo de producto', en: 'Smart dosing: how IoT sensors cut product consumption by up to 30%', fr: 'Dosage intelligent : comment les capteurs IoT réduisent la consommation de produit jusqu\'à 30%', de: 'Intelligente Dosierung: Wie IoT-Sensoren den Produktverbrauch um bis zu 30% senken' },
  t108: { ca: 'HACCP i desinfecció: les auditories del 2026 posen el focus en la traçabilitat del producte', es: 'HACCP y desinfección: las auditorías de 2026 ponen el foco en la trazabilidad del producto', en: 'HACCP and disinfection: 2026 audits focus on product traceability', fr: 'HACCP et désinfection : les audits 2026 se concentrent sur la traçabilité des produits', de: 'HACCP und Desinfektion: Audits 2026 fokussieren auf Produktrückverfolgbarkeit' },
  t109: { ca: 'Per què cada vegada més hospitals formen el seu personal de neteja en bioseguretat avançada', es: 'Por qué cada vez más hospitales forman a su personal de limpieza en bioseguridad avanzada', en: 'Why more hospitals are training cleaning staff in advanced biosafety', fr: 'Pourquoi de plus en plus d\'hôpitaux forment leur personnel de nettoyage à la biosécurité avancée', de: 'Warum immer mehr Krankenhäuser ihr Reinigungspersonal in fortgeschrittener Biosicherheit schulen' },
  t110: { ca: 'Logística intel·ligent: com l\'automatització redueix errors de subministrament un 25%', es: 'Logística inteligente: cómo la automatización reduce errores de suministro un 25%', en: 'Smart logistics: how automation cuts supply errors by 25%', fr: 'Logistique intelligente : comment l\'automatisation réduit les erreurs d\'approvisionnement de 25%', de: 'Intelligente Logistik: Wie Automatisierung Lieferfehler um 25% reduziert' },
  t111: { ca: 'Ajuda i Contacte', es: 'Ayuda y Contacto', en: 'Help & Contact', fr: 'Aide et Contact', de: 'Hilfe & Kontakt' },
  t112: { ca: 'Preguntes freqüents i com contactar', es: 'Preguntas frecuentes y cómo contactar', en: 'Frequently asked questions and how to contact us', fr: 'Questions fréquentes et comment nous contacter', de: 'Häufige Fragen und Kontaktmöglichkeiten' },
  t113: { ca: 'On està la meva comanda?', es: '¿Dónde está mi pedido?', en: 'Where Is My Order?', fr: 'Où est ma commande ?', de: 'Wo ist meine Bestellung?' },
  t114: { ca: 'Preguntes Freqüents', es: 'Preguntas Frecuentes', en: 'Frequently Asked Questions', fr: 'Questions Fréquentes', de: 'Häufig gestellte Fragen' },
  t115: { ca: 'Quins sectors atén HIGIENEX?', es: '¿Qué sectores atiende HIGIENEX?', en: 'What sectors does HIGIENEX serve?', fr: 'Quels secteurs HIGIENEX dessert-elle ?', de: 'Welche Branchen bedient HIGIENEX?' },
  t116: { ca: 'Quina és la forma jurídica d\'HIGIENEX?', es: '¿Cuál es la forma jurídica de HIGIENEX?', en: 'What is HIGIENEX\'s legal structure?', fr: 'Quelle est la forme juridique d\'HIGIENEX ?', de: 'Welche Rechtsform hat HIGIENEX?' },
  t117: { ca: 'Quins certificats tenen els vostres productes?', es: '¿Qué certificados tienen vuestros productos?', en: 'What certifications do your products have?', fr: 'Quelles certifications ont vos produits ?', de: 'Welche Zertifizierungen haben Ihre Produkte?' },
  t118: { ca: 'Podeu enviar a Portugal i altres països europeus?', es: '¿Podéis enviar a Portugal y otros países europeos?', en: 'Do you ship to Portugal and other European countries?', fr: 'Livrez-vous au Portugal et dans d\'autres pays européens ?', de: 'Liefern Sie nach Portugal und in andere europäische Länder?' },
  t119: { ca: 'Com funcionen els concentrats ECO?', es: '¿Cómo funcionan los concentrados ECO?', en: 'How do the ECO concentrates work?', fr: 'Comment fonctionnent les concentrés ECO ?', de: 'Wie funktionieren die ECO-Konzentrate?' },
  t120: { ca: 'Quin és el projecte WorkSafe Smart Space?', es: '¿Cuál es el proyecto WorkSafe Smart Space?', en: 'What is the WorkSafe Smart Space project?', fr: 'Qu\'est-ce que le projet WorkSafe Smart Space ?', de: 'Was ist das Projekt WorkSafe Smart Space?' },
  t121: { ca: 'Contacteu amb Nosaltres', es: 'Contacta con Nosotros', en: 'Get in Touch', fr: 'Contactez-nous', de: 'Kontaktieren Sie uns' },
  t122: { ca: 'Adreça', es: 'Dirección', en: 'Address', fr: 'Adresse', de: 'Adresse' },
  t123: { ca: 'Telèfon', es: 'Teléfono', en: 'Phone', fr: 'Téléphone', de: 'Telefon' },
  t124: { ca: 'Email', es: 'Email', en: 'Email', fr: 'E-mail', de: 'E-Mail' },
  t125: { ca: 'Horari', es: 'Horario', en: 'Hours', fr: 'Horaires', de: 'Öffnungszeiten' },
  t126: { ca: 'Nom i Cognoms *', es: 'Nombre y Apellidos *', en: 'Full Name *', fr: 'Nom complet *', de: 'Vollständiger Name *' },
  t127: { ca: 'Empresa *', es: 'Empresa *', en: 'Company *', fr: 'Entreprise *', de: 'Unternehmen *' },
  t128: { ca: 'Email *', es: 'Email *', en: 'Email *', fr: 'E-mail *', de: 'E-Mail *' },
  t129: { ca: 'Telèfon', es: 'Teléfono', en: 'Phone', fr: 'Téléphone', de: 'Telefon' },
  t130: { ca: 'Missatge *', es: 'Mensaje *', en: 'Message *', fr: 'Message *', de: 'Nachricht *' },
  t131: { ca: 'Enviar Missatge →', es: 'Enviar Mensaje →', en: 'Send Message →', fr: 'Envoyer le message →', de: 'Nachricht senden →' },
  t132: { ca: 'Avís legal', es: 'Aviso legal', en: 'Legal Notice', fr: 'Mentions légales', de: 'Impressum' },
  t133: { ca: '1. Identitat del titular', es: '1. Identidad del titular', en: '1. Owner\'s Identity', fr: '1. Identité du titulaire', de: '1. Identität des Inhabers' },
  t134: { ca: '2. Objecte', es: '2. Objeto', en: '2. Purpose', fr: '2. Objet', de: '2. Zweck' },
  t135: { ca: '3. Propietat intel·lectual i industrial', es: '3. Propiedad intelectual e industrial', en: '3. Intellectual & Industrial Property', fr: '3. Propriété intellectuelle et industrielle', de: '3. Geistiges und gewerbliches Eigentum' },
  t136: { ca: '4. Responsabilitat', es: '4. Responsabilidad', en: '4. Liability', fr: '4. Responsabilité', de: '4. Haftung' },
  t137: { ca: '5. Legislació aplicable', es: '5. Legislación aplicable', en: '5. Applicable Law', fr: '5. Législation applicable', de: '5. Anwendbares Recht' },
  t138: { ca: 'Política de privacitat', es: 'Política de privacidad', en: 'Privacy Policy', fr: 'Politique de confidentialité', de: 'Datenschutzrichtlinie' },
  t139: { ca: '1. Responsable del tractament', es: '1. Responsable del tratamiento', en: '1. Data Controller', fr: '1. Responsable du traitement', de: '1. Verantwortlicher' },
  t140: { ca: '2. Finalitat del tractament', es: '2. Finalidad del tratamiento', en: '2. Purpose of Processing', fr: '2. Finalité du traitement', de: '2. Zweck der Verarbeitung' },
  t141: { ca: '3. Base legal', es: '3. Base legal', en: '3. Legal Basis', fr: '3. Base légale', de: '3. Rechtsgrundlage' },
  t142: { ca: '4. Conservació de les dades', es: '4. Conservación de los datos', en: '4. Data Retention', fr: '4. Conservation des données', de: '4. Datenspeicherung' },
  t143: { ca: '5. Drets de l\'usuari', es: '5. Derechos del usuario', en: '5. User Rights', fr: '5. Droits de l\'utilisateur', de: '5. Rechte des Nutzers' },
  t144: { ca: '6. Cessió de dades', es: '6. Cesión de datos', en: '6. Data Transfer', fr: '6. Transfert de données', de: '6. Datenweitergabe' },
  t145: { ca: 'Política de cookies', es: 'Política de cookies', en: 'Cookie Policy', fr: 'Politique de cookies', de: 'Cookie-Richtlinie' },
  t146: { ca: '1. Què són les cookies?', es: '1. ¿Qué son las cookies?', en: '1. What are cookies?', fr: '1. Qu\'est-ce qu\'un cookie ?', de: '1. Was sind Cookies?' },
  t147: { ca: '2. Tipus de cookies que utilitzem', es: '2. Tipos de cookies que utilizamos', en: '2. Types of Cookies We Use', fr: '2. Types de cookies que nous utilisons', de: '2. Von uns verwendete Cookie-Arten' },
  t148: { ca: '3. Gestió i acceptació', es: '3. Gestión y aceptación', en: '3. Management & Acceptance', fr: '3. Gestion et acceptation', de: '3. Verwaltung und Zustimmung' },
  t149: { ca: '4. Més informació', es: '4. Más información', en: '4. More Information', fr: '4. Plus d\'informations', de: '4. Weitere Informationen' },
  t150: { ca: 'Fabricants i distribuïdors de productes d\'higiene professional ECO. Des de 2015 servint els sectors més exigents.', es: 'Fabricantes y distribuidores de productos de higiene profesional ECO. Desde 2015 sirviendo a los sectores más exigentes.', en: 'Manufacturers and distributors of ECO professional hygiene products. Serving the most demanding sectors since 2015.', fr: 'Fabricants et distributeurs de produits d\'hygiène professionnelle ECO. Au service des secteurs les plus exigeants depuis 2015.', de: 'Hersteller und Vertrieb von ECO-Profi-Hygieneprodukten. Seit 2015 im Dienst anspruchsvollster Branchen.' },
  t151: { ca: 'Empresa', es: 'Empresa', en: 'Company', fr: 'Entreprise', de: 'Unternehmen' },
  t152: { ca: 'Sobre Nosaltres', es: 'Sobre Nosotros', en: 'About Us', fr: 'À propos', de: 'Über uns' },
  t153: { ca: 'Missió i Valors', es: 'Misión y Valores', en: 'Mission & Values', fr: 'Mission et valeurs', de: 'Mission & Werte' },
  t154: { ca: 'Organigrama', es: 'Organigrama', en: 'Org Chart', fr: 'Organigramme', de: 'Organigramm' },
  t155: { ca: 'Equip Humà', es: 'Equipo Humano', en: 'Our Team', fr: 'Notre équipe', de: 'Unser Team' },
  t156: { ca: 'RSC', es: 'RSC', en: 'CSR', fr: 'RSE', de: 'CSR' },
  t157: { ca: 'Productes i Serveis', es: 'Productos y Servicios', en: 'Products & Services', fr: 'Produits et Services', de: 'Produkte & Dienstleistungen' },
  t158: { ca: 'Catàleg de Productes', es: 'Catálogo de Productos', en: 'Product Catalogue', fr: 'Catalogue de produits', de: 'Produktkatalog' },
  t159: { ca: 'Laboratori R+D', es: 'Laboratorio I+D', en: 'R&D Lab', fr: 'Laboratoire R&D', de: 'F&E-Labor' },
  t160: { ca: 'Sostenibilitat', es: 'Sostenibilidad', en: 'Sustainability', fr: 'Durabilité', de: 'Nachhaltigkeit' },
  t161: { ca: 'Innovació', es: 'Innovación', en: 'Innovation', fr: 'Innovation', de: 'Innovation' },
  t162: { ca: 'Casos d\'Èxit', es: 'Casos de Éxito', en: 'Success Stories', fr: 'Études de cas', de: 'Erfolgsgeschichten' },
  t163: { ca: 'Contacte', es: 'Contacto', en: 'Contact', fr: 'Contact', de: 'Kontakt' },
  t164: { ca: 'Benvingut/da', es: 'Bienvenido/a', en: 'Welcome', fr: 'Bienvenue', de: 'Willkommen' },
  t165: { ca: 'Crear compte', es: 'Crear cuenta', en: 'Create Account', fr: 'Créer un compte', de: 'Konto erstellen' },
  t166: { ca: 'Benvingut/da a la teva zona de comandes', es: 'Bienvenido/a a tu zona de pedidos', en: 'Welcome to your orders area', fr: 'Bienvenue dans votre espace commandes', de: 'Willkommen in Ihrem Bestellbereich' },
  t167: { ca: 'La teva comanda', es: 'Tu pedido', en: 'Your Order', fr: 'Votre commande', de: 'Ihre Bestellung' },
  t168: { ca: 'Producte', es: 'Producto', en: 'Product', fr: 'Produit', de: 'Produkt' },
  t169: { ca: 'No et perdis res del sector', es: 'No te pierdas nada del sector', en: 'Don\'t Miss Industry News', fr: 'Ne manquez rien du secteur', de: 'Verpassen Sie keine Branchen-News' },
  t170: { ca: 'Demana la teva mostra gratuïta', es: 'Solicita tu muestra gratuita', en: 'Request Your Free Sample', fr: 'Demandez votre échantillon gratuit', de: 'Fordern Sie Ihre kostenlose Probe an' },
  t171: { ca: 'Client', es: 'Cliente', en: 'Client', fr: 'Client', de: 'Kunde' },
  t172: { ca: 'Detalls', es: 'Detalles', en: 'Details', fr: 'Détails', de: 'Details' },
  t173: { ca: '📦 Les meves comandes', es: '📦 Mis pedidos', en: '📦 My Orders', fr: '📦 Mes commandes', de: '📦 Meine Bestellungen' },
  t174: { ca: 'Avís de cookies', es: 'Aviso de cookies', en: 'Cookie Notice', fr: 'Avis de cookies', de: 'Cookie-Hinweis' },
  t175: { ca: '🏠 Inici', es: '🏠 Inicio', en: '🏠 Home', fr: '🏠 Accueil', de: '🏠 Start' },
  t176: { ca: '🏢 Empresa', es: '🏢 Empresa', en: '🏢 Company', fr: '🏢 Entreprise', de: '🏢 Unternehmen' },
  t177: { ca: '🧴 Productes i Innovació', es: '🧴 Productos e Innovación', en: '🧴 Products & Innovation', fr: '🧴 Produits et Innovation', de: '🧴 Produkte & Innovation' },
  t178: { ca: '🏭 Operacions', es: '🏭 Operaciones', en: '🏭 Operations', fr: '🏭 Opérations', de: '🏭 Betrieb' },
  t179: { ca: '♻️ Compromís i Mercat', es: '♻️ Compromiso y Mercado', en: '♻️ Commitment & Market', fr: '♻️ Engagement et Marché', de: '♻️ Engagement & Markt' },
  t180: { ca: '📰 Newsletter', es: '📰 Newsletter', en: '📰 Newsletter', fr: '📰 Newsletter', de: '📰 Newsletter' },
  t181: { ca: '📞 Ajuda i Contacte', es: '📞 Ayuda y Contacto', en: '📞 Help & Contact', fr: '📞 Aide et Contact', de: '📞 Hilfe & Kontakt' },
};

var HX_LANG_KEY = 'hx_lang';

var HX_LANG_META = {
  ca: { flag: '🏴', code: 'CA', htmlLang: 'ca' },
  es: { flag: '🇪🇸', code: 'ES', htmlLang: 'es' },
  en: { flag: '🇬🇧', code: 'EN', htmlLang: 'en' },
  fr: { flag: '🇫🇷', code: 'FR', htmlLang: 'fr' },
  de: { flag: '🇩🇪', code: 'DE', htmlLang: 'de' }
};

// Aplica un idioma: recorre tots els elements marcats amb
// data-i18n-key i els posa el text de HX_I18N per a aquest idioma.
function hxApplyLang(lang) {
  var meta = HX_LANG_META[lang] || HX_LANG_META.ca;
  document.querySelectorAll('[data-i18n-key]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-key');
    var entry = HX_I18N[key];
    if (!entry) return;
    el.textContent = entry[lang] || entry.ca || '';
  });
  document.documentElement.setAttribute('lang', meta.htmlLang);

  var flagEl = document.getElementById('langCurrentFlag');
  var codeEl = document.getElementById('langCurrentCode');
  if (flagEl) flagEl.textContent = meta.flag;
  if (codeEl) codeEl.textContent = meta.code;

  document.querySelectorAll('#langDropdownMenu button').forEach(function(b, i) {
    var codes = ['ca', 'es', 'en', 'fr', 'de'];
    b.classList.toggle('active', codes[i] === lang);
  });
}

function hxSetLang(lang) {
  try { localStorage.setItem(HX_LANG_KEY, lang); } catch (e) {}
  hxApplyLang(lang);
  hxToggleLangMenu(false);
}
window.hxSetLang = hxSetLang;

function hxToggleLangMenu(force) {
  var menu = document.getElementById('langDropdownMenu');
  var btn = document.getElementById('langToggleBtn');
  if (!menu) return;
  var open = (force !== undefined) ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
window.hxToggleLangMenu = hxToggleLangMenu;

document.addEventListener('click', function(e) {
  var menu = document.getElementById('langDropdownMenu');
  var wrap = document.getElementById('langDropdownWrap');
  if (menu && menu.classList.contains('open') && wrap && !wrap.contains(e.target)) {
    hxToggleLangMenu(false);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  try {
    var saved = localStorage.getItem(HX_LANG_KEY);
    if (saved && saved !== 'ca') hxApplyLang(saved);
  } catch (e) {}
});
