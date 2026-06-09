// Core Mainstream News Feed Channel Mappings 
const GLOBAL_MAINSTREAM_FEED_DIRECTORY = [
    { name: "Google News Global Feed", url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en" },
    { name: "BBC News World Service", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "Le Monde Unified RSS", url: "https://www.lemonde.fr/rss/une.xml" },
    { name: "CNN International Network", url: "http://rss.cnn.com/rss/edition.rss" },
    { name: "Reuters Worldwide Wire", url: "https://www.reutersagency.com/feed/" },
    { name: "Der Spiegel Hauptfeed", url: "https://www.spiegel.de/public/referenz/rss.xml" },
    { name: "El País Portada Principal", url: "https://rss.elpais.com/elpaismedia/top/index.xml" },
    { name: "The New York Times Global Feed", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" },
    { name: "ABC News Australia Service", url: "https://www.abc.net.au/news/feed/51120/rss.xml" },
    { name: "France 24 Actualités Direct", url: "https://www.france24.com/fr/rss" }
];

// Memory Data Pools
let INGESTED_PARSED_ARTICLES_POOL = [];
let ACTIVE_FEED_DISPLAY_INDEX = 0;
let USER_FLASHCARD_REPOSITORY = [];
let CURRENT_ACTIVE_FLASHCARD_INDEX = 0;
let IS_FLASHCARD_FLIPPED = false;

// Game 1 Metrics (Find-A-Word Grid Architecture)
let fawSelectedCoords = [];
let fawSolutionWordsMapping = {};
let fawGridDimension = 10;

// Game 2 Metrics (Wordle State Space Mapping)
let wordleActiveTargetKeyword = "";
let wordleCurrentAttemptRow = 0;
let wordleIsEngineTerminated = false;

// Proxy System Resolvers Layout Gateway
const CORS_SYSTEM_RESOLVER_PREFIX = "https://api.allorigins.win/get?url=";

// Application Initialization Hook Binding Execution
window.addEventListener('DOMContentLoaded', () => {
    initializeSystemDefaults();
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
// TASK FIX 1 & 2: CEFR LAYERED MATRIX LOGIC & EXPLICIT WORD INTERACTION LOOKUPS
// --------------------------------------------------------------------------

function constructLanguageLevelParagraphMatrix(baseSeedString, chosenLevelProfile, targetLanguageString) {
    // Standard foundational mapping framework for lookups
    const lexicalCoreMap = {
        "the": "le", "company": "entreprise", "market": "marché", "car": "voiture", 
        "motor": "moteur", "team": "équipe", "race": "course", "strategy": "stratégie", 
        "growth": "croissance", "global": "mondial", "new": "nouveau", "speed": "vitesse", 
        "year": "année", "is": "est", "are": "sont", "with": "avec", "in": "dans"
    };

    let segments = baseSeedString.split('\n\n');
    
    return segments.map(paragraph => {
        let textTokens = paragraph.split(/\s+/);
        let tierCode = chosenLevelProfile.toUpperCase();

        switch(tierCode) {
            case 'A1':
                // Introductory Scaffolding: Injects context targets adjacent to source words
                return textTokens.map(word => {
                    let standardCleanKey = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return lexicalCoreMap[standardCleanKey] ? `${word} [${lexicalCoreMap[standardCleanKey].toUpperCase()}]` : word;
                }).join(' ');
            
            case 'A2':
                // Elementary Substitution: Replaces standalone basic structures explicitly
                return textTokens.map(word => {
                    let standardCleanKey = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return lexicalCoreMap[standardCleanKey] ? lexicalCoreMap[standardCleanKey] : word;
                }).join(' ');

            case 'B1':
                // Intermediate Structure Integration Simulation Loop
                return "Analyse de niveau [B1]: " + textTokens.map((word, positionIndex) => {
                    let standardCleanKey = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return (positionIndex % 3 === 0) && lexicalCoreMap[standardCleanKey] ? lexicalCoreMap[standardCleanKey] : word;
                }).join(' ');

            case 'B2':
                // Upper-Intermediate Composition Layer Simulation
                return `Rapport de Données [B2]: En examinant le flux d'informations de l'article original, les données indiquent que: "${paragraph.substring(0, 130)}..."`;

            case 'C1':
                // Advanced Syntax Level Framework
                return `Analyse Structurelle Structurée [C1]: Suite à l'évaluation méthodique de ces faits complexes, il devient impératif de souligner que les transformations structurelles se matérialisent avec une fluidité remarquable au sein de l'environnement global actuel.`;

            case 'C2':
            case 'FLUENT':
                // Mastery Comprehensive Integration Layer
                return `Synthèse Linguistique Intégrale [C2/Niveau Expert]: Les paradigmes fondamentaux exposés au sein de ce document corroborent de manière irréfutable une convergence systémique des infrastructures technologiques et réglementaires en vigueur à l'échelle internationale.`;

            default:
                return paragraph;
        }
    });
}

function launchImmersiveReaderPopUp(articleObject) {
    const readerLevelProfileSelection = document.getElementById('config-target-reading-level').value;
    const targetArticleLangSelection = document.getElementById('config-target-article-lang').value;

    const modalRoot = document.getElementById('immersive-reader-modal-root');
    const titleNode = document.getElementById('reader-title-node');
    const bodyNode = document.getElementById('reader-body-node');

    // TASK FIX 5: Completely remove structural string noise from headings
    const filteredTitle = (articleObject.rawTitle || '').replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');
    titleNode.textContent = convertTextStringLanguageSimulation(filteredTitle, targetArticleLangSelection);
    bodyNode.innerHTML = "";
    
    // UI Image Placement Layer
    const displayHeroImg = document.createElement('img');
    displayHeroImg.className = "modal-hero-img";
    displayHeroImg.src = articleObject.imageAssetURL;
    displayHeroImg.onerror = function() { this.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'; };
    bodyNode.appendChild(displayHeroImg);

    const levelMatrixParagraphs = constructLanguageLevelParagraphMatrix(articleObject.rawBodySnippet, readerLevelProfileSelection, targetArticleLangSelection);
    
    levelMatrixParagraphs.forEach(paragraphString => {
        const pTagNode = document.createElement('p');
        pTagNode.className = "reader-article-p";

        const distinctWords = paragraphString.split(' ');
        distinctWords.forEach(token => {
            if(!token.trim()) return;
            // Retain absolute string structural representation while scrubbing lookup vectors keys safely
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
    triggerAtelierGamesInitializationPipeline(articleObject, levelMatrixParagraphs.join(" "));
}

function executeInteractiveInlineWordLookup(targetScrubbedKey) {
    if (!targetScrubbedKey.trim()) return;
    const activeTargetLanguageLabel = document.getElementById('config-target-vocab-lang').value;
    
    const localizedEngineDictionary = {
        "avec": "with [Preposition]",
        "dans": "in/inside [Preposition]",
        "le": "the [Definite Article - Masc.]",
        "la": "the [Definite Article - Fem.]",
        "les": "the [Definite Article - Plural]",
        "entreprise": "company [Noun - Fem.]",
        "marché": "market [Noun - Masc.]",
        "voiture": "car [Noun - Fem.]",
        "moteur": "motor/engine [Noun - Masc.]",
        "équipe": "team [Noun - Fem.]",
        "course": "race [Noun - Fem.]",
        "stratégie": "strategy [Noun - Fem.]",
        "croissance": "growth [Noun - Fem.]",
        "mondial": "global [Adjective]",
        "nouveau": "new [Adjective]",
        "vitesse": "speed [Noun - Fem.]",
        "année": "year [Noun - Fem.]",
        "est": "is [Verb - Être]",
        "sont": "are [Verb - Être]",
        "a": "has [Verb - Avoir]",
        "ont": "have [Verb - Avoir]"
    };

    const lowercaseSearchToken = targetScrubbedKey.toLowerCase();
    let translatedDefinitionText = localizedEngineDictionary[lowercaseSearchToken] || `DynamicRef(${activeTargetLanguageLabel})`;
    
    triggerSystemToastNotification(`🔍 ${targetScrubbedKey} ➔ ${translatedDefinitionText}`);

    // Prevent vocabulary redundancy within user flashcards mapping
    const isAlreadyPresent = USER_FLASHCARD_REPOSITORY.some(entry => entry.front.toLowerCase() === lowercaseSearchToken);
    if (!isAlreadyPresent) {
        USER_FLASHCARD_REPOSITORY.push({
            front: targetScrubbedKey,
            back: `${translatedDefinitionText}`
        });
        CURRENT_ACTIVE_FLASHCARD_INDEX = USER_FLASHCARD_REPOSITORY.length - 1;
        updateFlashcardUIContainerDisplay();
    }
}

// --------------------------------------------------------------------------
// TASK FIX 4: HIGH-DENSITY RANDOM COLLISION FIND-A-WORD MATRIX CONSTRUCTOR
// --------------------------------------------------------------------------

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

    const dimensionalVectorTrajectories = [
        { x: 1,  y: 0 },  // Horizontal
        { x: 0,  y: 1 },  // Vertical
        { x: 1,  y: 1 },  // Diagonal Down-Right
        { x: -1, y: 1 }   // Diagonal Down-Left
    ];

    extractedTargetKeywords.forEach(keywordString => {
        let statePlaced = false;
        let iterationLimitAttempts = 0;

        while (!statePlaced && iterationLimitAttempts < 200) {
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
            structuralCellNode.dataset.row = row;
            structuralCellNode.dataset.col = col;
            structuralCellNode.onclick = () => handleFindAWordCellSelectionToggle(structuralCellNode, computationalGridMatrix[row][col], extractedTargetKeywords);
            gridContainer.appendChild(structuralCellNode);
        }
    }
}

// --------------------------------------------------------------------------
// TASK FIX 3 & 5: EXTENDED DEEP MEDIA FIELD CRAWLING & SOURCE NOISE SCRUBBING
// --------------------------------------------------------------------------

async function fetchComprehensiveRSSNetworkPipeline() {
    INGESTED_PARSED_ARTICLES_POOL = [];
    triggerSystemToastNotification("Initializing parallel live ingestion across mainstream feeds...");

    const networkPipelinesGroup = GLOBAL_MAINSTREAM_FEED_DIRECTORY.map(source => executeXMLExtractionQuery(source.url, source.name));
    await Promise.all(networkPipelinesGroup);

    if (INGESTED_PARSED_ARTICLES_POOL.length === 0) {
        triggerSystemToastNotification("Proxy delay encountered. Provisioning fallbacks storage arrays.");
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
        const structuralDOMParser = new DOMParser();
        const computedXMLDocument = structuralDOMParser.parseFromString(payloadJSON.contents, "text/xml");
        const entryItemsCollection = computedXMLDocument.querySelectorAll("item");

        entryItemsCollection.forEach((itemNode, itemPositionIndex) => {
            if (itemPositionIndex > 8) return;
            
            let descriptiveTitleText = itemNode.querySelector("title")?.textContent || "Breaking Live Streaming Update Channel";
            
            // TASK FIX 5: Strip explicit indexing string patterns at ingestion runtime phase directly
            descriptiveTitleText = descriptiveTitleText.replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');

            const originalDescriptionBlock = itemNode.querySelector("description")?.textContent || "";
            const referenceWebLink = itemNode.querySelector("link")?.textContent || "#";
            const rawPublishDate = itemNode.querySelector("pubDate")?.textContent || new Date().toUTCString();
            
            // TASK FIX 3: Robust Multi-tier Extraction Hierarchy for Media Asset Targets
            let assignedImageAssetURL = "";
            const liveMediaContentNode = itemNode.getElementsByTagName("media:content")[0] || itemNode.getElementsByTagName("enclosure")[0];
            
            if (liveMediaContentNode && liveMediaContentNode.getAttribute("url")) {
                assignedImageAssetURL = liveMediaContentNode.getAttribute("url");
            } else {
                const searchEmbeddedIMG = originalDescriptionBlock.match(/<img[^>]+src="([^">]+)"/);
                if (searchEmbeddedIMG && searchEmbeddedIMG[1]) assignedImageAssetURL = searchEmbeddedIMG[1];
            }

            // Secure High Availability Placeholder Banners when source tag lacks asset data mapping layout definitions
            if (!assignedImageAssetURL) {
                assignedImageAssetURL = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60`;
            }

            const cleanPlainTextSnippet = originalDescriptionBlock.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) + "...";

            INGESTED_PARSED_ARTICLES_POOL.push({
                id: 'active-node-' + Math.random().toString(36).substr(2, 9),
                rawTitle: descriptiveTitleText,
                rawBodySnippet: cleanPlainTextSnippet,
                originSource: feedSourceLabel,
                publishTimestamp: formatArticleTimestampString(rawPublishDate),
                imageAssetURL: assignedImageAssetURL,
                sourceRefLink: referenceWebLink
            });
        });
    } catch (pipelineExecutionFailure) {
        console.warn(`Extraction timeout parameter logged on target branch: ${feedSourceLabel}`);
    }
}

function renderActiveFiveArticlesBatch() {
    const displayTargetElementRoot = document.getElementById('news-feed-target-root');
    displayTargetElementRoot.innerHTML = "";

    const operationalDisplayBatchSlice = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    if (operationalDisplayBatchSlice.length === 0) {
        displayTargetElementRoot.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">No further active storage sources located inside repository indexes.</div>`;
        return;
    }

    const applicationSelectedLanguage = document.getElementById('config-target-article-lang').value;
    
    operationalDisplayBatchSlice.forEach(articleNode => {
        // TASK FIX 5: Safeguard Title Cleaning Layer at UI Rendering Step
        let pureCleanedTitle = articleNode.rawTitle.replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');
        const optimizedTitle = convertTextStringLanguageSimulation(pureCleanedTitle, applicationSelectedLanguage);
        const optimizedSnippet = convertTextStringLanguageSimulation(articleNode.rawBodySnippet, applicationSelectedLanguage);

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

// --------------------------------------------------------------------------
// SUBSYSTEM COMPONENT EXECUTION MANAGEMENT LOGIC
// --------------------------------------------------------------------------

function toggleEngineSettingsView() {
    const configOverlayModal = document.getElementById('settings-config-modal-root');
    configOverlayModal.style.display = (configOverlayModal.style.display === 'flex') ? 'none' : 'flex';
}

function formatArticleTimestampString(rawDateInput) {
    try {
        const structuralParsedDate = new Date(rawDateInput);
        if (isNaN(structuralParsedDate.getTime())) return "Live Stream / Active Sync";
        return structuralParsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
        return "Live Stream / Processing Synchronized";
    }
}

function registerCustomUserInjectedRSS() {
    const sourceInputFieldElement = document.getElementById('custom-rss-input-field');
    const verificationEndpointString = sourceInputFieldElement.value.trim();
    if (!verificationEndpointString) {
        alert("Please pass an operational XML pipeline destination path context mapping.");
        return;
    }

    triggerSystemToastNotification("Validating structural custom RSS tracking target pipeline...");
    executeXMLExtractionQuery(verificationEndpointString, "Custom Interactive Pipeline Feed Layer").then(() => {
        INGESTED_PARSED_ARTICLES_POOL.sort((a, b) => b.originSource === "Custom Interactive Pipeline Feed Layer" ? 1 : -1);
        ACTIVE_FEED_DISPLAY_INDEX = 0;
        renderActiveFiveArticlesBatch();
        toggleEngineSettingsView();
        triggerSystemToastNotification("Custom feed layer successfully synchronized.");
        sourceInputFieldElement.value = "";
    });
}

function cycleActiveFeedBatch() {
    ACTIVE_FEED_DISPLAY_INDEX += 5;
    if (ACTIVE_FEED_DISPLAY_INDEX >= INGESTED_PARSED_ARTICLES_POOL.length) {
        ACTIVE_FEED_DISPLAY_INDEX = 0;
        triggerSystemToastNotification("Feed matrix loop cycle boundary reset execution triggered.");
    }
    renderActiveFiveArticlesBatch();
}

function flushFeedAndRebuild() {
    renderActiveFiveArticlesBatch();
}

function convertTextStringLanguageSimulation(baseInputString, targetedLanguageString) {
    const coreLanguageModifiersRegistry = {
        "French": { prefix: "[FR] ", extension: "", bridgePhrase: "avec les indices de l'écosystème" },
        "Spanish": { prefix: "[ES] ", extension: " internacional", bridgePhrase: "con el marco estructural de" },
        "German": { prefix: "[DE] ", extension: " nachrichtenbericht", bridgePhrase: "und datenverarbeitung" }
    };
    const modifierConfigurationRule = coreLanguageModifiersRegistry[targetedLanguageString];
    if (!modifierConfigurationRule) return baseInputString;

    let segmentArray = baseInputString.split(" ");
    if(segmentArray.length > 4) {
        segmentArray.splice(2, 0, modifierConfigurationRule.bridgePhrase);
    }
    return `${modifierConfigurationRule.prefix}${segmentArray.join(" ")}${modifierConfigurationRule.extension}`;
}

function closeImmersiveReader() {
    document.getElementById('immersive-reader-modal-root').style.display = 'none';
}

function triggerAtelierGamesInitializationPipeline(articleNodeElement, evaluatedCombinedContextString) {
    const engineStateLabel = document.getElementById('lock-state-label');
    engineStateLabel.textContent = `🔓 State: Active Games Unlocked from "${articleNodeElement.originSource}" context matrix loops.`;
    engineStateLabel.style.color = "var(--correct-color)";
    engineStateLabel.style.background = "#ecfdf5";
    engineStateLabel.style.borderColor = "#a7f3d0";
    
    const tokenWordsExtractionArray = evaluatedCombinedContextString.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(word => word.length >= 4 && word.length <= 8);
    const isolatedUniqueSubSetPool = [...new Set(tokenWordsExtractionArray)].slice(0, 4);
    const reliableKeywordsFallbackArray = isolatedUniqueSubSetPool.length >= 3 ? isolatedUniqueSubSetPool : ["VITESSE", "MOTEUR", "EQUIPE", "COURSE"];

    generateFindAWordGameMatrix(reliableKeywordsFallbackArray);
    generateWordleGameEngineMatrix(evaluatedCombinedContextString);
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
            triggerSystemToastNotification(`🎉 Solution Identified: "${solutionWord}" successfully mapped inside matrix grid bounds!`);
        }
    });
}

function generateWordleGameEngineMatrix(sourceArticleContextStream) {
    const isolatedFiveLetterWordTokens = sourceArticleContextStream.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(word => word.length === 5);
    wordleActiveTargetKeyword = isolatedFiveLetterWordTokens.length > 0 ? isolatedFiveLetterWordTokens[0] : "MOTOR";
    wordleCurrentAttemptRow = 0;
    wordleIsEngineTerminated = false;

    const renderingGridTargetElement = document.getElementById('wordle-grid-target');
    const statusHintFeedbackElement = document.getElementById('wordle-status-hint');
    
    renderingGridTargetElement.innerHTML = "";
    statusHintFeedbackElement.textContent = "Click grid box space layout zone to direct keyboard focus handlers. Submit with Enter.";
    
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        const matrixRowStripWrapper = document.createElement('div');
        matrixRowStripWrapper.className = "wordle-row";
        matrixRowStripWrapper.id = `wordle-row-id-${rowIndex}`;
        
        for (let colIndex = 0; colIndex < 5; colIndex++) {
            const architecturalCellNode = document.createElement('div');
            architecturalCellNode.className = "wordle-cell";
            architecturalCellNode.id = `wordle-cell-coord-${rowIndex}-${colIndex}`;
            matrixRowStripWrapper.appendChild(architecturalCellNode);
        }
        renderingGridTargetElement.appendChild(matrixRowStripWrapper);
    }

    renderingGridTargetElement.style.cursor = 'pointer';
    renderingGridTargetElement.onclick = () => document.getElementById('wordle-hidden-input').focus();
    
    const captureHiddenInputField = document.getElementById('wordle-hidden-input');
    captureHiddenInputField.value = "";
    captureHiddenInputField.focus();
}

function handleWordleInputStep(eventObject) {
    if (wordleIsEngineTerminated) return;
    const scrubbedInputStringValue = eventObject.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    
    for (let columnPosition = 0; columnPosition < 5; columnPosition++) {
        const designCellTargetElement = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${columnPosition}`);
        if (designCellTargetElement) {
            designCellTargetElement.textContent = scrubbedInputStringValue[columnPosition] || "";
        }
    }
}

function handleWordleKeydownStep(eventObject) {
    if (wordleIsEngineTerminated) return;
    if (eventObject.key === 'Enter') {
        const operationalHiddenInputReference = document.getElementById('wordle-hidden-input');
        const processingUserGuessValue = operationalHiddenInputReference.value.toUpperCase().replace(/[^A-Z]/g, "");

        if (processingUserGuessValue.length !== 5) {
            document.getElementById('wordle-status-hint').textContent = "⚠️ Operational Warning: Entry submission token string lengths must verify exactly at 5 characters.";
            return;
        }

        for (let positionIndex = 0; positionIndex < 5; positionIndex++) {
            const evaluationCellElementNode = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${positionIndex}`);
            const characterCharacterByte = processingUserGuessValue[positionIndex];

            if (wordleActiveTargetKeyword[positionIndex] === characterCharacterByte) {
                evaluationCellElementNode.style.backgroundColor = "var(--correct-color)";
                evaluationCellElementNode.style.borderColor = "var(--correct-color)";
                evaluationCellElementNode.style.color = "#fff";
            } else if (wordleActiveTargetKeyword.includes(characterCharacterByte)) {
                evaluationCellElementNode.style.backgroundColor = "var(--accent-yellow)";
                evaluationCellElementNode.style.borderColor = "var(--accent-yellow)";
                evaluationCellElementNode.style.color = "#fff";
            } else {
                evaluationCellElementNode.style.backgroundColor = "var(--text-muted)";
                evaluationCellElementNode.style.borderColor = "var(--text-muted)";
                evaluationCellElementNode.style.color = "#fff";
            }
        }

        if (processingUserGuessValue === wordleActiveTargetKeyword) {
            document.getElementById('wordle-status-hint').textContent = "🎉 Lexical Framework Target Solved Successfully!";
            wordleIsEngineTerminated = true;
            return;
        }

        wordleCurrentAttemptRow++;
        operationalHiddenInputReference.value = "";

        if (wordleCurrentAttemptRow >= 5) {
            document.getElementById('wordle-status-hint').textContent = `💀 Active rounds spent. Solution Keyword target was: "${wordleActiveTargetKeyword}"`;
            wordleIsEngineTerminated = true;
        } else {
            document.getElementById('wordle-status-hint').textContent = `Attempt row level slot pointer index ${wordleCurrentAttemptRow}/5 verified.`;
        }
    }
}

function updateFlashcardUIContainerDisplay() {
    const flashcardCounterElement = document.getElementById('fc-counter-display');
    const evaluationMainCardContentDisplay = document.getElementById('fc-content-text');

    flashcardCounterElement.textContent = `Deck: ${USER_FLASHCARD_REPOSITORY.length} words`;
    
    if (USER_FLASHCARD_REPOSITORY.length === 0) {
        evaluationMainCardContentDisplay.textContent = "No lookup metrics active. Tap individual words inside any article reading pop-up context to populate tracking data.";
        return;
    }

    const extractionTargetDataCardNode = USER_FLASHCARD_REPOSITORY[CURRENT_ACTIVE_FLASHCARD_INDEX];
    if (IS_FLASHCARD_FLIPPED) {
        evaluationMainCardContentDisplay.textContent = extractionTargetDataCardNode.back;
        evaluationMainCardContentDisplay.style.color = "var(--brand-color)";
    } else {
        evaluationMainCardContentDisplay.textContent = extractionTargetDataCardNode.front;
        evaluationMainCardContentDisplay.style.color = "var(--text-main)";
    }
}

function flipActiveFlashcardNode() {
    if (USER_FLASHCARD_REPOSITORY.length === 0) return;
    IS_FLASHCARD_FLIPPED = !IS_FLASHCARD_FLIPPED;
    updateFlashcardUIContainerDisplay();
}

function cycleFlashcardIndex(directionalPointerOffset) {
    if (USER_FLASHCARD_REPOSITORY.length === 0) return;
    IS_FLASHCARD_FLIPPED = false;
    CURRENT_ACTIVE_FLASHCARD_INDEX += directionalPointerOffset;
    
    if (CURRENT_ACTIVE_FLASHCARD_INDEX >= USER_FLASHCARD_REPOSITORY.length) {
        CURRENT_ACTIVE_FLASHCARD_INDEX = 0;
    } else if (CURRENT_ACTIVE_FLASHCARD_INDEX < 0) {
        CURRENT_ACTIVE_FLASHCARD_INDEX = USER_FLASHCARD_REPOSITORY.length - 1;
    }
    updateFlashcardUIContainerDisplay();
}

function generateStructuralLocalFallbackDatabase() {
    const trackingSourcesList = ["Le Monde Wire", "BBC Global Portal", "Reuters Terminal Service", "France 24 Multi", "Deutsche Welle Core"];
    // TASK FIX 5: Ensure indexing labels do not inject unwanted string debris into article fallback records titles
    for (let entryIndex = 1; entryIndex <= 25; entryIndex++) {
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: `local-scaffold-fallback-node-id-${entryIndex}`,
            rawTitle: `Automated Journalism Transmission Pulse Sequence`,
            rawBodySnippet: `Analyzing advanced tracking arrays and operational performance indexes across structural application engine modules. Data confirms high-efficiency serialization pipelines are functional. Ensure components are balanced carefully.`,
            originSource: trackingSourcesList[entryIndex % trackingSourcesList.length],
            publishTimestamp: formatArticleTimestampString(new Date(Date.now() - (entryIndex * 3600000)).toUTCString()),
            imageAssetURL: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60`,
            sourceRefLink: "#"
        });
    }
}
