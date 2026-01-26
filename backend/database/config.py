from sqlmodel import create_engine
from core.config import settings

# Create database engine
engine = create_engine(settings.database_url, echo=True)

def get_session():
    from sqlmodel import Session
    with Session(engine) as session:
        yield session