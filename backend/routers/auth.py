from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.models.person_model import Person, User, Worker
from backend.utils.database import get_db
from backend.schemas.person_schema import PersonResponse, UserCreate, PersonLogin, WorkerLogin, PersonResponseWithEmail
from backend.crud.person_crud import (
    create_person, create_user_account,
    authenticate_login, authenticate_worker
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup/user", response_model=PersonResponse)
def signup_user(data: UserCreate, db: Session = Depends(get_db)):

    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise HTTPException(400, "Email already registered as user")
    exists = db.query(Worker).filter(Worker.email == data.email).first()
    if exists:
        raise HTTPException(400, "Email already registered as worker")

    person = create_person(db, role="user")
    user = create_user_account(db, person.id, data.name, data.email, data.password)

    return {
        "id": person.id,
        "name": user.name,
        "email": user.email,
        "role": person.role
    }

@router.post("/login")
def login(data: PersonLogin, db: Session = Depends(get_db)):
    person = authenticate_login(db, data.email, data.password)
    if not person:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "id": person.id,
        "role": person.role
    }


@router.post("/login/worker")
def login_worker(data: WorkerLogin, db: Session = Depends(get_db)):
    worker = authenticate_worker(db, data.email, data.password)
    if not worker:
        raise HTTPException(400, "Invalid email or password")

    return {
        "id": worker.id,
        "name": worker.name,
        "email": worker.email,
    }

@router.get("/persons", response_model=list[PersonResponseWithEmail])
def list_all_persons(db: Session = Depends(get_db)):
    persons = db.query(Person).all()
    result = []
    for p in persons:
        if p.user:
            result.append({
                "id": p.id,
                "role": p.role,
                "name": p.user.name,
                "email": p.user.email,
                "password_hash": p.user.password_hash
            })
        elif p.worker:
            result.append({
                "id": p.id,
                "role": p.role,
                "name": p.worker.name,
                "email": p.worker.email,
                "password_hash": p.worker.password_hash
            })
    return result