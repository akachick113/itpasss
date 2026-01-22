/**
 * Furigana Module
 * Handles toggling of furigana (reading hints) above Kanji characters
 */

const furigana = {
    isEnabled: true,

    /**
     * Initialize furigana module
     */
    init() {
        // Load saved preference
        const saved = localStorage.getItem('itpass_furigana');
        this.isEnabled = saved === null ? true : saved === 'true';

        // Apply initial state
        this.apply();

        // Setup toggle button
        const toggleBtn = document.getElementById('furiganaToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    /**
     * Toggle furigana visibility
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('itpass_furigana', this.isEnabled);
        this.apply();
    },

    /**
     * Apply current furigana state to DOM
     */
    apply() {
        document.body.classList.toggle('hide-furigana', !this.isEnabled);

        const toggleBtn = document.getElementById('furiganaToggle');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active', this.isEnabled);
        }
    },

    /**
     * Parse text and wrap Kanji with ruby tags
     * @param {string} text - Japanese text
     * @param {Array} terms - Array of {kanji, reading} objects
     * @returns {string} HTML with ruby tags
     */
    parseText(text, terms = []) {
        if (!terms || terms.length === 0) return text;

        let result = text;

        terms.forEach(term => {
            if (term.kanji && term.reading) {
                const regex = new RegExp(term.kanji, 'g');
                result = result.replace(regex,
                    `<ruby>${term.kanji}<rt class="furigana">${term.reading}</rt></ruby>`
                );
            }
        });

        return result;
    },

    /**
     * Create a ruby element
     * @param {string} kanji - Kanji text
     * @param {string} reading - Hiragana reading
     * @returns {string} Ruby HTML
     */
    createRuby(kanji, reading) {
        return `<ruby>${kanji}<rt class="furigana">${reading}</rt></ruby>`;
    },

    /**
     * Get current state
     */
    getState() {
        return this.isEnabled;
    }
};

// Export for use in other modules
window.furigana = furigana;
