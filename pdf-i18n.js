/* ==========================================================================
   HIGIENEX · traduccions dels PDF i dels emails a clients
   Els documents s'escriuen en català i HXT('text') els tradueix a l'idioma
   triat a la web (ca, es, en, fr, de). En àrab (ar) es fa servir l'anglès,
   perquè el generador de PDF no té lletra àrab.
   Les claus són el text original en català; {0}, {1}… són valors variables.
   ========================================================================== */
(function () {
  'use strict';
  var D = {
    /* ---- plantilla comuna ---- */
    'HIGIENE PROFESSIONAL SOSTENIBLE': ['HIGIENE PROFESIONAL SOSTENIBLE', 'SUSTAINABLE PROFESSIONAL HYGIENE', 'HYGIÈNE PROFESSIONNELLE DURABLE', 'NACHHALTIGE PROFESSIONELLE HYGIENE'],
    'Data': ['Fecha', 'Date', 'Date', 'Datum'],
    'Pàg.': ['Pág.', 'Page', 'Page', 'Seite'],
    'Document generat a higienexvalencia.es': ['Documento generado en higienexvalencia.es', 'Document generated at higienexvalencia.es', 'Document généré sur higienexvalencia.es', 'Dokument erstellt auf higienexvalencia.es'],
    'Client': ['Cliente', 'Customer', 'Client', 'Kunde'],
    'Emissor': ['Emisor', 'Issuer', 'Émetteur', 'Aussteller'],
    'Total': ['Total', 'Total', 'Total', 'Gesamt'],
    'Producte': ['Producto', 'Product', 'Produit', 'Produkt'],
    'Sector': ['Sector', 'Sector', 'Secteur', 'Branche'],
    'Telèfon': ['Teléfono', 'Phone', 'Téléphone', 'Telefon'],
    'Web': ['Web', 'Website', 'Site web', 'Website'],

    /* ---- fitxa tècnica ---- */
    'Fitxa tècnica de producte': ['Ficha técnica de producto', 'Product data sheet', 'Fiche technique du produit', 'Technisches Datenblatt'],
    'Fitxa tècnica': ['Ficha técnica', 'Data sheet', 'Fiche technique', 'Datenblatt'],
    'Preu de referència': ['Precio de referencia', 'Reference price', 'Prix de référence', 'Richtpreis'],
    'Professional': ['Profesional', 'Professional', 'Professionnel', 'Professionell'],
    'Concentració': ['Concentración', 'Concentration', 'Concentration', 'Konzentration'],
    'Certificació': ['Certificación', 'Certification', 'Certification', 'Zertifizierung'],
    'Descripció del producte': ['Descripción del producto', 'Product description', 'Description du produit', 'Produktbeschreibung'],
    'Dades del producte': ['Datos del producto', 'Product details', 'Données du produit', 'Produktdaten'],
    'Nom comercial': ['Nombre comercial', 'Trade name', 'Nom commercial', 'Handelsname'],
    'Ús recomanat': ['Uso recomendado', 'Recommended use', 'Usage recommandé', 'Empfohlene Verwendung'],
    'Concentració / dilució': ['Concentración / dilución', 'Concentration / dilution', 'Concentration / dilution', 'Konzentration / Verdünnung'],
    'Biodegradabilitat': ['Biodegradabilidad', 'Biodegradability', 'Biodégradabilité', 'Biologische Abbaubarkeit'],
    'Envàs': ['Envase', 'Packaging', 'Emballage', 'Verpackung'],
    'Fabricant': ['Fabricante', 'Manufacturer', 'Fabricant', 'Hersteller'],
    "Mode d'ús recomanat": ['Modo de uso recomendado', 'Directions for use', "Mode d'emploi recommandé", 'Anwendungshinweise'],
    'Diluir segons la superfície a tractar i el nivell de brutícia.': ['Diluir según la superficie a tratar y el nivel de suciedad.', 'Dilute according to the surface and how dirty it is.', 'Diluer selon la surface à traiter et le niveau de salissure.', 'Je nach Oberfläche und Verschmutzungsgrad verdünnen.'],
    'Aplicar amb polvoritzador, mopa o baieta de microfibra.': ['Aplicar con pulverizador, mopa o bayeta de microfibra.', 'Apply with a spray bottle, mop or microfibre cloth.', 'Appliquer au pulvérisateur, à la serpillière ou avec une lavette en microfibre.', 'Mit Sprühflasche, Wischmopp oder Mikrofasertuch auftragen.'],
    "Deixar actuar el temps de contacte indicat a l'etiqueta i aclarir si escau.": ['Dejar actuar el tiempo de contacto indicado en la etiqueta y aclarar si procede.', 'Leave for the contact time shown on the label and rinse if needed.', "Laisser agir le temps de contact indiqué sur l'étiquette et rincer si nécessaire.", 'Die auf dem Etikett angegebene Einwirkzeit abwarten und bei Bedarf abspülen.'],
    "Ventilar l'espai durant l'aplicació.": ['Ventilar el espacio durante la aplicación.', 'Ventilate the area during use.', "Aérer l'espace pendant l'application.", 'Den Raum während der Anwendung lüften.'],
    'Precaucions i emmagatzematge': ['Precauciones y almacenamiento', 'Precautions and storage', 'Précautions et stockage', 'Vorsichtsmaßnahmen und Lagerung'],
    "Mantenir fora de l'abast dels infants.": ['Mantener fuera del alcance de los niños.', 'Keep out of the reach of children.', 'Tenir hors de portée des enfants.', 'Außerhalb der Reichweite von Kindern aufbewahren.'],
    'Emmagatzemar en lloc fresc i sec, protegit de la llum directa (entre 5 i 30 °C).': ['Almacenar en lugar fresco y seco, protegido de la luz directa (entre 5 y 30 °C).', 'Store in a cool, dry place away from direct light (5 to 30 °C).', "Stocker dans un endroit frais et sec, à l'abri de la lumière directe (entre 5 et 30 °C).", 'Kühl und trocken, vor direktem Licht geschützt lagern (5 bis 30 °C).'],
    'No barrejar amb altres productes químics, especialment lleixius o àcids.': ['No mezclar con otros productos químicos, especialmente lejías o ácidos.', 'Do not mix with other chemicals, especially bleach or acids.', "Ne pas mélanger avec d'autres produits chimiques, notamment l'eau de Javel ou les acides.", 'Nicht mit anderen Chemikalien mischen, insbesondere nicht mit Bleichmitteln oder Säuren.'],
    'Usar guants per manipular el producte concentrat.': ['Usar guantes para manipular el producto concentrado.', 'Wear gloves when handling the concentrate.', 'Porter des gants pour manipuler le produit concentré.', 'Beim Umgang mit dem Konzentrat Handschuhe tragen.'],
    'Necessites la fitxa de seguretat?': ['¿Necesitas la ficha de seguridad?', 'Need the safety data sheet?', 'Besoin de la fiche de données de sécurité ?', 'Benötigen Sie das Sicherheitsdatenblatt?'],
    'Descarrega la FDS des de la fitxa del producte a la web o demana-la a contacto@higienexvalencia.es indicant la referència.': ['Descarga la FDS desde la ficha del producto en la web o pídela a contacto@higienexvalencia.es indicando la referencia.', 'Download the SDS from the product page on our website or request it from contacto@higienexvalencia.es quoting the reference.', 'Téléchargez la FDS depuis la fiche produit du site ou demandez-la à contacto@higienexvalencia.es en indiquant la référence.', 'Laden Sie das SDB auf der Produktseite unserer Website herunter oder fordern Sie es unter Angabe der Referenz bei contacto@higienexvalencia.es an.'],
    "Aquesta fitxa és orientativa. Per a la Fitxa de Dades de Seguretat (FDS) oficial reglamentària, contacta amb l'equip tècnic.": ['Esta ficha es orientativa. Para la Ficha de Datos de Seguridad (FDS) oficial, contacta con el equipo técnico.', 'This sheet is for guidance only. For the official Safety Data Sheet (SDS), contact our technical team.', 'Cette fiche est indicative. Pour la Fiche de Données de Sécurité (FDS) officielle, contactez notre équipe technique.', 'Dieses Blatt dient nur zur Orientierung. Für das offizielle Sicherheitsdatenblatt (SDB) wenden Sie sich an unser technisches Team.'],

    /* ---- FDS ---- */
    'Fitxa de dades de seguretat': ['Ficha de datos de seguridad', 'Safety data sheet', 'Fiche de données de sécurité', 'Sicherheitsdatenblatt'],
    'Fitxa de seguretat': ['Ficha de seguridad', 'Safety data sheet', 'Fiche de sécurité', 'Sicherheitsdatenblatt'],
    'FDS': ['FDS', 'SDS', 'FDS', 'SDB'],
    'Versió': ['Versión', 'Version', 'Version', 'Version'],
    '1.0 (simplificada)': ['1.0 (simplificada)', '1.0 (simplified)', '1.0 (simplifiée)', '1.0 (vereinfacht)'],
    'Reglament': ['Reglamento', 'Regulation', 'Règlement', 'Verordnung'],
    'Urgències 24 h': ['Urgencias 24 h', 'Emergencies 24 h', 'Urgences 24 h', 'Notfälle 24 h'],
    'Identificació de la substància i de la societat': ['Identificación de la sustancia y de la empresa', 'Identification of the substance and of the company', 'Identification de la substance et de la société', 'Bezeichnung des Stoffes und des Unternehmens'],
    'Nom del producte': ['Nombre del producto', 'Product name', 'Nom du produit', 'Produktname'],
    'Contacte': ['Contacto', 'Contact', 'Contact', 'Kontakt'],
    "Telèfon d'emergència": ['Teléfono de emergencia', 'Emergency phone', "Téléphone d'urgence", 'Notrufnummer'],
    '631 706 398 (horari laboral i urgències 24/7)': ['631 706 398 (horario laboral y urgencias 24/7)', '631 706 398 (office hours and 24/7 emergencies)', '631 706 398 (heures de bureau et urgences 24h/24)', '631 706 398 (Bürozeiten und Notfälle rund um die Uhr)'],
    'Identificació de perills': ['Identificación de los peligros', 'Hazards identification', 'Identification des dangers', 'Mögliche Gefahren'],
    'Classificació segons el Reglament (CE) 1272/2008 (CLP).': ['Clasificación según el Reglamento (CE) 1272/2008 (CLP).', 'Classification according to Regulation (EC) 1272/2008 (CLP).', 'Classification selon le règlement (CE) 1272/2008 (CLP).', 'Einstufung gemäß Verordnung (EG) 1272/2008 (CLP).'],
    'Certificació: {0}.': ['Certificación: {0}.', 'Certification: {0}.', 'Certification : {0}.', 'Zertifizierung: {0}.'],
    'Pot causar irritació ocular i cutània lleu en contacte perllongat. No ingerir. Evitar el contacte amb els ulls.': ['Puede causar irritación ocular y cutánea leve en contacto prolongado. No ingerir. Evitar el contacto con los ojos.', 'May cause mild eye and skin irritation on prolonged contact. Do not swallow. Avoid contact with eyes.', 'Peut provoquer une légère irritation des yeux et de la peau en cas de contact prolongé. Ne pas avaler. Éviter le contact avec les yeux.', 'Kann bei längerem Kontakt leichte Augen- und Hautreizungen verursachen. Nicht verschlucken. Kontakt mit den Augen vermeiden.'],
    'Composició / informació sobre els components': ['Composición / información sobre los componentes', 'Composition / information on ingredients', 'Composition / informations sur les composants', 'Zusammensetzung / Angaben zu Bestandteilen'],
    'Tensioactius aniònics i no iònics (5-15 %), agents desinfectants segons la variant, aigua i conservants. Formulació pròpia HIGIENEX registrada. Composició exacta disponible sota petició per a auditories.': ['Tensioactivos aniónicos y no iónicos (5-15 %), agentes desinfectantes según la variante, agua y conservantes. Formulación propia HIGIENEX registrada. Composición exacta disponible bajo petición para auditorías.', 'Anionic and non-ionic surfactants (5-15 %), disinfecting agents depending on the variant, water and preservatives. Registered HIGIENEX formulation. Exact composition available on request for audits.', "Tensioactifs anioniques et non ioniques (5-15 %), agents désinfectants selon la variante, eau et conservateurs. Formulation HIGIENEX déposée. Composition exacte disponible sur demande pour les audits.", 'Anionische und nichtionische Tenside (5-15 %), je nach Variante Desinfektionsmittel, Wasser und Konservierungsstoffe. Eingetragene HIGIENEX-Rezeptur. Genaue Zusammensetzung für Audits auf Anfrage.'],
    'Primers auxilis': ['Primeros auxilios', 'First-aid measures', 'Premiers secours', 'Erste-Hilfe-Maßnahmen'],
    "**Contacte amb els ulls:** rentar abundantment amb aigua durant 15 minuts, mantenint les parpelles obertes. **Contacte amb la pell:** rentar amb aigua i sabó. **Ingestió:** no provocar el vòmit, beure aigua i contactar amb el Servei d'Informació Toxicològica (915 620 420). **Inhalació:** traslladar a l'aire lliure.": [
      '**Contacto con los ojos:** lavar abundantemente con agua durante 15 minutos, manteniendo los párpados abiertos. **Contacto con la piel:** lavar con agua y jabón. **Ingestión:** no provocar el vómito, beber agua y llamar al Servicio de Información Toxicológica (915 620 420). **Inhalación:** trasladar al aire libre.',
      '**Eye contact:** rinse thoroughly with water for 15 minutes, keeping the eyelids open. **Skin contact:** wash with soap and water. **Ingestion:** do not induce vomiting, drink water and call the Poison Information Service (+34 915 620 420). **Inhalation:** move to fresh air.',
      "**Contact avec les yeux :** rincer abondamment à l'eau pendant 15 minutes en gardant les paupières ouvertes. **Contact avec la peau :** laver à l'eau et au savon. **Ingestion :** ne pas faire vomir, boire de l'eau et appeler le centre antipoison (+34 915 620 420). **Inhalation :** transporter la personne à l'air libre.",
      '**Augenkontakt:** 15 Minuten lang bei geöffneten Lidern gründlich mit Wasser spülen. **Hautkontakt:** mit Wasser und Seife waschen. **Verschlucken:** kein Erbrechen herbeiführen, Wasser trinken und den Giftinformationsdienst anrufen (+34 915 620 420). **Einatmen:** an die frische Luft bringen.'],
    'Mesures de lluita contra incendis': ['Medidas de lucha contra incendios', 'Firefighting measures', "Mesures de lutte contre l'incendie", 'Maßnahmen zur Brandbekämpfung'],
    "Producte no inflamable. En cas d'incendi de l'entorn, usar agents extintors adequats (CO2, pols seca, escuma). No es preveuen productes de descomposició perillosos en condicions normals d'ús.": ['Producto no inflamable. En caso de incendio en el entorno, usar agentes extintores adecuados (CO2, polvo seco, espuma). No se prevén productos de descomposición peligrosos en condiciones normales de uso.', 'Non-flammable product. In case of a fire nearby, use suitable extinguishing agents (CO2, dry powder, foam). No hazardous decomposition products are expected under normal use.', "Produit ininflammable. En cas d'incendie à proximité, utiliser des moyens d'extinction adaptés (CO2, poudre sèche, mousse). Aucun produit de décomposition dangereux n'est prévu dans des conditions normales d'utilisation.", 'Nicht brennbares Produkt. Bei einem Brand in der Umgebung geeignete Löschmittel verwenden (CO2, Trockenpulver, Schaum). Unter normalen Bedingungen sind keine gefährlichen Zersetzungsprodukte zu erwarten.'],
    "Mesures en cas d'abocament accidental": ['Medidas en caso de vertido accidental', 'Accidental release measures', 'Mesures en cas de dispersion accidentelle', 'Maßnahmen bei unbeabsichtigter Freisetzung'],
    "Absorbir amb material inert (sorra, terra de diatomees). Recollir en un recipient tancat per a la seva eliminació. Esbandir la zona amb aigua. Evitar l'abocament a la xarxa de clavegueram sense diluir.": ['Absorber con material inerte (arena, tierra de diatomeas). Recoger en un recipiente cerrado para su eliminación. Aclarar la zona con agua. Evitar el vertido sin diluir a la red de alcantarillado.', 'Absorb with inert material (sand, diatomaceous earth). Collect in a closed container for disposal. Rinse the area with water. Do not discharge undiluted into drains.', "Absorber avec un matériau inerte (sable, terre de diatomées). Recueillir dans un récipient fermé pour l'élimination. Rincer la zone à l'eau. Ne pas rejeter le produit non dilué dans les égouts.", 'Mit inertem Material (Sand, Kieselgur) aufnehmen. In einem geschlossenen Behälter zur Entsorgung sammeln. Den Bereich mit Wasser abspülen. Nicht unverdünnt in die Kanalisation gelangen lassen.'],
    'Manipulació i emmagatzematge': ['Manipulación y almacenamiento', 'Handling and storage', 'Manipulation et stockage', 'Handhabung und Lagerung'],
    'Emmagatzemar en lloc fresc, sec i ben ventilat, protegit de la llum directa, entre 5 °C i 30 °C. Mantenir el recipient ben tancat. No barrejar amb altres productes químics, especialment lleixius o àcids.': ['Almacenar en lugar fresco, seco y bien ventilado, protegido de la luz directa, entre 5 °C y 30 °C. Mantener el envase bien cerrado. No mezclar con otros productos químicos, especialmente lejías o ácidos.', 'Store in a cool, dry, well-ventilated place away from direct light, between 5 °C and 30 °C. Keep the container tightly closed. Do not mix with other chemicals, especially bleach or acids.', "Stocker dans un endroit frais, sec et bien aéré, à l'abri de la lumière directe, entre 5 °C et 30 °C. Garder le récipient bien fermé. Ne pas mélanger avec d'autres produits chimiques, notamment l'eau de Javel ou les acides.", 'Kühl, trocken und gut belüftet, vor direktem Licht geschützt zwischen 5 °C und 30 °C lagern. Behälter dicht geschlossen halten. Nicht mit anderen Chemikalien mischen, insbesondere nicht mit Bleichmitteln oder Säuren.'],
    "Controls d'exposició / protecció individual": ['Controles de exposición / protección individual', 'Exposure controls / personal protection', "Contrôles de l'exposition / protection individuelle", 'Begrenzung der Exposition / persönliche Schutzausrüstung'],
    "Ús recomanat de guants de nitril per a la manipulació del concentrat. Ventilar l'espai durant l'aplicació. No cal protecció respiratòria en ús normal diluït.": ['Se recomienda usar guantes de nitrilo para manipular el concentrado. Ventilar el espacio durante la aplicación. No se necesita protección respiratoria en uso normal diluido.', 'Nitrile gloves are recommended when handling the concentrate. Ventilate the area during use. No respiratory protection is needed for normal diluted use.', "Port de gants en nitrile recommandé pour manipuler le concentré. Aérer l'espace pendant l'application. Aucune protection respiratoire n'est nécessaire en usage normal dilué.", 'Beim Umgang mit dem Konzentrat werden Nitrilhandschuhe empfohlen. Den Raum während der Anwendung lüften. Bei normaler verdünnter Anwendung ist kein Atemschutz erforderlich.'],
    'Propietats fisicoquímiques': ['Propiedades físicas y químicas', 'Physical and chemical properties', 'Propriétés physiques et chimiques', 'Physikalische und chemische Eigenschaften'],
    'Estat físic': ['Estado físico', 'Physical state', 'État physique', 'Aggregatzustand'],
    'Líquid': ['Líquido', 'Liquid', 'Liquide', 'Flüssig'],
    'pH (concentrat)': ['pH (concentrado)', 'pH (concentrate)', 'pH (concentré)', 'pH (Konzentrat)'],
    '6,5 - 8,5 aprox.': ['6,5 - 8,5 aprox.', 'approx. 6.5 - 8.5', '6,5 - 8,5 env.', 'ca. 6,5 - 8,5'],
    'Solubilitat en aigua': ['Solubilidad en agua', 'Water solubility', "Solubilité dans l'eau", 'Wasserlöslichkeit'],
    'Estabilitat i reactivitat': ['Estabilidad y reactividad', 'Stability and reactivity', 'Stabilité et réactivité', 'Stabilität und Reaktivität'],
    'Estable en les condicions recomanades de manipulació i emmagatzematge. Evitar temperatures extremes i el contacte amb oxidants forts.': ['Estable en las condiciones recomendadas de manipulación y almacenamiento. Evitar temperaturas extremas y el contacto con oxidantes fuertes.', 'Stable under the recommended handling and storage conditions. Avoid extreme temperatures and contact with strong oxidisers.', "Stable dans les conditions de manipulation et de stockage recommandées. Éviter les températures extrêmes et le contact avec des oxydants forts.", 'Unter den empfohlenen Handhabungs- und Lagerbedingungen stabil. Extreme Temperaturen und Kontakt mit starken Oxidationsmitteln vermeiden.'],
    'Informació toxicològica': ['Información toxicológica', 'Toxicological information', 'Informations toxicologiques', 'Toxikologische Angaben'],
    "No es coneixen efectes greus en les condicions d'ús previstes. Consultar la secció 4 en cas d'exposició accidental.": ['No se conocen efectos graves en las condiciones de uso previstas. Consultar la sección 4 en caso de exposición accidental.', 'No serious effects are known under the intended conditions of use. See section 4 in case of accidental exposure.', "Aucun effet grave connu dans les conditions d'utilisation prévues. Voir la section 4 en cas d'exposition accidentelle.", 'Unter den vorgesehenen Anwendungsbedingungen sind keine schwerwiegenden Wirkungen bekannt. Bei versehentlicher Exposition siehe Abschnitt 4.'],
    'Informació ecològica': ['Información ecológica', 'Ecological information', 'Informations écologiques', 'Umweltbezogene Angaben'],
    'Biodegradabilitat: {0}.': ['Biodegradabilidad: {0}.', 'Biodegradability: {0}.', 'Biodégradabilité : {0}.', 'Biologische Abbaubarkeit: {0}.'],
    "Formulació dissenyada per minimitzar l'impacte en ecosistemes aquàtics.": ['Formulación diseñada para minimizar el impacto en los ecosistemas acuáticos.', 'Formulated to minimise the impact on aquatic ecosystems.', "Formulation conçue pour réduire au minimum l'impact sur les écosystèmes aquatiques.", 'Rezeptur zur Minimierung der Auswirkungen auf Gewässerökosysteme.'],
    "Consideracions sobre l'eliminació": ['Consideraciones sobre la eliminación', 'Disposal considerations', "Considérations relatives à l'élimination", 'Hinweise zur Entsorgung'],
    "Eliminar el contingut i l'envàs segons la normativa local. Els envasos buits i esbandits es poden reciclar.": ['Eliminar el contenido y el envase según la normativa local. Los envases vacíos y enjuagados se pueden reciclar.', 'Dispose of contents and container in line with local regulations. Empty, rinsed containers can be recycled.', "Éliminer le contenu et l'emballage conformément à la réglementation locale. Les emballages vides et rincés peuvent être recyclés.", 'Inhalt und Behälter gemäß den örtlichen Vorschriften entsorgen. Leere, ausgespülte Behälter können recycelt werden.'],
    'Informació relativa al transport': ['Información relativa al transporte', 'Transport information', 'Informations relatives au transport', 'Angaben zum Transport'],
    'No classificat com a mercaderia perillosa per al transport (ADR/RID).': ['No clasificado como mercancía peligrosa para el transporte (ADR/RID).', 'Not classified as dangerous goods for transport (ADR/RID).', 'Non classé comme marchandise dangereuse pour le transport (ADR/RID).', 'Nicht als Gefahrgut für den Transport eingestuft (ADR/RID).'],
    'Informació reglamentària': ['Información reglamentaria', 'Regulatory information', 'Informations réglementaires', 'Rechtsvorschriften'],
    'Producte fabricat de conformitat amb la normativa europea de detergents (Reglament (CE) 648/2004) i, si escau, el Reglament de biocides (UE) 528/2012.': ['Producto fabricado conforme a la normativa europea de detergentes (Reglamento (CE) 648/2004) y, en su caso, el Reglamento de biocidas (UE) 528/2012.', 'Manufactured in accordance with the EU Detergents Regulation (EC) 648/2004 and, where applicable, the Biocidal Products Regulation (EU) 528/2012.', "Produit fabriqué conformément au règlement européen sur les détergents (CE) 648/2004 et, le cas échéant, au règlement sur les biocides (UE) 528/2012.", 'Hergestellt gemäß der EU-Detergenzienverordnung (EG) 648/2004 und gegebenenfalls der Biozidverordnung (EU) 528/2012.'],
    'Certificacions: {0}.': ['Certificaciones: {0}.', 'Certifications: {0}.', 'Certifications : {0}.', 'Zertifizierungen: {0}.'],
    'Altra informació': ['Otra información', 'Other information', 'Autres informations', 'Sonstige Angaben'],
    "Revisió del {0}. Document preparat pel departament tècnic d'HIGIENEX.": ['Revisión del {0}. Documento preparado por el departamento técnico de HIGIENEX.', 'Revised on {0}. Prepared by the HIGIENEX technical department.', 'Révision du {0}. Document préparé par le service technique de HIGIENEX.', 'Stand: {0}. Erstellt von der technischen Abteilung von HIGIENEX.'],
    "Document generat automàticament des de la web d'HIGIENEX. Aquesta FDS és una versió simplificada amb finalitat informativa i de projecte acadèmic; no substitueix la Fitxa de Dades de Seguretat oficial reglamentària (Reglament REACH 1907/2006, Annex II), disponible sota petició al departament tècnic.": [
      'Documento generado automáticamente desde la web de HIGIENEX. Esta FDS es una versión simplificada con fines informativos y de proyecto académico; no sustituye a la Ficha de Datos de Seguridad oficial (Reglamento REACH 1907/2006, anexo II), disponible bajo petición al departamento técnico.',
      'Document generated automatically from the HIGIENEX website. This SDS is a simplified version for information and academic purposes; it does not replace the official Safety Data Sheet (REACH Regulation 1907/2006, Annex II), available on request from our technical department.',
      "Document généré automatiquement depuis le site de HIGIENEX. Cette FDS est une version simplifiée à titre informatif et pédagogique ; elle ne remplace pas la Fiche de Données de Sécurité officielle (règlement REACH 1907/2006, annexe II), disponible sur demande auprès du service technique.",
      'Automatisch auf der HIGIENEX-Website erstelltes Dokument. Dieses SDB ist eine vereinfachte Fassung zu Informations- und Ausbildungszwecken; es ersetzt nicht das offizielle Sicherheitsdatenblatt (REACH-Verordnung 1907/2006, Anhang II), das bei der technischen Abteilung angefordert werden kann.'],

    /* ---- catàleg ---- */
    'Catàleg de productes': ['Catálogo de productos', 'Product catalogue', 'Catalogue des produits', 'Produktkatalog'],
    'Catàleg {0}': ['Catálogo {0}', 'Catalogue {0}', 'Catalogue {0}', 'Katalog {0}'],
    'Catàleg': ['Catálogo', 'Catalogue', 'Catalogue', 'Katalog'],
    'Higiene professional sostenible': ['Higiene profesional sostenible', 'Sustainable professional hygiene', 'Hygiène professionnelle durable', 'Nachhaltige professionelle Hygiene'],
    'Productes': ['Productos', 'Products', 'Produits', 'Produkte'],
    '{0} referències': ['{0} referencias', '{0} products', '{0} références', '{0} Artikel'],
    'Sectors': ['Sectores', 'Sectors', 'Secteurs', 'Branchen'],
    '{0} sectors': ['{0} sectores', '{0} sectors', '{0} secteurs', '{0} Branchen'],
    'Dilució': ['Dilución', 'Dilution', 'Dilution', 'Verdünnung'],
    'Preu': ['Precio', 'Price', 'Prix', 'Preis'],
    'Per què HIGIENEX': ['Por qué HIGIENEX', 'Why HIGIENEX', 'Pourquoi HIGIENEX', 'Warum HIGIENEX'],
    'Concentrats que redueixen fins a un 70 % els envasos de plàstic.': ['Concentrados que reducen hasta un 70 % los envases de plástico.', 'Concentrates that cut plastic packaging by up to 70 %.', "Concentrés qui réduisent jusqu'à 70 % les emballages en plastique.", 'Konzentrate, die Kunststoffverpackungen um bis zu 70 % reduzieren.'],
    'Desinfectants registrats com a biocides a la UE i productes homologats HACCP.': ['Desinfectantes registrados como biocidas en la UE y productos homologados HACCP.', 'Disinfectants registered as biocides in the EU and HACCP-approved products.', "Désinfectants enregistrés comme biocides dans l'UE et produits homologués HACCP.", 'In der EU als Biozide registrierte Desinfektionsmittel und HACCP-zugelassene Produkte.'],
    'Descomptes automàtics per volum i transport de 5 € per comanda.': ['Descuentos automáticos por volumen y transporte de 5 € por pedido.', 'Automatic volume discounts and €5 shipping per order.', 'Remises automatiques sur volume et livraison à 5 € par commande.', 'Automatische Mengenrabatte und 5 € Versand pro Bestellung.'],
    'Fitxes tècniques i de seguretat descarregables des de la web.': ['Fichas técnicas y de seguridad descargables desde la web.', 'Technical and safety data sheets available on our website.', 'Fiches techniques et de sécurité téléchargeables sur le site.', 'Technische und Sicherheitsdatenblätter zum Herunterladen auf der Website.'],
    'Vols un pressupost a mida?': ['¿Quieres un presupuesto a medida?', 'Want a tailored quote?', 'Vous souhaitez un devis sur mesure ?', 'Möchten Sie ein individuelles Angebot?'],
    'Fes-lo a la web en un minut (secció Pressupost) o escriu-nos a contacto@higienexvalencia.es.': ['Hazlo en la web en un minuto (sección Presupuesto) o escríbenos a contacto@higienexvalencia.es.', 'Create one on our website in a minute (Quote section) or email us at contacto@higienexvalencia.es.', 'Faites-le sur le site en une minute (rubrique Devis) ou écrivez-nous à contacto@higienexvalencia.es.', 'Erstellen Sie es in einer Minute auf unserer Website (Bereich Angebot) oder schreiben Sie an contacto@higienexvalencia.es.'],
    "Preus orientatius sense IVA, subjectes a confirmació per part de l'equip comercial.": ['Precios orientativos sin IVA, sujetos a confirmación por parte del equipo comercial.', 'Guide prices excluding VAT, subject to confirmation by our sales team.', "Prix indicatifs hors TVA, sous réserve de confirmation par l'équipe commerciale.", 'Richtpreise ohne MwSt., vorbehaltlich der Bestätigung durch unser Vertriebsteam.'],

    /* ---- certificacions ---- */
    'Document de certificacions': ['Documento de certificaciones', 'Certifications document', 'Document de certifications', 'Zertifizierungsübersicht'],
    'Certificacions': ['Certificaciones', 'Certifications', 'Certifications', 'Zertifizierungen'],
    'Resum per a compres i qualitat': ['Resumen para compras y calidad', 'Summary for purchasing and quality teams', 'Résumé pour les achats et la qualité', 'Übersicht für Einkauf und Qualität'],
    '4 vigents': ['4 vigentes', '4 current', '4 en vigueur', '4 gültig'],
    'Entitats': ['Entidades', 'Bodies', 'Organismes', 'Stellen'],
    'Independents': ['Independientes', 'Independent', 'Indépendants', 'Unabhängig'],
    'Ref. empresa': ['Ref. empresa', 'Company ref.', 'Réf. société', 'Firmenref.'],
    'Validesa': ['Validez', 'Validity', 'Validité', 'Gültigkeit'],
    'Revisió anual': ['Revisión anual', 'Reviewed yearly', 'Révision annuelle', 'Jährliche Prüfung'],
    "Aquest document resumeix les certificacions i garanties d'HIGIENEX perquè el pugueu compartir amb el vostre departament de compres o de qualitat. Tots els certificats complets estan disponibles sota petició.": ['Este documento resume las certificaciones y garantías de HIGIENEX para que podáis compartirlo con vuestro departamento de compras o de calidad. Todos los certificados completos están disponibles bajo petición.', "This document summarises HIGIENEX's certifications and guarantees so you can share it with your purchasing or quality department. Full certificates are available on request.", 'Ce document résume les certifications et garanties de HIGIENEX afin que vous puissiez le partager avec votre service achats ou qualité. Tous les certificats complets sont disponibles sur demande.', 'Dieses Dokument fasst die Zertifizierungen und Garantien von HIGIENEX zusammen, damit Sie es mit Ihrer Einkaufs- oder Qualitätsabteilung teilen können. Alle vollständigen Zertifikate erhalten Sie auf Anfrage.'],
    'Gestió ambiental': ['Gestión ambiental', 'Environmental management', 'Management environnemental', 'Umweltmanagement'],
    'Sistema de gestió ambiental certificat per una entitat independent. Vigent des de 2022.': ['Sistema de gestión ambiental certificado por una entidad independiente. Vigente desde 2022.', 'Environmental management system certified by an independent body. In force since 2022.', 'Système de management environnemental certifié par un organisme indépendant. En vigueur depuis 2022.', 'Von einer unabhängigen Stelle zertifiziertes Umweltmanagementsystem. Gültig seit 2022.'],
    'Registre de biocides UE': ['Registro de biocidas UE', 'EU biocide registration', 'Enregistrement biocides UE', 'EU-Biozidregistrierung'],
    'TP2 i TP4': ['TP2 y TP4', 'PT2 and PT4', 'TP2 et TP4', 'PA2 und PA4'],
    'Desinfectants TP2 (superfícies) i TP4 (contacte alimentari) registrats segons el Reglament de biocides (UE) 528/2012.': ['Desinfectantes TP2 (superficies) y TP4 (contacto alimentario) registrados según el Reglamento de biocidas (UE) 528/2012.', 'PT2 (surfaces) and PT4 (food contact) disinfectants registered under the Biocidal Products Regulation (EU) 528/2012.', 'Désinfectants TP2 (surfaces) et TP4 (contact alimentaire) enregistrés selon le règlement sur les biocides (UE) 528/2012.', 'Desinfektionsmittel PA2 (Oberflächen) und PA4 (Lebensmittelkontakt), registriert nach der Biozidverordnung (EU) 528/2012.'],
    'Homologació HACCP': ['Homologación HACCP', 'HACCP approval', 'Homologation HACCP', 'HACCP-Zulassung'],
    'Línia ALIM': ['Línea ALIM', 'ALIM range', 'Gamme ALIM', 'ALIM-Reihe'],
    "Productes de la línia ALIM homologats per a l'ús en superfícies de contacte alimentari.": ['Productos de la línea ALIM homologados para uso en superficies de contacto alimentario.', 'ALIM range products approved for use on food-contact surfaces.', 'Produits de la gamme ALIM homologués pour les surfaces en contact avec les aliments.', 'Produkte der ALIM-Reihe, zugelassen für Oberflächen mit Lebensmittelkontakt.'],
    '19 patents pròpies': ['19 patentes propias', '19 own patents', '19 brevets propres', '19 eigene Patente'],
    'R+D': ['I+D', 'R&D', 'R&D', 'F&E'],
    "Formulacions desenvolupades i patentades pel laboratori R+D d'HIGIENEX des de 2018.": ['Formulaciones desarrolladas y patentadas por el laboratorio de I+D de HIGIENEX desde 2018.', 'Formulations developed and patented by the HIGIENEX R&D laboratory since 2018.', 'Formulations développées et brevetées par le laboratoire R&D de HIGIENEX depuis 2018.', 'Seit 2018 vom F&E-Labor von HIGIENEX entwickelte und patentierte Rezepturen.'],
    'Declaració': ['Declaración', 'Statement', 'Déclaration', 'Erklärung'],
    "HIGIENEX S.L. declara que la informació d'aquest document és correcta a la data d'emissió i que manté vigents les certificacions indicades.": ['HIGIENEX S.L. declara que la información de este documento es correcta a la fecha de emisión y que mantiene vigentes las certificaciones indicadas.', 'HIGIENEX S.L. declares that the information in this document is correct at the date of issue and that the certifications listed remain in force.', "HIGIENEX S.L. déclare que les informations de ce document sont exactes à la date d'émission et que les certifications indiquées sont en vigueur.", 'HIGIENEX S.L. erklärt, dass die Angaben in diesem Dokument zum Ausstellungsdatum korrekt sind und die genannten Zertifizierungen gültig sind.'],
    'Direcció Tècnica': ['Dirección Técnica', 'Technical Director', 'Direction technique', 'Technische Leitung'],
    'Departament de qualitat · HIGIENEX S.L.': ['Departamento de calidad · HIGIENEX S.L.', 'Quality department · HIGIENEX S.L.', 'Service qualité · HIGIENEX S.L.', 'Qualitätsabteilung · HIGIENEX S.L.'],
    'Certificats complets disponibles sota petició al departament tècnic.': ['Certificados completos disponibles bajo petición al departamento técnico.', 'Full certificates available on request from our technical department.', 'Certificats complets disponibles sur demande auprès du service technique.', 'Vollständige Zertifikate auf Anfrage bei der technischen Abteilung.'],

    /* ---- certificat d'impacte ---- */
    "Certificat d'impacte ambiental": ['Certificado de impacto ambiental', 'Environmental impact certificate', "Certificat d'impact environnemental", 'Umweltbilanz-Zertifikat'],
    'Certificat ECO': ['Certificado ECO', 'ECO certificate', 'Certificat ECO', 'ECO-Zertifikat'],
    'Emès per a {0}': ['Emitido para {0}', 'Issued to {0}', 'Délivré à {0}', 'Ausgestellt für {0}'],
    'Es certifica que': ['Se certifica que', 'This certifies that', 'Il est certifié que', 'Hiermit wird bestätigt, dass'],
    "ha reduït el seu impacte ambiental fent servir productes concentrats HIGIENEX ECO en lloc de producte ja diluït. Aquest és el resultat de les seves comandes:": ['ha reducido su impacto ambiental usando productos concentrados HIGIENEX ECO en lugar de producto ya diluido. Este es el resultado de sus pedidos:', 'has reduced its environmental impact by using HIGIENEX ECO concentrates instead of ready-diluted products. These are the results of its orders:', 'a réduit son impact environnemental en utilisant des concentrés HIGIENEX ECO au lieu de produits déjà dilués. Voici le résultat de ses commandes :', 'hat ihre Umweltbelastung verringert, indem sie HIGIENEX-ECO-Konzentrate statt gebrauchsfertiger Produkte verwendet. Das ist das Ergebnis ihrer Bestellungen:'],
    'Envasos evitats': ['Envases evitados', 'Containers saved', 'Emballages évités', 'Eingesparte Behälter'],
    'Plàstic evitat': ['Plástico evitado', 'Plastic saved', 'Plastique évité', 'Eingesparter Kunststoff'],
    'CO2 evitat (est.)': ['CO2 evitado (est.)', 'CO2 avoided (est.)', 'CO2 évité (est.)', 'Vermiedenes CO2 (gesch.)'],
    'Com es calcula': ['Cómo se calcula', 'How it is calculated', 'Méthode de calcul', 'So wird gerechnet'],
    'Es comparen les comandes reals de productes concentrats amb la quantitat equivalent de producte ja diluït: menys envasos, menys plàstic i menys transport. Xifres orientatives amb finalitat informativa i de comunicació de sostenibilitat.': ['Se comparan los pedidos reales de productos concentrados con la cantidad equivalente de producto ya diluido: menos envases, menos plástico y menos transporte. Cifras orientativas con fines informativos y de comunicación de sostenibilidad.', 'Actual orders of concentrates are compared with the equivalent amount of ready-diluted product: fewer containers, less plastic and less transport. Figures are indicative and for sustainability reporting only.', 'Les commandes réelles de concentrés sont comparées à la quantité équivalente de produit déjà dilué : moins d’emballages, moins de plastique et moins de transport. Chiffres indicatifs à des fins d’information et de communication RSE.', 'Die tatsächlichen Bestellungen von Konzentraten werden mit der entsprechenden Menge gebrauchsfertiger Produkte verglichen: weniger Behälter, weniger Kunststoff, weniger Transport. Richtwerte zu Informations- und Nachhaltigkeitszwecken.'],
    'València, {0}': ['Valencia, {0}', 'Valencia, {0}', 'Valence, {0}', 'Valencia, {0}'],

    /* ---- comanda ---- */
    'Justificant de comanda': ['Justificante de pedido', 'Order confirmation', 'Confirmation de commande', 'Bestellbestätigung'],
    'Comanda': ['Pedido', 'Order', 'Commande', 'Bestellung'],
    'Data de comanda': ['Fecha del pedido', 'Order date', 'Date de commande', 'Bestelldatum'],
    'Lliurament estimat': ['Entrega estimada', 'Estimated delivery', 'Livraison prévue', 'Voraussichtliche Lieferung'],
    'Pagament': ['Pago', 'Payment', 'Paiement', 'Zahlung'],
    'Confirmat': ['Confirmado', 'Confirmed', 'Confirmé', 'Bestätigt'],
    'Total (IVA incl.)': ['Total (IVA incl.)', 'Total (incl. VAT)', 'Total (TVA incl.)', 'Gesamt (inkl. MwSt.)'],
    'Uds.': ['Uds.', 'Qty', 'Qté', 'Menge'],
    'Preu/ut.': ['Precio/ud.', 'Unit price', 'Prix unit.', 'Stückpreis'],
    'Dte.': ['Dto.', 'Disc.', 'Remise', 'Rabatt'],
    'Import': ['Importe', 'Amount', 'Montant', 'Betrag'],
    'Subtotal productes': ['Subtotal productos', 'Products subtotal', 'Sous-total produits', 'Zwischensumme Produkte'],
    'Descomptes per volum': ['Descuentos por volumen', 'Volume discounts', 'Remises sur volume', 'Mengenrabatte'],
    'Descompte per volum': ['Descuento por volumen', 'Volume discount', 'Remise sur volume', 'Mengenrabatt'],
    'Transport': ['Transporte', 'Shipping', 'Livraison', 'Versand'],
    'IVA ({0} %)': ['IVA ({0} %)', 'VAT ({0} %)', 'TVA ({0} %)', 'MwSt. ({0} %)'],
    'PAGAMENT': ['PAGO', 'PAYMENT', 'PAIEMENT', 'ZAHLUNG'],
    'CONFIRMAT': ['CONFIRMADO', 'CONFIRMED', 'CONFIRMÉ', 'BESTÄTIGT'],
    'Hem rebut el pagament. Prepararem la comanda i rebràs un avís quan surti del magatzem.': ['Hemos recibido el pago. Prepararemos el pedido y recibirás un aviso cuando salga del almacén.', 'We have received your payment. We will prepare your order and let you know when it leaves our warehouse.', "Nous avons bien reçu votre paiement. Nous préparons votre commande et vous préviendrons dès qu'elle quittera l'entrepôt.", 'Wir haben Ihre Zahlung erhalten. Wir bereiten Ihre Bestellung vor und benachrichtigen Sie, sobald sie unser Lager verlässt.'],
    'Seguiment de la comanda': ['Seguimiento del pedido', 'Order tracking', 'Suivi de la commande', 'Sendungsverfolgung'],
    'Pots consultar on és la comanda a la web, a Seguiment de comanda, amb el número {0}.': ['Puedes consultar dónde está el pedido en la web, en Seguimiento de pedido, con el número {0}.', 'You can track your order on our website (Order tracking) using number {0}.', 'Vous pouvez suivre votre commande sur le site (Suivi de commande) avec le numéro {0}.', 'Sie können Ihre Bestellung auf unserer Website (Sendungsverfolgung) mit der Nummer {0} verfolgen.'],
    "Aquest document és un justificant de comanda, no una factura. La factura s'emetrà quan s'expedeixi la mercaderia. Per a qualsevol consulta, indica el número de comanda.": ['Este documento es un justificante de pedido, no una factura. La factura se emitirá cuando se expida la mercancía. Para cualquier consulta, indica el número de pedido.', 'This document is an order confirmation, not an invoice. The invoice will be issued when the goods are shipped. Please quote the order number in any enquiry.', "Ce document est une confirmation de commande et non une facture. La facture sera émise à l'expédition de la marchandise. Pour toute question, indiquez le numéro de commande.", 'Dieses Dokument ist eine Bestellbestätigung, keine Rechnung. Die Rechnung wird beim Versand der Ware ausgestellt. Bitte geben Sie bei Rückfragen die Bestellnummer an.'],

    /* ---- pressupost ---- */
    'Pressupost sense compromís': ['Presupuesto sin compromiso', 'Free, no-obligation quote', 'Devis sans engagement', 'Unverbindliches Angebot'],
    'Pressupost': ['Presupuesto', 'Quote', 'Devis', 'Angebot'],
    'Data d’emissió': ['Fecha de emisión', 'Issue date', "Date d'émission", 'Ausstellungsdatum'],
    'Vàlid fins al': ['Válido hasta', 'Valid until', "Valable jusqu'au", 'Gültig bis'],
    '{0} referència': ['{0} referencia', '{0} product', '{0} référence', '{0} Artikel'],
    'A l’atenció de: {0}': ['A la atención de: {0}', 'For the attention of: {0}', "À l'attention de : {0}", 'Zu Händen von: {0}'],
    'Condicions': ['Condiciones', 'Terms', 'Conditions', 'Bedingungen'],
    'Pressupost sense compromís, vàlid fins al {0}.': ['Presupuesto sin compromiso, válido hasta el {0}.', 'No-obligation quote, valid until {0}.', "Devis sans engagement, valable jusqu'au {0}.", 'Unverbindliches Angebot, gültig bis {0}.'],
    'Preus en euros. Descomptes per volum aplicats automàticament.': ['Precios en euros. Descuentos por volumen aplicados automáticamente.', 'Prices in euros. Volume discounts applied automatically.', 'Prix en euros. Remises sur volume appliquées automatiquement.', 'Preise in Euro. Mengenrabatte werden automatisch angewendet.'],
    'Transport de {0} per comanda. IVA del {1} % inclòs al total.': ['Transporte de {0} por pedido. IVA del {1} % incluido en el total.', 'Shipping {0} per order. VAT at {1} % included in the total.', 'Livraison {0} par commande. TVA de {1} % incluse dans le total.', 'Versand {0} pro Bestellung. {1} % MwSt. im Gesamtbetrag enthalten.'],
    'Per confirmar la comanda, indica el número {0} al nostre equip comercial.': ['Para confirmar el pedido, indica el número {0} a nuestro equipo comercial.', 'To confirm the order, quote number {0} to our sales team.', 'Pour confirmer la commande, indiquez le numéro {0} à notre équipe commerciale.', 'Zur Bestätigung der Bestellung nennen Sie unserem Vertrieb die Nummer {0}.'],
    'Vols confirmar-lo o ajustar quantitats?': ['¿Quieres confirmarlo o ajustar cantidades?', 'Want to confirm it or change quantities?', 'Vous souhaitez le confirmer ou modifier les quantités ?', 'Möchten Sie bestätigen oder Mengen ändern?'],
    'Escriu a contacto@higienexvalencia.es o truca al 631 706 398 indicant el número de pressupost.': ['Escribe a contacto@higienexvalencia.es o llama al 631 706 398 indicando el número de presupuesto.', 'Email contacto@higienexvalencia.es or call +34 631 706 398 quoting the quote number.', 'Écrivez à contacto@higienexvalencia.es ou appelez le +34 631 706 398 en indiquant le numéro de devis.', 'Schreiben Sie an contacto@higienexvalencia.es oder rufen Sie +34 631 706 398 an und nennen Sie die Angebotsnummer.'],

    /* ---- emails a clients ---- */
    'El teu pressupost {0} — HIGIENEX': ['Tu presupuesto {0} — HIGIENEX', 'Your quote {0} — HIGIENEX', 'Votre devis {0} — HIGIENEX', 'Ihr Angebot {0} — HIGIENEX'],
    'PRESSUPOST': ['PRESUPUESTO', 'QUOTE', 'DEVIS', 'ANGEBOT'],
    "Aquí tens el pressupost que has preparat a la nostra web. És vàlid durant 30 dies.": ['Aquí tienes el presupuesto que has preparado en nuestra web. Es válido durante 30 días.', 'Here is the quote you prepared on our website. It is valid for 30 days.', 'Voici le devis que vous avez préparé sur notre site. Il est valable 30 jours.', 'Hier ist das Angebot, das Sie auf unserer Website erstellt haben. Es ist 30 Tage gültig.'],
    'Detall del pressupost': ['Detalle del presupuesto', 'Quote details', 'Détail du devis', 'Angebotsdetails'],
    'Empresa': ['Empresa', 'Company', 'Entreprise', 'Firma'],
    'Total (IVA inclòs)': ['Total (IVA incluido)', 'Total (VAT included)', 'Total (TVA incluse)', 'Gesamt (inkl. MwSt.)'],
    'Per confirmar la comanda o canviar quantitats, respon aquest correu o truca’ns al 631 706 398 indicant el número de pressupost.': ['Para confirmar el pedido o cambiar cantidades, responde a este correo o llámanos al 631 706 398 indicando el número de presupuesto.', 'To confirm the order or change quantities, reply to this email or call us on +34 631 706 398 quoting the quote number.', 'Pour confirmer la commande ou modifier les quantités, répondez à cet e-mail ou appelez-nous au +34 631 706 398 en indiquant le numéro de devis.', 'Um die Bestellung zu bestätigen oder Mengen zu ändern, antworten Sie auf diese E-Mail oder rufen Sie uns unter +34 631 706 398 an und nennen Sie die Angebotsnummer.'],
    'Hem rebut la teva comanda {0} — HIGIENEX': ['Hemos recibido tu pedido {0} — HIGIENEX', 'We have received your order {0} — HIGIENEX', 'Nous avons bien reçu votre commande {0} — HIGIENEX', 'Wir haben Ihre Bestellung {0} erhalten — HIGIENEX'],
    'COMANDA CONFIRMADA': ['PEDIDO CONFIRMADO', 'ORDER CONFIRMED', 'COMMANDE CONFIRMÉE', 'BESTELLUNG BESTÄTIGT'],
    'Gràcies per la teva comanda. Ja la estem preparant.': ['Gracias por tu pedido. Ya lo estamos preparando.', 'Thank you for your order. We are already preparing it.', 'Merci pour votre commande. Nous la préparons déjà.', 'Vielen Dank für Ihre Bestellung. Wir bereiten sie bereits vor.'],
    'Detall de la comanda': ['Detalle del pedido', 'Order details', 'Détail de la commande', 'Bestelldetails'],
    'Pots seguir la comanda a la web, a «Seguiment de comanda», amb el número {0}. El justificant en PDF es descarrega en acabar la compra.': ['Puedes seguir el pedido en la web, en «Seguimiento de pedido», con el número {0}. El justificante en PDF se descarga al terminar la compra.', 'You can track the order on our website under “Order tracking” with number {0}. The PDF confirmation downloads when you complete your purchase.', 'Vous pouvez suivre la commande sur le site, rubrique « Suivi de commande », avec le numéro {0}. La confirmation PDF se télécharge à la fin de l’achat.', 'Sie können die Bestellung auf unserer Website unter „Sendungsverfolgung“ mit der Nummer {0} verfolgen. Die PDF-Bestätigung wird am Ende des Kaufs heruntergeladen.'],

    /* ---- dades dels productes (CMP_DATA) ---- */
    'General B2B': ['General B2B', 'General B2B', 'Général B2B', 'Allgemein B2B'],
    'Sanitari / Hospitals': ['Sanitario / Hospitales', 'Healthcare / Hospitals', 'Santé / Hôpitaux', 'Gesundheitswesen / Kliniken'],
    'Indústria alimentària': ['Industria alimentaria', 'Food industry', 'Industrie alimentaire', 'Lebensmittelindustrie'],
    'Hostaleria / Hotels': ['Hostelería / Hoteles', 'Hospitality / Hotels', 'Hôtellerie / Hôtels', 'Gastgewerbe / Hotels'],
    'Oficines / Multisector': ['Oficinas / Multisector', 'Offices / Multi-sector', 'Bureaux / Multisecteur', 'Büros / Branchenübergreifend'],
    'Oficines / Coworking': ['Oficinas / Coworking', 'Offices / Coworking', 'Bureaux / Coworking', 'Büros / Coworking'],
    '×3 (dilució 1:3)': ['×3 (dilución 1:3)', '×3 (1:3 dilution)', '×3 (dilution 1:3)', '×3 (Verdünnung 1:3)'],
    '×2 (dilució 1:2)': ['×2 (dilución 1:2)', '×2 (1:2 dilution)', '×2 (dilution 1:2)', '×2 (Verdünnung 1:2)'],
    'Ús directe': ['Uso directo', 'Ready to use', 'Prêt à l’emploi', 'Gebrauchsfertig'],
    'Biocida UE (TP2/TP4)': ['Biocida UE (TP2/TP4)', 'EU biocide (PT2/PT4)', 'Biocide UE (TP2/TP4)', 'EU-Biozid (PA2/PA4)'],
    'HACCP · Contacte alimentari': ['HACCP · Contacto alimentario', 'HACCP · Food contact', 'HACCP · Contact alimentaire', 'HACCP · Lebensmittelkontakt'],
    'ISO 14001 · QR traçabilitat': ['ISO 14001 · QR trazabilidad', 'ISO 14001 · QR traceability', 'ISO 14001 · Traçabilité QR', 'ISO 14001 · QR-Rückverfolgbarkeit'],
    'Biocida UE · Col·lab. OfiNova': ['Biocida UE · Colab. OfiNova', 'EU biocide · with OfiNova', 'Biocide UE · collab. OfiNova', 'EU-Biozid · mit OfiNova'],
    'Sí, 100%': ['Sí, 100 %', 'Yes, 100 %', 'Oui, 100 %', 'Ja, 100 %'],
    'Sí': ['Sí', 'Yes', 'Oui', 'Ja'],
    'Parcial': ['Parcial', 'Partial', 'Partielle', 'Teilweise'],
    '-70% plàstic': ['-70 % plástico', '-70 % plastic', '-70 % plastique', '-70 % Kunststoff'],
    '-40% plàstic': ['-40 % plástico', '-40 % plastic', '-40 % plastique', '-40 % Kunststoff'],
    'Estàndard': ['Estándar', 'Standard', 'Standard', 'Standard'],
    'Superfícies i sòls generals': ['Superficies y suelos en general', 'General surfaces and floors', 'Surfaces et sols en général', 'Allgemeine Oberflächen und Böden'],
    'Quiròfans, UCI, sanitari crític': ['Quirófanos, UCI, sanitario crítico', 'Operating theatres, ICU, critical care', 'Blocs opératoires, réanimation, soins critiques', 'OP-Säle, Intensivstation, kritische Bereiche'],
    'Cuines industrials, línies de producció': ['Cocinas industriales, líneas de producción', 'Industrial kitchens, production lines', 'Cuisines industrielles, lignes de production', 'Großküchen, Produktionslinien'],
    'Habitacions, zones comunes': ['Habitaciones, zonas comunes', 'Guest rooms, common areas', 'Chambres, parties communes', 'Zimmer, Gemeinschaftsbereiche'],
    'Superfícies amb traçabilitat de lot': ['Superficies con trazabilidad de lote', 'Surfaces with batch traceability', 'Surfaces avec traçabilité des lots', 'Oberflächen mit Chargenrückverfolgung'],
    'Superfícies de contacte freqüent, IoT': ['Superficies de contacto frecuente, IoT', 'High-touch surfaces, IoT', 'Surfaces très touchées, IoT', 'Häufig berührte Oberflächen, IoT'],
  };
  var IDX = { es: 0, en: 1, fr: 2, de: 3 };
  var LOCALE = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE' };

  function idioma() {
    var l = 'ca';
    try { l = localStorage.getItem('hx_lang') || 'ca'; } catch (e) {}
    if (l === 'ar') return 'en';
    return LOCALE[l] ? l : 'ca';
  }
  /* Tradueix un text català a l'idioma actual (o al que s'indiqui) i substitueix {0}, {1}… */
  function T(text) {
    var args = Array.prototype.slice.call(arguments, 1);
    var l = HXT.forcat || idioma();
    var e = D[text];
    var s = l !== 'ca' && e && e[IDX[l]] ? e[IDX[l]] : text;
    return s.replace(/\{(\d)\}/g, function (m, i) { return args[i] != null ? args[i] : m; });
  }
  var HXT = T;
  HXT.idioma = idioma;
  HXT.locale = function () { return LOCALE[HXT.forcat || idioma()]; };
  HXT.data = function (d, opts) { return (d || new Date()).toLocaleDateString(HXT.locale(), opts); };
  HXT.forcat = null;
  window.HXT = HXT;
})();
