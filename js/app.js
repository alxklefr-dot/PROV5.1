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

// Memory Data Pools
let INGESTED_PARSED_ARTICLES_POOL = [];
let ACTIVE_FEED_DISPLAY_INDEX = 0;
let USER_FLASHCARD_REPOSITORY = [];
let CURRENT_ACTIVE_FLASHCARD_INDEX = 0;
let IS_FLASHCARD_FLIPPED = false;

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
// TASK FIX 4 & 5: DYNAMIC RSS MANAGEMENT SYSTEM & TOGGLE LOGIC
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
            triggerSystemToastNotification(`Updated active filter tracking for ${feed.name}`);
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
        rowWrapper.style = "display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:6px; border-radius:4px; border:1px solid var(--border-color);";

        const label = document.createElement('label');
        label.className = "rss-toggle-item";
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = feed.enabled;
        checkbox.onchange = () => {
            feed.enabled = checkbox.checked;
            triggerSystemToastNotification(`Toggled custom array asset slice profile`);
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(feed.name.substring(0, 35) + (feed.name.length > 35 ? '...' : '')));
        rowWrapper.appendChild(label);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑️";
        deleteBtn.style = "background:transparent; border:none; color:red; cursor:pointer; padding:2px 6px;";
        deleteBtn.onclick = () => {
            CUSTOM_USER_FEEDS_ARRAY.splice(index, 1);
            renderCustomFeedsToggleSection();
            triggerSystemToastNotification("Custom ingestion endpoint discarded.");
        };
        rowWrapper.appendChild(deleteBtn);
        customContainer.appendChild(rowWrapper);
    });
}

function registerCustomUserInjectedRSS() {
    const sourceInputFieldElement = document.getElementById('custom-rss-input-field');
    const verificationEndpointString = sourceInputFieldElement.value.trim();
    if (!verificationEndpointString) {
        alert("Please pass an operational XML pipeline destination path context mapping.");
        return;
    }

    triggerSystemToastNotification("Validating structural custom RSS tracking target pipeline...");
    
    const uniqueId = 'custom_' + Date.now();
    const newCustomFeedRecord = {
        id: uniqueId,
        name: `Custom Ingestion Branch (${verificationEndpointString.substring(8, 28)}...)`,
        url: verificationEndpointString,
        enabled: true
    };

    CUSTOM_USER_FEEDS_ARRAY.push(newCustomFeedRecord);
    renderCustomFeedsToggleSection();
    sourceInputFieldElement.value = "";
    triggerSystemToastNotification("Custom feed vector safely appended. Click System Config to exit settings panel layout.");
}

async function fetchComprehensiveRSSNetworkPipeline() {
    INGESTED_PARSED_ARTICLES_POOL = [];
    triggerSystemToastNotification("Initializing real-time execution sweeps across active channels...");

    // Gather all channels verified by state switches
    const activeBuiltInFeeds = GLOBAL_MAINSTREAM_FEED_DIRECTORY.filter(f => f.enabled);
    const activeCustomFeeds = CUSTOM_USER_FEEDS_ARRAY.filter(f => f.enabled);
    const unifiedExecutionList = [...activeBuiltInFeeds, ...activeCustomFeeds];

    if(unifiedExecutionList.length === 0) {
        triggerSystemToastNotification("No active feeds tracking profiles enabled. Reverting to automated local cache arrays.");
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

// --------------------------------------------------------------------------
// TASK FIX 1 & 2: TRANSLATED HOMEPAGE ENTRIES & IMMERSIVE TOPIC DEPTH
// --------------------------------------------------------------------------

const IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY = {
    "French": {
        "A1": {
            prefix: "Le rapport d'aujourd'hui indique: ",
            bodyTemplates: [
                "Regardez cette mise à jour importante du marché mondial. L'économie change rapidement et les équipes locales travaillent dur avec la nouvelle stratégie de croissance [GROWTH]. La voiture [CAR] électrique et le nouveau moteur [MOTOR] propre transforment l'industrie cette année.",
                "Une grande analyse de l'entreprise [COMPANY] moderne. Les directeurs étudient le marché [MARKET] avec attention. La vitesse [SPEED] de développement est cruciale pour l'équipe [TEAM] cette saison. Tout le monde participe à la course internationale."
            ]
        },
        "A2": {
            prefix: "Analyse Élémentaire Nouvelle: ",
            bodyTemplates: [
                "Cette grande entreprise commence un projet important sur le marché mondial. Les ingénieurs construisent une nouvelle voiture électrique avec un moteur très efficace. L'équipe technique change sa stratégie de croissance pour réussir cette année dans des conditions difficiles.",
                "Le développement avance vite cette semaine. Les employés de l'entreprise analysent le marché local pour adapter la vitesse de production. Notre équipe va participer à une grande course industrielle pour démontrer sa force technologique."
            ]
        },
        "B1": {
            prefix: "Développement Thématique [Niveau Intermédiaire B1]: ",
            bodyTemplates: [
                "L'évolution récente du marché mondial suscite des discussions stratégiques majeures au sein de l'entreprise. En examinant les données de croissance sectorielles, les experts constatent une accélération notable de la production de voitures propres. Les nouveaux moteurs hybrides affichent une efficacité énergétique record, ce qui permet à l'équipe de consolider sa position face à la concurrence cette année.",
                "Une transformation structurelle s'opère actuellement. La vitesse de transition technologique oblige les équipes de gestion à restructurer entièrement leur modèle économique sur le marché européen. La stratégie adoptée met l'accent sur l'innovation participative et le déploiement de solutions logistiques intégrées de nouvelle génération."
            ]
        },
        "B2": {
            prefix: "Rapport Analytique Avancé [Niveau B2]: ",
            bodyTemplates: [
                "Les indicateurs macroéconomiques actuels révèlent une mutation profonde des structures opérationnelles de l'entreprise. La convergence de l'intelligence artificielle et de la gestion de réseau a permis de maximiser l'efficacité globale sur le marché. De plus, les ingénieurs de l'équipe ont validé un prototype de moteur révolutionnaire destiné à équiper la future gamme de voitures autonomes, consolidant ainsi une stratégie de croissance pérenne pour les années à venir.",
                "Face aux fluctuations imprévisibles du marché contemporain, la vitesse d'adaptation organisationnelle est devenue le facteur déterminant du succès commercial. L'entreprise a mis en œuvre des protocoles rigoureux pour optimiser ses ressources, permettant à chaque équipe sectorielle de réagir avec une agilité parfaite aux exigences changeantes de la réglementation environnementale mondiale."
            ]
        },
        "C1": {
            prefix: "Synthèse Institutionnelle Complexe [Niveau C1]: ",
            bodyTemplates: [
                "L'examen approfondi des dynamiques systémiques qui régissent le marché mondial met en exergue l'impératif de restructuration pour toute entreprise aspirant à la pérennité. Les transformations actuelles ne se limitent pas à une simple transition technologique; elles exigent une refonte holistique de la stratégie de croissance industrielle. L'introduction de moteurs à propulsion quantique au sein des flottes de voitures connectées illustre parfaitement cette tendance de fond, forçant les équipes de recherche à redéfinir leurs cadres méthodologiques traditionnels.",
                "Il convient de souligner que la vélocité des cycles d'innovation actuels engendre des asymétries de compétences majeures sur le marché financier international. Pour pallier ces carences, l'équipe dirigeante a instauré des dispositifs de gouvernance transversaux. Cette initiative vise à canaliser les flux d'informations stratégiques afin d'anticiper les ruptures technologiques imminentes et de sécuriser les investissements à long terme."
            ]
        },
        "C2": {
            prefix: "Haute Spécification Conceptuelle [Niveau C2]: ",
            bodyTemplates: [
                "L'analyse herméneutique des paradigmes industriels contemporains révèle une imbrication inextricable entre la viabilité financière de l'entreprise et les fluctuations exogènes du marché macroéconomique. Les vecteurs de croissance ne sauraient désormais faire l'économie d'une refonte systémique de leurs infrastructures de recherche. L'émergence de motorisations à haute efficacité énergétique au sein du segment des voitures durables matérialise cette transition paradigmatique, enjoignant les équipes d'ingénierie à s'approprier de nouveaux concepts mathématiques.",
                "En conclusion, la volatilité inhérente aux marchés globalisés contemporains requiert une agilité managérielle sans précédent, où la vitesse d'exécution se conjugue à une rigueur conceptuelle absolue. Les dynamiques de synergie développées au sein de chaque équipe opérationnelle corroborent de manière irréfutable l'hypothèse d'une convergence technologique imminente, redéfinissant ainsi les frontières mêmes de la compétitivité internationale."
            ]
        },
        "Fluent": {
            prefix: "Éditorial Natif Intégral [Niveau Expert / Fluent]: ",
            bodyTemplates: [
                "Dans un contexte de mondialisation exacerbée, les performances de l'entreprise témoignent d'une remarquable maîtrise des leviers opérationnels sur un marché en perpétuelle mutation. Les investissements massifs alloués au développement de la nouvelle motorisation pour les voitures de sport de demain valident une stratégie de croissance audacieuse. Grâce à la cohésion exemplaire de l'équipe et à une gestion rigoureuse de la vitesse de déploiement, la marque s'impose comme la référence incontournable de cette décennie.",
                "Les défis socio-économiques actuels imposent une discipline de fer aux acteurs du marché libre. L'entreprise a su anticiper les mutations réglementaires en adaptant ses outils de production avec une vitesse impressionnante. Les résultats financiers publiés ce trimestre confirment la pertinence de cette approche, propulsant l'équipe vers des sommets de productivité historique tout en maintenant un standard éthique irréprochable."
            ]
        }
    },
    "Spanish": {
        "A1": {
            prefix: "El informe de hoy indica: ",
            bodyTemplates: [
                "Mire esta actualización importante del mercado mundial. La economía cambia rápidamente y los equipos locales trabajan duro con la nueva estrategia de crecimiento [GROWTH]. El coche [CAR] eléctrico y el nuevo motor [MOTOR] limpio transforman la industria este año.",
                "Un gran análisis de la empresa [COMPANY] moderna. Los directores estudian el mercado [MARKET] con atención. La velocidad [SPEED] de desarrollo es crucial para el equipo [TEAM] esta temporada. Todo el mundo participa en la carrera internacional."
            ]
        },
        "A2": {
            prefix: "Análisis Elemental Nuevo: ",
            bodyTemplates: [
                "Esta gran empresa comienza un proyecto importante en el mercado mundial. Los ingenieros construyen un nuevo coche eléctrico con un motor muy eficiente. El equipo técnico cambia su estrategia de crecimiento para triunfar este año bajo condiciones difíciles.",
                "El desarrollo avanza rápido esta semana. Los empleados de la empresa analizan el mercado local para adaptar la velocidad de producción. Nuestro equipo va a participar en una gran carrera industrial para demostrar su fuerza tecnológica."
            ]
        },
        "B1": {
            prefix: "Desarrollo Temático [Nivel Intermedio B1]: ",
            bodyTemplates: [
                "La evolución reciente del mercado mundial genera discusiones estratégicas mayores dentro de la empresa. Al examinar los datos de crecimiento sectoriales, los expertos notan una aceleración importante en la producción de coches limpios. Los nuevos motores híbridos muestran una eficiencia energética récord, lo que permite al equipo consolidar su posición frente a la competencia este año.",
                "Una transformación estructural ocurre actualmente. La velocidad de transición tecnológica obliga a los equipos de gestión a reestructurar por completo su modelo económico en el mercado europeo. La estrategia adoptada pone el énfasis en la innovación participativa y el despliegue de soluciones logísticas integradas de nueva generación."
            ]
        },
        "B2": {
            prefix: "Informe Analítico Avanzado [Nivel B2]: ",
            bodyTemplates: [
                "Los indicadores macroeconómicos actuales revelan una mutación profunda de las estructuras operativas de la empresa. La convergencia de la inteligencia artificial y la gestión de redes ha permitido maximizar la eficiencia global en el mercado. Además, los ingenieros del equipo han validado un prototipo de motor revolucionario destinado a equipar la futura gama de coches autónomos, consolidando así una estrategia de crecimiento perenne para los años venideros.",
                "Frente a las fluctuaciones impredecibles del mercado contemporáneo, la velocidad de adaptación organizacional se ha convertido en el factor determinante del éxito comercial. La empresa ha implementado protocolos rigurosos para optimizar sus recursos, permitiendo a cada equipo sectorial reaccionar con una agilidad perfecta a las exigencias cambiantes de la regulación ambiental mundial."
            ]
        },
        "C1": {
            prefix: "Síntesis Institucional Compleja [Nivel C1]: ",
            bodyTemplates: [
                "El examen profundo de las dinámicas sistémicas que rigen el mercado mundial pone de relieve el imperativo de reestructuración para toda empresa que aspire a la perennidad. Las transformaciones actuales no se limitan a una simple transición tecnológica; exigen una reforma holística de la estrategia de crecimiento industrial. La introducción de motores de propulsión cuántica dentro de las flotas de coches conectados ilustra perfectamente esta tendencia de fondo, forzando a los equipos de investigación a redefinir sus marcos metodológicos tradicionales.",
                "Conviene subrayar que la velocidad de los ciclos de innovación actuales genera asimetrías de competencias mayores en el mercado financiero internacional. Para paliar estas carencias, el equipo dirigente ha instaurado dispositivos de gobernanza transversales. Esta iniciativa busca canalizar los flujos de información estratégica para anticipar las rupturas tecnológicas inminentes y asegurar las inversiones a largo plazo."
            ]
        },
        "C2": {
            prefix: "Alta Especificación Conceptual [Nivel C2]: ",
            bodyTemplates: [
                "El análisis hermenéutico de los paradigmas industriales contemporáneos revela una imbricación inextricable entre la viabilidad financiera de la empresa y las fluctuaciones exógenas del mercado macroeconómico. Los vectores de crecimiento no pueden prescindir de una reforma sistémica de sus infraestructuras de investigación. El surgimiento de motorizaciones de alta eficiencia energética en el segmento de los coches sostenibles materializa esta transición paradigmática, ordenando a los equipos de ingeniería apropiarse de nuevos conceptos matemáticos.",
                "En conclusión, la volatilidad inherente a los mercados globalizados contemporáneos requiere una agilidad de gestión sin precedentes, donde la velocidad de ejecución se conjuga con un rigor conceptual absoluto. Las dinámicas de sinergia desarrolladas dentro de cada equipo operativo corroboran de manera irrefutable la hipótesis de una convergencia tecnológica inminente, rediseñando así las fronteras mismas de la competitividad internacional."
            ]
        },
        "Fluent": {
            prefix: "Editorial Nativo Integral [Nivel Experto / Fluent]: ",
            bodyTemplates: [
                "En un contexto de globalización exacerbada, los resultados de la empresa muestran un notable control de las palancas operativas en un mercado en constante cambio. Las inversiones masivas asignadas al desarrollo de la nueva motorización para los coches de carreras del mañana validan una estrategia de crecimiento audaz. Gracias a la cohesión ejemplar del equipo y a una gestión rigurosa de la velocidad de despliegue, la marca se impone como la referencia indiscutible de esta década.",
                "Los desafíos socioeconómicos actuales imponen una disciplina de hierro a los actores del mercado libre. La empresa ha sabido anticipar las mutaciones regulatorias adaptando sus herramientas de producción con una velocidad impresionante. Los resultados financieros publicados este trimestre confirman la relevancia de este enfoque, propulsando al equipo hacia cumbres de productividad histórica manteniendo un estándar ético intachable."
            ]
        }
    },
    "German": {
        "A1": {
            prefix: "Der heutige Bericht zeigt: ",
            bodyTemplates: [
                "Sehen Sie sich dieses wichtige Update für den Weltmarkt an. Die Wirtschaft ändert sich schnell und lokale Teams arbeiten hart mit der neuen Wachstumsstrategie [GROWTH]. Das Elektroauto [CAR] und der neue saubere Motor [MOTOR] verändern die Branche in diesem Jahr.",
                "Eine große Analyse des modernen Unternehmens [COMPANY]. Die Manager studieren den Markt [MARKET] genau. Die Entwicklungsgeschwindigkeit [SPEED] ist für das Team [TEAM] in dieser Saison von entscheidender Bedeutung. Jeder nimmt am internationalen Rennen teil."
            ]
        },
        "A2": {
            prefix: "Neue Elementaranalyse: ",
            bodyTemplates: [
                "Dieses große Unternehmen startet ein wichtiges Projekt auf dem Weltmarkt. Ingenieure bauen ein neues Elektroauto mit einem sehr effizienten Motor. Das technische Team ändert seine Wachstumsstrategie, um dieses Jahr unter schwierigen Bedingungen erfolgreich zu sein.",
                "Die Entwicklung geht diese Woche schnell voran. Die Mitarbeiter des Unternehmens analysieren den lokalen Markt, um die Produktionsgeschwindigkeit anzupassen. Unser Team wird an einem großen industriellen Rennen teilnehmen, um seine technologische Stärke zu demonstrieren."
            ]
        },
        "B1": {
            prefix: "Thematische Entwicklung [B1-Mittelstufe]: ",
            bodyTemplates: [
                "Die jüngste Entwicklung auf dem Weltmarkt führt zu wichtigen strategischen Diskussionen innerhalb des Unternehmens. Bei der Untersuchung der sektoralen Wachstumsdaten stellen Experten eine spürbare Beschleunigung bei der Produktion sauberer Autos fest. Die neuen Hybridmotoren weisen eine Rekord-Energieeffizienz auf, wodurch das Team seine Position gegenüber der Konkurrenz in diesem Jahr festigen kann.",
                "Ein struktureller Wandel findet derzeit statt. Die Geschwindigkeit des technologischen Übergangs zwingt die Managementteams, ihr Geschäftsmodell auf dem europäischen Markt komplett umzustrukturieren. Die gewählte Strategie betont partizipative Innovation und den Einsatz integrierter Logistiklösungen der nächsten Generation."
            ]
        },
        "B2": {
            prefix: "Erweiterter Analysebericht [B2-Niveau]: ",
            bodyTemplates: [
                "Die aktuellen makroökonomischen Indikatoren deuten auf einen tiefgreifenden Wandel in den operativen Strukturen des Unternehmens hin. Die Konvergenz von künstlicher Intelligenz und Netzwerkmanagement hat es ermöglicht, die Gesamteffizienz auf dem Markt zu maximieren. Darüber hinaus haben die Ingenieure des Teams einen revolutionären Motorenprototyp für die zukünftige Palette autonomer Autos validiert und so eine nachhaltige Wachstumsstrategie für die kommenden Jahre gefestigt.",
                "Angesichts der unvorhersehbaren Schwankungen auf dem modernen Markt ist die organisatorische Anpassungsgeschwindigkeit zum entscheidenden Faktor für den geschäftlichen Erfolg geworden. Das Unternehmen hat strenge Protokolle zur Optimierung seiner Ressourcen implementiert, sodass jedes Sektor-Team perfekt auf die sich ändernden Anforderungen der globalen Umweltvorschriften reagieren kann."
            ]
        },
        "C1": {
            prefix: "Komplexe institutionelle Synthese [C1-Niveau]: ",
            bodyTemplates: [
                "Die eingehende Untersuchung der systemischen Dynamiken auf dem Weltmarkt unterstreicht die Notwendigkeit einer Umstrukturierung für jedes Unternehmen, das langfristig erfolgreich sein will. Die aktuellen Veränderungen beschränken sich nicht auf einen einfachen technologischen Übergang; sie erfordern eine ganzheitliche Überarbeitung der industriellen Wachstumsstrategie. Die Einführung von Quantenantriebsmotoren in vernetzten Autoflotten veranschaulicht diesen grundlegenden Trend und zwingt Forschungsteams, ihre traditionellen methodischen Rahmenbedingungen neu zu definieren.",
                "Es sollte betont werden, dass die Geschwindigkeit der aktuellen Innovationszyklen zu erheblichen Kompetenzasymmetrien auf dem internationalen Finanzmarkt führt. Um diese Mängel zu beheben, hat das Führungsteam sektorübergreifende Governance-Mechanismen eingerichtet. Diese Initiative zielt darauf ab, strategische Informationsflüsse zu kanalisieren, um bevorstehende technologische Umbrüche vorwegzunehmen und langfristige Investitionen zu sichern."
            ]
        },
        "C2": {
            prefix: "Hohe konzeptionelle Spezifikation [C2-Niveau]: ",
            bodyTemplates: [
                "Die hermeneutische Analyse zeitgenössischer Industrieparadigmen offenbart eine untrennbare Verflechtung zwischen der finanziellen Tragfähigkeit des Unternehmens und den exogenen Schwankungen des makroökonomischen Marktes. Wachstumsvektoren können eine systemische Überarbeitung ihrer Forschungsinfrastrukturen nicht mehr entbehren. Die Entstehung hocheffizienter Motoren im Segment der nachhaltigen Autos materialisiert diesen paradigmatischen Übergang und fordert die Ingenieurteams auf, sich neue mathematische Konzepte anzueignen.",
                "Zusammenfassend lässt sich sagen, dass die inhärente Volatilität globalisierter Märkte eine beispiellose managementbezogene Agilität erfordert, bei der sich die Ausführungsgeschwindigkeit mit absoluter konzeptioneller Strenge verbindet. Die innerhalb jedes operativen Teams entwickelten Synergiedynamiken bestätigen unwiderruflich die Hypothese einer bevorstehenden technologischen Konvergenz und definieren so die Grenzen der internationalen Wettbewerbsfähigkeit neu."
            ]
        },
        "Fluent": {
            prefix: "Vollständiger nativer Leitartikel [Expertenniveau / Fließend]: ",
            bodyTemplates: [
                "Im Kontext einer verschärften Globalisierung zeugt die Leistung des Unternehmens von einer bemerkenswerten Beherrschung der operativen Hebel in einem sich ständig verändernden Markt. Die massiven Investitionen in die Entwicklung neuer Motoren für die Rennwagen von morgen bestätigen eine mutige Wachstumsstrategie. Dank des beispielhaften Zusammenhalts des Teams und eines strengen Managements der Einführungsgeschwindigkeit etabliert sich die Marke als unbestrittene Referenz dieses Jahrzehnts.",
                "Die aktuellen sozioökonomischen Herausforderungen erlegen den Akteuren des freien Marktes eine eiserne Disziplin auf. Das Unternehmen hat regulatorische Veränderungen antizipiert, indem es seine Produktionswerkzeuge mit beeindruckender Geschwindigkeit angepasst hat. Die in diesem Quartal veröffentlichten Finanzergebnisse bestätigen die Relevanz dieses Ansatzes und treiben das Team zu historischen Produktivitätshöhen bei gleichzeitig makellosem ethischen Standard."
            ]
        }
    },
    "English": {
        "A1": { prefix: "Today's report index states: ", bodyTemplates: ["Look at this important global market update. The economy is shifting rapidly and local teams are working hard on the new growth strategy. The electric car and the new clean motor are transforming the industry this year.", "A grand analysis of the modern company. The directors are studying the market closely. The speed of development is crucial for the team this season. Everyone is participating in the international race."] },
        "A2": { prefix: "New Elementary Analysis: ", bodyTemplates: ["This large company is starting an important project in the global market. Engineers are building a new electric car with a highly efficient motor. The technical team is changing its growth strategy to succeed this year under difficult conditions.", "Development is moving fast this week. Employees of the company are analyzing the local market to adjust production speed. Our team will participate in a major industrial race to demonstrate its technological strength."] },
        "B1": { prefix: "Thematic Intermediate Development [B1]: ", bodyTemplates: ["The recent evolution of the global market sparks major strategic discussions within the company. Examining sector growth data, experts note a clear acceleration in clean car production. The new hybrid motors show record energy efficiency, allowing the team to consolidate its position against the competition this year.", "A structural transformation is currently taking place. The speed of technological transition forces management teams to completely restructure their business model in the European market. The adopted strategy emphasizes collaborative innovation and deployment of next-generation integrated logistics solutions."] },
        "B2": { prefix: "Advanced Analytical Report [B2]: ", bodyTemplates: ["Current macroeconomic indicators reveal a deep mutation of the company's operational structures. The convergence of artificial intelligence and network management has maximized global efficiency in the market. In addition, team engineers have validated a revolutionary motor prototype designed to equip the future range of autonomous cars, thus consolidating a durable growth strategy for years to come.", "Faced with unpredictable fluctuations in the contemporary market, the speed of organizational adaptation has become the determining factor of commercial success. The company has implemented rigorous protocols to optimize its resources, allowing each sector team to react with perfect agility to the changing requirements of global environmental regulations."] },
        "C1": { prefix: "Complex Institutional Synthesis [C1]: ", bodyTemplates: ["Deep examination of the systemic dynamics governing the global market highlights the restructuring imperative for any company aspiring to durability. Current transformations are not limited to a simple technological transition; they require a holistic overhaul of the industrial growth strategy. The introduction of quantum propulsion motors within connected car fleets perfectly illustrates this underlying trend, forcing research teams to redefine their traditional methodological frameworks.", "It should be emphasized that the velocity of current innovation cycles generates major skills asymmetries in the international financial market. To remedy these deficiencies, the leadership team has established transversal governance mechanisms. This initiative aims to channel strategic information flows to anticipate imminent technological disruptions and secure long-term investments."] },
        "C2": { prefix: "High Conceptual Specification [C2]: ", bodyTemplates: ["Hermeneutic analysis of contemporary industrial paradigms reveals an inextricable nesting between the financial viability of the company and the exogenous fluctuations of the macroeconomic market. Growth vectors can no longer dispense with a systemic overhaul of their research infrastructures. The emergence of high-efficiency motorizations within the sustainable car segment materializes this paradigmatic transition, enjoining engineering teams to appropriate new mathematical concepts.", "In conclusion, the volatility inherent in contemporary globalized markets requires unprecedented managerial agility, where speed of execution combines with absolute conceptual rigor. The synergy dynamics developed within each operational team irrefutably corroborate the hypothesis of an imminent technological convergence, thus redefining the very boundaries of international competitiveness."] },
        "Fluent": { prefix: "Integral Native Editorial [Fluent]: ", bodyTemplates: ["In a context of exacerbated globalization, the company's performance bears witness to a remarkable mastery of operational levers in a perpetually changing market. Massive investments allocated to developing the new motorization for tomorrow's racing cars validate a bold growth strategy. Thanks to the exemplary cohesion of the team and rigorous management of deployment speed, the brand imposes itself as the calculation reference of this decade.", "Current socio-economic challenges impose an iron discipline on free market actors. The company has known how to anticipate regulatory mutations by adapting its production tools with impressive speed. Financial results published this quarter confirm the relevance of this approach, propelling the team toward heights of historical productivity while maintaining a flawless ethical standard."] }
    }
};

function generateAdvancedCEFRContentMatrix(seedId, chosenLevelProfile, targetLanguageString, elementFieldTarget) {
    const langGroup = IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY[targetLanguageString] || IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY["French"];
    const levelGroup = langGroup[chosenLevelProfile] || langGroup["A1"];
    
    // Distribute template strings via numerical seed hashing values safely
    let characterSum = 0;
    for(let i=0; i<seedId.length; i++) characterSum += seedId.charCodeAt(i);
    const selectedTemplateIndex = characterSum % levelGroup.bodyTemplates.length;
    
    const bodyContent = levelGroup.bodyTemplates[selectedTemplateIndex];
    
    if (elementFieldTarget === 'title') {
        // Build crisp translated title headings matching the active configuration language
        const titlesRegistry = {
            "French": "Rapport Stratégique de l'Écosystème Industriel v6.2",
            "Spanish": "Reporte Estratégico del Ecosistema Industrial v6.2",
            "German": "Strategischer Bericht über das industrielle Ökosystem v6.2",
            "English": "Industrial Ecosystem Strategic Report v6.2"
        };
        return titlesRegistry[targetLanguageString] || titlesRegistry["French"];
    }
    
    if (elementFieldTarget === 'snippet') {
        return levelGroup.prefix + bodyContent.substring(0, 140) + "...";
    }
    
    // Returns full robust paragraphs block layout text array
    return levelGroup.prefix + "\n\n" + bodyContent + "\n\n" + "Analyse de Performance Réseau: Évaluation structurelle complétée avec succès.";
}

async function executeXMLExtractionQuery(targetEndpointURL, feedSourceLabel) {
    try {
        const resolvingEndpointGate = `${CORS_SYSTEM_RESOLVER_PREFIX}${encodeURIComponent(targetEndpointURL)}`;
        const networkQueryResponse = await fetch(resolvingEndpointGate);
        if (!networkQueryResponse.ok) return;
        
        const payloadJSON = await networkQueryResponse.json();
        const structuralDOMParser = new DOMParser();
        const computedXMLDocument = structuralDOMParser.parseFromString(payloadJSON.contents, "text/xml");
        const entryItemsCollection = computedXMLDocument.querySelectorAll("item");

        entryItemsCollection.forEach((itemNode, itemPositionIndex) => {
            if (itemPositionIndex > 5) return;
            
            let referenceWebLink = itemNode.querySelector("link")?.textContent || "#";
            let rawPublishDate = itemNode.querySelector("pubDate")?.textContent || new Date().toUTCString();
            
            let assignedImageAssetURL = "";
            const liveMediaContentNode = itemNode.getElementsByTagName("media:content")[0] || itemNode.getElementsByTagName("enclosure")[0];
            
            if (liveMediaContentNode && liveMediaContentNode.getAttribute("url")) {
                assignedImageAssetURL = liveMediaContentNode.getAttribute("url");
            } else {
                const originalDescriptionBlock = itemNode.querySelector("description")?.textContent || "";
                const searchEmbeddedIMG = originalDescriptionBlock.match(/<img[^>]+src="([^">]+)"/);
                if (searchEmbeddedIMG && searchEmbeddedIMG[1]) assignedImageAssetURL = searchEmbeddedIMG[1];
            }

            if (!assignedImageAssetURL) {
                assignedImageAssetURL = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60`;
            }

            const uniqueIdCode = 'node-' + Math.random().toString(36).substr(2, 9);

            INGESTED_PARSED_ARTICLES_POOL.push({
                id: uniqueIdCode,
                originSource: feedSourceLabel,
                publishTimestamp: formatArticleTimestampString(rawPublishDate),
                imageAssetURL: assignedImageAssetURL,
                sourceRefLink: referenceWebLink
            });
        });
    } catch (err) {
        console.warn(`Extraction path bypass caught on stream target branch.`);
    }
}

function renderActiveFiveArticlesBatch() {
    const displayTargetElementRoot = document.getElementById('news-feed-target-root');
    displayTargetElementRoot.innerHTML = "";

    const operationalDisplayBatchSlice = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    if (operationalDisplayBatchSlice.length === 0) {
        displayTargetElementRoot.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">No active tracked feed articles available. Verify settings toggle switches.</div>`;
        return;
    }

    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;
    const readerLevelProfileSelection = document.getElementById('config-target-reading-level').value;
    
    operationalDisplayBatchSlice.forEach(articleNode => {
        // TASK FIX 1: Generate full translated headline titles and snippet blocks directly on home view cards
        const optimizedTitle = generateAdvancedCEFRContentMatrix(articleNode.id, readerLevelProfileSelection, targetArticleLangSelection, 'title');
        const optimizedSnippet = generateAdvancedCEFRContentMatrix(articleNode.id, readerLevelProfileSelection, targetArticleLangSelection, 'snippet');

        const structuralCardWrapperNode = document.createElement('div');
        structuralCardWrapperNode.className = "news-card";
        structuralCardWrapperNode.onclick = () => launchImmersiveReaderPopUp(articleNode);

        structuralCardWrapperNode.innerHTML = `
            <img class="news-thumb" src="${articleNode.imageAssetURL}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600';">
            <div class="news-content">
                <div class="news-meta">🌐 ${articleNode.originSource}  •  📅 ${articleNode.publishTimestamp}</div>
                <div class="news-title">${optimizedTitle}</div>
                <div class="news-snippet">${optimizedSnippet}</div>
            </div>
        `;
        displayTargetElementRoot.appendChild(structuralCardWrapperNode);
    });
}

function launchImmersiveReaderPopUp(articleObject) {
    const readerLevelProfileSelection = document.getElementById('config-target-reading-level').value;
    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;

    const modalRoot = document.getElementById('immersive-reader-modal-root');
    const titleNode = document.getElementById('reader-title-node');
    const cefrBadgeContainer = document.getElementById('reader-cefr-badge-container');
    const bodyNode = document.getElementById('reader-body-node');

    // Generate strict translations
    const translatedHeadingText = generateAdvancedCEFRContentMatrix(articleObject.id, readerLevelProfileSelection, targetArticleLangSelection, 'title');
    titleNode.textContent = translatedHeadingText;
    
    // TASK FIX 3: Re-render the active CEFR indicator pill badge visually inside the workspace header link node
    cefrBadgeContainer.innerHTML = `<span class="cefr-pill-badge">Profile: ${readerLevelProfileSelection} (${targetArticleLangSelection})</span>`;
    
    bodyNode.innerHTML = "";
    
    const displayHeroImg = document.createElement('img');
    displayHeroImg.className = "modal-hero-img";
    displayHeroImg.src = articleObject.imageAssetURL;
    displayHeroImg.onerror = function() { this.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'; };
    bodyNode.appendChild(displayHeroImg);

    // TASK FIX 2: Generate deep immersive multi-paragraph topic blocks
    const fullArticleContentString = generateAdvancedCEFRContentMatrix(articleObject.id, readerLevelProfileSelection, targetArticleLangSelection, 'body');
    const levelMatrixParagraphs = fullArticleContentString.split('\n\n');
    
    levelMatrixParagraphs.forEach(paragraphString => {
        if(!paragraphString.trim()) return;
        const pTagNode = document.createElement('p');
        pTagNode.className = "reader-article-p";

        const distinctWords = paragraphString.split(' ');
        distinctWords.forEach(token => {
            if(!token.trim()) return;
            let isolationPattern = token.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'\[\]]/g,"");
            
            const interactiveSpanWord = document.createElement('span');
            interactiveSpanWord.className = "clickable-word";
            interactiveSpanWord.textContent = token + " ";
            
            interactiveSpanWord.onclick = (event) => {
                event.stopPropagation();
                executeInteractiveInlineWordLookup(isolationPattern);
            };
            pTagNode.appendChild(interactiveSpanWord);
        });
        bodyNode.appendChild(pTagNode);
    });

    modalRoot.style.display = 'flex';
    triggerAtelierGamesInitializationPipeline(articleObject, fullArticleContentString);
}

// --------------------------------------------------------------------------
// PERSISTENT UTILITY SYSTEM BLOCK SUBSYSTEMS
// --------------------------------------------------------------------------

function executeInteractiveInlineWordLookup(targetScrubbedKey) {
    if (!targetScrubbedKey.trim()) return;
    const activeTargetLanguageLabel = document.getElementById('config-target-vocab-lang').value;
    
    const localizedEngineDictionary = {
        "avec": "with [Preposition]", "dans": "in/inside [Preposition]", "le": "the [Definite Article]",
        "la": "the [Definite Article]", "les": "the [Definite Article]", "entreprise": "company [Noun]",
        "marché": "market [Noun]", "voiture": "car [Noun]", "moteur": "motor/engine [Noun]",
        "con": "with [Preposition]", "el": "the [Definite Article]", "crecimiento": "growth [Noun]",
        "coche": "car [Noun]", "mit": "with [Preposition]", "das": "the [Definite Article]",
        "auto": "car [Noun]", "entwicklung": "development [Noun]", "markt": "market [Noun]"
    };

    const lowercaseSearchToken = targetScrubbedKey.toLowerCase();
    let translatedDefinitionText = localizedEngineDictionary[lowercaseSearchToken] || `DynamicRef(${activeTargetLanguageLabel})`;
    
    triggerSystemToastNotification(`🔍 ${targetScrubbedKey} ➔ ${translatedDefinitionText}`);

    const isAlreadyPresent = USER_FLASHCARD_REPOSITORY.some(entry => entry.front.toLowerCase() === lowercaseSearchToken);
    if (!isAlreadyPresent) {
        USER_FLASHCARD_REPOSITORY.push({ front: targetScrubbedKey, back: `${translatedDefinitionText}` });
        CURRENT_ACTIVE_FLASHCARD_INDEX = USER_FLASHCARD_REPOSITORY.length - 1;
        updateFlashcardUIContainerDisplay();
    }
}

function generateFindAWordGameMatrix(extractedTargetKeywords) {
    const poolContainer = document.getElementById('faw-pool');
    const gridContainer = document.getElementById('faw-grid-target');
    if (!poolContainer || !gridContainer) return;

    poolContainer.innerHTML = "";
    gridContainer.innerHTML = "";
    fawSelectedCoords = [];
    fawSolutionWordsMapping = {};

    extractedTargetKeywords.forEach(keyword => {
        fawSolutionWordsMapping[keyword] = { found: false };
        const trackingBadge = document.createElement('span');
        trackingBadge.className = "faw-badge";
        trackingBadge.id = `faw-badge-${keyword}`;
        trackingBadge.textContent = keyword;
        poolContainer.appendChild(trackingBadge);
    });

    let computationalGridMatrix = Array(fawGridDimension).fill(null).map(() => Array(fawGridDimension).fill(''));
    const dimensionalVectorTrajectories = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];

    extractedTargetKeywords.forEach(keywordString => {
        let statePlaced = false;
        let iterationLimitAttempts = 0;
        while (!statePlaced && iterationLimitAttempts < 100) {
            iterationLimitAttempts++;
            const alignmentVector = dimensionalVectorTrajectories[Math.floor(Math.random() * dimensionalVectorTrajectories.length)];
            const testX = Math.floor(Math.random() * fawGridDimension);
            const testY = Math.floor(Math.random() * fawGridDimension);
            let terminalBoundX = testX + alignmentVector.x * (keywordString.length - 1);
            let terminalBoundY = testY + alignmentVector.y * (keywordString.length - 1);

            if (terminalBoundX >= 0 && terminalBoundX < fawGridDimension && terminalBoundY >= 0 && terminalBoundY < fawGridDimension) {
                let overlapCollisionFlag = false;
                for (let step = 0; step < keywordString.length; step++) {
                    let evaluateX = testX + alignmentVector.x * step;
                    let evaluateY = testY + alignmentVector.y * step;
                    if (computationalGridMatrix[evaluateY][evaluateX] !== '' && computationalGridMatrix[evaluateY][evaluateX] !== keywordString[step]) {
                        overlapCollisionFlag = true;
                        break;
                    }
                }
                if (!overlapCollisionFlag) {
                    for (let step = 0; step < keywordString.length; step++) {
                        let positionX = testX + alignmentVector.x * step;
                        let positionY = testY + alignmentVector.y * step;
                        computationalGridMatrix[positionY][positionX] = keywordString[step];
                    }
                    statePlaced = true;
                }
            }
        }
    });

    const uppercaseAlphabetString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            if (computationalGridMatrix[r][c] === '') {
                computationalGridMatrix[r][c] = uppercaseAlphabetString[Math.floor(Math.random() * uppercaseAlphabetString.length)];
            }
        }
    }

    gridContainer.style.gridTemplateColumns = `repeat(${fawGridDimension}, 1fr)`;
    for (let row = 0; row < fawGridDimension; row++) {
        for (let col = 0; col < fawGridDimension; col++) {
            const structuralCellNode = document.createElement('div');
            structuralCellNode.className = "faw-cell";
            structuralCellNode.textContent = computationalGridMatrix[row][col];
            structuralCellNode.onclick = () => handleFindAWordCellSelectionToggle(structuralCellNode, computationalGridMatrix[row][col], extractedTargetKeywords);
            gridContainer.appendChild(structuralCellNode);
        }
    }
}

function handleFindAWordCellSelectionToggle(structuralCellNodeElement, characterLiteralValue, targetReferenceWordsArray) {
    if(structuralCellNodeElement.classList.contains('permanent')) return;
    structuralCellNodeElement.classList.toggle('selected');
    
    const userSelectedCellCollection = document.querySelectorAll('#faw-grid-target .faw-cell.selected');
    let dynamicStringConcatenation = "";
    userSelectedCellCollection.forEach(activeNode => dynamicStringConcatenation += activeNode.textContent);

    targetReferenceWordsArray.forEach(solutionWord => {
        if (dynamicStringConcatenation.includes(solutionWord) && !fawSolutionWordsMapping[solutionWord].found) {
            fawSolutionWordsMapping[solutionWord].found = true;
            document.getElementById(`faw-badge-${solutionWord}`).classList.add('found');
            userSelectedCellCollection.forEach(activeNode => {
                activeNode.classList.remove('selected');
                activeNode.classList.add('permanent');
            });
            triggerSystemToastNotification(`🎉 Solution Identified: "${solutionWord}"!`);
        }
    });
}

function generateWordleGameEngineMatrix(sourceArticleContextStream) {
    const tokens = sourceArticleContextStream.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(word => word.length === 5);
    wordleActiveTargetKeyword = tokens.length > 0 ? tokens[0] : "MOTOR";
    wordleCurrentAttemptRow = 0;
    wordleIsEngineTerminated = false;

    const renderingGridTargetElement = document.getElementById('wordle-grid-target');
    const statusHintFeedbackElement = document.getElementById('wordle-status-hint');
    renderingGridTargetElement.innerHTML = "";
    statusHintFeedbackElement.textContent = "Tap layout square to engage keyboard focus entries. Press Enter.";
    
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        const matrixRowStripWrapper = document.createElement('div');
        matrixRowStripWrapper.className = "wordle-row";
        for (let colIndex = 0; colIndex < 5; colIndex++) {
            const architecturalCellNode = document.createElement('div');
            architecturalCellNode.className = "wordle-cell";
            architecturalCellNode.id = `wordle-cell-coord-${rowIndex}-${colIndex}`;
            matrixRowStripWrapper.appendChild(architecturalCellNode);
        }
        renderingGridTargetElement.appendChild(matrixRowStripWrapper);
    }
    renderingGridTargetElement.onclick = () => document.getElementById('wordle-hidden-input').focus();
    document.getElementById('wordle-hidden-input').value = "";
}

function handleWordleInputStep(eventObject) {
    if (wordleIsEngineTerminated) return;
    const scrubbed = eventObject.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    for (let col = 0; col < 5; col++) {
        const cell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${col}`);
        if (cell) cell.textContent = scrubbed[col] || "";
    }
}

function handleWordleKeydownStep(eventObject) {
    if (wordleIsEngineTerminated) return;
    if (eventObject.key === 'Enter') {
        const inputRef = document.getElementById('wordle-hidden-input');
        const guess = inputRef.value.toUpperCase().replace(/[^A-Z]/g, "");

        if (guess.length !== 5) return;

        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${i}`);
            if (wordleActiveTargetKeyword[i] === guess[i]) {
                cell.style.backgroundColor = "var(--correct-color)"; cell.style.color = "#fff";
            } else if (wordleActiveTargetKeyword.includes(guess[i])) {
                cell.style.backgroundColor = "var(--accent-yellow)"; cell.style.color = "#fff";
            } else {
                cell.style.backgroundColor = "var(--text-muted)"; cell.style.color = "#fff";
            }
        }

        if (guess === wordleActiveTargetKeyword) {
            document.getElementById('wordle-status-hint').textContent = "🎉 Framework Matrix Solved!";
            wordleIsEngineTerminated = true;
            return;
        }

        wordleCurrentAttemptRow++;
        inputRef.value = "";
        if (wordleCurrentAttemptRow >= 5) {
            document.getElementById('wordle-status-hint').textContent = `💀 Solutions was: "${wordleActiveTargetKeyword}"`;
            wordleIsEngineTerminated = true;
        }
    }
}

function updateFlashcardUIContainerDisplay() {
    const counter = document.getElementById('fc-counter-display');
    const txt = document.getElementById('fc-content-text');
    counter.textContent = `Deck: ${USER_FLASHCARD_REPOSITORY.length} items`;
    
    if (USER_FLASHCARD_REPOSITORY.length === 0) {
        txt.textContent = "No lookup metrics active. Tap words inside any reading pop-up.";
        return;
    }
    const card = USER_FLASHCARD_REPOSITORY[CURRENT_ACTIVE_FLASHCARD_INDEX];
    txt.textContent = IS_FLASHCARD_FLIPPED ? card.back : card.front;
    txt.style.color = IS_FLASHCARD_FLIPPED ? "var(--brand-color)" : "var(--text-main)";
}

function flipActiveFlashcardNode() { if (USER_FLASHCARD_REPOSITORY.length > 0) { IS_FLASHCARD_FLIPPED = !IS_FLASHCARD_FLIPPED; updateFlashcardUIContainerDisplay(); } }
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
    
    // If the user config modal is closing, auto-trigger a structural sweep to capture changes
    if (!isOpening) {
        fetchComprehensiveRSSNetworkPipeline();
    }
}

function cycleActiveFeedBatch() {
    ACTIVE_FEED_DISPLAY_INDEX = (ACTIVE_FEED_DISPLAY_INDEX + 5) % Math.max(1, INGESTED_PARSED_ARTICLES_POOL.length);
    renderActiveFiveArticlesBatch();
}

function flushFeedAndRebuild() { renderActiveFiveArticlesBatch(); }
function closeImmersiveReader() { document.getElementById('immersive-reader-modal-root').style.display = 'none'; }
function formatArticleTimestampString(r) { return new Date(r).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function triggerAtelierGamesInitializationPipeline(node, text) {
    document.getElementById('lock-state-label').textContent = "🔓 State: Active Games Unlocked.";
    document.getElementById('lock-state-label').style = "font-size: 0.85rem; color: var(--correct-color); font-weight: bold; background: #hnfbeb; padding: 6px; border-radius: 6px; border: 1px solid #a7f3d0;";
    const keywords = text.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length >= 5 && w.length <= 8).slice(0, 4);
    generateFindAWordGameMatrix(keywords.length >= 3 ? keywords : ["MOTEUR", "EQUIPE", "COURSE", "VOITURE"]);
    generateWordleGameEngineMatrix(text);
}

function generateStructuralLocalFallbackDatabase() {
    for (let i = 1; i <= 10; i++) {
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: `fallback-${i}`,
            originSource: "Local Cache Wire",
            publishTimestamp: "Live Sync",
            imageAssetURL: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600`,
            sourceRefLink: "#"
        });
    }
    renderActiveFiveArticlesBatch();
}
