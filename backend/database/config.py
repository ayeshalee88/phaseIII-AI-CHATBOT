# database/config.py - FIXED
from sqlmodel import SQLModel, create_engine, Session
from core.config import settings
import os

print(f"DEBUG: settings.database_url = '{settings.database_url}'")
print(f"DEBUG: DATABASE_URL env var = '{os.getenv('DATABASE_URL')}'")

# Ensure we have a valid database URL
database_url = settings.database_url or f"sqlite:///./todo.db"

# For local development
if database_url.startswith("sqlite") and "./" in database_url:
    database_url = "sqlite:///./todo.db"

if not database_url or database_url.strip() == "":
    database_url = "sqlite:///./todo.db"
    print(f"WARNING: Using fallback database URL: {database_url}")

print(f"DEBUG: Final database_url = '{database_url}'")

# Create database engine
engine = create_engine(
    database_url,
    echo=False,  # Set to False to reduce logs
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {}
)


# Session generator
def get_session():
    with Session(engine) as session:
        yield session