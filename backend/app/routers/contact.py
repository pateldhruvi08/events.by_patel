from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
import os, smtplib
from email.message import EmailMessage

router = APIRouter(
    prefix="/contact",
    tags=["contact"],
)

@router.post("/", response_model=schemas.ContactMessageOut)
def create_contact_message(message: schemas.ContactMessageCreate, db: Session = Depends(database.get_db)):
    # 1. Save to DB
    db_message = models.ContactMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # 2. Send Email
    try:
        send_email_notification(message)
    except Exception as e:
        print(f"Failed to send email: {e}")

    return db_message

def send_email_notification(message: schemas.ContactMessageCreate):
    EMAIL_ADDRESS = os.getenv("EMAIL_USER")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
    
    # Target email
    TARGET_EMAIL = "eventsbypatel88@gmail.com"

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("Email credentials not set in .env. Skipping email notification.")
        # Simulating email sent in logs
        print(f"--- FAKE EMAIL SENT TO {TARGET_EMAIL} ---")
        print(f"Subject: New Contact Message from {message.name}")
        print(f"Body: {message.message}")
        print("-------------------------------------------")
        return

    msg = EmailMessage()
    msg['Subject'] = f"New Contact Message from {message.name}"
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = TARGET_EMAIL
    
    content = f"""
    New inquiry received from Event Management Website:
    
    Name: {message.name}
    Email: {message.email}
    Phone: {message.phone}
    
    Message:
    {message.message}
    """
    msg.set_content(content)

    try:
        # Using Gmail SMTP by default
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        print("Email sent successfully.")
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise e
