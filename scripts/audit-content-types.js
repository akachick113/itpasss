/**
 * Content Type Audit Script
 * Scans all JSON files to find unique content types
 * 
 * Run: node scripts/audit-content-types.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'public', 'data', 'pages');

const typeCount = {};

function extractTypes(obj) {
    if (!obj) return;

    if (Array.isArray(obj)) {
        obj.forEach(item => extractTypes(item));
        return;
    }

    if (typeof obj === 'object') {
        if (obj.type) {
            typeCount[obj.type] = (typeCount[obj.type] || 0) + 1;
        }
        Object.values(obj).forEach(val => extractTypes(val));
    }
}

function auditFiles() {
    console.log('Scanning all JSON files for content types...\n');

    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            extractTypes(content);
        } catch (err) {
            console.error(`Error processing ${file}: ${err.message}`);
        }
    });

    console.log('='.repeat(50));
    console.log('CONTENT TYPES FOUND:');
    console.log('='.repeat(50));

    const sorted = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([type, count]) => {
        console.log(`  ${type}: ${count} occurrences`);
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Total unique types: ${Object.keys(typeCount).length}`);
    console.log('='.repeat(50));
}

auditFiles();
