from sqlalchemy.orm import Session
from backend.models.person_model import Person
from backend.models.user_model import User
from backend.models.worker_model import Worker
from backend.schemas.person_schema import PersonCreate

def create_person(db: Session, data: PersonCreate):
    person = Person(
        name=data.name,
        email=data.email,
        password_hash=data.password
    )
    db.add(person)
    db.commit()
    db.refresh(person)
    return person

def create_user_account(db: Session, person_id: int):
    user = User(id=person_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_person(db: Session, email: str, password_hash: str):
    person = db.query(Person).filter(Person.email == email).first()
    if not person:
        return None
    if person.password_hash != password_hash:
        return None
    return person
