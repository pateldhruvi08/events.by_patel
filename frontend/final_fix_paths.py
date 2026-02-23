import os
import re
import json

base_dir = r"c:\Users\Admin\Desktop\event manegement\frontend"
map_file = os.path.join(base_dir, "..", "map.json")

with open(map_file, 'r', encoding='utf-8') as f:
    map_data = json.load(f)

# Normalize map_data paths (change backslash to forward slash)
map_data = {k: v.replace('\\', '/') for k, v in map_data.items()}

def replacer_html(match):
    img_name = match.group(2)
    if img_name in map_data:
        # Match 1 is the prefix if any, Match 2 is the file name
        return f"images/{map_data[img_name]}"
    return match.group(0)

def replacer_css(match):
    prefix = match.group(1)
    img_name = match.group(3)
    if img_name in map_data:
        return f"url('{prefix}images/{map_data[img_name]}')"
    return match.group(0)

files_to_update = [
    'index.html',
    'gallery.html',
    'js/services.js',
    'js/gallery-filters.js',
    'js/home-gallery.js',
    'css/style.css',
    'css/navbar.css',
    'css/home-gallery-filters.css',
    'css/home-services.css'
]

for f in files_to_update:
    path = os.path.join(base_dir, f)
    if not os.path.exists(path): continue
    
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace anything that looks like images/(anything/)*imgX.jpeg with the mapped one
    # For HTML/JS matching `images/.../imgX.jpeg`
    content = re.sub(r'images/([^"\']*/)?(img\d+\.jpeg|WhatsApp[^"\']*\.jpeg|logo\.jpeg)', replacer_html, content)
    
    # For CSS matching `url('images/.../imgX.jpeg')`
    content = re.sub(r'url\([\'"]?((?:\.\./)?)images/([^)]*/)?(img\d+\.jpeg|WhatsApp[^)]*\.jpeg|logo\.jpeg)[\'"]?\)', replacer_css, content)
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

print("Final replacement complete.")
