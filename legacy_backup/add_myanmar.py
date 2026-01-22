"""
Script to add Myanmar translations to vocabulary entries in JSON files.
This script reads each page JSON, finds vocabulary entries without 'my' field,
and adds estimated Myanmar translations based on the English meanings.
"""

import json
import os
from pathlib import Path

# Myanmar translation dictionary for common IT Passport terms
MYANMAR_DICT = {
    # Basic exam terms
    "試験": "စာမေးပွဲ",
    "合格": "အောင်မြင်ခြင်း",
    "不合格": "ကျရှုံးခြင်း",
    "受験": "စာမေးပွဲဝင်ခြင်း",
    "受験者": "စာမေးပွဲဝင်သူ",
    "受験資格": "စာမေးပွဲဝင်ခွင့်",
    "準備": "ပြင်ဆင်ခြင်း",
    "学習": "လေ့လာခြင်း",
    "学習方法": "လေ့လာနည်း",
    
    # Organizations
    "情報処理推進機構": "သတင်းအချက်အလက်နည်းပညာမြှင့်တင်ရေးအေဂျင်စီ",
    "経済産業省": "စီးပွားရေးနှင့်စက်မှုဝန်ကြီးဌာန",
    "国家試験": "အမျိုးသားစာမေးပွဲ",
    
    # General terms
    "公式": "တရားဝင်",
    "定義": "အဓိပ္ပါယ်ဖွင့်ဆိုချက်",
    "概要": "အကျဉ်းချုပ်",
    "内容": "အကြောင်းအရာ",
    "目的": "ရည်ရွယ်ချက်",
    "方法": "နည်းလမ်း",
    "方式": "ပုံစံ",
    
    # People/roles
    "社会人": "အလုပ်သမား",
    "学生": "ကျောင်းသား",
    "経営者": "စီမံခန့်ခွဲသူ",
    "管理者": "အုပ်ချုပ်သူ",
    "応募者": "လျှောက်ထားသူ",
    
    # Time/age
    "年齢": "အသက်",
    "現在": "လက်ရှိ",
    "事前": "ကြိုတင်",
    
    # Categories
    "分野": "နယ်ပယ်",
    "分類": "အမျိုးအစားခွဲခြားခြင်း",
    "種類": "အမျိုးအစား",
    "区分": "အပိုင်းခွဲခြားခြင်း",
    
    # Actions
    "実施": "အကောင်အထည်ဖော်ခြင်း",
    "利用": "အသုံးပြုခြင်း",
    "確認": "အတည်ပြုခြင်း",
    "把握": "နားလည်သဘောပေါက်ခြင်း",
    "活躍": "တက်ကြွစွာလှုပ်ရှားခြင်း",
    "申込み": "လျှောက်ထားခြင်း",
    "紹介": "မိတ်ဆက်",
    "解説": "ရှင်းပြချက်",
    
    # Technical terms
    "情報処理": "သတင်းအချက်အလက်လုပ်ဆောင်ခြင်း",
    "基礎知識": "အခြေခံဗဟုသုတ",
    "基礎理論": "အခြေခံသီအိုရီ",
    "技術": "နည်းပညာ",
    "開発技術": "ဖွံ့ဖြိုးတိုးတက်ရေးနည်းပညာ",
    "操作方法": "လုပ်ဆောင်နည်း",
    "疑似体験": "simulation အတွေ့အကြုံ",
    
    # Business terms
    "企業": "ကုမ္ပဏီ",
    "企業活動": "ကုမ္ပဏီလုပ်ငန်းများ",
    "戦略": "ဗျူဟာ",
    "経営戦略": "စီးပွားရေးဗျူဟာ",
    "法務": "ဥပဒေရေးရာ",
    "勤務": "အလုပ်လုပ်ခြင်း",
    "資格試験": "အရည်အချင်းစစ်စာမေးပွဲ",
    
    # Characteristics
    "特徴": "ထူးခြားချက်",
    "効果的": "ထိရောက်သော",
    "専門的": "ကျွမ်းကျင်သော",
    "大切": "အရေးကြီးသော",
    "必要": "လိုအပ်သော",
    "重要": "အရေးကြီးသော",
    
    # Others
    "章": "အခန်း",
    "序章": "နိဒါန်း",
    "問題": "မေးခွန်း",
    "表示": "ပြသခြင်း",
    "機能": "လုပ်ဆောင်ချက်",
    "全般": "ယေဘုယျ",
    "現代社会": "ခေတ်သစ်လူ့အဖွဲ့အစည်း",
    "傾向": "လမ်းကြောင်း",
    "出題傾向": "မေးခွန်းထုတ်ပုံလမ်းကြောင်း",
    "出題範囲": "မေးခွန်းထုတ်နယ်ပယ်",
    "性別": "ကျား/မ",
    "学歴": "ပညာရေးနောက်ခံ",
    "国籍": "နိုင်ငံသား",
    "累計": "စုစုပေါင်း",
    "以下": "အောက်ပါ",
    "上位": "အထက်အဆင့်",
    "解答": "အဖြေ",
    "誤り": "အမှား",
    "試験対策": "စာမေးပွဲပြင်ဆင်ခြင်း",
    "試験会場": "စာမေးပွဲခန်း",
    "四肢択一式": "လေးရွေးချယ်စရာမေးခွန်း",
    "合格基準": "အောင်မြင်မှုစံနှုန်း",
}

def add_myanmar_to_vocabulary(json_path):
    """Add Myanmar translations to vocabulary entries that don't have them."""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'vocabulary' not in data:
        return False
    
    modified = False
    for vocab in data['vocabulary']:
        if 'my' not in vocab:
            kanji = vocab.get('kanji', '')
            if kanji in MYANMAR_DICT:
                vocab['my'] = MYANMAR_DICT[kanji]
                modified = True
            else:
                # Add placeholder for unknown words
                vocab['my'] = f"[{vocab.get('en', kanji)}]"
                modified = True
    
    if modified:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    return modified

def process_all_pages(pages_dir):
    """Process all page JSON files in the directory."""
    pages_dir = Path(pages_dir)
    modified_count = 0
    error_count = 0
    
    for json_file in sorted(pages_dir.glob('p_*.json')):
        try:
            if add_myanmar_to_vocabulary(json_file):
                print(f"Updated: {json_file.name}")
                modified_count += 1
        except Exception as e:
            print(f"ERROR in {json_file.name}: {e}")
            error_count += 1
    
    print(f"\nTotal files modified: {modified_count}")
    print(f"Total errors: {error_count}")

if __name__ == "__main__":
    pages_dir = r"c:\Users\2240699\.gemini\antigravity\scratch\itpasss\data\pages"
    process_all_pages(pages_dir)
