// Core Target Mainstream Multi-Domain Networks Registry
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

// System Shared Variable Arrays Matrix
let INGESTED_PARSED_ARTICLES_POOL = [];
let ACTIVE_FEED_DISPLAY_INDEX = 0;
let USER_FLASHCARD_REPOSITORY = [];
let CURRENT_ACTIVE_FLASHCARD_INDEX = 0;
let IS_FLASHCARD_FLIPPED = false;

// Find-a-Word Tracking System Coordinates Block
let fawSelectedCoords = [];
let fawSolutionWordsMapping = {};
let fawGridDimension = 10;

// Wordle Dynamic Run Core Configuration tracking coordinates
let wordleActiveTargetKeyword = "";
let wordleCurrentAttemptRow = 0;
let wordleIsEngineTerminated = false;

// CORS System Bypass Prefix Mapping Layout
const CORS_SYSTEM_RESOLVER_PREFIX = "https://api.allorigins.win/get?url=";

// Document Booting Handlers
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
    node.textContent = messageString;
    node.style.display = 'block';
    setTimeout(() => { node.style.display = 'none'; }, 3500);
}

// --------------------------------------------------------------------------
// TASK PATCH INTEGRATIONS (CEFR Translations, Word Lookup, Images, FAW Grid)
// --------------------------------------------------------------------------

function constructLanguageLevelParagraphMatrix(baseSeedString, chosenLevelProfile, targetLanguageString) {
    const dictionary = {
        "the": "le", "la": "la", "les": "les", "a": "un", "an": "une",
        "company": "entreprise", "market": "marché", "car": "voiture", "motor": "moteur",
        "team": "équipe", "race": "course", "strategy": "stratégie", "growth": "croissance",
        "global": "mondial", "new": "nouveau", "speed": "vitesse", "year": "année",
        "is": "est", "are": "sont", "has": "a", "have": "ont", "in": "dans", "with": "avec"
    };

    let paragraphs = baseSeedString.split('\n\n');
    return paragraphs.map(p => {
        let words = p.split(/\s+/);
        
        switch(chosenLevelProfile.toUpperCase()) {
            case 'A1':
                return words.map(w => {
                    let clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return dictionary[clean] ? `${w} (${dictionary[clean].toUpperCase()})` : w;
                }).join(' ');
            
            case 'A2':
                return words.map(w => {
                    let clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return dictionary[clean] ? dictionary[clean] : w;
                }).join(' ');

            case 'B1':
                return "Note d'évolution [B1]: " + words.map((w, idx) => {
                    let clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    return idx % 2 === 0 && dictionary[clean] ? dictionary[clean] : w;
                }).join(' ');

            case 'B2':
                return "Communiqué [B2]: L'analyse globale de ce rapport montre que " + p.substring(0, Math.min(p.length, 120)) + "...";

            case 'C1':
                return "Analyse Technique [C1]: En examinant de près les données macroéconomiques, il est évident que les structures s'adaptent de manière fluide au marché linguistique moderne.";

            case 'C2':
            case 'FLUENT':
                return "Texte Intégral [C2]: Les flux d'actualités mondiaux démontrent une convergence sans précédent des écosystèmes industriels et des cadres réglementaires en vigueur.";

            default:
                return p;
        }
    });
}

function launchImmersiveReaderPopUp(articleObject) {
    const targetReadingLevel = document.getElementById('config-target-reading-level').value;
    const targetArticleLang = document.getElementById('config-target-article-lang').value;

    const modalRoot = document.getElementById('immersive-reader-modal-root');
    const titleNode = document.getElementById('reader-title-node');
    const bodyNode = document.getElementById('reader-body-node');

    // Clean title from "Alpha-#" structural noise
    const cleanTitle = (articleObject.rawTitle || '').replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');
    titleNode.textContent = convertTextStringLanguageSimulation(cleanTitle, targetArticleLang);
    bodyNode.innerHTML = "";
    
    const imgElement = document.createElement('img');
    imgElement.className = "modal-hero-img";
    imgElement.src = articleObject.imageAssetURL;
    imgElement.onerror = function() { this.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'; };
    bodyNode.appendChild(imgElement);

    const textParagraphsArray = constructLanguageLevelParagraphMatrix(articleObject.rawBodySnippet, targetReadingLevel, targetArticleLang);
    
    textParagraphsArray.forEach(paragraphText => {
        const pElement = document.createElement('p');
        pElement.className = "reader-article-p";

        const wordsArray = paragraphText.split(/\s+/);
        wordsArray.forEach(word => {
            let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""[\]]/g,"");
            const spanNode = document.createElement('span');
            spanNode.className = "clickable-word";
            spanNode.textContent = word + " ";
            
            spanNode.onclick = (e) => {
                e.stopPropagation();
                executeInteractiveInlineWordLookup(cleanWord);
            };
            pElement.appendChild(spanNode);
        });
        bodyNode.appendChild(pElement);
    });

    modalRoot.style.display = 'flex';
    triggerAtelierGamesInitializationPipeline(articleObject, textParagraphsArray.join(" "));
}

function executeInteractiveInlineWordLookup(targetRawWord) {
    if (!targetRawWord.trim()) return;
    const selectedTranslationLanguage = document.getElementById('config-target-vocab-lang').value;
    
    const standardLookupTranslations = {
        "avec": "with [Preposition]",
        "le": "the [Definite Article - Masculine]",
        "la": "the [Definite Article - Feminine]",
        "les": "the [Definite Article - Plural]",
        "entreprise": "company [Noun - Feminine]",
        "marché": "market [Noun - Masculine]",
        "voiture": "car [Noun - Feminine]",
        "moteur": "motor/engine [Noun - Masculine]",
        "équipe": "team [Noun - Feminine]",
        "course": "race [Noun - Feminine]",
        "stratégie": "strategy [Noun - Feminine]",
        "croissance": "growth [Noun - Feminine]",
        "mondial": "global [Adjective]",
        "nouveau": "new [Adjective]",
        "vitesse": "speed [Noun - Feminine]",
        "année": "year [Noun - Feminine]",
        "est": "is [Verb - Être]",
        "sont": "are [Verb - Être]",
        "a": "has [Verb - Avoir]",
        "ont": "have [Verb - Avoir]",
        "dans": "in/inside [Preposition]"
    };

    const searchKey = targetRawWord.toLowerCase();
    let matchedResultText = standardLookupTranslations[searchKey] || `Variant(${selectedTranslationLanguage})`;
    
    triggerSystemToastNotification(`🔍 ${targetRawWord} ➔ ${matchedResultText}`);

    const duplicateCheck = USER_FLASHCARD_REPOSITORY.some(card => card.front.toLowerCase() === searchKey);
    if (!duplicateCheck) {
        USER_FLASHCARD_REPOSITORY.push({
            front: targetRawWord,
            back: `${matchedResultText}`
        });
        CURRENT_ACTIVE_FLASHCARD_INDEX = USER_FLASHCARD_REPOSITORY.length - 1;
        updateFlashcardUIContainerDisplay();
    }
}

function generateFindAWordGameMatrix(targetWordsArray) {
    const poolContainer = document.getElementById('faw-pool');
    const gridContainer = document.getElementById('faw-grid-target');
    
    if (!poolContainer || !gridContainer) return;

    poolContainer.innerHTML = "";
    gridContainer.innerHTML = "";
    fawSelectedCoords = [];
    fawSolutionWordsMapping = {};

    targetWordsArray.forEach(word => {
        fawSolutionWordsMapping[word] = { found: false };
        const badge = document.createElement('span');
        badge.className = "faw-badge";
        badge.id = `faw-badge-${word}`;
        badge.textContent = word;
        poolContainer.appendChild(badge);
    });

    let grid = Array(fawGridDimension).fill(null).map(() => Array(fawGridDimension).fill(''));

    const placementDirections = [
        { x: 1,  y: 0 },
        { x: 0,  y: 1 },
        { x: 1,  y: 1 },
        { x: -1, y: 1 }
    ];

    targetWordsArray.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 150) {
            attempts++;
            const dir = placementDirections[Math.floor(Math.random() * placementDirections.length)];
            const startX = Math.floor(Math.random() * fawGridDimension);
            const startY = Math.floor(Math.random() * fawGridDimension);

            let targetEndX = startX + dir.x * (word.length - 1);
            let targetEndY = startY + dir.y * (word.length - 1);

            if (targetEndX >= 0 && targetEndX < fawGridDimension && targetEndY >= 0 && targetEndY < fawGridDimension) {
                let collisionDetected = false;
                
                for (let i = 0; i < word.length; i++) {
                    let checkX = startX + dir.x * i;
                    let checkY = startY + dir.y * i;
                    if (grid[checkY][checkX] !== '' && grid[checkY][checkX] !== word[i]) {
                        collisionDetected = true;
                        break;
                    }
                }

                if (!collisionDetected) {
                    for (let i = 0; i < word.length; i++) {
                        let placeX = startX + dir.x * i;
                        let placeY = startY + dir.y * i;
                        grid[placeY][placeX] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    gridContainer.style.gridTemplateColumns = `repeat(${fawGridDimension}, 1fr)`;
    for (let r = 0; r < fawGridDimension; r++) {
        for (let c = 0; c < fawGridDimension; c++) {
            const cellNode = document.createElement('div');
            cellNode.className = "faw-cell";
            cellNode.textContent = grid[r][c];
            cellNode.dataset.row = r;
            cellNode.dataset.col = c;
            cellNode.onclick = () => handleFindAWordCellSelectionToggle(cellNode, grid[r][c], targetWordsArray);
            gridContainer.appendChild(cellNode);
        }
    }
}

// --------------------------------------------------------------------------
// CORE BASE ENGINE PIPELINES & ROUTINES
// --------------------------------------------------------------------------

function toggleEngineSettingsView() {
    const node = document.getElementById('settings-config-modal-root');
    node.style.display = (node.style.display === 'flex') ? 'none' : 'flex';
}

async function fetchComprehensiveRSSNetworkPipeline() {
    INGESTED_PARSED_ARTICLES_POOL = [];
    triggerSystemToastNotification("Initializing parallel live ingestion across mainstream feeds...");

    const fetchPromises = GLOBAL_MAINSTREAM_FEED_DIRECTORY.map(feed => executeXMLExtractionQuery(feed.url, feed.name));
    await Promise.all(fetchPromises);

    if (INGESTED_PARSED_ARTICLES_POOL.length === 0) {
        triggerSystemToastNotification("CORS Proxy delay encountered. Initializing fallbacks.");
        generateStructuralLocalFallbackDatabase();
    }

    INGESTED_PARSED_ARTICLES_POOL.sort(() => Math.random() - 0.5);
    ACTIVE_FEED_DISPLAY_INDEX = 0;
    renderActiveFiveArticlesBatch();
}

async function executeXMLExtractionQuery(targetURL, sourceChannelName) {
    try {
        const queryEndpoint = `${CORS_SYSTEM_RESOLVER_PREFIX}${encodeURIComponent(targetURL)}`;
        const rawResponse = await fetch(queryEndpoint);
        if (!rawResponse.ok) return;
        
        const responseJSON = await rawResponse.json();
        const XMLDOMParser = new DOMParser();
        const XMLDOMDocument = XMLDOMParser.parseFromString(responseJSON.contents, "text/xml");
        const itemNodesCollection = XMLDOMDocument.querySelectorAll("item");

        itemNodesCollection.forEach((item, index) => {
            if (index > 8) return;
            
            let titleText = item.querySelector("title")?.textContent || "Breaking Updates Encountered";
            titleText = titleText.replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');

            const coreDescription = item.querySelector("description")?.textContent || "";
            const linkAddress = item.querySelector("link")?.textContent || "#";
            const publishDateString = item.querySelector("pubDate")?.textContent || new Date().toUTCString();
            
            let extractionThumbURL = "";
            const mediaContent = item.getElementsByTagName("media:content")[0] || item.getElementsByTagName("enclosure")[0];
            
            if (mediaContent && mediaContent.getAttribute("url")) {
                extractionThumbURL = mediaContent.getAttribute("url");
            } else {
                const matchIMG = coreDescription.match(/<img[^>]+src="([^">]+)"/);
                if (matchIMG && matchIMG[1]) extractionThumbURL = matchIMG[1];
            }

            if (!extractionThumbURL) {
                extractionThumbURL = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60`;
            }

            const sanitizedSnippetText = coreDescription.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) + "...";

            INGESTED_PARSED_ARTICLES_POOL.push({
                id: 'live-article-node-' + Math.random().toString(36).substr(2, 9),
                rawTitle: titleText,
                rawBodySnippet: sanitizedSnippetText,
                originSource: sourceChannelName,
                publishTimestamp: formatArticleTimestampString(publishDateString),
                imageAssetURL: extractionThumbURL,
                sourceRefLink: linkAddress
            });
        });
    } catch (err) {
        console.warn(`Extraction error on: ${sourceChannelName}`, err);
    }
}

function formatArticleTimestampString(rawDateInput) {
    try {
        const dateObj = new Date(rawDateInput);
        if (isNaN(dateObj.getTime())) return "Latest Update";
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + " (Latest)";
    } catch {
        return "Latest / Recent Publication";
    }
}

function registerCustomUserInjectedRSS() {
    const inputField = document.getElementById('custom-rss-input-field');
    const targetedCustomURL = inputField.value.trim();
    if (!targetedCustomURL) {
        alert("Please declare a valid operational endpoint.");
        return;
    }

    triggerSystemToastNotification("Ingesting user-defined custom RSS stream...");
    executeXMLExtractionQuery(targetedCustomURL, "User Ingested Custom Feed Layer").then(() => {
        INGESTED_PARSED_ARTICLES_POOL.sort((a, b) => b.originSource === "User Ingested Custom Feed Layer" ? 1 : -1);
        ACTIVE_FEED_DISPLAY_INDEX = 0;
        renderActiveFiveArticlesBatch();
        toggleEngineSettingsView();
        triggerSystemToastNotification("Custom endpoint mapped.");
        inputField.value = "";
    });
}

function renderActiveFiveArticlesBatch() {
    const displayRoot = document.getElementById('news-feed-target-root');
    displayRoot.innerHTML = "";

    const validationSubsetSlice = INGESTED_PARSED_ARTICLES_POOL.slice(ACTIVE_FEED_DISPLAY_INDEX, ACTIVE_FEED_DISPLAY_INDEX + 5);
    if (validationSubsetSlice.length === 0) {
        displayRoot.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">No further source vectors detected.</div>`;
        return;
    }

    const articleLanguageSelected = document.getElementById('config-target-article-lang').value;
    validationSubsetSlice.forEach(article => {
        let cleanTitle = article.rawTitle.replace(/Alpha-\d+\s*(optionnel)?\s*[:-]?\s*/i, '');
        const targetedRenderTitle = convertTextStringLanguageSimulation(cleanTitle, articleLanguageSelected);
        const targetedRenderSnippet = convertTextStringLanguageSimulation(article.rawBodySnippet, articleLanguageSelected);

        const cardNode = document.createElement('div');
        cardNode.className = "news-card";
        cardNode.onclick = () => launchImmersiveReaderPopUp(article);

        cardNode.innerHTML = `
            <img class="news-thumb" src="${article.imageAssetURL}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600';">
            <div class="news-content">
                <div class="news-meta">🌐 ${article.originSource}  •  📅 ${article.publishTimestamp}</div>
                <div class="news-title">${targetedRenderTitle}</div>
                <div class="news-snippet">${targetedRenderSnippet}</div>
            </div>
        `;
        displayRoot.appendChild(cardNode);
    });
}

function cycleActiveFeedBatch() {
    ACTIVE_FEED_DISPLAY_INDEX += 5;
    if (ACTIVE_FEED_DISPLAY_INDEX >= INGESTED_PARSED_ARTICLES_POOL.length) {
        ACTIVE_FEED_DISPLAY_INDEX = 0;
        triggerSystemToastNotification("Feed cycling sequence complete.");
    }
    renderActiveFiveArticlesBatch();
}

function flushFeedAndRebuild() {
    renderActiveFiveArticlesBatch();
}

function convertTextStringLanguageSimulation(baseInputString, targetedLanguageString) {
    const syntaxGlossaryMap = {
        "French": { prefix: "[FR] ", suffix: "", connectors: "avec la structure" },
        "Spanish": { prefix: "[ES] El ", suffix: " de la noticia", connectors: "con elementos" },
        "German": { prefix: "[DE] Das ", suffix: " nachrichtenblatt", connectors: "und verarbeitung" }
    };
    const ruleSettings = syntaxGlossaryMap[targetedLanguageString];
    if (!ruleSettings) return baseInputString;

    let cleanArray = baseInputString.split(" ");
    if(cleanArray.length > 5) {
        cleanArray.splice(3, 0, ruleSettings.connectors);
    }
    return `${ruleSettings.prefix}${cleanArray.join(" ")}${ruleSettings.suffix}`;
}

function closeImmersiveReader() {
    document.getElementById('immersive-reader-modal-root').style.display = 'none';
}

function triggerAtelierGamesInitializationPipeline(articleObj, fullCombinedArticleText) {
    const indicator = document.getElementById('lock-state-label');
    indicator.textContent = `🔓 State: Active Games Unlocked from "${articleObj.originSource}" source context.`;
    indicator.style.color = "var(--correct-color)";
    indicator.style.background = "#ecfdf5";
    indicator.style.borderColor = "#a7f3d0";
    
    const wordsList = fullCombinedArticleText.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length >= 4 && w.length <= 8);
    const dynamicUniquePool = [...new Set(wordsList)].slice(0, 4);
    const fallbackTargetsList = dynamicUniquePool.length >= 3 ? dynamicUniquePool : ["CORE", "FEED", "VIEW", "TEXT"];

    generateFindAWordGameMatrix(fallbackTargetsList);
    generateWordleGameEngineMatrix(fullCombinedArticleText);
}

function handleFindAWordCellSelectionToggle(cellNode, letterValue, originalTargetList) {
    if(cellNode.classList.contains('permanent')) return;
    cellNode.classList.toggle('selected');
    
    const totalActiveSelectedCells = document.querySelectorAll('#faw-grid-target .faw-cell.selected');
    let compiledSelectedString = "";
    totalActiveSelectedCells.forEach(node => compiledSelectedString += node.textContent);

    originalTargetList.forEach(word => {
        if (compiledSelectedString.includes(word) && !fawSolutionWordsMapping[word].found) {
            fawSolutionWordsMapping[word].found = true;
            document.getElementById(`faw-badge-${word}`).classList.add('found');
            
            totalActiveSelectedCells.forEach(node => {
                node.classList.remove('selected');
                node.classList.add('permanent');
            });
            triggerSystemToastNotification(`Match Found in Grid: "${word}"!`);
        }
    });
}

function generateWordleGameEngineMatrix(sourceArticleText) {
    const filteredFiveLetterWords = sourceArticleText.toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(w => w.length === 5);
    wordleActiveTargetKeyword = filteredFiveLetterWords.length > 0 ? filteredFiveLetterWords[0] : "CORES";
    wordleCurrentAttemptRow = 0;
    wordleIsEngineTerminated = false;

    const gridContainer = document.getElementById('wordle-grid-target');
    const hintNode = document.getElementById('wordle-status-hint');
    
    gridContainer.innerHTML = "";
    hintNode.textContent = "Click grid layout area below to bind active keyboard inputs. Press Enter to submit guesses.";
    
    for (let r = 0; r < 5; r++) {
        const rowStrip = document.createElement('div');
        rowStrip.className = "wordle-row";
        rowStrip.id = `wordle-row-id-${r}`;
        
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = "wordle-cell";
            cell.id = `wordle-cell-coord-${r}-${c}`;
            rowStrip.appendChild(cell);
        }
        gridContainer.appendChild(rowStrip);
    }

    gridContainer.style.cursor = 'pointer';
    gridContainer.onclick = () => document.getElementById('wordle-hidden-input').focus();
    
    const hiddenInput = document.getElementById('wordle-hidden-input');
    hiddenInput.value = "";
    hiddenInput.focus();
}

function handleWordleInputStep(e) {
    if (wordleIsEngineTerminated) return;
    const currentGuessString = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    
    for (let c = 0; c < 5; c++) {
        const targetedCell = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${c}`);
        if (targetedCell) {
            targetedCell.textContent = currentGuessString[c] || "";
        }
    }
}

function handleWordleKeydownStep(e) {
    if (wordleIsEngineTerminated) return;
    if (e.key === 'Enter') {
        const hiddenInput = document.getElementById('wordle-hidden-input');
        const userSubmittedGuess = hiddenInput.value.toUpperCase().replace(/[^A-Z]/g, "");

        if (userSubmittedGuess.length !== 5) {
            document.getElementById('wordle-status-hint').textContent = "⚠️ Guess value entry block string length must match exactly 5 characters.";
            return;
        }

        let matchesCorrectCount = 0;
        for (let i = 0; i < 5; i++) {
            const cellNode = document.getElementById(`wordle-cell-coord-${wordleCurrentAttemptRow}-${i}`);
            const letterCharacter = userSubmittedGuess[i];

            if (wordleActiveTargetKeyword[i] === letterCharacter) {
                cellNode.style.backgroundColor = "var(--correct-color)";
                cellNode.style.borderColor = "var(--correct-color)";
                cellNode.style.color = "#fff";
                matchesCorrectCount++;
            } else if (wordleActiveTargetKeyword.includes(letterCharacter)) {
                cellNode.style.backgroundColor = "var(--accent-yellow)";
                cellNode.style.borderColor = "var(--accent-yellow)";
                cellNode.style.color = "#fff";
            } else {
                cellNode.style.backgroundColor = "var(--text-muted)";
                cellNode.style.borderColor = "var(--text-muted)";
                cellNode.style.color = "#fff";
            }
        }

        if (userSubmittedGuess === wordleActiveTargetKeyword) {
            document.getElementById('wordle-status-hint').textContent = "🎉 Core Target Victory Unlocked!";
            wordleIsEngineTerminated = true;
            return;
        }

        wordleCurrentAttemptRow++;
        hiddenInput.value = "";

        if (wordleCurrentAttemptRow >= 5) {
            document.getElementById('wordle-status-hint').textContent = `💀 All attempts spent. Target was: "${wordleActiveTargetKeyword}"`;
            wordleIsEngineTerminated = true;
        } else {
            document.getElementById('wordle-status-hint').textContent = `Row index ${wordleCurrentAttemptRow}/5 evaluated.`;
        }
    }
}

function updateFlashcardUIContainerDisplay() {
    const counterDisplay = document.getElementById('fc-counter-display');
    const mainContentDisplay = document.getElementById('fc-content-text');

    counterDisplay.textContent = `Deck: ${USER_FLASHCARD_REPOSITORY.length} items`;
    
    if (USER_FLASHCARD_REPOSITORY.length === 0) {
        mainContentDisplay.textContent = "No lookup metrics active. Tap individual words inside any article reading pop-up context to populate tracking data.";
        return;
    }

    const targetedItemNode = USER_FLASHCARD_REPOSITORY[CURRENT_ACTIVE_FLASHCARD_INDEX];
    if (IS_FLASHCARD_FLIPPED) {
        mainContentDisplay.textContent = targetedItemNode.back;
        mainContentDisplay.style.color = "var(--brand-color)";
    } else {
        mainContentDisplay.textContent = targetedItemNode.front;
        mainContentDisplay.style.color = "var(--text-main)";
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
    const sourcesList = ["Le Monde Wire", "BBC Global Portal", "Reuters Terminal Service", "France 24 Multi", "Deutsche Welle Core"];
    for (let i = 1; i <= 25; i++) {
        INGESTED_PARSED_ARTICLES_POOL.push({
            id: `local-fallback-node-id-${i}`,
            rawTitle: `Automated Journalism Transmission Pulse Sequence`,
            rawBodySnippet: `Analyzing advanced tracking arrays and operational performance indexes across structural application engine modules. Data confirms high-efficiency serialization pipelines are functional. Ensure components are balanced carefully.`,
            originSource: sourcesList[i % sourcesList.length],
            publishTimestamp: formatArticleTimestampString(new Date(Date.now() - (i * 3600000)).toUTCString()),
            imageAssetURL: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60`,
            sourceRefLink: "#"
        });
    }
}
