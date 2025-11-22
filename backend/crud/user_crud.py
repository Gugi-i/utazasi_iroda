from sqlalchemy.orm import Session
from backend.models.user_model import User
from backend.schemas.user_schema import UserCreate

def create_user(db: Session, data: UserCreate):
    user = User(
        name=data.name,
        email=data.email,
        password_hash=data.password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password_hash: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if user.password_hash != password_hash:
        return None
    return user



def get_user_rentals(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    return user.rentals
