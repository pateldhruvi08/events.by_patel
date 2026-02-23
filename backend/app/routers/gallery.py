from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from ..dependencies import get_current_admin_user

router = APIRouter(
    prefix="/gallery",
    tags=["gallery"]
)

@router.get("/", response_model=List[schemas.GalleryOut])
def get_gallery_items(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    items = db.query(models.Gallery).offset(skip).limit(limit).all()
    return items

@router.post("/", response_model=schemas.GalleryOut)
def create_gallery_item(item: schemas.GalleryCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_item = models.Gallery(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(item_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin_user)):
    item = db.query(models.Gallery).filter(models.Gallery.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    db.delete(item)
    db.commit()
    return None
