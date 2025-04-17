import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Text Processing API"
    API_V1_STR: str = "/api/v1"
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/textapi")
    
    # Hugging Face Settings
    HF_TOKEN: str = os.getenv("HF_TOKEN")
    HF_SUMMARY_MODEL: str = os.getenv("HF_SUMMARY_MODEL", "ByteDance-Seed/UI-TARS-1.5-7B")
    HF_BULLET_MODEL: str = os.getenv("HF_BULLET_MODEL", "cognitivetech/Hermes-2-Pro-7b-Mistral-Bulleted-Notes")
    
    # Security
    MIN_PASSWORD_LENGTH: int = 8

    class Config:
        case_sensitive = True

settings = Settings()