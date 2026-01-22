#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Furigana Completion Script
Adds missing furigana (reading) information to IT Passport JSON files.

This script:
1. Builds a kanji dictionary from existing vocabulary and headings
2. Scans paragraphs for kanji characters
3. Adds 'terms' arrays with kanji-reading pairs to paragraphs
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict

# Patterns for Japanese text
KANJI_PATTERN = re.compile(r'[\u4e00-\u9faf\u3400-\u4dbf]+')
HIRAGANA_PATTERN = re.compile(r'[\u3040-\u309f]+')

class FuriganaProcessor:
    def __init__(self, pages_dir):
        self.pages_dir = Path(pages_dir)
        self.kanji_dict = {}  # kanji -> reading
        self.stats = {
            'files_processed': 0,
            'files_updated': 0,
            'terms_added': 0,
            'paragraphs_updated': 0
        }
    
    def build_dictionary(self):
        """Extract all kanji-reading pairs from existing data."""
        print("Building kanji dictionary from existing data...")
        
        json_files = sorted(self.pages_dir.glob('p_*.json'))
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Extract from vocabulary array
                if 'vocabulary' in data and data['vocabulary']:
                    for vocab in data['vocabulary']:
                        if vocab.get('kanji') and vocab.get('reading'):
                            self.kanji_dict[vocab['kanji']] = vocab['reading']
                
                # Extract from content items (headings, etc.)
                if 'content' in data:
                    for item in data['content']:
                        # Headings with readings
                        if item.get('ja') and item.get('reading'):
                            ja_text = item['ja']
                            reading = item['reading']
                            # Only add if it's a single kanji term (heading text)
                            if len(ja_text) < 30:  # reasonable heading length
                                self.kanji_dict[ja_text] = reading
                        
                        # Existing terms arrays
                        if 'terms' in item and item['terms']:
                            for term in item['terms']:
                                if term.get('kanji') and term.get('reading'):
                                    self.kanji_dict[term['kanji']] = term['reading']
                
            except Exception as e:
                print(f"Error reading {json_file}: {e}")
        
        print(f"Dictionary built with {len(self.kanji_dict)} kanji-reading pairs")
        return self.kanji_dict
    
    def save_dictionary(self, output_path):
        """Save the dictionary to a JSON file."""
        # Sort by kanji length (longer first for better matching)
        sorted_dict = dict(sorted(
            self.kanji_dict.items(),
            key=lambda x: len(x[0]),
            reverse=True
        ))
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(sorted_dict, f, ensure_ascii=False, indent=2)
        
        print(f"Dictionary saved to {output_path}")
    
    def find_kanji_in_text(self, text):
        """Find all kanji words in text that are in our dictionary."""
        found_terms = []
        
        # Sort dictionary by length (longest first) for greedy matching
        sorted_kanji = sorted(self.kanji_dict.keys(), key=len, reverse=True)
        
        for kanji in sorted_kanji:
            if kanji in text:
                found_terms.append({
                    'kanji': kanji,
                    'reading': self.kanji_dict[kanji]
                })
        
        return found_terms
    
    def process_all_files(self, dry_run=False):
        """Process all JSON files and add missing terms to paragraphs."""
        print(f"\nProcessing all JSON files{'  (DRY RUN)' if dry_run else ''}...")
        
        json_files = sorted(self.pages_dir.glob('p_*.json'))
        
        for json_file in json_files:
            try:
                self.process_file(json_file, dry_run)
            except Exception as e:
                print(f"Error processing {json_file}: {e}")
        
        print(f"\n{'='*50}")
        print(f"Processing complete!")
        print(f"  Files processed: {self.stats['files_processed']}")
        print(f"  Files updated: {self.stats['files_updated']}")
        print(f"  Paragraphs updated: {self.stats['paragraphs_updated']}")
        print(f"  Terms added: {self.stats['terms_added']}")
    
    def process_file(self, json_file, dry_run=False):
        """Process a single JSON file."""
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.stats['files_processed'] += 1
        file_modified = False
        
        if 'content' not in data:
            return
        
        for item in data['content']:
            item_type = item.get('type', '')
            
            # Process paragraph type - add terms at top level
            if item_type == 'paragraph':
                ja_text = item.get('ja', '')
                if ja_text and not item.get('terms'):
                    found_terms = self.find_kanji_in_text(ja_text)
                    if found_terms:
                        unique_terms = self._dedupe_terms(found_terms)
                        if unique_terms:
                            item['terms'] = unique_terms
                            self.stats['terms_added'] += len(unique_terms)
                            self.stats['paragraphs_updated'] += 1
                            file_modified = True
            
            # Process boxes with nested content (info_box, exam_tip, learn_more, quote_box)
            elif item_type in ['info_box', 'exam_tip', 'learn_more']:
                # Process title if it has ja text
                if 'title' in item and isinstance(item['title'], dict):
                    title_ja = item['title'].get('ja', '')
                    if title_ja and not item['title'].get('terms'):
                        found_terms = self.find_kanji_in_text(title_ja)
                        if found_terms:
                            unique_terms = self._dedupe_terms(found_terms)
                            if unique_terms:
                                item['title']['terms'] = unique_terms
                                self.stats['terms_added'] += len(unique_terms)
                                file_modified = True
                
                # Process content if it has ja text
                if 'content' in item and isinstance(item['content'], dict):
                    content_ja = item['content'].get('ja', '')
                    if content_ja and not item['content'].get('terms'):
                        found_terms = self.find_kanji_in_text(content_ja)
                        if found_terms:
                            unique_terms = self._dedupe_terms(found_terms)
                            if unique_terms:
                                item['content']['terms'] = unique_terms
                                self.stats['terms_added'] += len(unique_terms)
                                self.stats['paragraphs_updated'] += 1
                                file_modified = True
            
            # Process quote_box
            elif item_type == 'quote_box':
                ja_text = item.get('ja', '')
                if ja_text and not item.get('terms'):
                    found_terms = self.find_kanji_in_text(ja_text)
                    if found_terms:
                        unique_terms = self._dedupe_terms(found_terms)
                        if unique_terms:
                            item['terms'] = unique_terms
                            self.stats['terms_added'] += len(unique_terms)
                            file_modified = True
        
        if file_modified:
            self.stats['files_updated'] += 1
            if not dry_run:
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                    f.write('\n')  # Add trailing newline
    
    def _dedupe_terms(self, terms):
        """Remove duplicate terms while preserving order."""
        seen = set()
        unique_terms = []
        for term in terms:
            if term['kanji'] not in seen:
                seen.add(term['kanji'])
                unique_terms.append(term)
        return unique_terms


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Add furigana to IT Passport JSON files')
    parser.add_argument('--pages-dir', default='data/pages', help='Path to pages directory')
    parser.add_argument('--dry-run', action='store_true', help='Do not modify files, just show what would be done')
    parser.add_argument('--dict-only', action='store_true', help='Only build dictionary, do not process files')
    parser.add_argument('--save-dict', default='kanji_dictionary.json', help='Path to save dictionary')
    
    args = parser.parse_args()
    
    # Get the script directory
    script_dir = Path(__file__).parent
    pages_dir = script_dir / args.pages_dir
    
    if not pages_dir.exists():
        print(f"Error: Pages directory not found: {pages_dir}")
        return 1
    
    processor = FuriganaProcessor(pages_dir)
    
    # Step 1: Build dictionary
    processor.build_dictionary()
    
    # Save dictionary
    dict_path = script_dir / args.save_dict
    processor.save_dictionary(dict_path)
    
    if args.dict_only:
        print("\nDictionary-only mode. Skipping file processing.")
        return 0
    
    # Step 2: Process all files
    processor.process_all_files(dry_run=args.dry_run)
    
    return 0


if __name__ == '__main__':
    exit(main())
