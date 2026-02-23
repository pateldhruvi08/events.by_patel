import os
from sqlalchemy import text
from app.database import engine

def main():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN time VARCHAR NULL"))
            print("Added time column")
        except Exception as e:
            print(f"Time column already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN location VARCHAR NULL"))
            print("Added location column")
        except Exception as e:
            print(f"Location column already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN package VARCHAR NULL"))
            print("Added package column")
        except Exception as e:
            print(f"Package column already exists or error: {e}")
        
        conn.commit()
    print("Database migration complete.")

if __name__ == "__main__":
    main()
