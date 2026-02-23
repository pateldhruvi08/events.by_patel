import os
import re

map_data = {
    "img27.jpeg": "anniversery/img27.jpeg", "img86.jpeg": "anniversery/img86.jpeg", "img95.jpeg": "anniversery/img95.jpeg", "img96.jpeg": "anniversery/img96.jpeg", "img97.jpeg": "anniversery/img97.jpeg", "img98.jpeg": "anniversery/img98.jpeg", 
    "img32.jpeg": "corporate/img32.jpeg", "img33.jpeg": "corporate/img33.jpeg", "img34.jpeg": "corporate/img34.jpeg", "img35.jpeg": "corporate/img35.jpeg", "img36.jpeg": "corporate/img36.jpeg", "img37.jpeg": "corporate/img37.jpeg", "img88.jpeg": "corporate/img88.jpeg", 
    "img74.jpeg": "home decor&welcome/img74.jpeg", "img75.jpeg": "home decor&welcome/img75.jpeg", "img76.jpeg": "home decor&welcome/img76.jpeg", "img77.jpeg": "home decor&welcome/img77.jpeg", "img78.jpeg": "home decor&welcome/img78.jpeg", "img79.jpeg": "home decor&welcome/img79.jpeg", "img81.jpeg": "home decor&welcome/img81.jpeg", "img82.jpeg": "home decor&welcome/img82.jpeg", "img83.jpeg": "home decor&welcome/img83.jpeg", "img84.jpeg": "home decor&welcome/img84.jpeg", "img85.jpeg": "home decor&welcome/img85.jpeg", 
    "img1.jpeg": "wedding/img1.jpeg", "img10.jpeg": "wedding/img10.jpeg", "img100.jpeg": "wedding/img100.jpeg", "img11.jpeg": "wedding/img11.jpeg", "img12.jpeg": "wedding/img12.jpeg", "img13.jpeg": "wedding/img13.jpeg", "img14.jpeg": "wedding/img14.jpeg", "img15.jpeg": "wedding/img15.jpeg", "img16.jpeg": "wedding/img16.jpeg", "img17.jpeg": "wedding/img17.jpeg", "img2.jpeg": "wedding/img2.jpeg", "img3.jpeg": "wedding/img3.jpeg", "img4.jpeg": "wedding/img4.jpeg", "img5.jpeg": "wedding/img5.jpeg", "img57.jpeg": "wedding/img57.jpeg", "img58.jpeg": "wedding/img58.jpeg", "img59.jpeg": "wedding/img59.jpeg", "img6.jpeg": "wedding/img6.jpeg", "img60.jpeg": "wedding/img60.jpeg", "img61.jpeg": "wedding/img61.jpeg", "img62.jpeg": "wedding/img62.jpeg", "img63.jpeg": "wedding/img63.jpeg", "img64.jpeg": "wedding/img64.jpeg", "img65.jpeg": "wedding/img65.jpeg", "img66.jpeg": "wedding/img66.jpeg", "img67.jpeg": "wedding/img67.jpeg", "img68.jpeg": "wedding/img68.jpeg", "img69.jpeg": "wedding/img69.jpeg", "img7.jpeg": "wedding/img7.jpeg", "img70.jpeg": "wedding/img70.jpeg", "img71.jpeg": "wedding/img71.jpeg", "img72.jpeg": "wedding/img72.jpeg", "img73.jpeg": "wedding/img73.jpeg", "img8.jpeg": "wedding/img8.jpeg", "img89.jpeg": "wedding/img89.jpeg", "img9.jpeg": "wedding/img9.jpeg", "img93.jpeg": "wedding/img93.jpeg", "img94.jpeg": "wedding/img94.jpeg",
    "img28.jpeg": "wedding/img28.jpeg", "img30.jpeg": "wedding/img30.jpeg", "img31.jpeg": "wedding/img31.jpeg",
    "img20.jpeg": "wedding/img20.jpeg", "img22.jpeg": "wedding/img22.jpeg", "img23.jpeg": "wedding/img23.jpeg", 
    "img24.jpeg": "wedding/img24.jpeg", "img25.jpeg": "wedding/img25.jpeg", "img26.jpeg": "wedding/img26.jpeg", 
    "img29.jpeg": "wedding/img29.jpeg", "img18.jpeg": "wedding/img18.jpeg", "img19.jpeg": "wedding/img19.jpeg"
}

def replace_paths(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for paths assuming they start with 'images/' or 'url(images/'
    # Find all pattern instances: images/imgX.jpeg
    def replacer(match):
        img_name = match.group(1)
        if img_name in map_data:
            return f"images/{map_data[img_name]}"
        return match.group(0)

    # 1. replace src="images/imgX.jpeg" -> src="images/category/imgX.jpeg"
    # match patterns like `images/imgX.jpeg` which are not preceded by another slash.
    content = re.sub(r'(?<!/)images/(img\d+\.jpeg)', replacer, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files_to_update = [
    'index.html',
    'gallery.html',
    'js/services.js',
    'js/gallery-filters.js'
]

for f in files_to_update:
    replace_paths(f)

print("Replacement complete.")
