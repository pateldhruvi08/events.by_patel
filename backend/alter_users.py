import os
from sqlalchemy import text
from app.database import engine

def main():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR NULL"))
            print("Added phone_number column")
        except Exception as e:
            print(f"phone_number column already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN profile_photo VARCHAR NULL"))
            print("Added profile_photo column")
        except Exception as e:
            print(f"profile_photo column already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN notification_email BOOLEAN DEFAULT TRUE"))
            print("Added notification_email column")
        except Exception as e:
            print(f"notification_email column already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN notification_sms BOOLEAN DEFAULT FALSE"))
            print("Added notification_sms column")
        except Exception as e:
            print(f"notification_sms column already exists or error: {e}")

        conn.commit()
    print("Database migration users complete.")

if __name__ == "__main__":
    main()
