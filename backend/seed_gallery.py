import os
import sys
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import the app module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# pyrefly: ignore [missing-import]
from app.database import SessionLocal
# pyrefly: ignore [missing-import]
from app.models import Gallery

def seed_gallery():
    db = SessionLocal()
    
    # Check if there are already images
    if db.query(Gallery).count() > 0:
        print("Gallery already has images. Skipping seed.")
        db.close()
        return

    gallery_images = [
        { "src": "images/wedding/img1.jpeg", "category": "wedding" },
        { "src": "images/wedding/img10.jpeg", "category": "wedding" },
        { "src": "images/wedding/img100.jpeg", "category": "wedding" },
        { "src": "images/wedding/img11.jpeg", "category": "wedding" },
        { "src": "images/wedding/img12.jpeg", "category": "wedding" },
        { "src": "images/wedding/img13.jpeg", "category": "wedding" },
        { "src": "images/wedding/img14.jpeg", "category": "wedding" },
        { "src": "images/wedding/img15.jpeg", "category": "wedding" },
        { "src": "images/wedding/img16.jpeg", "category": "wedding" },
        { "src": "images/wedding/img17.jpeg", "category": "wedding" },
        { "src": "images/wedding/img2.jpeg", "category": "wedding" },
        { "src": "images/wedding/img3.jpeg", "category": "wedding" },
        { "src": "images/wedding/img4.jpeg", "category": "wedding" },
        { "src": "images/wedding/img5.jpeg", "category": "wedding" },
        { "src": "images/wedding/img57.jpeg", "category": "wedding" },
        { "src": "images/wedding/img58.jpeg", "category": "wedding" },
        { "src": "images/wedding/img59.jpeg", "category": "wedding" },
        { "src": "images/wedding/img6.jpeg", "category": "wedding" },
        { "src": "images/wedding/img60.jpeg", "category": "wedding" },
        { "src": "images/wedding/img61.jpeg", "category": "wedding" },
        { "src": "images/wedding/img62.jpeg", "category": "wedding" },
        { "src": "images/wedding/img63.jpeg", "category": "wedding" },
        { "src": "images/wedding/img64.jpeg", "category": "wedding" },
        { "src": "images/wedding/img65.jpeg", "category": "wedding" },
        { "src": "images/wedding/img66.jpeg", "category": "wedding" },
        { "src": "images/wedding/img67.jpeg", "category": "wedding" },
        { "src": "images/wedding/img68.jpeg", "category": "wedding" },
        { "src": "images/wedding/img69.jpeg", "category": "wedding" },
        { "src": "images/wedding/img7.jpeg", "category": "wedding" },
        { "src": "images/wedding/img70.jpeg", "category": "wedding" },
        { "src": "images/wedding/img71.jpeg", "category": "wedding" },
        { "src": "images/wedding/img72.jpeg", "category": "wedding" },
        { "src": "images/wedding/img73.jpeg", "category": "wedding" },
        { "src": "images/wedding/img8.jpeg", "category": "wedding" },
        { "src": "images/wedding/img89.jpeg", "category": "wedding" },
        { "src": "images/wedding/img9.jpeg", "category": "wedding" },
        { "src": "images/wedding/img93.jpeg", "category": "wedding" },
        { "src": "images/wedding/img94.jpeg", "category": "wedding" },
        { "src": "images/corporate/img32.jpeg", "category": "corporate" },
        { "src": "images/corporate/img33.jpeg", "category": "corporate" },
        { "src": "images/corporate/img34.jpeg", "category": "corporate" },
        { "src": "images/corporate/img35.jpeg", "category": "corporate" },
        { "src": "images/corporate/img36.jpeg", "category": "corporate" },
        { "src": "images/corporate/img37.jpeg", "category": "corporate" },
        { "src": "images/corporate/img88.jpeg", "category": "corporate" },
        { "src": "images/birthday/img28.jpeg", "category": "birthday" },
        { "src": "images/birthday/img29.jpeg", "category": "birthday" },
        { "src": "images/birthday/img30.jpeg", "category": "birthday" },
        { "src": "images/birthday/img31.jpeg", "category": "birthday" },
        { "src": "images/birthday/img87.jpeg", "category": "birthday" },
        { "src": "images/birthday/img91.jpeg", "category": "birthday" },
        { "src": "images/birthday/img92.jpeg", "category": "birthday" },
        { "src": "images/birthday/img99.jpeg", "category": "birthday" },
        { "src": "images/birthday/WhatsApp Image 2026-02-19 at 10.43.35 PM.jpeg", "category": "birthday" },
        { "src": "images/birthday/WhatsApp Image 2026-02-19 at 10.45.25 PM.jpeg", "category": "birthday" },
        { "src": "images/baby-shower/img18.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img19.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img20.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img22.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img23.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img24.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img25.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img26.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/img90.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/WhatsApp Image 2026-02-19 at 10.40.16 PM.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/WhatsApp Image 2026-02-19 at 10.43.35 PM.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/WhatsApp Image 2026-02-19 at 10.45.25 PM.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/WhatsApp Image 2026-02-19 at 10.45.26 PM.jpeg", "category": "baby-shower" },
        { "src": "images/baby-shower/WhatsApp Image 2026-02-19 at 10.45.27 PM.jpeg", "category": "baby-shower" },
        { "src": "images/anniversery/img27.jpeg", "category": "anniversary" },
        { "src": "images/anniversery/img86.jpeg", "category": "anniversary" },
        { "src": "images/anniversery/img95.jpeg", "category": "anniversary" },
        { "src": "images/anniversery/img96.jpeg", "category": "anniversary" },
        { "src": "images/anniversery/img97.jpeg", "category": "anniversary" },
        { "src": "images/anniversery/img98.jpeg", "category": "anniversary" },
        { "src": "images/home-decor-welcome/img74.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img75.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img76.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img77.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img78.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img79.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img81.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img82.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img83.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img84.jpeg", "category": "home-decor" },
        { "src": "images/home-decor-welcome/img85.jpeg", "category": "home-decor" }
    ]

    for item in gallery_images:
        title = item['category'].replace('-', ' ').title()
        gallery_item = Gallery(
            title=title,
            image_url=item['src']
        )
        db.add(gallery_item)
    
    db.commit()
    print(f"Successfully seeded {len(gallery_images)} gallery items.")
    db.close()

if __name__ == "__main__":
    seed_gallery()
