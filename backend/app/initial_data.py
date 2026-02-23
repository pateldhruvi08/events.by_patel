from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine

# Create DB tables
models.Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    
    print("Initializing/Updating services...")
    
    services_data = [
        {
            "name": "Wedding Planning",
            "description": "Complete wedding decoration including floral arrangements, stage setup, and lighting.",
            "price": 5000.0,
            "category": "Wedding",
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "name": "Corporate Events",
            "description": "Professional setup for corporate events, including podiums, backdrops, and seating.",
            "price": 2500.0,
            "category": "Corporate",
            "image_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "name": "Birthday Decoration",
            "description": "Colorful and fun decorations for birthday parties of all ages.",
            "price": 800.0,
            "category": "Birthday",
            "image_url": "https://images.unsplash.com/photo-1530103862676-de3c9a59af57?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "name": "Catering Services",
            "description": "Delicious buffet and plated catering options for all event types.",
            "price": 1200.0,
            "category": "Catering",
            "image_url": "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "name": "Event Photography",
            "description": "Professional photography and videography to capture your best moments.",
            "price": 1500.0,
            "category": "Photography",
            "image_url": "https://images.unsplash.com/photo-1520854221256-17451cc330e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "name": "Venue Decoration",
            "description": "Transform any venue with our exquisite floral and lighting decor.",
            "price": 2000.0,
            "category": "Decoration",
            "image_url": "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
    ]

    for service in services_data:
        existing = db.query(models.Service).filter(models.Service.name == service["name"]).first()
        if not existing:
            print(f"Adding service: {service['name']}")
            db_service = models.Service(**service)
            db.add(db_service)
        else:
            print(f"Service exists: {service['name']}")
    
    db.commit()
    print("Services check complete.")
    db.close()

if __name__ == "__main__":
    init_db()
