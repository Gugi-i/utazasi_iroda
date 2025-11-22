from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.user_schema import UserCreate, UserLogin, UserResponse
from backend.crud import user_crud
from backend.schemas.car_schema import RentResponse


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = user_crud.create_user(db, data)
    return user


@router.post("/login", response_model=UserResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return user



