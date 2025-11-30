from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.models.person_model import Person
from backend.utils.database import get_db
from backend.schemas.person_schema import PersonCreate, PersonLogin, PersonResponse
from backend.models.user_model import User
from backend.models.worker_model import Worker 
from backend.crud.person_crud import (
    create_person, create_user_account,
    authenticate_person
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# --- USER signup ---
@router.post("/signup", response_model=PersonResponse)
def signup(data: PersonCreate, db: Session = Depends(get_db)):
    exists = db.query(Person).filter(Person.email == data.email).first()
    if exists:
        raise HTTPException(400, "Email already registered")

    person = create_person(db, data)
    create_user_account(db, person.id)

    return person


# --- USER login ---
@router.post("/login")
def login(data: PersonLogin, db: Session = Depends(get_db)):
    person = authenticate_person(db, data.email, data.password)
    if not person:
        raise HTTPException(400, "Invalid email or password")

    return {
        "id": person.id,
        "name": person.name,
        "email": person.email,
        "role": "user" if person.user else "worker"
    }

# --- LIST persons ---
@router.get("/persons", response_model=list[PersonResponse])
def list_all_persons(db: Session = Depends(get_db)):
    return db.query(Person).all()
