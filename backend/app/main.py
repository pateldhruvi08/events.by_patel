from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, services, bookings, admin, gallery, contact, likes
from .database import engine, Base
import os

# Create tables
Base.metadata.create_all(bind=engine)

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
