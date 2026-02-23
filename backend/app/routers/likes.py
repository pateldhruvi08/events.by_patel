from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, utils
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/likes",
    tags=["Likes"]
)

@router.post("/toggle", response_model=dict)
def toggle_like(like_data: schemas.LikeToggle, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Toggles a like on an image. If it's already liked, it unlikes it (removes from DB).
    If it's not liked, it adds it to the DB.
    """
    existing_like = db.query(models.UserLike).filter(
        models.UserLike.user_id == current_user.id,
        models.UserLike.image_url == like_data.image_url
    ).first()

    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        return {"status": "unliked", "image_url": like_data.image_url}
    else:
        # Like
        new_like = models.UserLike(user_id=current_user.id, image_url=like_data.image_url)
        db.add(new_like)
        db.commit()
        return {"status": "liked", "image_url": like_data.image_url}

@router.get("/me", response_model=List[str])
def get_my_likes(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns a list of image URLs liked by the current authenticated user.
    """
    likes = db.query(models.UserLike.image_url).filter(models.UserLike.user_id == current_user.id).all()
    # likes is a list of tuples, e.g. [("images/wedding/img1.jpeg",),  ...]
    return [like[0] for like in likes]
