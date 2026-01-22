"""Fix JSON files with unescaped quotes"""
import os
import re

def fix_json_quotes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines for manual processing
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # Check if this is a ja: field with unescaped quotes
        if '"ja":' in line or '"ja": [' in line:
            # Find patterns like から\" or は\" followed by text and ending with \"で or \"の
            # These need to be escaped
            
            # Pattern: Japanese text with unescaped quotes inside
            # Example: から"..¥ should be から\"..¥
            
            # Fix common patterns in file path questions
            line = re.sub(r'から"\.\.', r'から\\"..', line)
            line = re.sub(r'\.txt"で', r'.txt\\"で', line)
            line = re.sub(r'は"デ', r'は\\"デ', line)
            line = re.sub(r'名"の', r'名\\"の', line)
            line = re.sub(r'に"¥"', r'に\\"¥\\"', line)
            line = re.sub(r'る"¥"', r'る\\"¥\\"', line)
            line = re.sub(r'後に"¥"', r'後に\\"¥\\"', line)
            line = re.sub(r'は"\."', r'は\\".\\"', line)
            line = re.sub(r'は"\.\."', r'は\\"..\\"', line)
            line = re.sub(r'が"¥"', r'が\\"¥\\"', line)
        
        fixed_lines.append(line)
    
    fixed_content = '\n'.join(fixed_lines)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

# Fix problem files
pages_dir = r"c:\Users\2240699\.gemini\antigravity\scratch\itpasss\data\pages"
problem_files = ['p_0465.json', 'p_0466.json']

import json

for fname in problem_files:
    path = os.path.join(pages_dir, fname)
    print(f"Fixing {fname}...")
    fix_json_quotes(path)
    
    # Verify
    try:
        with open(path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"  {fname}: Valid!")
    except Exception as e:
        print(f"  {fname}: Still error - {e}")

# Check all files again
print("\nChecking all files...")
error_count = 0
for fname in sorted(os.listdir(pages_dir)):
    if fname.startswith('p_') and fname.endswith('.json'):
        path = os.path.join(pages_dir, fname)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                json.load(f)
        except:
            error_count += 1
            fix_json_quotes(path)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    json.load(f)
                print(f"Fixed: {fname}")
            except Exception as e:
                print(f"Still broken: {fname}")

print(f"\nDone. Remaining errors: {error_count}")
