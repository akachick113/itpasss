#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Complete Furigana Script - Uses pykakasi to add readings for ALL kanji
"""

import json
import re
from pathlib import Path
from pykakasi import kakasi

# Initialize kakasi converter
kks = kakasi()

# Kanji pattern
KANJI_PATTERN = re.compile(r'[\u4e00-\u9faf\u3400-\u4dbf]+')

def get_kanji_reading(text):
    """Get hiragana reading for kanji text using pykakasi."""
    result = kks.convert(text)
    # Get hiragana reading
    readings = []
    for item in result:
        if item['orig'] != item['hira']:  # Only if it's actually kanji
            readings.append((item['orig'], item['hira']))
    return readings

def extract_kanji_with_readings(text, existing_dict=None):
    """Extract all kanji from text and get their readings."""
    if existing_dict is None:
        existing_dict = {}
    
    terms = []
    seen = set()
    
    # Find all kanji sequences in text
    kanji_matches = KANJI_PATTERN.findall(text)
    
    for kanji in kanji_matches:
        if kanji in seen:
            continue
        seen.add(kanji)
        
        # Check if we already have this in existing dictionary
        if kanji in existing_dict:
            terms.append({
                'kanji': kanji,
                'reading': existing_dict[kanji]
            })
        else:
            # Use pykakasi to get reading
            result = kks.convert(kanji)
            reading = ''.join([item['hira'] for item in result])
            if reading and reading != kanji:  # Only add if we got a valid reading
                terms.append({
                    'kanji': kanji,
                    'reading': reading
                })
    
    return terms

def load_existing_dictionary(pages_dir):
    """Load existing kanji-reading pairs from vocabulary and headings."""
    kanji_dict = {}
    
    for json_file in pages_dir.glob('p_*.json'):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # From vocabulary
            if 'vocabulary' in data and data['vocabulary']:
                for vocab in data['vocabulary']:
                    if vocab.get('kanji') and vocab.get('reading'):
                        kanji_dict[vocab['kanji']] = vocab['reading']
            
            # From headings and existing terms
            if 'content' in data:
                for item in data['content']:
                    if item.get('ja') and item.get('reading'):
                        kanji_dict[item['ja']] = item['reading']
                    if 'terms' in item:
                        for term in item.get('terms', []):
                            if term.get('kanji') and term.get('reading'):
                                kanji_dict[term['kanji']] = term['reading']
                    # Check nested content
                    if 'content' in item and isinstance(item['content'], dict):
                        for term in item['content'].get('terms', []):
                            if term.get('kanji') and term.get('reading'):
                                kanji_dict[term['kanji']] = term['reading']
        except Exception as e:
            print(f"Error reading {json_file}: {e}")
    
    return kanji_dict

def process_json_file(json_file, existing_dict, dry_run=False):
    """Process a single JSON file and add complete furigana terms."""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    stats = {'terms_added': 0, 'items_updated': 0}
    
    if 'content' not in data:
        return modified, stats
    
    for item in data['content']:
        item_type = item.get('type', '')
        
        # Process paragraph
        if item_type == 'paragraph' and item.get('ja'):
            terms = extract_kanji_with_readings(item['ja'], existing_dict)
            if terms:
                item['terms'] = terms
                stats['terms_added'] += len(terms)
                stats['items_updated'] += 1
                modified = True
        
        # Process info_box, exam_tip, learn_more
        elif item_type in ['info_box', 'exam_tip', 'learn_more']:
            if 'content' in item and isinstance(item['content'], dict) and item['content'].get('ja'):
                terms = extract_kanji_with_readings(item['content']['ja'], existing_dict)
                if terms:
                    item['content']['terms'] = terms
                    stats['terms_added'] += len(terms)
                    stats['items_updated'] += 1
                    modified = True
        
        # Process quote_box
        elif item_type == 'quote_box' and item.get('ja'):
            terms = extract_kanji_with_readings(item['ja'], existing_dict)
            if terms:
                item['terms'] = terms
                stats['terms_added'] += len(terms)
                modified = True
    
    if modified and not dry_run:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
    
    return modified, stats

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Add complete furigana to all kanji')
    parser.add_argument('--pages-dir', default='data/pages', help='Path to pages directory')
    parser.add_argument('--dry-run', action='store_true', help='Do not modify files')
    
    args = parser.parse_args()
    
    script_dir = Path(__file__).parent
    pages_dir = script_dir / args.pages_dir
    
    if not pages_dir.exists():
        print(f"Error: Pages directory not found: {pages_dir}")
        return 1
    
    print("Loading existing dictionary...")
    existing_dict = load_existing_dictionary(pages_dir)
    print(f"Loaded {len(existing_dict)} existing kanji-reading pairs")
    
    print(f"\nProcessing files{'  (DRY RUN)' if args.dry_run else ''}...")
    
    total_files = 0
    total_updated = 0
    total_terms = 0
    
    json_files = sorted(pages_dir.glob('p_*.json'))
    
    for i, json_file in enumerate(json_files):
        if i % 50 == 0:
            print(f"Progress: {i}/{len(json_files)} files...")
        
        try:
            modified, stats = process_json_file(json_file, existing_dict, args.dry_run)
            total_files += 1
            if modified:
                total_updated += 1
                total_terms += stats['terms_added']
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Files processed: {total_files}")
    print(f"  Files updated: {total_updated}")
    print(f"  Terms added: {total_terms}")
    
    return 0

if __name__ == '__main__':
    exit(main())
