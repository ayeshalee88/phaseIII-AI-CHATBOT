from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

# Base models for requests/responses
class UserBase(SQLModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Database model
class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)