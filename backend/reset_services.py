from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import SessionLocal, engine

# Create DB session
db = SessionLocal()

print("Deleting all existing services...")
try:
    db.query(models.Service).delete()
    db.commit()
    print("All services deleted.")
except Exception as e:
    print(f"Error deleting services: {e}")
    db.rollback()

print("Re-initializing services with clean data...")

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
        "name": "Baby Shower",
        "description": "Celebrate the arrival of your little one with themed decorations and games.",
        "price": 1200.0,
        "category": "Baby Shower",
        "image_url": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
        "name": "Anniversary",
        "description": "Timeless and romantic decorations for your special milestone.",
        "price": 1500.0,
        "category": "Anniversary",
        "image_url": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    {
        "name": "Home Decor",
        "description": "Add festive charm to your home for pujas, festivals, and gatherings.",
        "price": 2000.0,
        "category": "Home Decor",
        "image_url": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
]

for service in services_data:
    print(f"Adding: {service['name']}")
    db_service = models.Service(**service)
    db.add(db_service)

db.commit()
print("Services reset successfully.")
db.close()
