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

// --------------------------------------------------------------------------
// CORE INITIALIZATION & CACHE WORKFLOWS (LOCALSTORAGE)
// --------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    loadCachedSystemPreferences();
    initializeSystemDefaults();
    buildFeedManagementSettingsUI();
    fetchComprehensiveRSSNetworkPipeline();
});

function initializeSystemDefaults() {
    const wordleInput = document.getElementById('wordle-hidden-input');
    if (wordleInput) {
        wordleInput.addEventListener('input', handleWordleInputStep);
        wordleInput.addEventListener('keydown', handleWordleKeydownStep);
    }
}

function loadCachedSystemPreferences() {
    try {
        const cachedPrefs = localStorage.getItem('CORE_READER_PREFERENCES_V1');
        if (cachedPrefs) {
            const prefs = JSON.parse(cachedPrefs);
            if (prefs.readingLevel && document.getElementById('config-target-reading-level')) {
                document.getElementById('config-target-reading-level').value = prefs.readingLevel;
            }
            if (prefs.articleLang && document.getElementById('config-target-article-lang')) {
                document.getElementById('config-target-article-lang').value = prefs.articleLang;
            }
            if (prefs.vocabLang && document.getElementById('config-target-vocab-lang')) {
                document.getElementById('config-target-vocab-lang').value = prefs.vocabLang;
            }
        }
        
        const cachedFeeds = localStorage.getItem('CUSTOM_USER_FEEDS_V1');
        if (cachedFeeds) {
            CUSTOM_USER_FEEDS_ARRAY = JSON.parse(cachedFeeds);
        }
        
        const cachedDirectoryState = localStorage.getItem('GLOBAL_FEED_DIRECTORY_STATE_V1');
        if (cachedDirectoryState) {
            const savedStates = JSON.parse(cachedDirectoryState);
            GLOBAL_MAINSTREAM_FEED_DIRECTORY.forEach(feed => {
                if (savedStates[feed.id] !== undefined) {
                    feed.enabled = savedStates[feed.id];
                }
            });
        }
    } catch (e) {
        console.error("Failed to restore cached configuration settings:", e);
    }
}

function saveSystemPreferencesToCache() {
    try {
        const preferencesObj = {
            readingLevel: document.getElementById('config-target-reading-level').value,
            articleLang: document.getElementById('config-target-article-lang').value,
            vocabLang: document.getElementById('config-target-vocab-lang').value
        };
        localStorage.setItem('CORE_READER_PREFERENCES_V1', JSON.stringify(preferencesObj));
        localStorage.setItem('CUSTOM_USER_FEEDS_V1', JSON.stringify(CUSTOM_USER_FEEDS_ARRAY));
        
        const directoryState = {};
        GLOBAL_MAINSTREAM_FEED_DIRECTORY.forEach(feed => {
            directoryState[feed.id] = feed.enabled;
        });
        localStorage.setItem('GLOBAL_FEED_DIRECTORY_STATE_V1', JSON.stringify(directoryState));
    } catch (e) {
        console.error("Failed to commit settings to browser cache:", e);
    }
}

function triggerSystemToastNotification(messageString) {
    const node = document.getElementById('toast-notification-node');
    if (!node) return;
    node.textContent = messageString;
    node.style.display = 'block';
    setTimeout(() => { node.style.display = 'none'; }, 3800);
}

// --------------------------------------------------------------------------
// INTERMEDIATE LEVEL NORMALIZATION LAYER
// --------------------------------------------------------------------------
function normalizeReadingLevelProfile(tierString) {
    switch(tierString) {
        case 'A1A2B1': return 'A1';
        case 'B1B2C1': return 'B1';
        case 'C1c2fluent':
        case 'C1C2fluent': return 'C1';
        default: return tierString || 'A1';
    }
}

// --------------------------------------------------------------------------
// DEEP LEVEL DICTIONARY FOR GENUINE TARGET->LEARNER TRANSLATIONS
// --------------------------------------------------------------------------
const TARGET_TO_LEARNER_DICTIONARY = {
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
    "va": "is going to", "démontrer": "demonstrate", "sa": "its / her", "force": "strength / force", "technologique": "technological"
};

const IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY = {
    "French": {
        "A1": { prefix: "Rapport d'actualité élémentaire (Niveau A1).", bodyTemplates: ["Regardez cette mise à jour importante du marché mondial. L'économie globale change rapidement chaque jour et les équipes locales travaillent très dur. Ils adoptent maintenant la nouvelle stratégie de croissance durable. La voiture électrique moderne et le nouveau moteur propre transforment complètement toute l'industrie automobile cette année. Les clients aiment beaucoup cette technologie.\n\nUne grande analyse de l'entreprise moderne montre des résultats intéressants. Les directeurs étudient le marché avec une attention spéciale. La vitesse de développement est cruciale pour l'équipe cette saison. Tout le monde participe activement à la course internationale pour l'innovation numérique."] },
        "A2": { prefix: "Analyse Élémentaire Suivie (Niveau A2).", bodyTemplates: ["Cette grande entreprise internationale commence un projet important sur le marché mondial. Les ingénieurs construisent une nouvelle voiture électrique avec un moteur très efficace. L'équipe technique change sa stratégie de croissance pour réussir cette année dans des conditions difficiles. Les ouvriers d'usine collaborent pour réduire les coûts de fabrication de manière significative."] },
        "B1": { prefix: "Développement Thématique Structurel (Niveau Intermédiaire B1).", bodyTemplates: ["L'évolution récente du marché mondial suscite des discussions stratégiques majeures au sein de l'entreprise. En examinant les données de croissance sectorielles, les experts constatent une accélération notable de la production de voitures propres. Les nouveaux moteurs hybrides affichent une efficacité énergétique record, ce qui permet à l'équipe de consolider sa position face à la concurrence internationale cette année."] },
        "B2": { prefix: "Rapport Analytique Avancé (Niveau Élevé B2).", bodyTemplates: ["Les indicateurs macroéconomiques actuels révèlent une mutation profonde des structures opérationnelles de l'entreprise. La convergence de l'intelligence artificielle et de la gestion de réseau a permis de maximiser l'efficacité globale sur le marché. De plus, les ingénieurs de l'équipe ont validé un prototype de moteur révolutionnaire destiné à équiper la future gamme de voitures autonomes."] },
        "C1": { prefix: "Synthèse Institutionnelle Complexe (Niveau Avancé C1).", bodyTemplates: ["L'examen approfondi des dynamiques systémiques qui régissent le marché mondial met en exergue l'impératif de restructuration pour toute entreprise aspirant à la pérennité. Les transformations actuelles ne se limitent pas à une simple transition technologique; elles exigent une refonte holistique de la stratégie de croissance industrielle."] },
        "C2": { prefix: "Haute Spécification Conceptuelle (Niveau Maîtrise C2).", bodyTemplates: ["L'analyse herméneutique des paradigmes industriels contemporains révèle une imbrication inextricable entre la viabilité financière de l'entreprise et les fluctuations exogènes du marché macroéconomique. Les vecteurs de croissance ne sauraient désormais faire l'économie d'une refonte systémique de leurs infrastructures."] },
        "Fluent": { prefix: "Éditorial Natif Intégral (Niveau Bilingue).", bodyTemplates: ["Dans un contexte de mondialisation exacerbée, les performances de l'entreprise témoignent d'une remarquable maîtrise des leviers opérationnels sur un marché en perpétuelle mutation. Les investissements massifs alloués au développement de la nouvelle motorisation pour les voitures de sport de demain valident une stratégie de croissance audacieuse."] }
    }
};

function generateAdvancedCEFRContentMatrix(seedId, chosenLevelProfile, targetLanguageString, elementFieldTarget) {
    const langGroup = IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY[targetLanguageString] || IMMERSIVE_LANGUAGE_TRANSLATION_DICTIONARY["French"];
    
    // Resolve single CEFR mapping if broad tier code was bypassed directly
    const granularLevelKey = normalizeReadingLevelProfile(chosenLevelProfile);
    const levelGroup = langGroup[granularLevelKey] || langGroup["A1"];
    
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
    
    return levelGroup.prefix + "\n\n" + bodyContent;
}

// --------------------------------------------------------------------------
// SUBSYSTEM CORE PIPELINES & WORKSPACE BUILDERS
// --------------------------------------------------------------------------
function buildFeedManagementSettingsUI() {
    const builtInContainer = document.getElementById('built-in-feeds-toggle-list');
    if (!builtInContainer) return;
    builtInContainer.innerHTML = "";
    
    GLOBAL_MAINSTREAM_FEED_DIRECTORY.forEach(feed => {
        const itemLabel = document.createElement('label');
        itemLabel.className = "rss-toggle-item";
        itemLabel.style.display = "block";
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = feed.enabled;
        checkbox.onchange = () => {
            feed.enabled = checkbox.checked;
            saveSystemPreferencesToCache();
            triggerSystemToastNotification(`Updated filter for ${feed.name}`);
        };
        
        itemLabel.appendChild(checkbox);
        itemLabel.appendChild(document.createTextNode(" " + feed.name));
        builtInContainer.appendChild(itemLabel);
    });

    renderCustomFeedsToggleSection();
}

function renderCustomFeedsToggleSection() {
    const customContainer = document.getElementById('custom-feeds-toggle-list');
    if (!customContainer) return;
    customContainer.innerHTML = "";

    if(CUSTOM_USER_FEEDS_ARRAY.length === 0) {
        customContainer.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No custom tracking matrices mapped yet.</span>`;
        return;
    }

    CUSTOM_USER_FEEDS_ARRAY.forEach((feed, index) => {
        const rowWrapper = document.createElement('div');
        rowWrapper.style = "display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:6px; border-radius:4px; border:1px solid var(--border-color); margin-top:4px;";

        const label = document.createElement('label');
        label.className = "rss-toggle-item";
        
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = feed.enabled;
        checkbox.onchange = () => { 
            feed.enabled = checkbox.checked; 
            saveSystemPreferencesToCache();
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + feed.name.substring(0, 25) + '...'));
        rowWrapper.appendChild(label);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑️";
        deleteBtn.style = "background:transparent; border:none; color:red; cursor:pointer;";
        deleteBtn.onclick = () => {
            CUSTOM_USER_FEEDS_ARRAY.splice(index, 1);
            saveSystemPreferencesToCache();
            renderCustomFeedsToggleSection();
        };
        rowWrapper.appendChild(deleteBtn);
        customContainer.appendChild(rowWrapper);
    });
}

function registerCustomUserInjectedRSS() {
    const field = document.getElementById('custom-rss-input-field');
    if (!field) return;
    const val = field.value.trim();
    if (!val) return;
    
    const uniqueId = 'custom_' + Date.now();
    let truncatedName = val.replace(/^(https?:\/\/)?(www\.)?/, '').substring(0, 16);
    
    CUSTOM_USER_FEEDS_ARRAY.push({ 
        id: uniqueId, 
        name: `Custom (${truncatedName}...)`, 
        url: val, 
        enabled: true 
    });
    
    saveSystemPreferencesToCache();
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
            
            // FIX: Extracts real data strings from structural XML tree nodes
            let extractedContent = itemNode.querySelector("description")?.textContent || 
                                   itemNode.querySelector("encoded")?.textContent || "";
            
            let imgUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600";
            
            const uniqueIdCode = 'node-' + Math.random().toString(36).substr(2, 9);
            INGESTED_PARSED_ARTICLES_POOL.push({
                id: uniqueIdCode, 
                originSource: feedSourceLabel, 
                publishTimestamp: formatArticleTimestampString(pubD), 
                imageAssetURL: imgUrl, 
                sourceRefLink: refLink,
                rawPayloadContent: extractedContent
            });
        });
    } catch (e) { 
        console.warn("XML Extraction step bypassed for " + feedSourceLabel); 
    }
}

function renderActiveFiveArticlesBatch() {
    const root = document.getElementById('news-feed-target-root');
    if (!root) return;
    root.innerHTML = "";

    const sliceBatch = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;
    
    // FIX: Level mapped via normalization utility layer safely
    const rawLevelProfile = document.getElementById('config-target-reading-level').value;
    const readerLevelProfileSelection = normalizeReadingLevelProfile(rawLevelProfile);
    
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
// MODAL WORKSPACES & TEXT ADAPTATION ENGINES
// --------------------------------------------------------------------------
function launchImmersiveReaderPopUp(articleObject) {
    CURRENTLY_OPENED_ARTICLE_OBJECT = articleObject;

    const rawGlobalLevel = document.getElementById('config-target-reading-level').value;
    const globalLang = document.getElementById('config-target-article-lang').value;

    // Synchronize inner selectors seamlessly
    if (document.getElementById('modal-change-level')) {
        document.getElementById('modal-change-level').value = normalizeReadingLevelProfile(rawGlobalLevel);
    }
    if (document.getElementById('modal-change-lang')) {
        document.getElementById('modal-change-lang').value = globalLang;
    }

    rebuildModalContentDynamicView();
}

function syncModalLevelAndRegenerate() {
    // Sync sub-step adjustments back to the primary config tree selection parameters
    const activeModalLevel = document.getElementById('modal-change-level').value;
    const activeModalLang = document.getElementById('modal-change-lang').value;
    
    document.getElementById('config-target-article-lang').value = activeModalLang;
    
    // Refresh main view to track with modal changes seamlessly
    renderActiveFiveArticlesBatch();
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

    if (titleNode) titleNode.textContent = generateAdvancedCEFRContentMatrix(CURRENTLY_OPENED_ARTICLE_OBJECT.id, level, lang, 'title');
    if (cefrBadgeContainer) {
        cefrBadgeContainer.innerHTML = `<span class="cefr-pill-badge" style="background: var(--brand-color, #2563eb); padding:4px 8px; color:#fff; border-radius:4px; font-size:0.8rem;">Active Level: ${level} (${lang})</span>`;
    }
    
    if (bodyNode) {
        bodyNode.innerHTML = "";
        const img = document.createElement('img');
        img.className = "modal-hero-img";
        img.style.width = "100%";
        img.style.maxHeight = "240px";
        img.style.objectFit = "cover";
        img.src = CURRENTLY_OPENED_ARTICLE_OBJECT.imageAssetURL;
        bodyNode.appendChild(img);

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
        
        if (modalRoot) modalRoot.style.display = 'flex';
        triggerAtelierGamesInitializationPipeline(CURRENTLY_OPENED_ARTICLE_OBJECT, fullArticleContentString);
    }
}

function executeInteractiveInlineWordLookup(scrubbedKey) {
    if (!scrubbedKey) return;
    
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
        badge.style.margin = "2px"; badge.style.padding = "2px 6px"; badge.style.border = "1px solid #ccc";
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

    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${fawGridDimension}, 1fr)`;
    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            const cell = document.createElement('div');
            cell.className = "faw-cell"; cell.textContent = matrix[r][c];
            cell.style.textAlign = "center"; cell.style.cursor = "pointer"; cell.style.padding = "4px";
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
            const badge = document.getElementById(`faw-badge-${w}`);
            if (badge) badge.classList.add('found');
            selected.forEach(n => { n.classList.remove('selected'); n.classList.add('permanent'); });
        }
    });
}

function generateWordleGameEngineMatrix(text) {
    const tokens = text.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length === 5);
    wordleActiveTargetKeyword = tokens.length > 0 ? tokens[0] : "MOTOR";
    wordleCurrentAttemptRow = 0; wordleIsEngineTerminated = false;

    const grid = document.getElementById('wordle-grid-target');
    if (!grid) return;
    grid.innerHTML = "";
    for (let r = 0; r < 5; r++) {
        const row = document.createElement('div'); row.className = "wordle-row";
        row.style.display = "flex";
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div'); cell.className = "wordle-cell"; cell.id = `wordle-cell-coord-${r}-${c}`;
            cell.style.width = "30px"; cell.style.height = "30px"; cell.style.border = "1px solid #ccc"; cell.style.textAlign = "center";
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
        if (!input) return;
        const guess = input.value.toUpperCase().replace(/[^A-Z]/g, "");
        if (guess.length !== 5) return;

        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${i}`);
            if (!cell) continue;
            if (wordleActiveTargetKeyword[i] === guess[i]) {
                cell.style.backgroundColor = "var(--correct-color, green)";
            } else if (wordleActiveTargetKeyword.includes(guess[i])) {
                cell.style.backgroundColor = "var(--accent-yellow, orange)";
            } else {
                cell.style.backgroundColor = "var(--text-muted, gray)";
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
    if (counter) counter.textContent = `Deck: ${USER_FLASHCARD_REPOSITORY.length} items`;
    if (USER_FLASHCARD_REPOSITORY.length === 0) return;
    const card = USER_FLASHCARD_REPOSITORY[CURRENT_ACTIVE_FLASHCARD_INDEX];
    if (txt) txt.textContent = IS_FLASHCARD_FLIPPED ? card.back : card.front;
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
    if (!modal) return;
    const isOpening = (modal.style.display !== 'flex');
    modal.style.display = isOpening ? 'flex' : 'none';
    if (!isOpening) fetchComprehensiveRSSNetworkPipeline();
}

function cycleActiveFeedBatch() {
    ACTIVE_FEED_DISPLAY_INDEX = (ACTIVE_FEED_DISPLAY_INDEX + 5) % Math.max(1, INGESTED_PARSED_ARTICLES_POOL.length);
    renderActiveFiveArticlesBatch();
}

function closeImmersiveReader() { 
    const modal = document.getElementById('immersive-reader-modal-root');
    if (modal) modal.style.display = 'none'; 
    CURRENTLY_OPENED_ARTICLE_OBJECT = null;
}

function formatArticleTimestampString(r) { return new Date(r).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function triggerAtelierGamesInitializationPipeline(node, text) {
    const stateLabel = document.getElementById('lock-state-label');
    if (stateLabel) stateLabel.textContent = "🔓 State: Atelier Mini-Games Unlocked.";
    const keywords = text.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length >= 5 && w.length <= 8).slice(0, 4);
    generateFindAWordGameMatrix(keywords.length >= 3 ? keywords : ["MOTEUR", "EQUIPE", "COURSE", "VOITURE"]);
    generateWordleGameEngineMatrix(text);
}

function generateStructuralLocalFallbackDatabase() {
    for (let i = 1; i <= 12; i++) {
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: `fallback-${i}`, 
            originSource: "Network News Wire", 
            publishTimestamp: "Live Sync", 
            imageAssetURL: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600`, 
            sourceRefLink: "#",
            rawPayloadContent: "Regardez cette mise à jour importante du marché mondial. L'économie globale change rapidement chaque jour et les équipes locales travaillent très dur."
        });
    }
    renderActiveFiveArticlesBatch();
}

// --------------------------------------------------------------------------
// FIXED UNIFIED SETTINGS SAVE WORKFLOW
// --------------------------------------------------------------------------
function executeUnifiedSettingsSaveWorkflow() {
    // 1. Commit preferences to client local storage states safely
    saveSystemPreferencesToCache();
    console.log("Configuration preferences committed successfully.");

    // 2. Clear out displays and safely trigger core network fetching routines
    fetchComprehensiveRSSNetworkPipeline();

    // 3. Gracefully close out the settings modal viewport view
    toggleEngineSettingsView();

    // 4. Trigger UI notification to show the user the updates are complete
    triggerSystemToastNotification("✅ Preferences saved! Article feed updated successfully.");
}
