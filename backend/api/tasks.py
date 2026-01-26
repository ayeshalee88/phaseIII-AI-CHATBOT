from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models.task_models import Task, TaskCreate, TaskUpdate, TaskResponse
from database.config import get_session
from auth.utils import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from core.exceptions import UnauthorizedAccessException, TaskNotFoundException

router = APIRouter()
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    return user_id

@router.get("/users/{user_id}/tasks", response_model=List[TaskResponse])
def get_tasks(user_id: str, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks

@router.post("/users/{user_id}/tasks", response_model=TaskResponse)
def create_task(user_id: str, task: TaskCreate, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    db_task = Task(
        **task.dict(),
        user_id=user_id
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/users/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(user_id: str, task_id: str, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()
    if not task:
        raise TaskNotFoundException(task_id)
    return task

@router.put("/users/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(user_id: str, task_id: str, task_update: TaskUpdate, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()
    if not db_task:
        raise TaskNotFoundException(task_id)

    # Update task fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/users/{user_id}/tasks/{task_id}")
def delete_task(user_id: str, task_id: str, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()
    if not db_task:
        raise TaskNotFoundException(task_id)

    session.delete(db_task)
    session.commit()
    return {"message": "Task deleted successfully"}

@router.patch("/users/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def update_task_completion(user_id: str, task_id: str, task_update: TaskUpdate, current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    if user_id != current_user_id:
        raise UnauthorizedAccessException()

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()
    if not db_task:
        raise TaskNotFoundException(task_id)

    # Update completion status
    if task_update.completed is not None:
        db_task.completed = task_update.completed

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

