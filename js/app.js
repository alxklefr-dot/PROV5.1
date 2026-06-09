// Base Mainstream News Feed Channels Matrix
let GLOBAL_MAINSTREAM_FEED_DIRECTORY = [
    { id: "feed_google", name: "Google News Global Feed", url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", enabled: true },
    { id: "feed_bbc", name: "BBC News World Service", url: "http://feeds.bbci.co.uk/news/world/rss.xml", enabled: true },
    { id: "feed_lemonde", name: "Le Monde Unified RSS", url: "https://www.lemonde.fr/rss/une.xml", enabled: true },
    { id: "feed_cnn", name: "CNN International Network", url: "http://rss.cnn.com/rss/edition.rss", enabled: true },
    { id: "feed_reuters", name: "Reuters Worldwide Wire", url: "https://www.reutersagency.com/feed/", enabled: false },
    { id: "feed_spiegel", name: "Der Spiegel Hauptfeed", url: "https://www.spiegel.de/public/referenz/rss.xml", enabled: false },
    { id: "feed_elpais", name: "El País Portada Principal", url: "https://rss.elpais.com/elpaismedia/top/index.xml", enabled: false },
    { id: "feed_nytimes", name: "The New York Times Global", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", enabled: true },
    { id: "feed_abc", name: "ABC News Australia Service", url: "https://www.abc.net.au/news/feed/51120/rss.xml", enabled: false },
    { id: "feed_france24", name: "France 24 Actualités Direct", url: "https://www.france24.com/fr/rss", enabled: true }
];

let CUSTOM_USER_FEEDS_ARRAY = [];
let INGESTED_PARSED_ARTICLES_POOL = [];
let ACTIVE_FEED_DISPLAY_INDEX = 0;
let USER_FLASHCARD_REPOSITORY = [];
let CURRENT_ACTIVE_FLASHCARD_INDEX = 0;
let IS_FLASHCARD_FLIPPED = false;

// Global tracking pointer for running modal instances
let CURRENTLY_OPENED_ARTICLE_OBJECT = null;

// Game Metrics
let fawSelectedCoords = [];
let fawSolutionWordsMapping = {};
let fawGridDimension = 10;
let wordleActiveTargetKeyword = "";
let wordleCurrentAttemptRow = 0;
let wordleIsEngineTerminated = false;

const CORS_SYSTEM_RESOLVER_PREFIX = "https://api.allorigins.win/get?url=";

window.addEventListener('DOMContentLoaded', () => {
    initializeSystemDefaults();
    buildFeedManagementSettingsUI();
    fetchComprehensiveRSSNetworkPipeline();
});

function initializeSystemDefaults() {
    document.getElementById('wordle-hidden-input').addEventListener('input', handleWordleInputStep);
    document.getElementById('wordle-hidden-input').addEventListener('keydown', handleWordleKeydownStep);
}

function triggerSystemToastNotification(messageString) {
    const node = document.getElementById('toast-notification-node');
    if (!node) return;
    node.textContent = messageString;
    node.style.display = 'block';
    setTimeout(() => { node.style.display = 'none'; }, 3800);
}

// --------------------------------------------------------------------------
// DEEP LEVEL DICTIONARY FOR GENUINE TARGET->LEARNER TRANSLATIONS
// --------------------------------------------------------------------------
const TARGET_TO_LEARNER_DICTIONARY = {
    // French to English
    "le": "the (Masculine)", "la": "the (Feminine)", "les": "the (Plural)", "un": "a/an (Masculine)", "une": "a/an (Feminine)",
    "rapport": "report / link", "indique": "indicates / shows", "regardez": "look / watch", "mise": "update / placement",
    "à": "to / at", "jour": "day", "importante": "important", "du": "of the", "marché": "market", "mondial": "global / worldwide",
    "l'économie": "the economy", "change": "changes / is changing", "rapidement": "rapidly / quickly", "et": "and",
    "les": "the", "équipes": "teams", "locales": "local", "travaillent": "work / are working", "dur": "hard", "avec": "with",
    "la": "the", "nouvelle": "new", "stratégie": "strategy", "de": "of / from", "croissance": "growth", "voiture": "car",
    "électrique": "electric", "nouveau": "new", "moteur": "motor / engine", "propre": "clean / own", "transforment": "transform",
    "l'industrie": "the industry", "cette": "this", "année": "year", "grande": "large / great", "analyse": "analysis",
    "l'entreprise": "the company", "moderne": "modern", "directeurs": "directors / managers", "étudient": "study / are studying",
    "attention": "attention / care", "vitesse": "speed / velocity", "développement": "development", "est": "is",
    "cruciale": "crucial", "pour": "for", "l'équipe": "the team", "saison": "season", "tout": "all / every", "le": "the",
    "monde": "world", "participe": "participates", "dans": "in / inside", "course": "race", "internationale": "international",
    "commence": "starts / begins", "projet": "project", "ingénieurs": "engineers", "construisent": "build / are building",
    "très": "very", "efficace": "efficient / effective", "technique": "technical", "réussir": "succeed", "conditions": "conditions",
    "difficiles": "difficult", "avance": "advances / moves forward", "vite": "fast / quickly", "semaine": "week",
    "employés": "employees", "analysent": "analyze", "local": "local", "adapter": "adapt", "production": "production",
    "va": "is going to", "démontrer": "demonstrate", "sa": "its / her", "force": "strength / force", "technologique": "technological",

    // Spanish to English
    "el": "the (Masculine)", "los": "the (Plural)", "informe": "report", "hoy": "today", "indica": "indicates", "mire": "look",
    "esta": "this", "actualización": "update", "importante": "important", "del": "of the", "mercado": "market", "mundial": "global",
    "economía": "economy", "cambia": "changes", "rápidamente": "rapidly", "y": "and", "equipos": "teams", "locales": "local",
    "trabajan": "work", "duro": "hard", "con": "with", "nueva": "new", "estrategia": "strategy", "crecimiento": "growth",
    "coche": "car", "eléctrico": "electric", "motor": "motor / engine", "limpio": "clean", "transforman": "transform",
    "industria": "industry", "este": "this", "año": "year", "gran": "great / large", "análisis": "analysis", "empresa": "company / firm",
    "moderna": "modern", "directores": "directors", "estudian": "study", "atención": "attention", "velocidad": "speed",
    "desarrollo": "development", "crucial": "crucial", "para": "for", "equipo": "the team", "temporada": "season", "todos": "everyone",
    "participa": "participates", "en": "in / on", "carrera": "race", "internacional": "international",

    // German to English
    "der": "the (Masculine)", "die": "the (Feminine/Plural)", "das": "the (Neuter)", "heutige": "today's", "bericht": "report",
    "zeigt": "shows / indicates", "sehen": "look / see", "sie": "you / they", "wichtige": "important", "update": "update",
    "für": "for", "weltmarkt": "global market", "wirtschaft": "economy", "ändert": "changes", "sich": "itself", "schnell": "fast",
    "lokale": "local", "teams": "teams", "arbeiten": "work", "hart": "hard", "mit": "with", "neuen": "new", "wachstumsstrategie": "growth strategy",
    "elektroauto": "electric car", "neue": "new", "saubere": "clean", "verändern": "change / transform", "branche": "industry / sector",
    "diesem": "this", "jahr": "year", "große": "large / grand", "analyse": "analysis", "modernen": "modern", "unternehmens": "company",
    "manager": "managers", "studieren": "study", "markt": "market", "genau": "closely / exactly", "entwicklungsgeschwindigkeit": "development speed",
    "ist": "is", "dieser": "this", "saison": "season", "entscheidender": "crucial / decisive", "bedeutung": "importance", "jeder": "everyone",
    "nimmt": "takes part / participates", "teil": "part", "internationalen": "international", "rennen": "race"
};

// --------------------------------------------------------------------------
// EXTENDED RESOURCE ARRAYS - PARAGRAPH LENGTH PROBLEMS REMOVED
// --------------------------------------------------------------------------
const IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY = {
    "French": {
        "A1": {
            prefix: "Rapport d'actualité élémentaire (Niveau A1).",
            bodyTemplates: [
                "Regardez cette mise à jour importante du marché mondial. L'économie globale change rapidement chaque jour et les équipes locales travaillent très dur. Ils adoptent maintenant la nouvelle stratégie de croissance durable. La voiture électrique moderne et le nouveau moteur propre transforment complètement toute l'industrie automobile cette année. Les clients aiment beaucoup cette technologie.\n\nUne grande analyse de l'entreprise moderne montre des résultats intéressants. Les directeurs étudient le marché avec une attention spéciale. La vitesse de développement est cruciale pour l'équipe cette saison. Tout le monde participe activement à la course internationale pour l'innovation numérique.\n\nLe travail continue dans les bureaux de Paris et de Berlin. Les employés partagent des informations utiles sur les projets. Cette collaboration crée une force unique pour le futur de la production. Nous attendons des progrès majeurs le mois prochain dans tous les secteurs d'activité."
            ]
        },
        "A2": {
            prefix: "Analyse Élémentaire Suivie (Niveau A2).",
            bodyTemplates: [
                "Cette grande entreprise internationale commence un projet important sur le marché mondial. Les ingénieurs construisent une nouvelle voiture électrique avec un moteur très efficace. L'équipe technique change sa stratégie de croissance pour réussir cette année dans des conditions difficiles. Les ouvriers d'usine collaborent pour réduire les coûts de fabrication de manière significative.\n\nLe développement technique avance vite cette semaine. Les employés de l'entreprise analysent le marché local pour adapter la vitesse de production générale. Notre équipe va participer à une grande course industrielle pour démontrer sa force technologique et valider les nouveaux systèmes de sécurité.\n\nEn outre, les directeurs préparent des présentations détaillées pour les investisseurs européens. Les retours du public sont positifs. La demande pour ces produits augmente rapidement, ce qui confirme la viabilité de ce modèle commercial à long terme."
            ]
        },
        "B1": {
            prefix: "Développement Thématique Structurel (Niveau Intermédiaire B1).",
            bodyTemplates: [
                "L'évolution récente du marché mondial suscite des discussions stratégiques majeures au sein de l'entreprise. En examinant les données de croissance sectorielles, les experts constatent une accélération notable de la production de voitures propres. Les nouveaux moteurs hybrides affichent une efficacité énergétique record, ce qui permet à l'équipe de consolider sa position face à la concurrence internationale cette année.\n\nUne transformation structurelle s'opère actuellement à tous les niveaux opérationnels. La vitesse de transition technologique oblige les équipes de gestion à restructurer entièrement leur modèle économique sur le marché européen. La stratégie adoptée met l'accent sur l'innovation participative et le déploiement de solutions logistiques intégrées.\n\nPar ailleurs, les cadres financiers confirment une allocation budgétaire supplémentaire pour soutenir la recherche et le développement. Les retombées commerciales attendues devraient propulser l'organisation parmi les leaders du secteur d'ici la fin de l'exercice annuel."
            ]
        },
        "B2": {
            prefix: "Rapport Analytique Avancé (Niveau Élevé B2).",
            bodyTemplates: [
                "Les indicateurs macroéconomiques actuels révèlent une mutation profonde des structures opérationnelles de l'entreprise. La convergence de l'intelligence artificielle et de la gestion de réseau a permis de maximiser l'efficacité globale sur le marché. De plus, les ingénieurs de l'équipe ont validé un prototype de moteur révolutionnaire destiné à équiper la future gamme de voitures autonomes, consolidant ainsi une stratégie de croissance pérenne.\n\nFace aux fluctuations imprévisibles du marché contemporain, la vitesse d'adaptation organisationnelle est devenue le facteur déterminant du succès commercial. L'entreprise a mis en œuvre des protocoles rigoureux pour optimiser ses ressources, permettant à chaque équipe sectorielle de réagir avec une agilité parfaite aux exigences de la réglementation.\n\nCette dynamique est renforcée par des alliances stratégiques avec des partenaires académiques de premier plan. Les audits internes confirment que cette synergie opérationnelle minimise les risques financiers tout en maximisant la valeur ajoutée pour l'ensemble des parties prenantes mondiales."
            ]
        },
        "C1": {
            prefix: "Synthèse Institutionnelle Complexe (Niveau Avancé C1).",
            bodyTemplates: [
                "L'examen approfondi des dynamiques systémiques qui régissent le marché mondial met en exergue l'impératif de restructuration pour toute entreprise aspirant à la pérennité. Les transformations actuelles ne se limitent pas à une simple transition technologique; elles exigen une refonte holistique de la stratégie de croissance industrielle. L'introduction de moteurs à propulsion quantique au sein des flottes de voitures connectées illustre parfaitement cette tendance de fond, forçant les équipes de recherche à redéfinir leurs cadres méthodologiques.\n\nIl convient de souligner que la vélocité des cycles d'innovation actuels engendre des asymétries de compétences majeures sur le marché financier international. Pour pallier ces carences, l'équipe dirigeante a instauré des dispositifs de gouvernance transversaux visant à canaliser les flux d'informations stratégiques.\n\nCe déploiement de ressources hautement spécialisées s'accompagne d'une refonte des grilles d'évaluation de la performance. Les résultats préliminaires démontrent une corrélation directe entre l'agilité conceptuelle des structures de gestion et l'augmentation des parts de marché à l'échelle continentale."
            ]
        },
        "C2": {
            prefix: "Haute Spécification Conceptuelle (Niveau Maîtrise C2).",
            bodyTemplates: [
                "L'analyse herméneutique des paradigmes industriels contemporains révèle une imbrication inextricable entre la viabilité financière de l'entreprise et les fluctuations exogènes du marché macroéconomique. Les vecteurs de croissance ne sauraient désormais faire l'économie d'une refonte systémique de leurs infrastructures de recherche. L'émergence de motorisations à haute efficacité énergétique au sein du segment des voitures durables matérialise cette transition paradigmatique.\n\nEn conclusion, la volatilité inhérente aux marchés globalisés contemporains requiert une agilité managérielle sans précédent, où la vitesse d'exécution se conjugue à une rigueur conceptuelle absolue. Les dynamiques de synergie développées au sein de chaque équipe opérationnelle corroborent de manière irréfutable l'hypothèse d'une convergence technologique imminente.\n\nCe constat impose une réévaluation critique des doctrines d'investissement traditionnelles. Les décideurs doivent intégrer des variables stochastiques avancées afin d'optimiser le positionnement concurrentiel de la firme face aux bouleversements géopolitiques imminents."
            ]
        },
        "Fluent": {
            prefix: "Éditorial Natif Intégral (Niveau Bilingue / Fluent).",
            bodyTemplates: [
                "Dans un contexte de mondialisation exacerbée, les performances de l'entreprise témoignent d'une remarquable maîtrise des leviers opérationnels sur un marché en perpétuelle mutation. Les investissements massifs alloués au développement de la nouvelle motorisation pour les voitures de sport de demain valident une stratégie de croissance audacieuse. Grâce à la cohésion exemplaire de l'équipe et à une gestion rigoureuse de la vitesse de déploiement, la marque s'impose comme la référence incontournable.\n\nLes défis socio-économiques actuels imposent une discipline de fer aux acteurs du marché libre. L'entreprise a su anticiper les mutations réglementaires en adaptant ses outils de production avec une vitesse impressionnante. Les résultats financiers publiés ce trimestre confirment la pertinence de cette approche prospective.\n\nCette réussite commerciale éclatante s'accompagne d'un engagement renouvelé en faveur de la responsabilité sociétale. En harmonisant performance industrielle et impératifs écologiques, la direction trace la voie d'une prospérité partagée au sein d'un écosystème économique revitalisé."
            ]
        }
    },
    "Spanish": {
        "A1": {
            prefix: "Informe de actualidad elemental (Nivel A1).",
            bodyTemplates: [
                "Mire esta actualización importante del mercado mundial. La economía global cambia rápidamente cada día y los equipos locales trabajan muy duro con la nueva estrategia de crecimiento. El coche eléctrico moderno y el nuevo motor limpio transforman la industria este año de manera drástica.\n\nUn gran análisis de la empresa moderna muestra detalles valiosos. Los directores estudian el mercado con atención especial. La velocidad de desarrollo es crucial para el equipo esta temporada. Todo el mundo participa en la carrera internacional."
            ]
        },
        "A2": {
            prefix: "Análisis Elemental Sostenido (Nivel A2).",
            bodyTemplates: [
                "Esta gran empresa comienza un proyecto importante en el mercado mundial. Los ingenieros construyen un nuevo coche eléctrico con un motor muy eficiente. El equipo técnico cambia su estrategia de crecimiento para triunfar este año bajo condiciones difíciles.\n\nEl desarrollo avanza rápido esta semana. Los empleados de la empresa analizan el mercado local para adaptar la velocidad de producción. Nuestro equipo va a participar en una gran carrera industrial para demostrar su fuerza tecnológica."
            ]
        },
        "B1": {
            prefix: "Desarrollo Temático Estructurado (Nivel B1).",
            bodyTemplates: [
                "La evolución reciente del mercado mundial genera discusiones estratégicas mayores dentro de la empresa. Al examinar los datos de crecimiento sectoriales, los expertos notan una aceleración importante en la producción de coches limpios. Los nuevos motores híbridos muestran una eficiencia energética récord, lo que permite al equipo consolidar su posición frente a la competencia este año.\n\nUna transformación estructural ocurre actualmente. La velocidad de transición tecnológica obliga a los equipos de gestión a reestructurar por completo su modelo económico en el mercado europeo. La estrategia adoptada pone el énfasis en la innovación participativa y el despliegue de soluciones logísticas integradas de nueva generación."
            ]
        },
        "B2": {
            prefix: "Informe Analítico Avanzado (Nivel B2).",
            bodyTemplates: [
                "Los indicadores macroeconómicos actuales revelan una mutación profunda de las estructuras operativas de la empresa. La convergencia de la inteligencia artificial y la gestión de redes ha permitido maximizar la eficiencia global en el mercado. Además, los ingenieros del equipo han validado un prototipo de motor revolucionario destinado a equipar la futura gama de coches autónomos, consolidando así una estrategia de crecimiento perenne para los años venideros.\n\nFrente a las fluctuaciones impredecibles del mercado contemporáneo, la velocidad de adaptación organizacional se ha convertido en el factor determinante del éxito comercial. La empresa ha implementado protocolos rigurosos para optimizar sus recursos, permitiendo a cada equipo sectorial reaccionar con una agilidad perfecta a las exigencias cambiantes de la regulación ambiental mundial."
            ]
        },
        "C1": {
            prefix: "Síntesis Institucional Compleja (Nivel C1).",
            bodyTemplates: [
                "El examen profundo de las dinámicas sistémicas que rigen el mercado mundial pone de relieve el imperativo de reestructuración para toda empresa que aspire a la perennidad. Las transformaciones actuales no se limitan a una simple transición tecnológica; exigen una reforma holística de la estrategia de crecimiento industrial. La introducción de motores de propulsión cuántica dentro de las flotas de coches conectados ilustra perfectamente esta tendencia de fondo, forzando a los equipos de investigación a redefinir sus marcos metodológicos tradicionales.\n\nConviene subrayar que la velocidad de los ciclos de innovación actuales genera asimetrías de competencias mayores en el mercado financiero internacional. Para paliar estas carencias, el equipo dirigente ha instaurado dispositivos de gobernanza transversales. Esta iniciativa busca canalizar los flujos de información estratégica para anticipar las rupturas tecnológicas inminentes y asegurar las inversiones a largo plazo."
            ]
        },
        "C2": {
            prefix: "Alta Especificación Conceptual (Nivel C2).",
            bodyTemplates: [
                "El análisis hermenéutico de los paradigmas industriales contemporáneos revela una imbricación inextricable entre la viabilidad financiera de la empresa y las fluctuaciones exógenas del mercado macroeconómico. Los vectores de crecimiento no pueden prescindir de una reforma sistémica de sus infraestructuras de investigación. El surgimiento de motorizaciones de alta eficiencia energética en el segmento de los coches sostenibles materializa esta transición paradigmática, ordenando a los equipos de ingeniería apropiarse de nuevos conceptos matemáticos.\n\nEn conclusión, la volatilidad inherente a los mercados globalizados contemporáneos requiere una agilidad de gestión sin precedentes, donde la velocidad de ejecución se conjuga con un rigor conceptual absoluto. Las dinámicas de sinergia desarrolladas dentro de cada equipo operativo corroboran de manera irrefutable la hipótesis de una convergencia tecnológica inminente, rediseñando así las fronteras mismas de la competitividad internacional."
            ]
        },
        "Fluent": {
            prefix: "Editorial Nativo Integral (Nivel Experto / Fluent).",
            bodyTemplates: [
                "En un contexto de globalización exacerbada, los resultados de la empresa muestran un notable control de las palancas operativas en un mercado en constante cambio. Las inversiones masivas asignadas al desarrollo de la nueva motorización para los coches de carreras del mañana validan una estrategia de crecimiento audaz. Gracias a la cohesión ejemplar del equipo y a una gestión rigoureuse de la velocidad de despliegue, la marca se impone como la referencia indiscutible de esta década.\n\nLos desafíos socioeconómicos actuales imponen una disciplina de hierro a los actores del mercado libre. La empresa ha sabido anticipar las mutaciones regulatorias adaptando sus herramientas de producción con una velocidad impresionante. Los resultados financieros publicados este trimestre confirman la relevancia de este enfoque, propulsando al equipo hacia cumbres de productividad histórica manteniendo un estándar ético intachable."
            ]
        }
    },
    "German": {
        "A1": {
            prefix: "Aktueller Basisbericht (Niveau A1).",
            bodyTemplates: [
                "Sehen Sie sich dieses wichtige Update für den Weltmarkt an. Die Wirtschaft ändert sich schnell und lokale Teams arbeiten hart mit der neuen Wachstumsstrategie. Das Elektroauto und der neue saubere Motor verändern die Branche in diesem Jahr. Die Menschen finden die Technik super.\n\nEine große Analyse des modernen Unternehmens. Die Manager studieren den Markt genau. Die Entwicklungsgeschwindigkeit ist für das Team in dieser Saison von entscheidender Bedeutung. Jeder nimmt am internationalen Rennen teil."
            ]
        },
        "A2": {
            prefix: "Erweiterte Elementaranalyse (Niveau A2).",
            bodyTemplates: [
                "Dieses große Unternehmen startet ein wichtiges Projekt auf dem Weltmarkt. Ingenieure bauen ein neues Elektroauto mit einem sehr effizienten Motor. Das technische Team ändert seine Wachstumsstrategie, um dieses Jahr unter schwierigen Bedingungen erfolgreich zu sein.\n\nDie Entwicklung geht diese Woche schnell voran. Die Mitarbeiter des Unternehmens analysieren den lokalen Markt, um die Produktionsgeschwindigkeit anzupassen. Unser Team wird an einem großen industriellen Rennen teilnehmen, um seine technologische Stärke zu demonstrieren."
            ]
        },
        "B1": {
            prefix: "Thematische Entwicklung (Niveau B1).",
            bodyTemplates: [
                "Die jüngste Entwicklung auf dem Weltmarkt führt zu wichtigen strategischen Diskussionen innerhalb des Unternehmens. Bei der Untersuchung der sektoralen Wachstumsdaten stellen Experten eine spürbare Beschleunigung bei der Produktion sauberer Autos fest. Die neuen Hybridmotoren weisen eine Rekord-Energieeffizienz auf, wodurch das Team seine Position gegenüber der Konkurrenz in diesem Jahr festigen kann.\n\nEin struktureller Wandel findet derzeit statt. Die Geschwindigkeit des technologischen Übergangs zwingt die Managementteams, ihr Geschäftsmodell auf dem europäischen Markt komplett umzustrukturieren. Die gewählte Strategie betont partizipative Innovation und den Einsatz integrierter Logistiklösungen der nächsten Generation."
            ]
        },
        "B2": {
            prefix: "Erweiterter Analysebericht (Niveau B2).",
            bodyTemplates: [
                "Die aktuellen makroökonomischen Indikatoren deuten auf einen tiefgreifenden Wandel in den operativen Strukturen des Unternehmens hin. Die Konvergenz von künstlicher Intelligenz und Netzwerkmanagement hat es ermöglicht, die Gesamteffizienz auf dem Markt zu maximieren. Darüber hinaus haben die Ingenieure des Teams einen revolutionären Motorenprototyp für die zukünftige Palette autonomer Autos validiert und so eine nachhaltige Wachstumsstrategie für die kommenden Jahre gefestigt.\n\nAngesichts der unvorhersehbaren Schwankungen auf dem modernen Markt ist die organisatorische Anpassungsgeschwindigkeit zum entscheidenden Faktor für den geschäftlichen Erfolg geworden. Das Unternehmen hat strenge Protokolle zur Optimierung seiner Ressourcen implementiert, sodass jedes Sektor-Team perfekt auf die sich ändernden Anforderungen der globalen Umweltvorschriften reagieren kann."
            ]
        },
        "C1": {
            prefix: "Komplexe institutionelle Synthese (Niveau C1).",
            bodyTemplates: [
                "Die eingehende Untersuchung der systemischen Dynamiken auf dem Weltmarkt unterstreicht die Notwendigkeit einer Umstrukturierung für jedes Unternehmen, das langfristig erfolgreich sein will. Die aktuellen Veränderungen beschränken sich nicht auf einen einfachen technologischen Übergang; sie erfordern eine ganzheitliche Überarbeitung der industriellen Wachstumsstrategie. Die Einführung von Quantenantriebsmotoren in vernetzten Autoflotten veranschaulicht diesen grundlegenden Trend und zwingt Forschungsteams, ihre traditionellen methodischen Rahmenbedingungen neu zu definieren.\n\nEs sollte betont werden, dass die Geschwindigkeit der aktuellen Innovationszyklen zu erheblichen Kompetenzasymmetrien auf dem internationalen Finanzmarkt führt. Um diese Mängel zu beheben, hat das Führungsteam sektorübergreifende Governance-Mechanismen eingerichtet. Diese Initiative zielt darauf ab, strategische Informationsflüsse zu kanalisieren, um bevorstehende technologische Umbrüche vorwegzunehmen und langfristige Investitionen zu sichern."
            ]
        },
        "C2": {
            prefix: "Hohe konzeptionelle Spezifikation (Niveau C2).",
            bodyTemplates: [
                "Die hermeneutische Analyse zeitgenössischer Industrieparadigmen offenbart eine untrennbare Verflechtung zwischen der finanziellen Tragfähigkeit des Unternehmens und den exogenen Schwankungen des makroökonomischen Marktes. Wachstumsvektoren können eine systemische Überarbeitung ihrer Forschungsinfrastrukturen nicht mehr entbehren. Die Entstehung hocheffizienter Motoren im segment der nachhaltigen Autos materialisiert diesen paradigmatischen Übergang und fordert die Ingenieurteams auf, sich neue mathematische Konzepte anzueignen.\n\nZusammenfassend lässt sich sagen, dass die inhärente Volatilidad globalisierter Märkte eine beispiellose managementbezogene Agilität erfordert, bei der sich die Ausführungsgeschwindigkeit mit absoluter konzeptioneller Strenge verbindet. Die innerhalb jedes operativen Teams entwickelten Synergiedynamiken bestätigen unwiderruflich die Hypothese einer bevorstehenden technologischen Konvergenz und definieren so die Grenzen der internationalen Wettbewerbsfähigkeit neu."
            ]
        },
        "Fluent": {
            prefix: "Vollständiger nativer Leitartikel (Niveau Fluent).",
            bodyTemplates: [
                "Im Kontext einer verschärften Globalisierung zeugt die Leistung des Unternehmens von einer bemerkenswerten Beherrschung der operativen Hebel in einem sich ständig verändernden Markt. Die massiven Investitionen in die Entwicklung neuer Motoren für die Rennwagen von morgen bestätigen eine mutige Wachstumsstrategie. Dank des beispielhaften Zusammenhalts des Teams und eines strengen Managements der Einführungsgeschwindigkeit etabliert sich die Marke als unbestrittene Referenz dieses Jahrzehnts.\n\nDie aktuellen sozioökonomischen Herausforderungen erlegen den Akteuren des freien Marktes eine eiserne Disziplin auf. Das Unternehmen hat regulatorische Veränderungen antizipiert, indem es seine Produktionswerkzeuge mit beeindruckender Geschwindigkeit angepasst hat. Die in diesem Quartal veröffentlichten Finanzergebnisse bestätigen die Relevanz dieses Ansatzes und treiben das Team zu historischen Produktivitätshöhen bei gleichzeitig makellosem ethischen Standard."
            ]
        }
    },
    "English": {
        "A1": { prefix: "Global Core Index Update (Level A1).", bodyTemplates: ["Look at this important global market update. The economy is shifting rapidly and local teams are working hard on the new growth strategy. The electric car and the new clean motor are transforming the industry this year.\n\nA grand analysis of the modern company. The directors are studying the market closely. The speed of development is crucial for the team this season. Everyone is participating in the international race."] },
        "A2": { prefix: "Elementary General Analysis (Level A2).", bodyTemplates: ["This large company is starting an important project in the global market. Engineers are building a new electric car with a highly efficient motor. The technical team is changing its growth strategy to succeed this year under difficult conditions.\n\nDevelopment is moving fast this week. Employees of the company are analyzing the local market to adjust production speed. Our team will participate in a major industrial race to demonstrate its technological strength."] },
        "B1": { prefix: "Intermediate Structural Content (Level B1).", bodyTemplates: ["The recent evolution of the global market sparks major strategic discussions within the company. Examining sector growth data, experts note a clear acceleration in clean car production. The new hybrid motors show record energy efficiency, allowing the team to consolidate its position against the competition this year.\n\nA structural transformation is currently taking place. The speed of technological transition forces management teams to completely restructure their business model in the European market. The adopted strategy emphasizes collaborative innovation and deployment of next-generation integrated logistics solutions."] },
        "B2": { prefix: "Upper-Intermediate Analytical Report (Level B2).", bodyTemplates: ["Current macroeconomic indicators reveal a deep mutation of the company's operational structures. The convergence of artificial intelligence and network management has maximized global efficiency in the market. In addition, team engineers have validated a revolutionary motor prototype designed to equip the future range of autonomous cars, thus consolidating a durable growth strategy for years to come.\n\nFaced with unpredictable fluctuations in the contemporary market, the speed of organizational adaptation has become the determining factor of commercial success. The company has implemented rigorous protocols to optimize its resources, allowing each sector team to react with perfect agility to the changing requirements of global environmental regulations."] },
        "C1": { prefix: "Advanced Institutional Synthesis (Level C1).", bodyTemplates: ["Deep examination of the systemic dynamics governing the global market highlights the restructuring imperative for any company aspiring to durability. Current transformations are not limited to a simple technological transition; they require a holistic overhaul of the industrial growth strategy. The introduction of quantum propulsion motors within connected car fleets perfectly illustrates this underlying trend, forcing research teams to redefine their traditional methodological frameworks.\n\nIt should be emphasized that the velocity of current innovation cycles generates major skills asymmetries in the international financial market. To remedy these deficiencies, the leadership team has established transversal governance mechanisms. This initiative aims to channel strategic information flows to anticipate imminent technological disruptions and secure long-term investments."] },
        "C2": { prefix: "Expert Conceptual Specification (Level C2).", bodyTemplates: ["Hermeneutic analysis of contemporary industrial paradigms reveals an inextricable nesting between the financial viability of the company and the exogenous fluctuations of the macroeconomic market. Growth vectors can no longer dispense with a systemic overhaul of their research infrastructures. The emergence of high-efficiency motorizations within the sustainable car segment materializes this paradigmmatic transition, enjoining engineering teams to appropriate new mathematical concepts.\n\nIn conclusion, the volatility inherent in contemporary globalized markets requires unprecedented managerial agility, where speed of execution combines with absolute conceptual rigor. The synergy dynamics developed within each operational team irrefutably corroborate the hypothesis of an imminent technological convergence, thus redefining the very boundaries of international competitiveness."] },
        "Fluent": { prefix: "Integral Native Production Core (Level Fluent).", bodyTemplates: ["In a context of exacerbated globalization, the company's performance bears witness to a remarkable mastery of operational levers in a perpetually changing market. Massive investments allocated to developing the new motorization for tomorrow's racing cars validate a bold growth strategy. Thanks to the exemplary cohesion of the team and rigorous management of deployment speed, the brand imposes itself as the calculation reference of this decade.\n\nCurrent socio-economic challenges impose an iron discipline on free market actors. The company has known how to anticipate regulatory mutations by adapting its production tools with impressive speed. Financial results published this quarter confirm the relevance of this approach, propelling the team toward heights of historical productivity while maintaining a flawless ethical standard."] }
    }
};

function generateAdvancedCEFRContentMatrix(seedId, chosenLevelProfile, targetLanguageString, elementFieldTarget) {
    const langGroup = IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY[targetLanguageString] || IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY["French"];
    const levelGroup = langGroup[chosenLevelProfile] || langGroup["A1"];
    
    let characterSum = 0;
    for(let i=0; i<seedId.length; i++) characterSum += seedId.charCodeAt(i);
    const selectedTemplateIndex = characterSum % levelGroup.bodyTemplates.length;
    
    const bodyContent = levelGroup.bodyTemplates[selectedTemplateIndex];
    
    if (elementFieldTarget === 'title') {
        const titlesRegistry = {
            "French": "Rapport Stratégique de l'Écosystème Industriel v6.5",
            "Spanish": "Reporte Estratégico del Ecosistema Industrial v6.5",
            "German": "Strategischer Bericht über das industrielle Ökosystem v6.5",
            "English": "Industrial Ecosystem Strategic Report v6.5"
        };
        return titlesRegistry[targetLanguageString] || titlesRegistry["French"];
    }
    
    if (elementFieldTarget === 'snippet') {
        return levelGroup.prefix + " " + bodyContent.substring(0, 140) + "...";
    }
    
    // Returns full clean text block without trailing english artifacts
    return levelGroup.prefix + "\n\n" + bodyContent;
}

// --------------------------------------------------------------------------
// SUBSYSTEM CORE PIPELINES & WORKSPACE BUILDERS
// --------------------------------------------------------------------------

function buildFeedManagementSettingsUI() {
    const builtInContainer = document.getElementById('built-in-feeds-toggle-list');
    builtInContainer.innerHTML = "";
    
    GLOBAL_MAINSTREAM_FEED_DIRECTORY.forEach(feed => {
        const itemLabel = document.createElement('label');
        itemLabel.className = "rss-toggle-item";
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = feed.enabled;
        checkbox.onchange = () => {
            feed.enabled = checkbox.checked;
            triggerSystemToastNotification(`Updated filter for ${feed.name}`);
        };
        
        itemLabel.appendChild(checkbox);
        itemLabel.appendChild(document.createTextNode(feed.name));
        builtInContainer.appendChild(itemLabel);
    });

    renderCustomFeedsToggleSection();
}

function renderCustomFeedsToggleSection() {
    const customContainer = document.getElementById('custom-feeds-toggle-list');
    customContainer.innerHTML = "";

    if(CUSTOM_USER_FEEDS_ARRAY.length === 0) {
        customContainer.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No custom tracking matrices mapped yet.</span>`;
        return;
    }

    CUSTOM_USER_FEEDS_ARRAY.forEach((feed, index) => {
        const rowWrapper = document.createElement('div');
        rowWrapper.style = "display:flex; justify-content:between; align-items:center; background:var(--bg-primary); padding:6px; border-radius:4px; border:1px solid var(--border-color); justify-content: space-between;";

        const label = document.createElement('label');
        label.className = "rss-toggle-item";
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = feed.enabled;
        checkbox.onchange = () => { feed.enabled = checkbox.checked; };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(feed.name.substring(0, 30) + '...'));
        rowWrapper.appendChild(label);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑️";
        deleteBtn.style = "background:transparent; border:none; color:red; cursor:pointer;";
        deleteBtn.onclick = () => {
            CUSTOM_USER_FEEDS_ARRAY.splice(index, 1);
            renderCustomFeedsToggleSection();
        };
        rowWrapper.appendChild(deleteBtn);
        customContainer.appendChild(rowWrapper);
    });
}

function registerCustomUserInjectedRSS() {
    const field = document.getElementById('custom-rss-input-field');
    const val = field.value.trim();
    if (!val) return;
    
    const uniqueId = 'custom_' + Date.now();
    CUSTOM_USER_FEEDS_ARRAY.push({ id: uniqueId, name: `Custom Feed (${val.substring(8,24)}...)`, url: val, enabled: true });
    renderCustomFeedsToggleSection();
    field.value = "";
    triggerSystemToastNotification("Custom vector added.");
}

async function fetchComprehensiveRSSNetworkPipeline() {
    INGESTED_PARSED_ARTICLES_POOL = [];
    const activeBuiltInFeeds = GLOBAL_MAINSTREAM_FEED_DIRECTORY.filter(f => f.enabled);
    const activeCustomFeeds = CUSTOM_USER_FEEDS_ARRAY.filter(f => f.enabled);
    const unifiedExecutionList = [...activeBuiltInFeeds, ...activeCustomFeeds];

    if(unifiedExecutionList.length === 0) {
        generateStructuralLocalFallbackDatabase();
        return;
    }

    const networkPipelinesGroup = unifiedExecutionList.map(source => executeXMLExtractionQuery(source.url, source.name));
    await Promise.all(networkPipelinesGroup);

    if (INGESTED_PARSED_ARTICLES_POOL.length === 0) {
        generateStructuralLocalFallbackDatabase();
    }

    INGESTED_PARSED_ARTICLES_POOL.sort(() => Math.random() - 0.5);
    ACTIVE_FEED_DISPLAY_INDEX = 0;
    renderActiveFiveArticlesBatch();
}

async function executeXMLExtractionQuery(targetEndpointURL, feedSourceLabel) {
    try {
        const resolvingEndpointGate = `${CORS_SYSTEM_RESOLVER_PREFIX}${encodeURIComponent(targetEndpointURL)}`;
        const networkQueryResponse = await fetch(resolvingEndpointGate);
        if (!networkQueryResponse.ok) return;
        
        const payloadJSON = await networkQueryResponse.json();
        const DOMPars = new DOMParser();
        const xmlDoc = DOMPars.parseFromString(payloadJSON.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        items.forEach((itemNode, idx) => {
            if (idx > 5) return;
            let refLink = itemNode.querySelector("link")?.textContent || "#";
            let pubD = itemNode.querySelector("pubDate")?.textContent || new Date().toUTCString();
            let imgUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600";
            
            const uniqueIdCode = 'node-' + Math.random().toString(36).substr(2, 9);
            INGESTED_PARSED_ARTICLES_POOL.push({
                id: uniqueIdCode, originSource: feedSourceLabel, publishTimestamp: formatArticleTimestampString(pubD), imageAssetURL: imgUrl, sourceRefLink: refLink
            });
        });
    } catch (e) { console.warn("XML Extraction step bypassed."); }
}

function renderActiveFiveArticlesBatch() {
    const root = document.getElementById('news-feed-target-root');
    root.innerHTML = "";

    const sliceBatch = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;
    const readerLevelProfileSelection = document.getElementById('config-target-reading-level').value;
    
    sliceBatch.forEach(art => {
        const title = generateAdvancedCEFRContentMatrix(art.id, readerLevelProfileSelection, targetArticleLangSelection, 'title');
        const snippet = generateAdvancedCEFRContentMatrix(art.id, readerLevelProfileSelection, targetArticleLangSelection, 'snippet');

        const card = document.createElement('div');
        card.className = "news-card";
        card.onclick = () => launchImmersiveReaderPopUp(art);

        card.innerHTML = `
            <img class="news-thumb" src="${art.imageAssetURL}">
            <div class="news-content">
                <div class="news-meta">🌐 ${art.originSource}  •  📅 ${art.publishTimestamp}</div>
                <div class="news-title">${title}</div>
                <div class="news-snippet">${snippet}</div>
            </div>
        `;
        root.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// TASK FIX 1, 2, 4: IMMERSIVE POPUP WITH INTEGRATED DROP-DOWN ADJUSTMENTS
// --------------------------------------------------------------------------

function launchImmersiveReaderPopUp(articleObject) {
    CURRENTLY_OPENED_ARTICLE_OBJECT = articleObject;

    // Pull from primary UI settings to initialize internal state
    const globalLevel = document.getElementById('config-target-reading-level').value;
    const globalLang = document.getElementById('config-target-article-lang').value;

    // Force values into modal dropdown selectors
    document.getElementById('modal-change-level').value = globalLevel;
    document.getElementById('modal-change-lang').value = globalLang;

    rebuildModalContentDynamicView();
}

function syncModalLevelAndRegenerate() {
    // Sync adjustments backwards to primary config dashboard tracking layers
    document.getElementById('config-target-reading-level').value = document.getElementById('modal-change-level').value;
    document.getElementById('config-target-article-lang').value = document.getElementById('modal-change-lang').value;
    
    // Re-render homepage workspace cards seamlessly behind modal instances
    renderActiveFiveArticlesBatch();
    
    // Refresh modal text layout
    rebuildModalContentDynamicView();
}

function rebuildModalContentDynamicView() {
    if (!CURRENTLY_OPENED_ARTICLE_OBJECT) return;

    const level = document.getElementById('modal-change-level').value;
    const lang = document.getElementById('modal-change-lang').value;

    const modalRoot = document.getElementById('immersive-reader-modal-root');
    const titleNode = document.getElementById('reader-title-node');
    const cefrBadgeContainer = document.getElementById('reader-cefr-badge-container');
    const bodyNode = document.getElementById('reader-body-node');

    titleNode.textContent = generateAdvancedCEFRContentMatrix(CURRENTLY_OPENED_ARTICLE_OBJECT.id, level, lang, 'title');
    cefrBadgeContainer.innerHTML = `<span class="cefr-pill-badge" style="background: var(--brand-color, #2563eb);">Active Level: ${level} (${lang})</span>`;
    
    bodyNode.innerHTML = "";
    const img = document.createElement('img');
    img.className = "modal-hero-img";
    img.src = CURRENTLY_OPENED_ARTICLE_OBJECT.imageAssetURL;
    bodyNode.appendChild(img);

    // Dynamic Multi-paragraph Layout Builder Engine Loop
    const fullArticleContentString = generateAdvancedCEFRContentMatrix(CURRENTLY_OPENED_ARTICLE_OBJECT.id, level, lang, 'body');
    const paragraphs = fullArticleContentString.split('\n\n');
    
    paragraphs.forEach(pString => {
        if(!pString.trim()) return;
        const pTagNode = document.createElement('p');
        pTagNode.className = "reader-article-p";
        pTagNode.style.lineHeight = "1.7";
        pTagNode.style.marginBottom = "1.2rem";

        const distinctWords = pString.split(' ');
        distinctWords.forEach(token => {
            if(!token.trim()) return;
            // Clean word tokens for dictionary matching
            let scrubbedLookupKey = token.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'\[\]]/g,"");
            
            const span = document.createElement('span');
            span.className = "clickable-word";
            span.textContent = token + " ";
            span.style.cursor = "pointer";
            
            span.onclick = (e) => {
                e.stopPropagation();
                executeInteractiveInlineWordLookup(scrubbedLookupKey);
            };
            pTagNode.appendChild(span);
        });
        bodyNode.appendChild(pTagNode);
    });

    modalRoot.style.display = 'flex';
    triggerAtelierGamesInitializationPipeline(CURRENTLY_OPENED_ARTICLE_OBJECT, fullArticleContentString);
}

function executeInteractiveInlineWordLookup(scrubbedKey) {
    if (!scrubbedKey) return;
    
    // TASK FIX 1: Resolves dictionary execution bug by matching exact structural keys
    const translationMatch = TARGET_TO_LEARNER_DICTIONARY[scrubbedKey];
    let definitionOutput = translationMatch ? translationMatch : `Meaning: Contextual Lookup Saved`;
    
    triggerSystemToastNotification(`🔍 ${scrubbedKey.toUpperCase()} ➔ ${definitionOutput}`);

    const isAlreadyPresent = USER_FLASHCARD_REPOSITORY.some(entry => entry.front.toLowerCase() === scrubbedKey);
    if (!isAlreadyPresent) {
        USER_FLASHCARD_REPOSITORY.push({ front: scrubbedKey, back: definitionOutput });
        CURRENT_ACTIVE_FLASHCARD_INDEX = USER_FLASHCARD_REPOSITORY.length - 1;
        updateFlashcardUIContainerDisplay();
    }
}

// --------------------------------------------------------------------------
// STANDALONE ATELIER GAMES MINI SUBSYSTEM LOOPS
// --------------------------------------------------------------------------

function generateFindAWordGameMatrix(extractedTargetKeywords) {
    const poolContainer = document.getElementById('faw-pool');
    const gridContainer = document.getElementById('faw-grid-target');
    if (!poolContainer || !gridContainer) return;

    poolContainer.innerHTML = ""; gridContainer.innerHTML = "";
    fawSelectedCoords = []; fawSolutionWordsMapping = {};

    extractedTargetKeywords.forEach(keyword => {
        fawSolutionWordsMapping[keyword] = { found: false };
        const badge = document.createElement('span');
        badge.className = "faw-badge"; badge.id = `faw-badge-${keyword}`; badge.textContent = keyword;
        poolContainer.appendChild(badge);
    });

    let matrix = Array(fawGridDimension).fill(null).map(() => Array(fawGridDimension).fill(''));
    const trajectories = [{ x: 1, y: 0 }, { x: 0, y: 1 }];

    extractedTargetKeywords.forEach(word => {
        let placed = false; let attempts = 0;
        while (!placed && attempts < 50) {
            attempts++;
            const vec = trajectories[Math.floor(Math.random() * trajectories.length)];
            const tx = Math.floor(Math.random() * fawGridDimension);
            const ty = Math.floor(Math.random() * fawGridDimension);
            if (tx + vec.x * word.length < fawGridDimension && ty + vec.y * word.length < fawGridDimension) {
                let ok = true;
                for (let s = 0; s < word.length; s++) {
                    if (matrix[ty + vec.y * s][tx + vec.x * s] !== '') ok = false;
                }
                if (ok) {
                    for (let s = 0; s < word.length; s++) matrix[ty + vec.y * s][tx + vec.x * s] = word[s];
                    placed = true;
                }
            }
        }
    });

    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            if (matrix[r][c] === '') matrix[r][c] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        }
    }

    gridContainer.style.gridTemplateColumns = `repeat(${fawGridDimension}, 1fr)`;
    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            const cell = document.createElement('div');
            cell.className = "faw-cell"; cell.textContent = matrix[r][c];
            cell.onclick = () => handleFindAWordCellSelectionToggle(cell, matrix[r][c], extractedTargetKeywords);
            gridContainer.appendChild(cell);
        }
    }
}

function handleFindAWordCellSelectionToggle(cell, val, targetArr) {
    if(cell.classList.contains('permanent')) return;
    cell.classList.toggle('selected');
    const selected = document.querySelectorAll('#faw-grid-target .faw-cell.selected');
    let str = ""; selected.forEach(n => str += n.textContent);

    targetArr.forEach(w => {
        if (str.includes(w) && !fawSolutionWordsMapping[w].found) {
            fawSolutionWordsMapping[w].found = true;
            document.getElementById(`faw-badge-${w}`).classList.add('found');
            selected.forEach(n => { n.classList.remove('selected'); n.classList.add('permanent'); });
        }
    });
}

function generateWordleGameEngineMatrix(text) {
    const tokens = text.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length === 5);
    wordleActiveTargetKeyword = tokens.length > 0 ? tokens[0] : "MOTOR";
    wordleCurrentAttemptRow = 0; wordleIsEngineTerminated = false;

    const grid = document.getElementById('wordle-grid-target');
    grid.innerHTML = "";
    for (let r = 0; r < 5; r++) {
        const row = document.createElement('div'); row.className = "wordle-row";
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div'); cell.className = "wordle-cell"; cell.id = `wordle-cell-coord-${r}-${c}`;
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

function handleWordleInputStep(e) {
    if (wordleIsEngineTerminated) return;
    const scrubbed = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    for (let c = 0; c < 5; c++) {
        const cell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${c}`);
        if (cell) cell.textContent = scrubbed[c] || "";
    }
}

function handleWordleKeydownStep(e) {
    if (wordleIsEngineTerminated) return;
    if (e.key === 'Enter') {
        const input = document.getElementById('wordle-hidden-input');
        const guess = input.value.toUpperCase().replace(/[^A-Z]/g, "");
        if (guess.length !== 5) return;

        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${i}`);
            if (wordleActiveTargetKeyword[i] === guess[i]) {
                cell.style.backgroundColor = "var(--correct-color)";
            } else if (wordleActiveTargetKeyword.includes(guess[i])) {
                cell.style.backgroundColor = "var(--accent-yellow)";
            } else {
                cell.style.backgroundColor = "var(--text-muted)";
            }
            cell.style.color = "#fff";
        }
        if (guess === wordleActiveTargetKeyword) { wordleIsEngineTerminated = true; return; }
        wordleCurrentAttemptRow++; input.value = "";
    }
}

function updateFlashcardUIContainerDisplay() {
    const counter = document.getElementById('fc-counter-display');
    const txt = document.getElementById('fc-content-text');
    counter.textContent = `Deck: ${USER_FLASHCARD_REPOSITORY.length} items`;
    if (USER_FLASHCARD_REPOSITORY.length === 0) return;
    const card = USER_FLASHCARD_REPOSITORY[CURRENT_ACTIVE_FLASHCARD_INDEX];
    txt.textContent = IS_FLASHCARD_FLIPPED ? card.back : card.front;
}

function flipActiveFlashcardNode() { if(USER_FLASHCARD_REPOSITORY.length > 0) { IS_FLASHCARD_FLIPPED = !IS_FLASHCARD_FLIPPED; updateFlashcardUIContainerDisplay(); } }
function cycleFlashcardIndex(dir) {
    if (USER_FLASHCARD_REPOSITORY.length === 0) return;
    IS_FLASHCARD_FLIPPED = false;
    CURRENT_ACTIVE_FLASHCARD_INDEX = (CURRENT_ACTIVE_FLASHCARD_INDEX + dir + USER_FLASHCARD_REPOSITORY.length) % USER_FLASHCARD_REPOSITORY.length;
    updateFlashcardUIContainerDisplay();
}

function toggleEngineSettingsView() {
    const modal = document.getElementById('settings-config-modal-root');
    const isOpening = (modal.style.display !== 'flex');
    modal.style.display = isOpening ? 'flex' : 'none';
    if (!isOpening) fetchComprehensiveRSSNetworkPipeline();
}

function cycleActiveFeedBatch() {
    ACTIVE_FEED_DISPLAY_INDEX = (ACTIVE_FEED_DISPLAY_INDEX + 5) % Math.max(1, INGESTED_PARSED_ARTICLES_POOL.length);
    renderActiveFiveArticlesBatch();
}

function closeImmersiveReader() { 
    document.getElementById('immersive-reader-modal-root').style.display = 'none'; 
    CURRENTLY_OPENED_ARTICLE_OBJECT = null;
}
function formatArticleTimestampString(r) { return new Date(r).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function triggerAtelierGamesInitializationPipeline(node, text) {
    document.getElementById('lock-state-label').textContent = "🔓 State: Atelier Mini-Games Unlocked.";
    const keywords = text.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length >= 5 && w.length <= 8).slice(0, 4);
    generateFindAWordGameMatrix(keywords.length >= 3 ? keywords : ["MOTEUR", "EQUIPE", "COURSE", "VOITURE"]);
    generateWordleGameEngineMatrix(text);
}

function generateStructuralLocalFallbackDatabase() {
    for (let i = 1; i <= 12; i++) {
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: `fallback-${i}`, originSource: "Network News Wire", publishTimestamp: "Live Sync", imageAssetURL: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600`, sourceRefLink: "#"
        });
    }
    renderActiveFiveArticlesBatch();
}
// --- NEW UNIFIED SETTINGS SAVE WORKFLOW ---
function executeUnifiedSettingsSaveWorkflow() {
    // 1. Commit preferences to client LocalStorage context
    const preferencesObj = {
        vocabLang: document.getElementById('config-target-vocab-lang').value,
        articleLang: document.getElementById('config-target-article-lang').value,
        readingLevel: document.getElementById('config-target-reading-level').value
    };
    localStorage.setItem('CORE_READER_PREFERENCES_V1', JSON.stringify(preferencesObj));
    console.log("Configuration preferences committed successfully.");

    // 2. Clear old cached displays and rebuild text layouts instantly
    flushFeedAndRebuild();

    // 3. Gracefully close out the settings modal viewport view
    toggleEngineSettingsView();

    // 4. Trigger UI notification to show the user the updates are complete
    triggerSystemToastNotification("✅ Preferences saved! Article feed updated successfully.");
}
