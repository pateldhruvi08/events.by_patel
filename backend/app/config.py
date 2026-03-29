from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Event Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Strictly database URL from environment
    DATABASE_URL: str

    # Security
    SECRET_KEY: str = "your-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200 # 30 days for persistent session

    # Email
    EMAIL_USER: str | None = None
    EMAIL_PASSWORD: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL must be set in the environment variables.")

@lru_cache()
def get_settings():
    return Settings()
