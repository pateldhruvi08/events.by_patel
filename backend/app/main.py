from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .routers import auth, users, services, bookings, admin, gallery, contact, likes
from .database import engine, Base, SessionLocal
from .config import get_settings
from . import models, utils
import os

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Automatically create tables on startup
    Base.metadata.create_all(bind=engine)
    
    # 2. Automatically create a default admin user if one does not exist
    db = SessionLocal()
    try:
        admin_user = db.query(models.User).filter(models.User.username == settings.DEFAULT_ADMIN_USERNAME).first()
        if not admin_user:
            hashed_pwd = utils.get_password_hash(settings.DEFAULT_ADMIN_PASSWORD)
            new_admin = models.User(
                username=settings.DEFAULT_ADMIN_USERNAME,
                email="admin@example.com",
                password=hashed_pwd,
                is_superuser=True
            )
            db.add(new_admin)
            db.commit()
            print(f"Created default admin user: {settings.DEFAULT_ADMIN_USERNAME}")
    except Exception as e:
        print(f"Failed to create default admin: {e}")
    finally:
        db.close()
    
    yield
    # (Shutdown code goes here if needed)

app = FastAPI(title="Event Management API", lifespan=lifespan)

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
