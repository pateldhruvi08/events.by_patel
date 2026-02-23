from sqlalchemy.orm import Session
from backend.app import models, database

# Create DB session
db = database.SessionLocal()

try:
    services = db.query(models.Service).all()
    print(f"Total Services Found: {len(services)}")
    for s in services:
        print(f" - {s.name} (Price: {s.price})")
except Exception as e:
    print(f"Error querying services: {e}")
finally:
    db.close()
