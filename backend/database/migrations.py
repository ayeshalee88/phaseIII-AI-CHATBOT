"""
Database migration script for the Todo application
"""
from sqlmodel import SQLModel
from models.task_models import User, Task
from database.config import engine

def create_tables():
    """
    Create all tables in the database
    """
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!")