"""Fix Myanmar placeholder translations [xxx] with actual Myanmar text"""
import json
import os
from pathlib import Path

# More comprehensive Myanmar dictionary
MYANMAR_DICT = {
    # Basic exam terms
    "試験": "စာမေးပွဲ",
    "合格": "အောင်မြင်ခြင်း",
    "不合格": "ကျရှုံးခြင်း", 
    "受験": "စာမေးပွဲဝင်ခြင်း",
    "受験者": "စာမေးပွဲဝင်သူ",
    
    # Study terms
    "学習": "လေ့လာခြင်း",
    "暗記": "အလွတ်ကျက်ခြင်း",
    "復習": "ပြန်လည်သုံးသပ်ခြင်း",
    "記憶": "အမှတ်ဥာဏ်",
    "定着": "အမြဲတမ်းမှတ်မိခြင်း",
    
    # Common terms
    "過去問": "အတိတ်စာမေးပွဲမေးခွန်းများ",
    "頻出": "မကြာခဏထွက်လေ့ရှိသော",
    "厳選": "သေချာသပ်ရွေးချယ်ထားသော",
    "一発合格": "ပထမအကြိမ်တွင် အောင်မြင်ခြင်း",
    "通読": "ဖတ်ရှုခြင်း",
    "スキマ時間": "အချိန်လပ်",
    "挫折": "စိတ်ပျက်ခြင်း",
    "モチベーション": "လှုံ့ဆော်မှု",
    "心得": "အကြံပြုချက်များ",
    "消去法": "ဖယ်ထုတ်နည်းလမ်း",
    "擬似言語": "pseudo-language",
    
    # Business terms
    "企業": "ကုမ္ပဏီ",
    "企業活動": "ကုမ္ပဏီလုပ်ငန်းများ",
    "経営": "စီးပွားရေး",
    "経営戦略": "စီးပွားရေးဗျူဟာ",
    "戦略": "ဗျူဟာ",
    "財務": "ငွေကြေးရေး",
    "法務": "ဥပဒေရေးရာ",
    "会計": "စာရင်းကိုင်",
    
    # Security
    "セキュリティ": "လုံခြုံရေး",
    "情報セキュリティ": "သတင်းအချက်အလက်လုံခြုံရေး",
    
    # Management
    "管理": "စီမံခန့်ခွဲမှု",
    "管理者": "စီမံခန့်ခွဲသူ",
    "プロジェクト": "ပရောဂျက်",
    "マネジメント": "စီမံခန့်ခွဲမှု",
    
    # Technology
    "技術": "နည်းပညာ",
    "コンピュータ": "ကွန်ပျူတာ",
    "システム": "စနစ်",
    "データベース": "ဒေတာဘေ့စ်",
    "ネットワーク": "ကွန်ရက်",
    "ソフトウェア": "ဆော့ဖ်ဝဲ",
    "ハードウェア": "ဟတ်ဒ်ဝဲ",
    "アルゴリズム": "အယ်လ်ဂိုရီသမ်",
    "プログラミング": "ပရိုဂရမ်ရေးသားခြင်း",
}

def fix_myanmar_placeholders(json_path):
    """Replace [xxx] placeholders with actual Myanmar translations."""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # Find all [xxx] patterns in my fields
        import re
        
        # For each vocabulary entry with [xxx] placeholder
        for kanji, myanmar in MYANMAR_DICT.items():
            # Pattern to find: "my": "[anything]" after matching kanji
            # This is a simplified approach - find and replace bracketed English
            pass
        
        # Simpler approach: just replace known patterns
        replacements = {
            '"my": "[First-attempt pass]"': '"my": "ပထမအကြိမ်တွင် အောင်မြင်ခြင်း"',
            '"my": "[Reading through]"': '"my": "ဖတ်ရှုခြင်း"',
            '"my": "[Spare time]"': '"my": "အချိန်လပ်"',
            '"my": "[Frustration, giving up]"': '"my": "စိတ်ပျက်ခြင်း"',
            '"my": "[Past exam questions]"': '"my": "အတိတ်စာမေးပွဲမေးခွန်းများ"',
            '"my": "[Frequently appearing]"': '"my": "မကြာခဏထွက်လေ့ရှိသော"',
            '"my": "[Carefully selected]"': '"my": "သေချာသပ်ရွေးချယ်ထားသော"',
            '"my": "[Motivation]"': '"my": "လှုံ့ဆော်မှု"',
            '"my": "[Tips, principles]"': '"my": "အကြံပြုချက်များ"',
            '"my": "[Elimination method]"': '"my": "ဖယ်ထုတ်နည်းလမ်း"',
            '"my": "[Pseudo-language]"': '"my": "pseudo-language"',
            '"my": "[Finance]"': '"my": "ငွေကြေးရေး"',
            '"my": "[Security]"': '"my": "လုံခြုံရေး"',
            '"my": "[Pass/fail determination]"': '"my": "အောင်/ကျ ဆုံးဖြတ်ချက်"',
        }
        
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
                modified = True
        
        if modified:
            with open(json_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error in {json_path}: {e}")
        return False

def process_all_pages(pages_dir):
    """Process all page JSON files."""
    pages_dir = Path(pages_dir)
    modified_count = 0
    
    for json_file in sorted(pages_dir.glob('p_*.json')):
        if fix_myanmar_placeholders(json_file):
            print(f"Fixed: {json_file.name}")
            modified_count += 1
    
    print(f"\nTotal files fixed: {modified_count}")

if __name__ == "__main__":
    pages_dir = r"c:\Users\2240699\.gemini\antigravity\scratch\itpasss\data\pages"
    process_all_pages(pages_dir)
