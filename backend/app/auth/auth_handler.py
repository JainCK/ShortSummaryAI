from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session

from app.database import User
from app.models.user import UserCreate, UserInDB
from app.utils.security import get_password_hash, verify_password
from app.auth.jwt_handler import create_access_token
from app.config import settings

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by verifying email and password
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    return user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Retrieve a user by email
    """
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Retrieve a user by username
    """
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Retrieve a user by ID
    """
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user in the database
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_token(user: User) -> dict:
    """
    Create an access token for a user
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}