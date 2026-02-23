import os
import glob
import re

base_dir = r"c:\Users\Admin\Desktop\event manegement\frontend"
img_dir = os.path.join(base_dir, "images")
js_file = os.path.join(base_dir, "js", "gallery-filters.js")

valid_dirs = {
    "wedding": "wedding",
    "corporate": "corporate",
    "birthday": "birthday",
    "baby shower": "baby-shower",
    "anniversery": "anniversary",
    "home decor&welcome": "home-decor"
}

images = []
for d, cat in valid_dirs.items():
    search_path = os.path.join(img_dir, d, "*.jpeg")
    files = glob.glob(search_path)
    for f in files:
        rel_path = f"images/{d}/{os.path.basename(f)}"
        images.append(f"    {{ src: '{rel_path}', category: '{cat}' }}")

gallery_images_str = "const galleryImages = [\n" + ",\n".join(images) + "\n];"

with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace const galleryImages = [ ... ];
new_content = re.sub(r'const galleryImages = \[.*?\];', gallery_images_str, content, flags=re.DOTALL)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated {len(images)} images in gallery-filters.js")
