import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, make_transient
from app.models import Base, User, Service, Booking, Gallery, ContactMessage, UserLike
from dotenv import load_dotenv

load_dotenv()

# Source Database (Local SQLite)
SQLITE_URL = "sqlite:///./event_management.db"
sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
SqliteSession = sessionmaker(bind=sqlite_engine)

# Destination Database (PostgreSQL via Environment Variables)
POSTGRES_URL = os.getenv("DATABASE_URL")
if not POSTGRES_URL:
    print("Error: Please set DATABASE_URL in your environment before running the migration.")
    print("Example: set DATABASE_URL=postgresql://user:pass@host/db")
    exit(1)

# Ensure correct SQLAlchemy prefix for old postgres:// URLs
if POSTGRES_URL.startswith("postgres://"):
    POSTGRES_URL = POSTGRES_URL.replace("postgres://", "postgresql://", 1)

postgres_engine = create_engine(POSTGRES_URL)
PostgresSession = sessionmaker(bind=postgres_engine)

def migrate():
    print("Connecting to Source (SQLite)...")
    print(f"Connecting to Destination (Postgres): {POSTGRES_URL.split('@')[-1]}")
    
    # 1. First, make sure all tables exist in destination
    print("Verifying target tables...")
    Base.metadata.create_all(bind=postgres_engine)

    src = SqliteSession()
    dst = PostgresSession()

    try:
        # 2. Define migration sequence correctly to avoid Foreign Key conflicts
        models = [User, Service, Gallery, ContactMessage, Booking, UserLike]

        for model in models:
            print(f"Migrating table: {model.__tablename__} ...")
            
            # Clear target destination before migration (optional but safe to ensure exact clone without duplicates)
            dst.query(model).delete()
            dst.commit()

            # Retrieve Source rows
            rows = src.query(model).all()
            
            # Migrate rows to Destination
            for row in rows:
                src.expunge(row)             # Detach from source session
                make_transient(row)          # Mark as entirely new, unpersisted object
                dst.add(row)                 # Add to destination queue
            
            # Commit batch
            dst.commit()
            print(f"-> Successfully migrated {len(rows)} records into {model.__tablename__}.")
            
        print("\n✅ Database Migration fully completed!")
        
    except Exception as e:
        print(f"\n❌ Migration Failed: {e}")
        dst.rollback()
        
    finally:
        src.close()
        dst.close()

if __name__ == "__main__":
    migrate()
