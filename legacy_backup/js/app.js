/**
 * IT Passport Study Guide - Main Application
 */

const app = {
    currentPage: 1,
    totalPages: 611,
    currentChapter: null,
    pageData: {},

    /**
     * Initialize the application
     */
    init() {
        // Initialize modules
        i18n.init();
        furigana.init();

        // Setup event listeners
        this.setupEventListeners();

        // Load saved state
        this.loadState();

        console.log('IT Passport Study Guide initialized');
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevPage')?.addEventListener('click', () => this.prevPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());

        // Chapter selection
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const chapter = parseInt(e.currentTarget.dataset.chapter);
                this.selectChapter(chapter);
            });
        });

        // Mobile menu
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarClose')?.addEventListener('click', () => this.closeSidebar());

        // Settings modal
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('settingsClose')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('settingsModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettings();
        });

        // Font size buttons
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.currentTarget.dataset.size;
                this.setFontSize(size);
            });
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Display mode buttons
        document.querySelectorAll('.display-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const display = e.currentTarget.dataset.display;
                this.setDisplayMode(display);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });

        // Page input handler
        const pageInput = document.getElementById('pageInput');
        if (pageInput) {
            pageInput.addEventListener('change', (e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= this.totalPages) {
                    this.goToPage(page);
                } else {
                    e.target.value = this.currentPage;
                }
            });
            pageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        }

        // Language change event
        window.addEventListener('languageChanged', () => this.updateContent());
    },

    /**
     * Load saved state from localStorage
     */
    loadState() {
        // Load theme
        const theme = localStorage.getItem('itpass_theme') || 'light';
        this.setTheme(theme, false);

        // Load font size
        const fontSize = localStorage.getItem('itpass_fontSize') || 'medium';
        this.setFontSize(fontSize, false);

        // Load last page
        const lastPage = localStorage.getItem('itpass_currentPage');
        if (lastPage) {
            this.currentPage = parseInt(lastPage);
            this.updatePageInfo();
        }
    },

    /**
     * Select a chapter
     */
    selectChapter(chapterId) {
        // Update active state
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.chapter) === chapterId);
        });

        this.currentChapter = chapterId;

        // Get first page of chapter (this would come from data in real app)
        const chapterPages = this.getChapterPages(chapterId);
        if (chapterPages.length > 0) {
            this.goToPage(chapterPages[0]);
        }

        // Close sidebar on mobile
        this.closeSidebar();
    },

    /**
 * Get pages for a chapter
 * Note: File p_0017.png = Book page 1, so offset is 16
 * Book uses: 序章(1-10), 第1章(11-54), 第2章(55-96), etc.
 */
    getChapterPages(chapterId) {
        // Page ranges based on book page numbers
        // File number = Book page number + 16
        const bookPageRanges = {
            0: [1, 10],      // 序章: pages 1-10 → files 17-26
            1: [11, 54],     // 第1章: pages 11-54 → files 27-70
            2: [55, 96],     // 第2章: pages 55-96 → files 71-112
            3: [97, 124],    // 第3章: pages 97-124 → files 113-140
            4: [125, 174],   // 第4章: pages 125-174 → files 141-190
            5: [175, 222],   // 第5章: pages 175-222 → files 191-238
            6: [223, 256],   // 第6章: pages 223-256 → files 239-272
            7: [257, 278],   // 第7章: pages 257-278 → files 273-294
            8: [279, 314],   // 第8章: pages 279-314 → files 295-330
            9: [315, 370],   // 第9章: pages 315-370 → files 331-386
            10: [371, 390],  // 第10章: pages 371-390 → files 387-406
            11: [391, 595]   // 第11章+索引: pages 391-595 → files 407-611
        };

        const OFFSET = 16;  // File number = Book page + 16

        const range = bookPageRanges[chapterId];
        if (range) {
            const startFile = range[0] + OFFSET;
            const endFile = range[1] + OFFSET;
            return Array.from({ length: endFile - startFile + 1 }, (_, i) => startFile + i);
        }
        return [];
    },

    /**
     * Go to a specific page
     */
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) return;

        this.currentPage = pageNum;
        localStorage.setItem('itpass_currentPage', pageNum);
        this.updatePageInfo();
        this.loadPageContent(pageNum);
    },

    /**
     * Go to previous page
     */
    prevPage() {
        this.goToPage(this.currentPage - 1);
    },

    /**
     * Go to next page
     */
    nextPage() {
        this.goToPage(this.currentPage + 1);
    },

    /**
     * Update page info display
     */
    updatePageInfo() {
        const currentPageEl = document.getElementById('currentPage');
        const pageInput = document.getElementById('pageInput');

        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (pageInput) pageInput.value = this.currentPage;

        document.getElementById('prevPage').disabled = this.currentPage <= 1;
        document.getElementById('nextPage').disabled = this.currentPage >= this.totalPages;

        // Update progress
        const progress = (this.currentPage / this.totalPages) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${this.currentPage} / ${this.totalPages} pages`;
    },

    /**
     * Load page content from JSON
     */
    async loadPageContent(pageNum) {
        const pageId = String(pageNum).padStart(4, '0');
        const contentEl = document.getElementById('pageContent');
        const lang = i18n.getLang();

        // Cache busting for JSON data
        const cacheBust = Date.now();

        // Show loading spinner
        contentEl.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span class="loading-text">${lang === 'ja' ? '読み込み中…' : lang === 'vi' ? 'Đang tải…' : 'Loading…'}</span>
            </div>
        `;

        try {
            const response = await fetch(`data/pages/p_${pageId}.json?v=${cacheBust}`);

            if (!response.ok) {
                // Show image fallback if no JSON data yet
                this.showImageFallback(pageNum);
                return;
            }

            const pageData = await response.json();
            this.renderPageContent(pageData);

        } catch (error) {
            // Show image fallback
            this.showImageFallback(pageNum);
        }
    },

    /**
     * Show original image as fallback when no translated data available
     */
    showImageFallback(pageNum) {
        const pageId = String(pageNum).padStart(4, '0');
        const contentEl = document.getElementById('pageContent');
        const lang = i18n.getLang();

        contentEl.innerHTML = `
            <div class="page-fallback">
                <div class="fallback-notice">
                    <span class="notice-icon">📝</span>
                    <p>${lang === 'ja' ? '翻訳データ準備中...' :
                lang === 'vi' ? 'Đang chuẩn bị dữ liệu dịch...' :
                    lang === 'my' ? 'ဘာသာပြန်ဒေတာပြင်ဆင်နေသည်...' :
                        'Translation data coming soon...'}</p>
                </div>
                <div class="page-image-container">
                    <img src="images/p_${pageId}.png" alt="Page ${pageNum}" class="page-image" 
                         onerror="this.parentElement.innerHTML='<p>Image not found</p>'">
                </div>
            </div>
        `;
    },

    /**
     * Render page content from data
     */
    renderPageContent(data) {
        const contentEl = document.getElementById('pageContent');
        const lang = i18n.getLang();
        const pageId = String(data.page_id).padStart(4, '0');
        const savedView = this.getSavedViewMode();

        // Create view toggle and content container
        let html = `
            <div class="content-view-toggle">
                <button class="view-btn ${savedView === 'text' ? 'active' : ''}" data-view="text" onclick="app.toggleView('text')">
                    📝 ${lang === 'ja' ? 'テキスト' : lang === 'vi' ? 'Văn bản' : 'Text'}
                </button>
                <button class="view-btn ${savedView === 'image' ? 'active' : ''}" data-view="image" onclick="app.toggleView('image')">
                    🖼️ ${lang === 'ja' ? '原本画像' : lang === 'vi' ? 'Ảnh gốc' : 'Original'}
                </button>
                <button class="view-btn ${savedView === 'both' ? 'active' : ''}" data-view="both" onclick="app.toggleView('both')">
                    📑 ${lang === 'ja' ? '両方' : lang === 'vi' ? 'Cả hai' : 'Both'}
                </button>
                <button class="view-btn ${savedView === 'vocab' ? 'active' : ''}" data-view="vocab" onclick="app.toggleView('vocab')">
                    📚 ${lang === 'ja' ? '単語帳' : lang === 'vi' ? 'Từ vựng' : 'Vocab'}
                </button>
            </div>
        `;

        // Text content
        html += `<div class="view-content view-text ${savedView === 'text' ? 'active' : ''}">`;
        html += '<div class="page-rendered">';

        data.content.forEach(item => {
            switch (item.type) {
                case 'heading':
                case 'lesson_header':
                    html += this.renderHeading(item, lang);
                    break;
                case 'paragraph':
                    html += this.renderParagraph(item, lang);
                    break;
                case 'exam_tip':
                    html += this.renderExamTip(item, lang);
                    break;
                case 'learn_more':
                case 'info_box':
                    html += this.renderLearnMore(item, lang);
                    break;
                case 'table':
                    html += this.renderTable(item, lang);
                    break;
                case 'quote_box':
                    html += this.renderQuoteBox(item, lang);
                    break;
                case 'exam_question':
                    html += this.renderExamQuestion(item, lang);
                    break;
                case 'answer_explanation':
                    html += this.renderAnswerExplanation(item, lang);
                    break;
                case 'chapter_title':
                    html += `<div class="chapter-title-box">${item[lang] || item.ja}</div>`;
                    break;
                default:
                    if (item.ja) {
                        html += `<p>${item[lang] || item.ja}</p>`;
                    }
            }
        });

        html += '</div></div>';

        // Original image
        html += `
            <div class="view-content view-image ${savedView === 'image' ? 'active' : ''}">
                <div class="page-image-container">
                    <img src="images/p_${pageId}.png" alt="Page ${data.page_id}" class="page-image">
                </div>
            </div>
        `;

        // Both view (side by side)
        html += `
            <div class="view-content view-both ${savedView === 'both' ? 'active' : ''}">
                <div class="split-view">
                    <div class="split-left page-rendered">
                        ${data.content.map(item => {
            switch (item.type) {
                case 'heading':
                case 'lesson_header':
                    return this.renderHeading(item, lang);
                case 'paragraph':
                    return this.renderParagraph(item, lang);
                case 'exam_tip':
                    return this.renderExamTip(item, lang);
                case 'learn_more':
                case 'info_box':
                    return this.renderLearnMore(item, lang);
                case 'table':
                    return this.renderTable(item, lang);
                case 'quote_box':
                    return this.renderQuoteBox(item, lang);
                case 'exam_question':
                    return this.renderExamQuestion(item, lang);
                case 'answer_explanation':
                    return this.renderAnswerExplanation(item, lang);
                default:
                    return item.ja ? `<p>${item[lang] || item.ja}</p>` : '';
            }
        }).join('')}
                    </div>
                    <div class="split-right">
                        <img src="images/p_${pageId}.png" alt="Page ${data.page_id}" class="page-image">
                    </div>
                </div>
            </div>
        `;

        // Vocab view (3 columns: vocab left, content center, image right)
        html += `
            <div class="view-content view-vocab ${savedView === 'vocab' ? 'active' : ''}">
                <div class="vocab-view">
                    <div class="vocab-left">
                        <div class="vocab-left-header">
                            <span>📚</span>
                            <span>${lang === 'ja' ? '単語一覧' : lang === 'vi' ? 'Từ vựng' : 'Vocabulary'}</span>
                        </div>
                        <div class="vocab-list-container">
                            ${this.renderVocabPanel(data, lang)}
                        </div>
                    </div>
                    <div class="vocab-center page-rendered">
                        ${data.content.map(item => {
            switch (item.type) {
                case 'heading':
                case 'lesson_header':
                    return this.renderHeading(item, lang);
                case 'paragraph':
                    return this.renderParagraph(item, lang);
                case 'exam_tip':
                    return this.renderExamTip(item, lang);
                case 'learn_more':
                case 'info_box':
                    return this.renderLearnMore(item, lang);
                case 'table':
                    return this.renderTable(item, lang);
                case 'quote_box':
                    return this.renderQuoteBox(item, lang);
                case 'exam_question':
                    return this.renderExamQuestion(item, lang);
                case 'answer_explanation':
                    return this.renderAnswerExplanation(item, lang);
                default:
                    return item.ja ? `<p>${item[lang] || item.ja}</p>` : '';
            }
        }).join('')}
                    </div>
                    <div class="vocab-right">
                        <img src="images/p_${pageId}.png" alt="Page ${data.page_id}" class="page-image">
                    </div>
                </div>
            </div>
        `;

        contentEl.innerHTML = html;
    },

    /**
     * Toggle view mode (text, image, both)
     */
    toggleView(viewMode) {
        // Save to localStorage
        localStorage.setItem('itpass_viewMode', viewMode);

        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewMode);
        });

        // Update content views
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        document.querySelector(`.view-${viewMode}`)?.classList.add('active');
    },

    /**
     * Get saved view mode or default to 'text'
     */
    getSavedViewMode() {
        return localStorage.getItem('itpass_viewMode') || 'text';
    },

    /**
     * Render vocabulary panel from page data
     */
    renderVocabPanel(data, lang) {
        // Collect all vocabulary
        const vocabSet = new Map(); // Use Map to avoid duplicates

        // Add from vocabulary array
        if (data.vocabulary && Array.isArray(data.vocabulary)) {
            data.vocabulary.forEach(v => {
                if (v.kanji) {
                    vocabSet.set(v.kanji, {
                        kanji: v.kanji,
                        reading: v.reading || '',
                        meaning: v[lang] || v.vi || v.en || ''
                    });
                }
            });
        }

        // Add from paragraph terms
        if (data.content && Array.isArray(data.content)) {
            data.content.forEach(item => {
                if (item.terms && Array.isArray(item.terms)) {
                    item.terms.forEach(t => {
                        if (t.kanji && !vocabSet.has(t.kanji)) {
                            vocabSet.set(t.kanji, {
                                kanji: t.kanji,
                                reading: t.reading || '',
                                meaning: ''
                            });
                        }
                    });
                }
            });
        }

        if (vocabSet.size === 0) {
            return `<div class="vocab-empty">${lang === 'ja' ? '単語データなし' : lang === 'vi' ? 'Chưa có dữ liệu từ vựng' : 'No vocabulary data'}</div>`;
        }

        // Render vocab items using ruby for furigana (controlled by existing toggle)
        let html = '';
        vocabSet.forEach((v, kanji) => {
            const rubyText = v.reading ? furigana.createRuby(v.kanji, v.reading) : v.kanji;
            html += `
                <div class="vocab-item">
                    <div class="vocab-kanji">${rubyText}</div>
                    ${v.meaning ? `<div class="vocab-meaning">${v.meaning}</div>` : ''}
                </div>
            `;
        });

        return html;
    },


    /**
     * Render heading element (bilingual)
     */
    renderHeading(item, lang) {
        const jaText = furigana.createRuby(item.ja, item.reading);

        if (lang === 'ja') {
            return `<h${item.level || 2} class="content-heading">${jaText}</h${item.level || 2}>`;
        }

        return `
            <div class="heading-bilingual">
                <h${item.level || 2} class="content-heading heading-ja">${jaText}</h${item.level || 2}>
                <p class="heading-translation">${item[lang] || item.ja}</p>
            </div>
        `;
    },

    /**
     * Render paragraph with side-by-side translation
     */
    renderParagraph(item, lang) {
        const jaText = item.terms ?
            furigana.parseText(item.ja, item.terms) :
            item.ja;

        if (lang === 'ja') {
            return `<p class="content-paragraph">${jaText}</p>`;
        }

        return `
            <div class="translation-block">
                <div class="translation-ja">
                    <span class="lang-label">🇯🇵</span>
                    ${jaText}
                </div>
                <div class="translation-target">
                    <span class="lang-label">${lang === 'vi' ? '🇻🇳' : lang === 'en' ? '🇬🇧' : '🇲🇲'}</span>
                    ${item[lang] || item.ja}
                </div>
            </div>
        `;
    },

    /**
     * Render exam tip box (bilingual)
     */
    renderExamTip(item, lang) {
        const titleJa = item.title?.ja || i18n.t('exam_tip');
        const titleTrans = item.title?.[lang] || titleJa;
        const contentJa = item.content?.ja || '';
        const contentTrans = item.content?.[lang] || contentJa;

        // Apply furigana to content if terms exist
        const contentWithFurigana = item.content?.terms ?
            furigana.parseText(contentJa, item.content.terms) : contentJa;

        if (lang === 'ja') {
            return `
                <div class="exam-tip">
                    <div class="exam-tip-header"><span>🎯</span><span>${titleJa}</span></div>
                    <div class="exam-tip-content">${contentWithFurigana}</div>
                </div>
            `;
        }

        return `
            <div class="exam-tip">
                <div class="exam-tip-header"><span>🎯</span><span>${titleJa} <span class="header-trans">(${titleTrans})</span></span></div>
                <div class="bilingual-content">
                    <div class="bilingual-ja">🇯🇵 ${contentWithFurigana}</div>
                    <div class="bilingual-trans">${this.getLangFlag(lang)} ${contentTrans}</div>
                </div>
            </div>
        `;
    },

    /**
     * Render learn more box (bilingual)
     */
    renderLearnMore(item, lang) {
        const titleJa = item.title?.ja || i18n.t('learn_more');
        const titleTrans = item.title?.[lang] || titleJa;
        const contentJa = item.content?.ja || '';
        const contentTrans = item.content?.[lang] || contentJa;

        // Apply furigana to content if terms exist
        const contentWithFurigana = item.content?.terms ?
            furigana.parseText(contentJa, item.content.terms) : contentJa;

        if (lang === 'ja') {
            return `
                <div class="learn-more">
                    <div class="learn-more-header"><span>💡</span><span>${titleJa}</span></div>
                    <div class="learn-more-content">${contentWithFurigana}</div>
                </div>
            `;
        }

        return `
            <div class="learn-more">
                <div class="learn-more-header"><span>💡</span><span>${titleJa} <span class="header-trans">(${titleTrans})</span></span></div>
                <div class="bilingual-content">
                    <div class="bilingual-ja">🇯🇵 ${contentWithFurigana}</div>
                    <div class="bilingual-trans">${this.getLangFlag(lang)} ${contentTrans}</div>
                </div>
            </div>
        `;
    },

    /**
     * Get flag emoji for language
     */
    getLangFlag(lang) {
        const flags = { vi: '🇻🇳', en: '🇬🇧', my: '🇲🇲', ja: '🇯🇵' };
        return flags[lang] || '🌐';
    },

    /**
     * Render quote box (bilingual)
     */
    renderQuoteBox(item, lang) {
        const jaText = item.ja || '';
        const transText = item[lang] || jaText;

        // Apply furigana if terms exist
        const jaWithFurigana = item.terms ?
            furigana.parseText(jaText, item.terms) : jaText;

        if (lang === 'ja') {
            return `
                <div class="quote-box">
                    <div class="quote-content">${jaWithFurigana}</div>
                </div>
            `;
        }

        return `
            <div class="quote-box">
                <div class="bilingual-content">
                    <div class="bilingual-ja">🇯🇵 ${jaWithFurigana}</div>
                    <div class="bilingual-trans">${this.getLangFlag(lang)} ${transText}</div>
                </div>
            </div>
        `;
    },

    /**
     * Render exam question (bilingual)
     */
    renderExamQuestion(item, lang) {
        const number = item.number || '';
        const year = item.year || '';
        const questionJa = item.question?.ja || '';
        const questionTrans = item.question?.[lang] || questionJa;
        const options = item.options?.ja || [];
        const optionsTrans = item.options?.[lang] || options;
        const answer = item.answer || '';

        let optionsHtml = '<div class="exam-options">';
        options.forEach((opt, i) => {
            const optTrans = optionsTrans[i] || opt;
            const isAnswer = opt.startsWith(answer) || opt.includes(`${answer}.`) || opt.includes(`${answer} `);
            optionsHtml += `<div class="exam-option ${isAnswer ? 'correct-answer' : ''}">${opt}</div>`;
        });
        optionsHtml += '</div>';

        if (lang === 'ja') {
            return `
                <div class="exam-question">
                    <div class="exam-header">
                        <span class="exam-number">問題 ${number}</span>
                        <span class="exam-year">${year}</span>
                    </div>
                    <div class="exam-question-text">${questionJa}</div>
                    ${optionsHtml}
                </div>
            `;
        }

        return `
            <div class="exam-question">
                <div class="exam-header">
                    <span class="exam-number">問題 ${number}</span>
                    <span class="exam-year">${year}</span>
                </div>
                <div class="bilingual-content">
                    <div class="bilingual-ja">🇯🇵 ${questionJa}</div>
                    <div class="bilingual-trans">${this.getLangFlag(lang)} ${questionTrans}</div>
                </div>
                ${optionsHtml}
            </div>
        `;
    },

    /**
     * Render answer explanation (bilingual)
     */
    renderAnswerExplanation(item, lang) {
        const number = item.number || '';
        const answer = item.answer || '';
        const explanationJa = item.explanation?.ja || '';
        const explanationTrans = item.explanation?.[lang] || explanationJa;

        if (lang === 'ja') {
            return `
                <div class="answer-explanation">
                    <div class="answer-header">
                        <span class="answer-number">解答 ${number}</span>
                        <span class="answer-value">正解：${answer}</span>
                    </div>
                    <div class="answer-text">${explanationJa.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }

        return `
            <div class="answer-explanation">
                <div class="answer-header">
                    <span class="answer-number">解答 ${number}</span>
                    <span class="answer-value">正解：${answer}</span>
                </div>
                <div class="bilingual-content">
                    <div class="bilingual-ja">🇯🇵 ${explanationJa.replace(/\n/g, '<br>')}</div>
                    <div class="bilingual-trans">${this.getLangFlag(lang)} ${explanationTrans.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `;
    },

    /**
     * Render table
     */
    renderTable(item, lang) {
        const headers = item.headers?.[lang] || item.headers?.ja || [];
        const rows = item.rows || [];

        let html = `<table class="content-table">`;

        if (headers.length) {
            html += '<thead><tr>';
            headers.forEach(h => html += `<th>${h}</th>`);
            html += '</tr></thead>';
        }

        html += '<tbody>';
        rows.forEach(row => {
            const cells = row[lang] || row.ja || [];
            html += '<tr>';
            cells.forEach(cell => html += `<td>${cell}</td>`);
            html += '</tr>';
        });
        html += '</tbody></table>';

        return html;
    },

    /**
     * Update content when language changes
     */
    updateContent() {
        if (this.currentPage) {
            this.loadPageContent(this.currentPage);
        }
    },

    /**
     * Toggle sidebar visibility
     */
    toggleSidebar() {
        document.getElementById('sidebar')?.classList.toggle('open');
    },

    /**
     * Close sidebar
     */
    closeSidebar() {
        document.getElementById('sidebar')?.classList.remove('open');
    },

    /**
     * Open settings modal
     */
    openSettings() {
        document.getElementById('settingsModal')?.classList.add('open');
    },

    /**
     * Close settings modal
     */
    closeSettings() {
        document.getElementById('settingsModal')?.classList.remove('open');
    },

    /**
     * Set font size
     */
    setFontSize(size, save = true) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);

        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });

        if (save) localStorage.setItem('itpass_fontSize', size);
    },

    /**
     * Set theme
     */
    setTheme(theme, save = true) {
        document.documentElement.dataset.theme = theme;

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        if (save) localStorage.setItem('itpass_theme', theme);
    },

    /**
     * Set display mode
     */
    setDisplayMode(mode, save = true) {
        document.body.dataset.displayMode = mode;

        document.querySelectorAll('.display-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.display === mode);
        });

        if (save) localStorage.setItem('itpass_displayMode', mode);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());

// Export for debugging
window.app = app;
