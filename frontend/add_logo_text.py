import glob
import re
import os

html_files = glob.glob(r'c:\Users\Admin\Desktop\event manegement\frontend\*.html')

for fn in html_files:
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()

    # The user wants "Event's by Patel" text next to the logo.
    # Look for `<a ... class="logo"><img ... class="logo-img"></a>`
    # We will replace it with `<a ... class="logo"><img ... class="logo-img"> <span class="logo-text">Event's By Patel</span></a>`
    
    # First, let's remove any existing logo-text just in case to prevent duplicates during testing
    html = re.sub(r'\s*<span class="logo-text">[^<]+</span>', '', html)
    
    # Now inject the span right before the closing </a> of the logo element
    html = re.sub(
        r'(<a[^>]+class="logo"[^>]*>.*?<img[^>]+class="logo-img"[^>]*>)(.*?)(</a>)',
        r'\1\2 <span class="logo-text">Event's By Patel</span>\3',
        html,
        flags=re.IGNORECASE | re.DOTALL
    )

    with open(fn, 'w', encoding='utf-8') as f:
        f.write(html)

print("Added logo text to all HTML files.")
