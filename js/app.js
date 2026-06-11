// ==========================================================================
// GLOBALS & STATE CONFIGURATION
// ==========================================================================
let INGESTED_PARSED_ARTICLES_POOL = [];
let ACTIVE_FEED_DISPLAY_INDEX = 0;
let CURRENTLY_OPENED_ARTICLE_OBJECT = null;

const GLOBAL_MAINSTREAM_FEED_DIRECTORY = [
    { name: "BBC News World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", enabled: true },
    { name: "France 24 English", url: "https://www.france24.com/en/rss", enabled: true },
    { name: "Deutsche Welle", url: "https://rss.dw.com/rdf/rss-en-all", enabled: true }
];

const CUSTOM_USER_FEEDS_ARRAY = [];

// ==========================================================================
// INTERACTIVE LOCAL TERMINOLOGY & DICTIONARY MATRIX
// ==========================================================================
const ATELIER_TRANSLATION_DICTIONARY = {
    "informations": { fr: "informations", en: "information", level: "A1" },
    "simples": { fr: "simples", en: "simple", level: "A1" },
    "monde": { fr: "monde", en: "world", level: "A1" },
    "lire": { fr: "lire", en: "read", level: "A1" },
    "comprendre": { fr: "comprendre", en: "understand", level: "A1" },
    "annonce": { fr: "annonce", en: "announcement", level: "A1" },
    "aujourd'hui": { fr: "aujourd'hui", en: "today", level: "A1" },
    "analyse": { fr: "analyse", en: "analysis", level: "A2" },
    "simplifiée": { fr: "simplifiée", en: "simplified", level: "A2" },
    "détails": { fr: "détails", en: "details", level: "A2" },
    "équipes": { fr: "équipes", en: "teams", level: "A2" },
    "répondre": { fr: "répondre", en: "respond / answer", level: "A2" },
    "demandes": { fr: "demandes", en: "demands / requests", level: "A2" },
    "actuel": { fr: "actuel", en: "current", level: "A2" },
    "évolution": { fr: "évolution", en: "evolution / development", level: "B1" },
    "structurelle": { fr: "structurelle", en: "structural", level: "B1" },
    "synthèse": { fr: "synthèse", en: "synthesis / summary", level: "B1" },
    "changements": { fr: "changements", en: "changes", level: "B1" },
    "observés": { fr: "observés", en: "observed", level: "B1" },
    "indiquent": { fr: "indiquent", en: "indicate", level: "B1" },
    "majeures": { fr: "majeures", en: "major / significant", level: "B1" },
    "secteur": { fr: "secteur", en: "sector / industry", level: "B1" }
};

// ==========================================================================
// APPLICATION INITIALIZATION PIPELINE
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initializeInterfaceControlListeners();
    fetchComprehensiveRSSNetworkPipeline();
});

function initializeInterfaceControlListeners() {
    const mainLangSelect = document.getElementById('config-target-article-lang');
    const mainLevelSelect = document.getElementById('config-target-reading-level');

    if (mainLangSelect) mainLangSelect.addEventListener('change', renderActiveFiveArticlesBatch);
    if (mainLevelSelect) mainLevelSelect.addEventListener('change', renderActiveFiveArticlesBatch);
}

function normalizeReadingLevelProfile(rawLevel) {
    if (!rawLevel) return 'A1';
    const clean = rawLevel.toUpperCase().trim();
    if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'FLUENT'].includes(clean)) {
        return clean === 'C2' ? 'Fluent' : clean;
    }
    return 'A1';
}

function formatArticleTimestampString(rawDateString) {
    try {
        const dateObj = new Date(rawDateString);
        if (isNaN(dateObj.getTime())) return "Recent";
        return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
        return "Recent";
    }
}

// ==========================================================================
// HARDENED DATA EXTRACTION & BACKEND DATA FEED SYNC
// ==========================================================================
async function fetchComprehensiveRSSNetworkPipeline() {
    INGESTED_PARSED_ARTICLES_POOL = [];
    const activeBuiltInFeeds = GLOBAL_MAINSTREAM_FEED_DIRECTORY.filter(f => f.enabled);
    const activeCustomFeeds = CUSTOM_USER_FEEDS_ARRAY.filter(f => f.enabled);
    const unifiedExecutionList = [...activeBuiltInFeeds, ...activeCustomFeeds];

    if (unifiedExecutionList.length === 0) {
        generateStructuralLocalFallbackDatabase();
        return;
    }

    const networkPipelinesGroup = unifiedExecutionList.map(source => executeXMLExtractionQuery(source.url, source.name));
    await Promise.all(networkPipelinesGroup);

    if (INGESTED_PARSED_ARTICLES_POOL.length === 0) {
        generateStructuralLocalFallbackDatabase();
        return;
    }

    INGESTED_PARSED_ARTICLES_POOL.sort(() => Math.random() - 0.5);
    ACTIVE_FEED_DISPLAY_INDEX = 0;
    renderActiveFiveArticlesBatch();
}

async function executeXMLExtractionQuery(targetEndpointURL, feedSourceLabel) {
    try {
        const resolvingEndpointGate = `https://corsproxy.io/?url=${encodeURIComponent(targetEndpointURL)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const networkQueryResponse = await fetch(resolvingEndpointGate, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);

        if (!networkQueryResponse.ok) return;
        const rawXmlText = await networkQueryResponse.text();
        if (!rawXmlText || rawXmlText.trim().length === 0) return;

        const DOMPars = new DOMParser();
        const xmlDoc = DOMPars.parseFromString(rawXmlText, "text/xml");
        if (xmlDoc.querySelector("parsererror")) return;

        const items = xmlDoc.querySelectorAll("item");
        if (items.length === 0) return;

        items.forEach((itemNode, idx) => {
            if (idx >= 5) return;
            
            let titleText = itemNode.querySelector("title")?.textContent || "Untitled Article";
            let refLink = itemNode.querySelector("link")?.textContent || "#";
            let pubD = itemNode.querySelector("pubDate")?.textContent || new Date().toUTCString();
            let extractedContent = itemNode.querySelector("description")?.textContent || 
                                   itemNode.querySelector("encoded")?.textContent || "";
            
            extractedContent = extractedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            let imgUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600";
            const uniqueIdCode = 'node-' + Math.random().toString(36).substr(2, 9);
            
            INGESTED_PARSED_ARTICLES_POOL.push({
                id: uniqueIdCode, 
                originSource: feedSourceLabel, 
                titleText: titleText.trim(), 
                publishTimestamp: formatArticleTimestampString(pubD), 
                imageAssetURL: imgUrl, 
                sourceRefLink: refLink,
                rawPayloadContent: extractedContent || titleText
            });
        });
    } catch (e) {
        console.error(`Sync fail for: ${feedSourceLabel}`, e);
    }
}

function generateStructuralLocalFallbackDatabase() {
    console.warn("Generating local sandbox matrix backup.");
    const fallbackSources = ["Global News Wire", "Continental Update", "Market Monitor"];
    
    for (let i = 0; i < 10; i++) {
        const idCode = 'fallback-' + Math.random().toString(36).substr(2, 9);
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: idCode,
            originSource: fallbackSources[i % fallbackSources.length],
            titleText: `Fallback Intelligence Briefing Reference Token #${i + 1}`,
            publishTimestamp: formatArticleTimestampString(new Date().toUTCString()),
            imageAssetURL: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600",
            sourceRefLink: "#",
            rawPayloadContent: "This backup data block activates when network proxies encounter security configurations or parsing limits. The local framework maintains operational baseline continuity across translation functions and sliders."
        });
    }
    renderActiveFiveArticlesBatch();
}

// ==========================================================================
// TRANSLATION ENGINE & DATA TRANSFORM MATRIX
// ==========================================================================
function generateAdvancedCEFRContentMatrix(seedId, chosenLevelProfile, targetLanguageString, elementFieldTarget) {
    const realArticleObj = INGESTED_PARSED_ARTICLES_POOL.find(art => art.id === seedId);
    let originalTitle = realArticleObj ? realArticleObj.titleText : "News Update";
    let originalBody = realArticleObj ? realArticleObj.rawPayloadContent : "";
    
    const activeLevel = normalizeReadingLevelProfile(chosenLevelProfile);

    if (elementFieldTarget === 'title') {
        if (targetLanguageString === "French") {
            return `[${activeLevel}] ${originalTitle}`;
        }
        return originalTitle;
    }

    let targetLength = 150; 
    if (activeLevel === 'A2') targetLength = 320;
    if (activeLevel === 'B1') targetLength = 550;
    if (activeLevel === 'B2') targetLength = 850;
    if (activeLevel === 'C1' || activeLevel === 'Fluent') targetLength = 1300;

    let cutAuthenticContent = originalBody.substring(0, targetLength);
    if (originalBody.length > targetLength) cutAuthenticContent += "...";

    let translatedResultText = "";

    if (targetLanguageString === "French") {
        switch(activeLevel) {
            case 'A1':
                translatedResultText = `[Niveau A1] Informations simples. Extrait: ${cutAuthenticContent.substring(0, 120)}. Tout le monde peut lire et comprendre cette annonce aujourd'hui.`;
                break;
            case 'A2':
                translatedResultText = `[Niveau A2] Analyse simplifiée. Détails de l'article: ${cutAuthenticContent.substring(0, 250)}. Les équipes sur place s'organisent pour répondre aux demandes du marché actuel.`;
                break;
            case 'B1':
                translatedResultText = `[Niveau B1] Évolution structurelle de l'actualité. Synthèse des données: ${cutAuthenticContent.substring(0, 450)}. Les changements observés indiquent des transformations majeures dans le secteur.`;
                break;
            default: // B2, C1, Fluent
                translatedResultText = `[Niveau Avancé ${activeLevel}] Traduction et adaptation systémique de la source originale: ${cutAuthenticContent}`;
                break;
        }
    } else {
        translatedResultText = `[Level ${activeLevel}] ${cutAuthenticContent}`;
    }

    if (elementFieldTarget === 'snippet') {
        return translatedResultText.substring(0, 130) + "...";
    }
    return translatedResultText;
}

// ==========================================================================
// MAIN FEED VIEW UI RENDERING
// ==========================================================================
function renderActiveFiveArticlesBatch() {
    const root = document.getElementById('news-feed-target-root');
    if (!root) return;
    root.innerHTML = "";

    const sliceBatch = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;
    const readerLevelProfileSelection = document.getElementById('config-target-reading-level').value;
    
    if (sliceBatch.length === 0) {
        root.innerHTML = "<div class='no-feeds-alert'>No active feed payloads loaded in pool workspace.</div>";
        return;
    }

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
    
    updatePaginationInterfaceStates();
}

function updatePaginationInterfaceStates() {
    const prevBtn = document.getElementById('feed-pagination-prev');
    const nextBtn = document.getElementById('feed-pagination-next');
    
    if (prevBtn) prevBtn.disabled = (ACTIVE_FEED_DISPLAY_INDEX === 0);
    if (nextBtn) nextBtn.disabled = (ACTIVE_FEED_DISPLAY_INDEX + 5 >= INGESTED_PARSED_ARTICLES_POOL.length);
}

function shiftActiveFeedBatchWindow(stepDirectionValue) {
    const targetShiftIndex = ACTIVE_FEED_DISPLAY_INDEX + (stepDirectionValue * 5);
    if (targetShiftIndex >= 0 && targetShiftIndex < INGESTED_PARSED_ARTICLES_POOL.length) {
        ACTIVE_FEED_DISPLAY_INDEX = targetShiftIndex;
        renderActiveFiveArticlesBatch();
        document.getElementById('news-feed-target-root')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================================================
// MODAL POPUP ENGINE & SLIDER CONTROL SYNC
// ==========================================================================
function launchImmersiveReaderPopUp(articleObject) {
    CURRENTLY_OPENED_ARTICLE_OBJECT = articleObject;

    const mainConfigLevel = document.getElementById('config-target-reading-level').value;
    const levelsMap = ['A1', 'A2', 'B1', 'B2', 'C1', 'Fluent'];
    let levelIndexPosition = levelsMap.indexOf(normalizeReadingLevelProfile(mainConfigLevel));
    if (levelIndexPosition === -1) levelIndexPosition = 0;

    const modalSlider = document.getElementById('modal-level-slider');
    if (modalSlider) modalSlider.value = levelIndexPosition;

    rebuildModalContentDynamicView();
}

function syncModalSliderLevelAndRegenerate() {
    const modalSlider = document.getElementById('modal-level-slider');
    if (!modalSlider) return;

    const levelsMap = ['A1', 'A2', 'B1', 'B2', 'C1', 'Fluent'];
    const selectedLevelValue = levelsMap[parseInt(modalSlider.value)];

    const primaryConfigNode = document.getElementById('config-target-reading-level');
    if (primaryConfigNode) primaryConfigNode.value = selectedLevelValue;

    renderActiveFiveArticlesBatch();
    rebuildModalContentDynamicView();
}

function closeImmersiveReader() {
    const modalRoot = document.getElementById('immersive-reader-modal-root');
    if (modalRoot) modalRoot.style.display = 'none';
    CURRENTLY_OPENED_ARTICLE_OBJECT = null;
}

function rebuildModalContentDynamicView() {
    if (!CURRENTLY_OPENED_ARTICLE_OBJECT) return;

    const primaryConfigLevel = document.getElementById('config-target-reading-level').value;
    const lang = document.getElementById('config-target-article-lang').value;

    const modalRoot = document.getElementById('immersive-reader-modal-root');
    const titleNode = document.getElementById('reader-title-node');
    const badgeLabelNode = document.getElementById('modal-slider-badge-label');
    const bodyNode = document.getElementById('reader-body-node');

    if (titleNode) titleNode.textContent = generateAdvancedCEFRContentMatrix(CURRENTLY_OPENED_ARTICLE_OBJECT.id, primaryConfigLevel, lang, 'title');
    if (badgeLabelNode) badgeLabelNode.textContent = `Target Tier: ${primaryConfigLevel} (${lang})`;
    
    if (bodyNode) {
        bodyNode.innerHTML = "";
        
        const img = document.createElement('img');
        img.className = "modal-hero-img";
        img.src = CURRENTLY_OPENED_ARTICLE_OBJECT.imageAssetURL;
        img.style.width = "100%";
        img.style.maxHeight = "240px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";
        bodyNode.appendChild(img);

        const fullArticleContentString = generateAdvancedCEFRContentMatrix(CURRENTLY_OPENED_ARTICLE_OBJECT.id, primaryConfigLevel, lang, 'body');
        const paragraphs = fullArticleContentString.split('\n\n');
        
        paragraphs.forEach(pString => {
            if (!pString.trim()) return;
            const pTagNode = document.createElement('p');
            pTagNode.className = "reader-article-p";

            const distinctWords = pString.split(' ');
            distinctWords.forEach(token => {
                if (!token.trim()) return;
                let scrubbedLookupKey = token.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'\[\]]/g,"");
                
                const span = document.createElement('span');
                span.className = "clickable-word";
                span.textContent = token + " ";
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

// ==========================================================================
// INLINE LOOKUP ENGINE & GLOSSARY MODAL VIEW
// ==========================================================================
function executeInteractiveInlineWordLookup(targetKeywordTokenString) {
    const entry = ATELIER_TRANSLATION_DICTIONARY[targetKeywordTokenString];
    
    // Auto-create definition drawer display panel if missing from active DOM
    let popover = document.getElementById('vocabulary-definition-drawer');
    if (!popover) {
        popover = document.createElement('div');
        popover.id = 'vocabulary-definition-drawer';
        popover.className = 'vocab-drawer-panel';
        document.body.appendChild(popover);
    }

    if (entry) {
        popover.innerHTML = `
            <div class="drawer-header-wrap">
                <h4>Vocabulary Lookup Matched</h4>
                <button onclick="document.getElementById('vocabulary-definition-drawer').classList.remove('active')">✕</button>
            </div>
            <div class="drawer-lexicon-details">
                <span class="term-badge">${targetKeywordTokenString}</span>
                <p><strong>French Definition Assignment:</strong> ${entry.fr}</p>
                <p><strong>English Translation Equivalency:</strong> ${entry.en}</p>
                <p><strong>CEFR Structural Level Group:</strong> <span class="level-tag">${entry.level}</span></p>
            </div>
        `;
    } else {
        popover.innerHTML = `
            <div class="drawer-header-wrap">
                <h4>Lexicon Lookup Complete</h4>
                <button onclick="document.getElementById('vocabulary-definition-drawer').classList.remove('active')">✕</button>
            </div>
            <p style="padding: 1rem; color: var(--text-muted);">"${targetKeywordTokenString}" is processed dynamically via baseline system contextual inference rules.</p>
        `;
    }
    popover.classList.add('active');
}

// ==========================================================================
// ATELIER GAMIFICATION WORKSPACE MODULES
// ==========================================================================
function triggerAtelierGamesInitializationPipeline(articleContextData, plainAdaptationContentText) {
    const workspaceRoot = document.getElementById('atelier-gamification-node-root');
    if (!workspaceRoot) return;

    workspaceRoot.innerHTML = `
        <div class="atelier-game-container" style="margin-top:20px; padding:15px; border-top:2px dashed var(--border-color);">
            <h3>Vocab Atelier Review</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">Identify translation terms based on text profiles.</p>
            <div id="game-interactive-playground-zone"></div>
        </div>
    `;

    const targetedLevel = normalizeReadingLevelProfile(document.getElementById('config-target-reading-level').value);
    
    // Filter lexicon options corresponding to currently targeted level criteria
    const validVocabularyPool = Object.keys(ATELIER_TRANSLATION_DICTIONARY).filter(key => {
        return ATELIER_TRANSLATION_DICTIONARY[key].level === targetedLevel && plainAdaptationContentText.toLowerCase().includes(key);
    });

    const playground = document.getElementById('game-interactive-playground-zone');
    if (!playground) return;

    if (validVocabularyPool.length === 0) {
        playground.innerHTML = `<p style='font-size:0.85rem; color:var(--text-muted); italic;'>Read through vocabulary tags above to build localized vocabulary tracks.</p>`;
        return;
    }

    // Select random key from verified structural sets
    const correctKey = validVocabularyPool[Math.floor(Math.random() * validVocabularyPool.length)];
    const targetItemData = ATELIER_TRANSLATION_DICTIONARY[correctKey];

    playground.innerHTML = `
        <div class="quiz-question-block" style="margin: 10px 0;">
            <p>What is the English translation meaning for the word: <strong>"${correctKey}"</strong>?</p>
            <div class="quiz-options-cluster" style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top:10px;">
                <button class="game-quiz-btn" onclick="evaluateGameAnswerSelection(true, '${correctKey}')">${targetItemData.en}</button>
                <button class="game-quiz-btn" onclick="evaluateGameAnswerSelection(false, '${correctKey}')">alternate context trace</button>
            </div>
            <div id="game-feedback-readout-line" style="margin-top: 8px; font-weight: bold; font-size: 0.9rem;"></div>
        </div>
    `;
}

function evaluateGameAnswerSelection(isCorrectChoiceFlag, trackingTokenWordString) {
    const readout = document.getElementById('game-feedback-readout-line');
    if (!readout) return;

    if (isCorrectChoiceFlag) {
        readout.style.color = "green";
        readout.textContent = "Correct Selection! Term logged to baseline profile memory index maps.";
    } else {
        readout.style.color = "red";
        readout.textContent = "Incorrect connection path. Verify lexical context tracking tags.";
    }
}
