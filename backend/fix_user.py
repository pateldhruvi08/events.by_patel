from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database import Base
from backend.app.models import User
from backend.app.utils import get_password_hash
from backend.app.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

username = "mahi patel"
email = "mahipatel2628@gmail.com" # Guessed from previous screenshot context if available, or just a placeholder
password = "12345"

existing_user = db.query(User).filter(User.username == username).first()

if existing_user:
    print(f"User '{username}' ALREADY EXISTS.")
    # Reset password to ensure they can login
    print(f"Resetting password for '{username}' to '{password}'...")
    existing_user.hashed_password = get_password_hash(password)
    existing_user.is_superuser = True
    db.commit()
    print("Password reset successful. User set to SUPERUSER.")
else:
    print(f"User '{username}' NOT FOUND. Creating new user...")
    new_user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password)
    )
    db.add(new_user)
    db.commit()
    print(f"User '{username}' created successfully with password '{password}'.")

db.close()
