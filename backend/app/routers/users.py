from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models, schemas, utils
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserOut)
def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    if user_update.username is not None:
        # check if username already taken
        user_with_username = db.query(models.User).filter(models.User.username == user_update.username, models.User.id != current_user.id).first()
        if user_with_username:
            raise HTTPException(status_code=400, detail="Username already registered")
        current_user.username = user_update.username
        
    if user_update.email is not None:
        user_with_email = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != current_user.id).first()
        if user_with_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = str(user_update.email)
        
    if user_update.phone_number is not None:
        current_user.phone_number = user_update.phone_number
        
    if user_update.profile_photo is not None:
        current_user.profile_photo = user_update.profile_photo
        
    if user_update.notification_email is not None:
        current_user.notification_email = user_update.notification_email
        
    if user_update.notification_sms is not None:
        current_user.notification_sms = user_update.notification_sms
        
    if user_update.password is not None and len(user_update.password) > 0:
        hashed_password = utils.hash_password(user_update.password)
        current_user.hashed_password = hashed_password

    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_me(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db.delete(current_user)
    db.commit()
    return None
