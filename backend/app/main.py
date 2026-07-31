# pyrefly: ignore [missing-import]
from fastapi import FastAPI, APIRouter
# pyrefly: ignore [missing-import]
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
# Mount on /api/static as well for Vercel compatibility
app.mount("/api/static", StaticFiles(directory=STATIC_DIR), name="api_static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production (Vercel)
    allow_credentials=False, # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(services.router)
api_router.include_router(bookings.router)
api_router.include_router(admin.router)
api_router.include_router(gallery.router)
api_router.include_router(contact.router)
api_router.include_router(likes.router)

# Also add the root to /api
@api_router.get("/")
def read_root():
    return {"message": "Welcome to Event Management System API"}

app.include_router(api_router)

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
                models.Service(name="Wedding Planning", description="Complete wedding decoration including floral arrangements, stage setup, and lighting.", price=5000.0, category="Wedding", image_url="images/wedding/img4.jpeg"),
                models.Service(name="Corporate Events", description="Professional setup for corporate events, including podiums, backdrops, and seating.", price=2500.0, category="Corporate", image_url="images/corporate/img35.jpeg"),
                models.Service(name="Birthday Decoration", description="Colorful and fun decorations for birthday parties of all ages.", price=800.0, category="Birthday", image_url="images/birthday/img28.jpeg"),
                models.Service(name="Baby Shower", description="Celebrate the arrival of your little one with themed decorations and games.", price=1200.0, category="Baby Shower", image_url="images/baby-shower/img20.jpeg"),
                models.Service(name="Anniversary", description="Timeless and romantic decorations for your special milestone.", price=1500.0, category="Anniversary", image_url="images/anniversery/img27.jpeg"),
                models.Service(name="Home Decor", description="Add festive charm to your home for pujas, festivals, and gatherings.", price=2000.0, category="Home Decor", image_url="images/home-decor-welcome/img78.jpeg"),
                models.Service(name="Kanku Pagla", description="Traditional Kanku Pagla setup and welcome decoration.", price=1000.0, category="Welcome Home", image_url="images/kanku pagla/img06.jpeg"),
                models.Service(name="Engagement Ceremony", description="Beautiful engagement setups and ring ceremony decor.", price=3000.0, category="Wedding", image_url="images/engegment ceremony/img1.jpeg"),
                models.Service(name="Chhatthi Pooja", description="Special Chhatthi Pooja decorations for newborns.", price=900.0, category="Baby Shower", image_url="images/chhatthi pooja/img3.jpeg")
            ]
            db.add_all(default_services)
            db.commit()

        # Ensure admin user exists
        from . import utils
        admin_email = "mahipatel2628@gmail.com"
        admin_user = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin_user:
            print("Admin user not found. Auto-populating admin user...")
            hashed_pw = utils.get_password_hash("admin123")
            new_admin = models.User(
                email=admin_email,
                username="mahi patel",
                hashed_password=hashed_pw,
                notification_email=True,
                notification_sms=False,
                is_active=True,
                is_superuser=True
            )
            db.add(new_admin)
            db.commit()
        else:
            # Force update if it already exists
            admin_user.username = "mahi patel"
            admin_user.hashed_password = utils.get_password_hash("admin123")
            admin_user.is_superuser = True
            db.commit()

    except Exception as e:
        print(f"Auto-populate error: {e}")
    finally:
        db.close()

@app.get("/status")
def get_status():
    from .database import engine
    return {"database_connected": True, "database_dialect": engine.dialect.name}
