/**
 * Internationalization (i18n) Module
 * Handles multi-language support for Vietnamese, English, and Myanmar
 */

const i18n = {
    currentLang: 'ja',
    
    // UI translations
    translations: {
        ja: {
            furigana: 'ふりがな',
            chapters: '目次',
            vocabulary: '用語集',
            settings: '設定',
            prev: '前へ',
            next: '次へ',
            exam_tip: '試験にはコレが出る!',
            learn_more: 'もうすこし詳しく!',
            search: '検索',
            progress: '進捗',
            page: 'ページ'
        },
        vi: {
            furigana: 'Phiên âm',
            chapters: 'Mục lục',
            vocabulary: 'Từ vựng',
            settings: 'Cài đặt',
            prev: 'Trước',
            next: 'Tiếp',
            exam_tip: 'Thi có ra!',
            learn_more: 'Tìm hiểu thêm!',
            search: 'Tìm kiếm',
            progress: 'Tiến độ',
            page: 'Trang'
        },
        en: {
            furigana: 'Furigana',
            chapters: 'Contents',
            vocabulary: 'Vocabulary',
            settings: 'Settings',
            prev: 'Prev',
            next: 'Next',
            exam_tip: 'Exam Tip!',
            learn_more: 'Learn More!',
            search: 'Search',
            progress: 'Progress',
            page: 'Page'
        },
        my: {
            furigana: 'ဖူရိဂါးနား',
            chapters: 'မာတိကာ',
            vocabulary: 'ဝေါဟာရ',
            settings: 'ဆက်တင်များ',
            prev: 'ရှေ့',
            next: 'နောက်',
            exam_tip: 'စာမေးပွဲအတွက်!',
            learn_more: 'ပိုမိုလေ့လာပါ!',
            search: 'ရှာဖွေရန်',
            progress: 'တိုးတက်မှု',
            page: 'စာမျက်နှာ'
        }
    },
    
    // Chapter titles in all languages
    chapterTitles: {
        0: {
            ja: '序章 - ITパスポート試験の概要',
            vi: 'Mở đầu - Tổng quan kỳ thi IT Passport',
            en: 'Introduction - IT Passport Exam Overview',
            my: 'နိဒါန်း - IT Passport စာမေးပွဲ အကျဉ်းချုပ်'
        },
        1: {
            ja: '第1章 - 企業活動',
            vi: 'Chương 1 - Hoạt động doanh nghiệp',
            en: 'Chapter 1 - Business Activities',
            my: 'အခန်း ၁ - စီးပွားရေးလုပ်ငန်းများ'
        },
        2: {
            ja: '第2章 - 法務',
            vi: 'Chương 2 - Pháp luật',
            en: 'Chapter 2 - Legal Affairs',
            my: 'အခန်း ၂ - ဥပဒေရေးရာ'
        },
        3: {
            ja: '第3章 - 経営戦略マネジメント',
            vi: 'Chương 3 - Quản lý chiến lược kinh doanh',
            en: 'Chapter 3 - Business Strategy Management',
            my: 'အခန်း ၃ - စီးပွားရေးဗျူဟာစီမံခန့်ခွဲမှု'
        },
        4: {
            ja: '第4章 - 技術戦略マネジメント',
            vi: 'Chương 4 - Quản lý chiến lược công nghệ',
            en: 'Chapter 4 - Technology Strategy Management',
            my: 'အခန်း ၄ - နည်းပညာဗျူဟာစီမံခန့်ခွဲမှု'
        },
        5: {
            ja: '第5章 - システム戦略',
            vi: 'Chương 5 - Chiến lược hệ thống',
            en: 'Chapter 5 - System Strategy',
            my: 'အခန်း ၅ - စနစ်ဗျူဟာ'
        },
        6: {
            ja: '第6章 - 開発技術',
            vi: 'Chương 6 - Công nghệ phát triển',
            en: 'Chapter 6 - Development Technology',
            my: 'အခန်း ၆ - ဖွံ့ဖြိုးတိုးတက်ရေးနည်းပညာ'
        },
        7: {
            ja: '第7章 - プロジェクトマネジメント',
            vi: 'Chương 7 - Quản lý dự án',
            en: 'Chapter 7 - Project Management',
            my: 'အခန်း ၇ - ပရောဂျက်စီမံခန့်ခွဲမှု'
        },
        8: {
            ja: '第8章 - サービスマネジメントとシステム監査',
            vi: 'Chương 8 - Quản lý dịch vụ và Kiểm toán hệ thống',
            en: 'Chapter 8 - Service Management & System Audit',
            my: 'အခန်း ၈ - ဝန်ဆောင်မှုစီမံခန့်ခွဲမှုနှင့် စနစ်စစ်ဆေးမှု'
        },
        9: {
            ja: '第9章 - 基礎理論とアルゴリズム',
            vi: 'Chương 9 - Lý thuyết cơ bản và Thuật toán',
            en: 'Chapter 9 - Basic Theory & Algorithms',
            my: 'အခန်း ၉ - အခြေခံသီအိုရီနှင့် အယ်လ်ဂိုရီသမ်များ'
        },
        10: {
            ja: '第10章 - コンピュータシステム',
            vi: 'Chương 10 - Hệ thống máy tính',
            en: 'Chapter 10 - Computer Systems',
            my: 'အခန်း ၁၀ - ကွန်ပျူတာစနစ်များ'
        },
        11: {
            ja: '第11章 - ハードウェア',
            vi: 'Chương 11 - Phần cứng',
            en: 'Chapter 11 - Hardware',
            my: 'အခန်း ၁၁ - ဟာ့ဒ်ဝဲ'
        }
    },
    
    /**
     * Initialize i18n module
     */
    init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('itpass_lang') || 'ja';
        this.setLanguage(savedLang);
        
        // Setup language button listeners
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.setLanguage(lang);
            });
        });
    },
    
    /**
     * Set current language and update UI
     */
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('itpass_lang', lang);
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update all translatable elements
        this.updateUI();
        
        // Update chapter titles
        this.updateChapterTitles();
        
        // Dispatch event for content update
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },
    
    /**
     * Update all UI elements with translations
     */
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });
    },
    
    /**
     * Update chapter titles based on current language
     */
    updateChapterTitles() {
        document.querySelectorAll('.chapter-item').forEach(item => {
            const chapterId = item.dataset.chapter;
            const titleEl = item.querySelector('.chapter-title');
            if (titleEl && this.chapterTitles[chapterId]) {
                titleEl.textContent = this.chapterTitles[chapterId][this.currentLang];
            }
        });
    },
    
    /**
     * Get translation for a key
     */
    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    },
    
    /**
     * Get current language
     */
    getLang() {
        return this.currentLang;
    }
};

// Export for use in other modules
window.i18n = i18n;
