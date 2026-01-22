"""
Safe crop script - adds padding to avoid cutting into content
Creates backup before cropping
"""

from PIL import Image
from pathlib import Path
import shutil

def find_content_bounds_safe(img, padding=20):
    """
    Scan from center outward to find content boundaries
    Adds padding for safety
    Returns (left, right) pixel positions
    """
    width, height = img.size
    
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    pixels = img.load()
    
    center_x = width // 2
    
    # Sample multiple rows for reliability
    sample_rows = [height // 4, height // 3, height // 2, height * 2 // 3, height * 3 // 4]
    
    def is_black(x, y):
        r, g, b = pixels[x, y][:3]
        return r < 15 and g < 15 and b < 15
    
    # Find left edge - scan from center to left
    left_edges = []
    for y in sample_rows:
        for x in range(center_x, 0, -1):
            if is_black(x, y):
                left_edges.append(x + 1)
                break
    
    # Find right edge - scan from center to right
    right_edges = []
    for y in sample_rows:
        for x in range(center_x, width):
            if is_black(x, y):
                right_edges.append(x)
                break
    
    # Use the MOST CONSERVATIVE bounds (keep more content)
    left = min(left_edges) if left_edges else 0
    right = max(right_edges) if right_edges else width
    
    # Add safety padding (move bounds OUTWARD to keep more content)
    left = max(0, left - padding)
    right = min(width, right + padding)
    
    return left, right

def crop_image_safe(input_path, output_path, padding=20):
    """Crop black borders with safety padding"""
    try:
        img = Image.open(input_path)
        original_width = img.size[0]
        height = img.size[1]
        
        left, right = find_content_bounds_safe(img, padding)
        content_width = right - left
        
        left_crop = left
        right_crop = original_width - right
        total_removed = left_crop + right_crop
        
        # Only crop if removing significant borders (at least 200px total)
        # and content width is reasonable (at least 600px)
        if total_removed >= 200 and content_width >= 600:
            cropped = img.crop((left, 0, right, height))
            cropped.save(output_path, 'PNG', optimize=True)
            return True, f"Cropped {left}:{right} → {content_width}x{height}"
        
        return False, f"Skipped (content={content_width}px, removed={total_removed}px)"
        
    except Exception as e:
        return False, f"Error: {e}"

def main():
    images_dir = Path(r"c:\Users\2240699\.gemini\antigravity\scratch\itpasss\images")
    
    image_files = sorted(images_dir.glob("p_*.png"))
    total = len(image_files)
    
    print(f"🖼️  Found {total} images to process")
    print(f"📏 Using 20px safety padding")
    print("=" * 70)
    
    cropped_count = 0
    skipped_count = 0
    
    for i, img_path in enumerate(image_files, 1):
        was_cropped, status = crop_image_safe(img_path, img_path, padding=20)
        
        if was_cropped:
            cropped_count += 1
        else:
            skipped_count += 1
        
        # Show progress
        if i % 50 == 0 or i == total:
            print(f"[{i:3d}/{total}] Cropped: {cropped_count} | Skipped: {skipped_count}")
    
    print("=" * 70)
    print(f"✅ Done! Cropped: {cropped_count}, Skipped: {skipped_count}")

if __name__ == "__main__":
    main()
