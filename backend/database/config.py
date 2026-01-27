from sqlmodel import SQLModel, create_engine
from core.config import settings
from database import models
import os

print(f"DEBUG: settings.database_url = '{settings.database_url}'")
print(f"DEBUG: DATABASE_URL env var = '{os.getenv('DATABASE_URL')}'")
print(f"DEBUG: All env vars with 'DATABASE': {[k for k in os.environ.keys() if 'DATABASE' in k.upper()]}")

# Ensure we have a valid database URL
database_url = settings.database_url or "sqlite:////temp/todo.db"

# For HF Spaces, use /tmp folder (writable)
if database_url.startswith("sqlite") and "./" in database_url:
    database_url = "sqlite:////tmp/todo.db"

if not database_url or database_url.strip() == "":
    database_url = "sqlite:////tmp/todo.db"
    print(f"WARNING: Using fallback database URL: {database_url}")

print(f"DEBUG: Final database_url = '{database_url}'")

# Create database engine using fixed URL
engine = create_engine(
    database_url,
    echo=True,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {}
)

# Create tables
SQLModel.metadata.create_all(engine)

# Session generator
def get_session():
    from sqlmodel import Session
    with Session(engine) as session:
        yield session

