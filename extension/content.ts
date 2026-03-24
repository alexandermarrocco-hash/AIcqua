import { calculateCloudWater } from '../calculator';

// Configuration
const DEBOUNCE_MS = 1000;
const WORDS_TO_TOKENS = 0.75;
const THRESHOLD_ML = 1000;
const IMAGE_COST_ML = 500;

/**
 * Helper to update storage stats safely with deltas.
 */
function updateStorage(deltaMl: number, type: 'text' | 'image' = 'text') {
    if (Math.abs(deltaMl) < 0.01) return;

    chrome.storage.local.get(['waterStats'], (result) => {
        const stats = result.waterStats || { totalMl: 0, textMl: 0, imageMl: 0, sessionCount: 0, lastUpdate: 0 };
        stats.totalMl = Math.max(0, stats.totalMl + deltaMl);
        if (type === 'text') {
            stats.textMl = Math.max(0, (stats.textMl || 0) + deltaMl);
        } else if (type === 'image') {
            stats.imageMl = Math.max(0, (stats.imageMl || 0) + deltaMl);
        }
        if (deltaMl > 0) stats.sessionCount += 1;
        stats.lastUpdate = Date.now();
        chrome.storage.local.set({ waterStats: stats });
    });
}

/**
 * Tracks and badges AI-Generated Images (DALL-E) based on precise selectors.
 */
function processGeneratedImages() {
    // Precise selectors provided by user
    const generatedImages = document.querySelectorAll('img[alt="Generated image"], [aria-label="Generated image"] img');

    generatedImages.forEach((img) => {
        if (img.getAttribute('data-water-counted') === 'true') return;

        img.setAttribute('data-water-counted', 'true');
        updateStorage(IMAGE_COST_ML, 'image');

        // UI Placement: Nest badge in the nearest relative wrapper
        const wrapper = img.closest('div') || img.parentElement;
        if (wrapper) {
            const wrapperElem = wrapper as HTMLElement;
            // Force relative positioning if not set to ensure absolute badge works
            if (getComputedStyle(wrapperElem).position === 'static') {
                wrapperElem.style.position = 'relative';
            }

            const badge = document.createElement('div');
            badge.className = 'water-footprint-badge';
            badge.textContent = `🎨 500 ml`;

            // Inline styles for high visibility on images as requested
            Object.assign(badge.style, {
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: '100',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                pointerEvents: 'none',
                backdropFilter: 'blur(4px)'
            });

            wrapperElem.appendChild(badge);
            console.log("AIcqua: Precise DALL-E image detected and badge added.");
        }
    });
}

/**
 * Creates or updates the water footprint badge for an assistant text message.
 */
function updateTextMessageBadge(messageElement: Element) {
    // We only count text here. Images are handled by processGeneratedImages separately.
    const text = (messageElement as HTMLElement).innerText || "";
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount < 2) return;

    const lastWordCount = parseInt(messageElement.getAttribute('data-last-word-count') || '0');
    if (lastWordCount === wordCount) return;

    // Calculate Text Water
    const tokens = Math.ceil(wordCount / WORDS_TO_TOKENS);
    const waterML = calculateCloudWater(tokens, 'GOOGLE_US');

    // UI Logic
    let badge = messageElement.querySelector('.water-footprint-text-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.className = 'water-footprint-badge water-footprint-text-badge';
        const injectionPoint = messageElement.querySelector('.markdown, .prose, .message-content, [data-testid="message-content"]') || messageElement;
        injectionPoint.appendChild(badge);
    }

    badge.textContent = `💧 ${waterML.toFixed(1)} ml`;

    if (waterML > THRESHOLD_ML) {
        badge.classList.add('high-consumption');
    } else {
        badge.classList.remove('high-consumption');
    }

    // Storage Sync for Text (Delta)
    const prevTokens = Math.ceil(lastWordCount / WORDS_TO_TOKENS);
    const prevTextML = calculateCloudWater(prevTokens, 'GOOGLE_US');
    updateStorage(waterML - prevTextML, 'text');

    messageElement.setAttribute('data-last-word-count', wordCount.toString());
}

/**
 * Scans the entire page for messages and images.
 */
function scanPage() {
    // 1. Process Images (highest priority precision)
    processGeneratedImages();

    // 2. Process Assistant Text Messages
    const assistantSelectors = [
        '[data-message-author-role="assistant"]',
        '[data-message-author="assistant"]',
        '.font-claude-message',
        '[data-testid="message-container"]'
    ];

    const messages = document.querySelectorAll(assistantSelectors.join(', '));
    messages.forEach(msg => {
        const isAssistant =
            msg.getAttribute('data-message-author-role') === 'assistant' ||
            msg.getAttribute('data-message-author') === 'assistant' ||
            msg.classList.contains('font-claude-message') ||
            (msg.getAttribute('data-testid') === 'message-container' &&
                (msg.textContent?.includes('Claude') || msg.querySelector('.font-claude-message')));

        if (isAssistant) {
            updateTextMessageBadge(msg);
        }
    });
}

/**
 * Observer for dynamic changes.
 */
let debounceTimer: number | null = null;
const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(scanPage, DEBOUNCE_MS);
});

// INITIALIZATION
function init() {
    console.log("AIcqua: Initializing Precise DALL-E Tracking...");

    // Initial scans
    setTimeout(scanPage, 1000);
    setTimeout(scanPage, 3000); // Catch slower loads

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    window.addEventListener('load', init);
}
