// App State
const state = {
    activeTab: 'conversation',
    inputMode: 'romaji', // 'romaji', 'japanese', 'english'
    kanjiData: null,
    currentKanji: null,
    kanjiKeys: [],
    levelFilter: 'all',
    quizMode: false,
    currentQuizAnswer: null
};

// ===== FUZZY MATCHING UTILITIES =====
// Levenshtein distance for typo tolerance
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[m][n];
}

// Calculate similarity percentage (0-100)
function similarity(str1, str2) {
    if (!str1 || !str2) return 0;
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    if (str1 === str2) return 100;
    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 100;
    const distance = levenshteinDistance(str1, str2);
    return Math.round((1 - distance / maxLen) * 100);
}

// Check if input matches any of the acceptable answers (forgiving)
function isCloseMatch(input, acceptableAnswers, threshold = 70) {
    input = input.toLowerCase().trim();
    
    for (const answer of acceptableAnswers) {
        const answerLower = answer.toLowerCase().trim();
        
        // Exact match
        if (input === answerLower) return { match: true, similarity: 100, matched: answer };
        
        // Contains match (for partial answers)
        if (answerLower.includes(input) || input.includes(answerLower)) {
            return { match: true, similarity: 90, matched: answer };
        }
        
        // Check individual words in multi-word answers
        const answerWords = answerLower.split(/[\s\/,]+/);
        for (const word of answerWords) {
            if (word.length > 2 && similarity(input, word) >= threshold) {
                return { match: true, similarity: similarity(input, word), matched: answer };
            }
        }
        
        // Fuzzy match on full string
        const sim = similarity(input, answerLower);
        if (sim >= threshold) {
            return { match: true, similarity: sim, matched: answer };
        }
    }
    
    return { match: false, similarity: 0, matched: null };
}

// Normalize romaji input (handle common variations)
function normalizeRomaji(text) {
    return text.toLowerCase()
        .replace(/ou/g, 'o')  // long o
        .replace(/uu/g, 'u')  // long u
        .replace(/aa/g, 'a')  // long a
        .replace(/ii/g, 'i')  // long i
        .replace(/ee/g, 'e')  // long e
        .replace(/nn/g, 'n')  // double n
        .replace(/[\s\-_]/g, '') // remove spaces/dashes
        .trim();
}

// DOM Elements
const elements = {
    // Tabs
    tabButtons: document.querySelectorAll('.nav-btn'),
    tabContents: document.querySelectorAll('.tab-content'),

    // Chat
    chatMessages: document.getElementById('chat-messages'),
    userInput: document.getElementById('user-input'),
    inputModeSelect: document.getElementById('input-mode'),
    sendBtn: document.getElementById('send-btn'),

    // Flashcards
    flashcardContainer: document.querySelector('.flashcard-container'),
    card: document.querySelector('.card'),
    cardKanji: document.querySelector('.kanji-large'),
    kanjiReading: document.querySelector('.kanji-reading'),
    cardMeaning: document.querySelector('.meaning'),
    cardOn: document.querySelector('.onyomi'),
    cardKun: document.querySelector('.kunyomi'),
    cardJlpt: document.querySelector('.jlpt-badge'),
    cardStrokes: document.querySelector('.stroke-count'),
    nextCardBtn: document.getElementById('next-card-btn'),
    levelSelect: document.getElementById('flashcard-level'),
    
    // Quiz Mode
    flashcardMode: document.getElementById('flashcard-mode'),
    quizSection: document.getElementById('quiz-section'),
    quizAnswer: document.getElementById('quiz-answer'),
    submitQuiz: document.getElementById('submit-quiz'),
    quizFeedback: document.getElementById('quiz-feedback'),
    quizScore: document.getElementById('quiz-score'),
    quizTotal: document.getElementById('quiz-total'),
    quizStreak: document.getElementById('quiz-streak'),
    hintText: document.querySelector('.hint-text')
};

// Quiz State
const quizState = {
    score: 0,
    total: 0,
    streak: 0,
    currentKanjiKey: null,
    isQuizMode: false
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    setupEventListeners();
    await loadKanjiData();
    switchTab('conversation'); // Default tab
}

function setupEventListeners() {
    // Tab Switching
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Chat
    elements.sendBtn.addEventListener('click', handleSendMessage);
    elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Input Mode
    elements.inputModeSelect.addEventListener('change', (e) => {
        switchInputMode(e.target.value);
    });

    // Wanakana Binding
    wanakana.bind(elements.userInput);

    // Flashcards - Browse mode click to flip
    elements.card.addEventListener('click', () => {
        if (!quizState.isQuizMode) {
            elements.card.classList.toggle('is-flipped');
        }
    });

    elements.nextCardBtn.addEventListener('click', () => {
        elements.card.classList.remove('is-flipped');
        if (elements.quizFeedback) elements.quizFeedback.textContent = '';
        if (elements.quizFeedback) elements.quizFeedback.className = 'quiz-feedback';
        if (elements.quizAnswer) elements.quizAnswer.value = '';
        setTimeout(loadNextKanji, 300);
    });

    elements.levelSelect.addEventListener('change', (e) => {
        state.levelFilter = e.target.value;
        loadNextKanji();
    });
    
    // Quiz Mode Toggle
    if (elements.flashcardMode) {
        elements.flashcardMode.addEventListener('change', (e) => {
            toggleQuizMode(e.target.value === 'quiz');
        });
    }
    
    // Quiz Submit
    if (elements.submitQuiz) {
        elements.submitQuiz.addEventListener('click', checkQuizAnswer);
    }
    
    if (elements.quizAnswer) {
        elements.quizAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkQuizAnswer();
        });
    }
}

// Toggle Quiz Mode
function toggleQuizMode(isQuiz) {
    quizState.isQuizMode = isQuiz;
    
    if (elements.quizSection) {
        elements.quizSection.style.display = isQuiz ? 'block' : 'none';
    }
    
    if (elements.hintText) {
        elements.hintText.textContent = isQuiz ? 'Answer below!' : 'Click to Flip';
    }
    
    // Reset card flip state
    elements.card.classList.remove('is-flipped');
    
    // In quiz mode, disable clicking to flip
    if (isQuiz) {
        loadNextKanji();
        if (elements.quizAnswer) elements.quizAnswer.focus();
    }
}

// Check Quiz Answer with Fuzzy Matching
function checkQuizAnswer() {
    if (!state.currentKanji || !elements.quizAnswer) return;
    
    const userAnswer = elements.quizAnswer.value.trim();
    if (!userAnswer) return;
    
    const k = state.currentKanji;
    
    // Build list of acceptable answers
    const acceptableAnswers = [
        ...k.meanings,
        ...k.readings_on,
        ...k.readings_kun
    ].filter(a => a && a.length > 0);
    
    // Also add normalized versions
    const normalizedAnswers = acceptableAnswers.map(a => normalizeRomaji(a));
    const allAnswers = [...acceptableAnswers, ...normalizedAnswers];
    
    // Check with fuzzy matching (threshold 60% for more forgiveness)
    const result = isCloseMatch(userAnswer, allAnswers, 60);
    
    quizState.total++;
    
    if (result.match) {
        // Correct or close enough
        if (result.similarity >= 85) {
            // Fully correct
            quizState.score++;
            quizState.streak++;
            elements.quizFeedback.textContent = `✓ Correct! ${k.meanings.slice(0, 2).join(', ')}`;
            elements.quizFeedback.className = 'quiz-feedback correct';
        } else {
            // Close enough - still count it
            quizState.score++;
            quizState.streak++;
            elements.quizFeedback.textContent = `✓ Close enough! "${result.matched}" - Full answer: ${k.meanings.slice(0, 2).join(', ')}`;
            elements.quizFeedback.className = 'quiz-feedback close';
        }
    } else {
        // Incorrect
        quizState.streak = 0;
        elements.quizFeedback.textContent = `✗ The answer was: ${k.meanings.slice(0, 2).join(', ')} (${k.readings_on[0] || k.readings_kun[0] || ''})`;
        elements.quizFeedback.className = 'quiz-feedback incorrect';
        
        // Show the card back
        elements.card.classList.add('is-flipped');
    }
    
    // Update stats display
    if (elements.quizScore) elements.quizScore.textContent = quizState.score;
    if (elements.quizTotal) elements.quizTotal.textContent = quizState.total;
    if (elements.quizStreak) elements.quizStreak.textContent = `🔥 Streak: ${quizState.streak}`;
}

// Data Loading
async function loadKanjiData() {
    try {
        // Use global variable from kanji_data.js instead of fetch
        if (typeof KANJI_DATA !== 'undefined') {
            state.kanjiData = KANJI_DATA;
            state.kanjiKeys = Object.keys(state.kanjiData);
            console.log(`Loaded ${state.kanjiKeys.length} Kanji`);
            loadNextKanji();
        } else {
            throw new Error("KANJI_DATA is not defined");
        }
    } catch (error) {
        console.error("Failed to load Kanji data:", error);
        addChatMessage("System", "Failed to load Kanji data.", "system");
    }
}

// Tab Logic
function switchTab(tabId) {
    state.activeTab = tabId;
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

// Input Mode Logic
function switchInputMode(mode) {
    state.inputMode = mode;
    wanakana.unbind(elements.userInput);

    if (mode === 'romaji') {
        wanakana.bind(elements.userInput);
        elements.userInput.placeholder = "Type in Romaji (converts)...";
    } else if (mode === 'japanese') {
        elements.userInput.placeholder = "Type in Japanese directly...";
    } else {
        elements.userInput.placeholder = "Type in English...";
    }
    elements.userInput.focus();
}

// Flashcard Logic
function loadNextKanji() {
    if (!state.kanjiData) return;

    // Filter Kanji based on Level
    let filteredKeys = state.kanjiKeys;
    if (state.levelFilter !== 'all') {
        const targetLevel = parseInt(state.levelFilter);
        filteredKeys = state.kanjiKeys.filter(key => {
            const k = state.kanjiData[key];
            return k.jlpt_new === targetLevel;
        });
    }

    if (filteredKeys.length === 0) {
        // Fallback if no kanji found for level
        filteredKeys = state.kanjiKeys;
    }

    // Pick Random
    const randomKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
    const kBtn = state.kanjiData[randomKey];
    state.currentKanji = kBtn;
    state.currentKanjiKey = randomKey;

    // Render Front - show kanji and primary reading
    elements.cardKanji.textContent = randomKey;
    
    // Show romaji reading below the kanji
    const primaryReading = kBtn.readings_on[0] || kBtn.readings_kun[0] || '';
    const romajiReading = wanakana.toRomaji(primaryReading.replace(/[.\-]/g, ''));
    if (elements.kanjiReading) {
        elements.kanjiReading.textContent = romajiReading ? `( ${romajiReading} )` : '';
    }

    // Render Back
    elements.cardMeaning.textContent = kBtn.meanings.slice(0, 3).join(", ");
    elements.cardOn.textContent = kBtn.readings_on.slice(0, 3).join(", ") || "-";
    elements.cardKun.textContent = kBtn.readings_kun.slice(0, 3).join(", ") || "-";
    elements.cardJlpt.textContent = kBtn.jlpt_new ? `N${kBtn.jlpt_new}` : "N?";
    elements.cardStrokes.textContent = `Strokes: ${kBtn.strokes}`;
}

// Chat Logic
function handleSendMessage() {
    const text = elements.userInput.value.trim();
    if (!text) return;

    // Add User Message
    addChatMessage('User', text, 'user');
    elements.userInput.value = '';

    // Simulate Processing Delay
    setTimeout(() => {
        const response = generateAIResponse(text);
        addChatMessage('Nihongo Helper', response.japanese, 'ai', response.romaji, response.english);
    }, 600);
}

function addChatMessage(sender, text, type, romaji = '', english = '') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type} glass`;

    let content = '';
    if (type === 'ai') {
        content = `
            <div class="jp-text">${text}</div>
            <div class="romaji-text">${romaji}</div>
            <div class="en-text">${english}</div>
        `;
    } else {
        // For user messages: show original text, then kanji conversion, then romaji
        const romajiVersion = wanakana.toRomaji(text);
        const hiraganaVersion = wanakana.toHiragana(romajiVersion);
        const isJapanese = wanakana.isJapanese(text);
        const isHiragana = wanakana.isHiragana(text);
        
        // If user typed in romaji mode, text is already hiragana
        // Show: Japanese text + romaji below
        if (isJapanese || isHiragana) {
            content = `
                <div class="jp-text">${text}</div>
                <div class="romaji-text">${romajiVersion}</div>
            `;
        } else {
            // User typed in English - show as is with hiragana conversion attempt
            content = `
                <div class="jp-text">${text}</div>
                <div class="romaji-text">${hiraganaVersion !== text ? hiraganaVersion + ' / ' : ''}${romajiVersion}</div>
            `;
        }
    }

    msgDiv.innerHTML = content;
    elements.chatMessages.appendChild(msgDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function generateAIResponse(input) {
    const lowerInput = input.toLowerCase().trim();
    const romajiInput = wanakana.toRomaji(input).toLowerCase();
    const normalizedInput = normalizeRomaji(romajiInput);
    
    // 1. Check Pre-defined Patterns with FUZZY MATCHING
    if (typeof CONVERSATIONS !== 'undefined') {
        let bestMatch = null;
        let bestSimilarity = 0;
        
        for (const pattern of CONVERSATIONS.patterns) {
            // Collect all triggers for fuzzy matching
            const triggers = pattern.triggers.map(t => t.toLowerCase());
            
            // Check for exact/contains match first (fast path)
            for (const trigger of triggers) {
                if (lowerInput.includes(trigger) || romajiInput.includes(trigger)) {
                    const resp = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
                    return resp;
                }
            }
            
            // Check fuzzy match with typo tolerance
            const fuzzyResult = isCloseMatch(lowerInput, triggers, 65);
            if (fuzzyResult.match && fuzzyResult.similarity > bestSimilarity) {
                bestSimilarity = fuzzyResult.similarity;
                bestMatch = pattern;
            }
            
            // Also check against normalized romaji
            const normalizedTriggers = triggers.map(t => normalizeRomaji(t));
            const fuzzyRomaji = isCloseMatch(normalizedInput, normalizedTriggers, 65);
            if (fuzzyRomaji.match && fuzzyRomaji.similarity > bestSimilarity) {
                bestSimilarity = fuzzyRomaji.similarity;
                bestMatch = pattern;
            }
        }
        
        // If we found a fuzzy match
        if (bestMatch && bestSimilarity >= 65) {
            const resp = bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
            return resp;
        }
    }

    // 2. Check for Kanji Lookup (Dynamic Dictionary)
    if (state.kanjiData) {
        for (const char of input) {
            if (state.kanjiData[char]) {
                const k = state.kanjiData[char];
                const meanings = k.meanings.join(", ");
                const readings = [...k.readings_on, ...k.readings_kun].join(", ");

                return {
                    japanese: `「${char}」ですね！意味は「${meanings}」です。`,
                    romaji: `"${char}" desu ne! Imi wa "${meanings}" desu.`,
                    english: `That's "${char}"! It means "${meanings}". Readings: ${readings}`
                };
            }
        }
    }
    
    // 3. Check vocabulary for word lookups with fuzzy matching
    if (typeof VOCABULARY !== 'undefined') {
        for (const category in VOCABULARY) {
            for (const word of VOCABULARY[category]) {
                const possibleMatches = [
                    word.romaji.toLowerCase(),
                    word.english.toLowerCase(),
                    normalizeRomaji(word.romaji)
                ];
                
                const fuzzyResult = isCloseMatch(lowerInput, possibleMatches, 70);
                if (fuzzyResult.match) {
                    return {
                        japanese: `「${word.kanji}」ですね！`,
                        romaji: `"${word.romaji}" desu ne!`,
                        english: `That's "${word.english}"!`
                    };
                }
            }
        }
    }

    // 4. Default Fallback
    const defaults = CONVERSATIONS?.default_responses || [
        { japanese: "面白いですね。", romaji: "Omoshiroi desu ne.", english: "That's interesting." }
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}
