from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.get("/", response_model=List[schemas.BookingOut])
def get_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).offset(skip).limit(limit).all()
    return bookings

@router.post("/", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_booking = models.Booking(**booking.dict(), user_id=current_user.id)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/{booking_id}", response_model=schemas.BookingOut)
def get_booking(booking_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

from datetime import datetime

@router.patch("/{booking_id}/cancel", response_model=schemas.BookingOut)
def cancel_booking(booking_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.event_date < datetime.now():
        raise HTTPException(status_code=400, detail="Cannot cancel past bookings")
    
    if booking.status not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail="Can only cancel pending or confirmed bookings")
        
    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking
