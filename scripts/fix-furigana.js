/**
 * Furigana Auto-Fix Script
 * Automatically fixes on/kun reading errors in all JSON files
 * 
 * Run: node scripts/fix-furigana.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'public', 'data', 'pages');

// Mapping: kanji -> { wrongReadings: [...], correctReading: '...' }
// These are single kanji that should use kun'yomi when standalone
const FIX_MAP = {
    // Verbs
    '見': { wrong: ['けん'], correct: 'み' },
    '聞': { wrong: ['ぶん'], correct: 'き' },
    '言': { wrong: ['げん'], correct: 'い' },
    '思': { wrong: ['し'], correct: 'おも' },
    '使': { wrong: ['し'], correct: 'つか' },
    '作': { wrong: ['さく'], correct: 'つく' },
    '持': { wrong: ['じ'], correct: 'も' },
    '取': { wrong: ['しゅ'], correct: 'と' },
    '出': { wrong: ['しゅつ'], correct: 'で' },
    '入': { wrong: ['にゅう'], correct: 'はい' },
    '読': { wrong: ['どく'], correct: 'よ' },
    '書': { wrong: ['しょ'], correct: 'か' },
    '買': { wrong: ['ばい'], correct: 'か' },
    '売': { wrong: ['ばい'], correct: 'う' },
    '待': { wrong: ['たい'], correct: 'ま' },
    '立': { wrong: ['りつ'], correct: 'た' },
    '走': { wrong: ['そう'], correct: 'はし' },
    '歩': { wrong: ['ほ'], correct: 'ある' },
    '働': { wrong: ['どう'], correct: 'はたら' },
    '休': { wrong: ['きゅう'], correct: 'やす' },
    '開': { wrong: ['かい'], correct: 'ひら' },
    '始': { wrong: ['し'], correct: 'はじ' },
    '終': { wrong: ['しゅう'], correct: 'お' },
    '送': { wrong: ['そう'], correct: 'おく' },
    '起': { wrong: ['き'], correct: 'お' },

    // Adjectives
    '広': { wrong: ['こう'], correct: 'ひろ' },
    '高': { wrong: ['こう'], correct: 'たか' },
    '安': { wrong: ['あん'], correct: 'やす' },
    '新': { wrong: ['しん'], correct: 'あたら' },
    '古': { wrong: ['こ'], correct: 'ふる' },
    '長': { wrong: ['ちょう'], correct: 'なが' },
    '短': { wrong: ['たん'], correct: 'みじか' },
    '多': { wrong: ['た'], correct: 'おお' },
    '少': { wrong: ['しょう'], correct: 'すく' },
    '大': { wrong: ['だい', 'たい'], correct: 'おお' },
    '小': { wrong: ['しょう'], correct: 'ちい' },
    '強': { wrong: ['きょう'], correct: 'つよ' },
    '弱': { wrong: ['じゃく'], correct: 'よわ' },
    '早': { wrong: ['そう'], correct: 'はや' },
    '難': { wrong: ['なん'], correct: 'むずか' },
    '甘': { wrong: ['かん'], correct: 'あま' },
    '重': { wrong: ['じゅう'], correct: 'おも' },
    '軽': { wrong: ['けい'], correct: 'かる' },
    '深': { wrong: ['しん'], correct: 'ふか' },

    // Common standalone words
    '人': { wrong: ['にん', 'じん'], correct: 'ひと' },
    '物': { wrong: ['ぶつ', 'もつ'], correct: 'もの' },
    '事': { wrong: ['じ'], correct: 'こと' },
    '時': { wrong: ['じ'], correct: 'とき' },
    '方': { wrong: ['ほう'], correct: 'かた' },
    '側': { wrong: ['そく'], correct: 'がわ' },
    '話': { wrong: ['わ'], correct: 'はなし' },
    '備': { wrong: ['び'], correct: 'そな' },
    '踏': { wrong: ['とう'], correct: 'ふ' },
    '超': { wrong: ['ちょう'], correct: 'こ' },
    '掛': { wrong: ['かかり', 'かけ'], correct: 'か' },
};

let totalFixed = 0;
let filesModified = 0;

function fixTermsInObject(obj, filePath) {
    if (!obj) return false;

    let modified = false;

    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (fixTermsInObject(item, filePath)) {
                modified = true;
            }
        });
        return modified;
    }

    if (typeof obj === 'object') {
        // Check if this object has terms array
        if (obj.terms && Array.isArray(obj.terms)) {
            obj.terms.forEach(term => {
                if (term.kanji && term.reading && term.kanji.length === 1) {
                    const fix = FIX_MAP[term.kanji];
                    if (fix && fix.wrong.includes(term.reading)) {
                        console.log(`  Fixed: "${term.kanji}" ${term.reading} → ${fix.correct}`);
                        term.reading = fix.correct;
                        totalFixed++;
                        modified = true;
                    }
                }
            });
        }

        // Recursively check all properties
        Object.values(obj).forEach(val => {
            if (fixTermsInObject(val, filePath)) {
                modified = true;
            }
        });
    }

    return modified;
}

function fixFiles() {
    console.log('Starting Furigana Auto-Fix...\n');
    console.log(`Fix patterns loaded: ${Object.keys(FIX_MAP).length} kanji\n`);

    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            console.log(`Processing ${file}...`);
            const wasModified = fixTermsInObject(content, filePath);

            if (wasModified) {
                // Write back the fixed content
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
                filesModified++;
            }
        } catch (err) {
            console.error(`Error processing ${file}: ${err.message}`);
        }
    });

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Auto-Fix Complete!`);
    console.log(`   Files modified: ${filesModified}`);
    console.log(`   Total readings fixed: ${totalFixed}`);
    console.log('='.repeat(50));
}

fixFiles();
