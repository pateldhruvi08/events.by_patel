import re
import os
import glob

html_files = glob.glob(r'c:\Users\Admin\Desktop\event manegement\frontend\*.html')
v = "?v=41.0"

for fn in html_files:
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()

    # Append ?v=2.0 to .css and .js tags 
    # link href="css/style.css" -> link href="css/style.css?v=2.0"
    html = re.sub(r'(href="css/[^"]+\.css)(?:\?v=[0-9.]+)?(")', lambda m: m.group(1) + v + m.group(2), html)
    html = re.sub(r'(src="js/[^"]+\.js)(?:\?v=[0-9.]+)?(")', lambda m: m.group(1) + v + m.group(2), html)

    with open(fn, 'w', encoding='utf-8') as f:
        f.write(html)

print("Cache busting updated.")
