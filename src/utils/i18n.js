// UI Translations for all supported languages
const translations = {
    ja: {
        // Sidebar
        appTitle: 'IT Passport',
        progress: 'Progress',
        chapters: [
            '序章 - ITパスポート試験の概要',
            '第1章 - 企業活動',
            '第2章 - 法務',
            '第3章 - 経営戦略マネジメント',
            '第4章 - 技術戦略マネジメント',
            '第5章 - システム戦略',
            '第6章 - 開発技術',
            '第7章 - プロジェクトマネジメント',
            '第8章 - サービスマネジメント',
            '第9章 - 基礎理論とアルゴリズム',
            '第10章 - コンピュータシステム',
            '第11章 - ハードウェア',
        ],
        // Header
        studyGuide: 'Study Guide',
        furigana: 'Furigana',
        // Content
        page: 'Page',
        translationPending: '翻訳準備中...',
    },
    vi: {
        // Sidebar
        appTitle: 'IT Passport',
        progress: 'Tiến độ',
        chapters: [
            'Lời mở đầu - Tổng quan kỳ thi IT Passport',
            'Chương 1 - Hoạt động doanh nghiệp',
            'Chương 2 - Pháp luật',
            'Chương 3 - Quản lý chiến lược kinh doanh',
            'Chương 4 - Quản lý chiến lược công nghệ',
            'Chương 5 - Chiến lược hệ thống',
            'Chương 6 - Kỹ thuật phát triển',
            'Chương 7 - Quản lý dự án',
            'Chương 8 - Quản lý dịch vụ',
            'Chương 9 - Lý thuyết cơ bản và giải thuật',
            'Chương 10 - Hệ thống máy tính',
            'Chương 11 - Phần cứng',
        ],
        // Header
        studyGuide: 'Tài liệu học',
        furigana: 'Furigana',
        // Content
        page: 'Trang',
        translationPending: 'Đang chuẩn bị bản dịch...',
    },
    en: {
        // Sidebar
        appTitle: 'IT Passport',
        progress: 'Progress',
        chapters: [
            'Introduction - IT Passport Exam Overview',
            'Chapter 1 - Corporate Activities',
            'Chapter 2 - Law',
            'Chapter 3 - Business Strategy Management',
            'Chapter 4 - Technology Strategy Management',
            'Chapter 5 - System Strategy',
            'Chapter 6 - Development Technology',
            'Chapter 7 - Project Management',
            'Chapter 8 - Service Management',
            'Chapter 9 - Basic Theory and Algorithms',
            'Chapter 10 - Computer Systems',
            'Chapter 11 - Hardware',
        ],
        // Header
        studyGuide: 'Study Guide',
        furigana: 'Furigana',
        // Content
        page: 'Page',
        translationPending: 'Translation pending...',
    },
    my: {
        // Sidebar (Myanmar/Burmese)
        appTitle: 'IT Passport',
        progress: 'တိုးတက်မှု',
        chapters: [
            'အစပိုင်း - IT Passport စာမေးပွဲ အကျဉ်းချုပ်',
            'အခန်း ၁ - စီးပွားရေးလုပ်ငန်း',
            'အခန်း ၂ - ဥပဒေ',
            'အခန်း ၃ - စီးပွားရေးမဟာဗျူဟာ စီမံခန့်ခွဲမှု',
            'အခန်း ၄ - နည်းပညာမဟာဗျူဟာ စီမံခန့်ခွဲမှု',
            'အခန်း ၅ - စနစ်မဟာဗျူဟာ',
            'အခန်း ၆ - ဖွံ့ဖြိုးရေးနည်းပညာ',
            'အခန်း ၇ - ပရောဂျက်စီမံခန့်ခွဲမှု',
            'အခန်း ၈ - ဝန်ဆောင်မှုစီမံခန့်ခွဲမှု',
            'အခန်း ၉ - အခြေခံသီအိုရီနှင့် Algorithm များ',
            'အခန်း ၁၀ - ကွန်ပျူတာစနစ်များ',
            'အခန်း ၁၁ - Hardware',
        ],
        // Header
        studyGuide: 'လေ့လာရေးလမ်းညွှန်',
        furigana: 'Furigana',
        // Content
        page: 'စာမျက်နှာ',
        translationPending: 'ဘာသာပြန်ဆဲ...',
    },
};

export const getTranslation = (lang, key) => {
    return translations[lang]?.[key] || translations['ja'][key] || key;
};

export const getChapterTitle = (lang, chapterIndex) => {
    return translations[lang]?.chapters?.[chapterIndex] || translations['ja'].chapters[chapterIndex];
};

export default translations;
