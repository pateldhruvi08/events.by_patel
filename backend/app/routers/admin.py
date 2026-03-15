from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from ..dependencies import get_current_admin_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/users", response_model=List[schemas.UserOut])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user_by_admin(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.username is not None:
        user_with_username = db.query(models.User).filter(models.User.username == user_update.username, models.User.id != user_id).first()
        if user_with_username:
            raise HTTPException(status_code=400, detail="Username already registered")
        user.username = user_update.username
        
    if user_update.email is not None:
        user_with_email = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != user_id).first()
        if user_with_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = str(user_update.email)
        
    if user_update.phone_number is not None:
        user.phone_number = user_update.phone_number
        
    if user_update.is_superuser is not None:
        user.is_superuser = user_update.is_superuser
        
    if user_update.is_active is not None:
        user.is_active = user_update.is_active

    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_admin(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
        
    db.delete(user)
    db.commit()
    return None

@router.get("/bookings", response_model=List[schemas.BookingOut])
def get_all_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    bookings = db.query(models.Booking).offset(skip).limit(limit).all()
    return bookings

@router.patch("/bookings/{booking_id}/status", response_model=schemas.BookingOut)
def update_booking_status(booking_id: int, status_update: schemas.BookingUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking

from fastapi import File, UploadFile
import shutil
import os
from datetime import datetime

# Setup upload directory
# Current file: backend/app/routers/admin.py
# Standard base: backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(get_current_admin_user)):
    try:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        # Sanitize filename
        safe_filename = "".join([c for c in file.filename if c.isalnum() or c in ('.', '_', '-')])
        filename = f"{timestamp}_{safe_filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # URL construction (Hardcoded localhost for now, ideally strictly relative or config driven)
        url = f"/static/uploads/{filename}"
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
