import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import models
from app.models import Base, User, Service, Booking, Gallery, ContactMessage, UserLike

# 1. Database URLs
SQLITE_URL = "sqlite:///./event_management.db"
# Remember: Neon requires sslmode=require
POSTGRES_URL = "postgresql://neondb_owner:npg_Ag3D2wsCvWZV@ep-wild-sound-azr5bxb0-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 2. Setup Engines & Sessions
print("Connecting to local SQLite database...")
sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
SqliteSession = sessionmaker(autocommit=False, autoflush=False, bind=sqlite_engine)

print("Connecting to live PostgreSQL database...")
# Note: This will FAIL if your IP is not allowed in Render's Access Control
postgres_engine = create_engine(POSTGRES_URL)
PostgresSession = sessionmaker(autocommit=False, autoflush=False, bind=postgres_engine)

def migrate_data():
    sqlite_db = SqliteSession()
    postgres_db = PostgresSession()

    try:
        # Create all tables in Postgres if they don't exist
        print("Creating tables in PostgreSQL if they don't exist...")
        Base.metadata.create_all(bind=postgres_engine)

        # We must migrate in the correct order to respect Foreign Keys!
        # 1. Independent Tables: User, Service, Gallery, ContactMessage
        # 2. Dependent Tables: Booking, UserLike

        models_to_migrate = [
            (User, "Users"),
            (Service, "Services"),
            (Gallery, "Gallery Images"),
            (ContactMessage, "Contact Messages"),
            (Booking, "Bookings"),
            (UserLike, "User Likes")
        ]

        for model, name in models_to_migrate:
            print(f"\nMigrating {name}...")
            
            # Fetch all records from SQLite
            records = sqlite_db.query(model).all()
            print(f"Found {len(records)} records in SQLite.")

            if not records:
                continue

            # Clear existing data in Postgres table (optional, but prevents primary key clashes)
            # postgres_db.query(model).delete()
            # postgres_db.commit()

            # Prepare data for insertion (strip SQLAlchemy instance state)
            new_records = []
            for record in records:
                # Convert the object to a dictionary
                data = {column.name: getattr(record, column.name) for column in model.__table__.columns}
                new_records.append(model(**data))
            
            # Use merge to avoid duplicate primary key errors if data already exists
            for new_record in new_records:
                postgres_db.merge(new_record)
            
            postgres_db.commit()
            print(f"Successfully migrated {name} to PostgreSQL!")

        print("\n🎉 Migration completed successfully!")

    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        postgres_db.rollback()
    finally:
        sqlite_db.close()
        postgres_db.close()

if __name__ == "__main__":
    print("Starting Database Migration Script...")
    migrate_data()
