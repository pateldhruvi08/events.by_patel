import os
import re

map_data = {
    "img27.jpeg": "anniversery/img27.jpeg", "img86.jpeg": "anniversery/img86.jpeg", "img95.jpeg": "anniversery/img95.jpeg", "img96.jpeg": "anniversery/img96.jpeg", "img97.jpeg": "anniversery/img97.jpeg", "img98.jpeg": "anniversery/img98.jpeg", 
    "img32.jpeg": "corporate/img32.jpeg", "img33.jpeg": "corporate/img33.jpeg", "img34.jpeg": "corporate/img34.jpeg", "img35.jpeg": "corporate/img35.jpeg", "img36.jpeg": "corporate/img36.jpeg", "img37.jpeg": "corporate/img37.jpeg", "img88.jpeg": "corporate/img88.jpeg", 
    "img74.jpeg": "home decor&welcome/img74.jpeg", "img75.jpeg": "home decor&welcome/img75.jpeg", "img76.jpeg": "home decor&welcome/img76.jpeg", "img77.jpeg": "home decor&welcome/img77.jpeg", "img78.jpeg": "home decor&welcome/img78.jpeg", "img79.jpeg": "home decor&welcome/img79.jpeg", "img81.jpeg": "home decor&welcome/img81.jpeg", "img82.jpeg": "home decor&welcome/img82.jpeg", "img83.jpeg": "home decor&welcome/img83.jpeg", "img84.jpeg": "home decor&welcome/img84.jpeg", "img85.jpeg": "home decor&welcome/img85.jpeg", 
    "img1.jpeg": "wedding/img1.jpeg", "img10.jpeg": "wedding/img10.jpeg", "img100.jpeg": "wedding/img100.jpeg", "img11.jpeg": "wedding/img11.jpeg", "img12.jpeg": "wedding/img12.jpeg", "img13.jpeg": "wedding/img13.jpeg", "img14.jpeg": "wedding/img14.jpeg", "img15.jpeg": "wedding/img15.jpeg", "img16.jpeg": "wedding/img16.jpeg", "img17.jpeg": "wedding/img17.jpeg", "img2.jpeg": "wedding/img2.jpeg", "img3.jpeg": "wedding/img3.jpeg", "img4.jpeg": "wedding/img4.jpeg", "img5.jpeg": "wedding/img5.jpeg", "img57.jpeg": "wedding/img57.jpeg", "img58.jpeg": "wedding/img58.jpeg", "img59.jpeg": "wedding/img59.jpeg", "img6.jpeg": "wedding/img6.jpeg", "img60.jpeg": "wedding/img60.jpeg", "img61.jpeg": "wedding/img61.jpeg", "img62.jpeg": "wedding/img62.jpeg", "img63.jpeg": "wedding/img63.jpeg", "img64.jpeg": "wedding/img64.jpeg", "img65.jpeg": "wedding/img65.jpeg", "img66.jpeg": "wedding/img66.jpeg", "img67.jpeg": "wedding/img67.jpeg", "img68.jpeg": "wedding/img68.jpeg", "img69.jpeg": "wedding/img69.jpeg", "img7.jpeg": "wedding/img7.jpeg", "img70.jpeg": "wedding/img70.jpeg", "img71.jpeg": "wedding/img71.jpeg", "img72.jpeg": "wedding/img72.jpeg", "img73.jpeg": "wedding/img73.jpeg", "img8.jpeg": "wedding/img8.jpeg", "img89.jpeg": "wedding/img89.jpeg", "img9.jpeg": "wedding/img9.jpeg", "img93.jpeg": "wedding/img93.jpeg", "img94.jpeg": "wedding/img94.jpeg"
}

def replace_css_paths(file_path):
    if not os.path.exists(file_path): return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # CSS files might have url('../images/imgX.jpeg') or url('images/imgX.jpeg')
    def replacer_css(match):
        prefix = match.group(1)
        img_name = match.group(2)
        if img_name in map_data:
            return f"url('{prefix}images/{map_data[img_name]}')"
        return match.group(0)

    content = re.sub(r"url\('((?:\.\./)?)images/(img\d+\.jpeg)'\)", replacer_css, content)
    content = re.sub(r'url\("((?:\.\./)?)images/(img\d+\.jpeg)"\)', replacer_css, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files_to_update_css = [
    'css/style.css',
    'css/navbar.css',
    'css/home-gallery-filters.css',
    'css/home-services.css'
]

for f in files_to_update_css:
    replace_css_paths(f)

print("CSS replacement complete.")
