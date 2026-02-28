from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine, Base
from .routers import auth, users, services, bookings, admin, gallery, contact, likes
import os

# 1. Safely create any missing tables using SQLAlchemy models.
# 2. WILL NOT drop existing tables or delete existing data (CREATE TABLE IF NOT EXISTS).
# 3. Requires that 'models' is explicitly imported before this runs!
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Management API")

# Mount Static Files
# Path: backend/static/uploads
# We mount /static to backend/static
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
os.makedirs(STATIC_DIR, exist_ok=True) # Ensure it exists
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production (Netlify)
    allow_credentials=False, # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(services.router)
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(gallery.router)
app.include_router(contact.router)
app.include_router(likes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Event Management System API"}

@app.on_event("startup")
def populate_default_services():
    from .database import SessionLocal
    from . import models
    
    db = SessionLocal()
    try:
        # Check if services table is completely empty
        if db.query(models.Service).count() == 0:
            print("Database empty. Auto-populating default services...")
            default_services = [
                models.Service(name="Wedding Planning", description="Complete wedding decoration including floral arrangements, stage setup, and lighting.", price=5000.0, category="Wedding", image_url="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                models.Service(name="Corporate Events", description="Professional setup for corporate events, including podiums, backdrops, and seating.", price=2500.0, category="Corporate", image_url="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                models.Service(name="Birthday Decoration", description="Colorful and fun decorations for birthday parties of all ages.", price=800.0, category="Birthday", image_url="https://images.unsplash.com/photo-1530103862676-de3c9a59af57?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                models.Service(name="Baby Shower", description="Celebrate the arrival of your little one with themed decorations and games.", price=1200.0, category="Baby Shower", image_url="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                models.Service(name="Anniversary", description="Timeless and romantic decorations for your special milestone.", price=1500.0, category="Anniversary", image_url="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                models.Service(name="Home Decor", description="Add festive charm to your home for pujas, festivals, and gatherings.", price=2000.0, category="Home Decor", image_url="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")
            ]
            db.add_all(default_services)
            db.commit()
            
        # Ensure Admin user "mahi patel" exists
        admin_user = db.query(models.User).filter(
            (models.User.email == "mahipatel2628@gmail.com") | (models.User.username == "mahi patel")
        ).first()

        from .utils import get_password_hash
        if not admin_user:
            print("Admin user 'mahi patel' not found. Creating securely...")
            new_admin = models.User(
                username="mahi patel",
                email="mahipatel2628@gmail.com",
                hashed_password=get_password_hash("pw-12345"),
                is_superuser=True,
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            print("Admin user created successfully.")
        else:
            if not admin_user.is_superuser:
                admin_user.is_superuser = True
                db.commit()
                print("Updated existing user 'mahi patel' to have admin privileges.")

    except Exception as e:
        print(f"Auto-populate error: {e}")
    finally:
        db.close()

@app.get("/status")
def get_status():
    from .database import engine
    return {"database_connected": True, "database_dialect": engine.dialect.name}
