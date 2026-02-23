import glob

html_files = glob.glob(r'c:\Users\Admin\Desktop\event manegement\frontend\*.html')

for fn in html_files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Event\'s with Event's
    new_content = content.replace("Event\\'s", "Event's")
    
    if new_content != content:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fn}")
        
    
with open(r'c:\Users\Admin\Desktop\event manegement\frontend\add_logo_text.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace("Event\\'s", "Event's")

if new_content != content:
    with open(r'c:\Users\Admin\Desktop\event manegement\frontend\add_logo_text.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated add_logo_text.py")
