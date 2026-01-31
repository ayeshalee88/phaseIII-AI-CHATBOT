from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from auth.utils import get_password_hash, create_access_token, verify_password
from database.config import get_session
from models.user_model import User, UserCreate, UserResponse
from pydantic import BaseModel
from core.exceptions import DuplicateEmailException, InvalidCredentialsException
import secrets

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleSignInRequest(BaseModel):
    email: str
    name: str
    google_id: str

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()
    
    if existing_user:
        raise DuplicateEmailException(user.email)

    # Create new user with hashed password
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token AFTER user is created (so id exists)
    access_token = create_access_token(data={"sub": db_user.id})

    return db_user

@router.post("/login")
def login(request: LoginRequest, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise InvalidCredentialsException()

    # Create access token with user ID
    access_token = create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "updated_at": user.updated_at.isoformat()
    }

@router.post("/google-signin")
def google_signin(request: GoogleSignInRequest, session: Session = Depends(get_session)):
    """
    Handle Google OAuth sign-in
    Creates user if doesn't exist, returns existing user if exists
    """
    # Check if user exists
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    
    if not user:
        # Create new user with random password (they'll use Google to login)
        random_password = secrets.token_urlsafe(32)
        hashed_password = get_password_hash(random_password)
        
        user = User(
            email=request.email,
            password_hash=hashed_password,
            # You can add name field to User model if you want to store it
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "updated_at": user.updated_at.isoformat()
    }