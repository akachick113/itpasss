/**
 * Furigana Audit Script
 * Scans all JSON files and finds suspicious on/kun reading errors
 * 
 * Run: node scripts/audit-furigana.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'public', 'data', 'pages');
const OUTPUT_FILE = path.join(__dirname, 'furigana-audit-report.txt');

// Common single kanji that often use kun'yomi when standalone or with okurigana
// These are flagged if they appear to have on'yomi readings
const SUSPICIOUS_PATTERNS = [
    // Verbs - should have kun'yomi when conjugated
    { kanji: '見', wrongReading: 'けん', correctReading: 'み' },
    { kanji: '聞', wrongReading: 'ぶん', correctReading: 'き' },
    { kanji: '言', wrongReading: 'げん', correctReading: 'い' },
    { kanji: '思', wrongReading: 'し', correctReading: 'おも' },
    { kanji: '知', wrongReading: 'ち', correctReading: 'し' },
    { kanji: '使', wrongReading: 'し', correctReading: 'つか' },
    { kanji: '作', wrongReading: 'さく', correctReading: 'つく' },
    { kanji: '持', wrongReading: 'じ', correctReading: 'も' },
    { kanji: '取', wrongReading: 'しゅ', correctReading: 'と' },
    { kanji: '行', wrongReading: 'こう', correctReading: 'い/ゆ/おこな' },
    { kanji: '出', wrongReading: 'しゅつ', correctReading: 'で/だ' },
    { kanji: '入', wrongReading: 'にゅう', correctReading: 'い/はい' },
    { kanji: '書', wrongReading: 'しょ', correctReading: 'か' },
    { kanji: '読', wrongReading: 'どく', correctReading: 'よ' },
    { kanji: '食', wrongReading: 'しょく', correctReading: 'た' },
    { kanji: '飲', wrongReading: 'いん', correctReading: 'の' },
    { kanji: '買', wrongReading: 'ばい', correctReading: 'か' },
    { kanji: '売', wrongReading: 'ばい', correctReading: 'う' },
    { kanji: '待', wrongReading: 'たい', correctReading: 'ま' },
    { kanji: '立', wrongReading: 'りつ', correctReading: 'た' },
    { kanji: '座', wrongReading: 'ざ', correctReading: 'すわ' },
    { kanji: '走', wrongReading: 'そう', correctReading: 'はし' },
    { kanji: '歩', wrongReading: 'ほ', correctReading: 'ある' },
    { kanji: '泳', wrongReading: 'えい', correctReading: 'およ' },
    { kanji: '遊', wrongReading: 'ゆう', correctReading: 'あそ' },
    { kanji: '働', wrongReading: 'どう', correctReading: 'はたら' },
    { kanji: '休', wrongReading: 'きゅう', correctReading: 'やす' },
    { kanji: '寝', wrongReading: 'しん', correctReading: 'ね' },
    { kanji: '起', wrongReading: 'き', correctReading: 'お' },
    { kanji: '開', wrongReading: 'かい', correctReading: 'あ/ひら' },
    { kanji: '閉', wrongReading: 'へい', correctReading: 'し/と' },
    { kanji: '始', wrongReading: 'し', correctReading: 'はじ' },
    { kanji: '終', wrongReading: 'しゅう', correctReading: 'お' },
    { kanji: '送', wrongReading: 'そう', correctReading: 'おく' },
    { kanji: '届', wrongReading: 'とどけ', correctReading: 'とど' },
    { kanji: '届', wrongReading: 'かい', correctReading: 'とど' },
    { kanji: '届', wrongReading: 'とう', correctReading: 'とど' },
    { kanji: '届', wrongReading: 'とう', correctReading: 'とど' },
    { kanji: '届', wrongReading: 'しゅう', correctReading: 'おく' },

    // Adjectives - should have kun'yomi when standalone
    { kanji: '広', wrongReading: 'こう', correctReading: 'ひろ' },
    { kanji: '高', wrongReading: 'こう', correctReading: 'たか' },
    { kanji: '安', wrongReading: 'あん', correctReading: 'やす' },
    { kanji: '新', wrongReading: 'しん', correctReading: 'あたら' },
    { kanji: '古', wrongReading: 'こ', correctReading: 'ふる' },
    { kanji: '長', wrongReading: 'ちょう', correctReading: 'なが' },
    { kanji: '短', wrongReading: 'たん', correctReading: 'みじか' },
    { kanji: '多', wrongReading: 'た', correctReading: 'おお' },
    { kanji: '少', wrongReading: 'しょう', correctReading: 'すく/すこ' },
    { kanji: '大', wrongReading: 'だい/たい', correctReading: 'おお' },
    { kanji: '小', wrongReading: 'しょう', correctReading: 'ちい/こ' },
    { kanji: '強', wrongReading: 'きょう', correctReading: 'つよ' },
    { kanji: '弱', wrongReading: 'じゃく', correctReading: 'よわ' },
    { kanji: '早', wrongReading: 'そう', correctReading: 'はや' },
    { kanji: '遅', wrongReading: 'ち', correctReading: 'おそ' },
    { kanji: '難', wrongReading: 'なん', correctReading: 'むずか' },
    { kanji: '易', wrongReading: 'い/えき', correctReading: 'やさ' },
    { kanji: '甘', wrongReading: 'かん', correctReading: 'あま' },
    { kanji: '辛', wrongReading: 'しん', correctReading: 'から' },
    { kanji: '重', wrongReading: 'じゅう', correctReading: 'おも' },
    { kanji: '軽', wrongReading: 'けい', correctReading: 'かる' },
    { kanji: '深', wrongReading: 'しん', correctReading: 'ふか' },
    { kanji: '浅', wrongReading: 'せん', correctReading: 'あさ' },

    // Other common standalone kanji
    { kanji: '人', wrongReading: 'にん/じん', correctReading: 'ひと' },
    { kanji: '物', wrongReading: 'ぶつ/もつ', correctReading: 'もの' },
    { kanji: '事', wrongReading: 'じ', correctReading: 'こと' },
    { kanji: '所', wrongReading: 'しょ', correctReading: 'ところ' },
    { kanji: '時', wrongReading: 'じ', correctReading: 'とき' },
    { kanji: '方', wrongReading: 'ほう', correctReading: 'かた' },
    { kanji: '側', wrongReading: 'そく', correctReading: 'がわ' },
    { kanji: '話', wrongReading: 'わ', correctReading: 'はなし/はな' },
    { kanji: '掛', wrongReading: 'かかり', correctReading: 'か' },
    { kanji: '備', wrongReading: 'び', correctReading: 'そな' },
    { kanji: '関', wrongReading: 'かん', correctReading: 'かか' },
    { kanji: '踏', wrongReading: 'とう', correctReading: 'ふ' },
    { kanji: '超', wrongReading: 'ちょう', correctReading: 'こ' },
    { kanji: '感', wrongReading: 'かん', correctReading: 'かん' }, // This one is usually on'yomi
];

// Build a lookup map
const suspiciousMap = new Map();
SUSPICIOUS_PATTERNS.forEach(p => {
    if (!suspiciousMap.has(p.kanji)) {
        suspiciousMap.set(p.kanji, []);
    }
    suspiciousMap.get(p.kanji).push(p);
});

function extractTerms(obj, results, filePath) {
    if (!obj) return;

    if (Array.isArray(obj)) {
        obj.forEach(item => extractTerms(item, results, filePath));
        return;
    }

    if (typeof obj === 'object') {
        // Check if this object has terms array
        if (obj.terms && Array.isArray(obj.terms)) {
            obj.terms.forEach(term => {
                if (term.kanji && term.reading) {
                    // Check if this is a single kanji term (suspicious)
                    if (term.kanji.length === 1 && suspiciousMap.has(term.kanji)) {
                        const patterns = suspiciousMap.get(term.kanji);
                        patterns.forEach(p => {
                            if (term.reading.includes(p.wrongReading.split('/')[0])) {
                                results.push({
                                    file: path.basename(filePath),
                                    kanji: term.kanji,
                                    currentReading: term.reading,
                                    likelyCorrect: p.correctReading,
                                    context: obj.ja?.substring(0, 50) || 'N/A'
                                });
                            }
                        });
                    }
                }
            });
        }

        // Recursively check all properties
        Object.values(obj).forEach(val => extractTerms(val, results, filePath));
    }
}

function auditFiles() {
    console.log('Starting Furigana Audit...\n');

    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));
    const allSuspicious = [];

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            extractTerms(content, allSuspicious, filePath);
        } catch (err) {
            console.error(`Error reading ${file}: ${err.message}`);
        }
    });

    // Generate report
    let report = `FURIGANA AUDIT REPORT\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Files scanned: ${files.length}\n`;
    report += `Suspicious entries found: ${allSuspicious.length}\n`;
    report += `${'='.repeat(80)}\n\n`;

    // Group by file
    const byFile = {};
    allSuspicious.forEach(item => {
        if (!byFile[item.file]) byFile[item.file] = [];
        byFile[item.file].push(item);
    });

    Object.keys(byFile).sort().forEach(file => {
        report += `\n📄 ${file}\n`;
        report += `${'-'.repeat(40)}\n`;
        byFile[file].forEach(item => {
            report += `  ❌ "${item.kanji}" → Current: "${item.currentReading}" | Likely: "${item.likelyCorrect}"\n`;
            report += `     Context: "${item.context}..."\n`;
        });
    });

    // Write report
    fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
    console.log(`\n✅ Report saved to: ${OUTPUT_FILE}`);
    console.log(`   Found ${allSuspicious.length} suspicious entries in ${Object.keys(byFile).length} files.`);

    // Also print summary to console
    console.log('\n--- SUMMARY (First 20 issues) ---\n');
    allSuspicious.slice(0, 20).forEach(item => {
        console.log(`${item.file}: "${item.kanji}" → ${item.currentReading} (should be ${item.likelyCorrect})`);
    });

    if (allSuspicious.length > 20) {
        console.log(`\n... and ${allSuspicious.length - 20} more. See full report.`);
    }
}

auditFiles();
