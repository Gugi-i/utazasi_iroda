from sqlalchemy.orm import Session
from backend.models.person_model import Person, User, Worker
import hashlib

def create_person(db: Session, role: str):
    person = Person(role=role)
    db.add(person)
    db.commit()
    db.refresh(person)
    return person

def create_user_account(db: Session, person_id: int, name: str, email: str, password: str):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    user = User(
        id=person_id,
        name=name,
        email=email,
        password_hash=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_login(db: Session, email: str, password: str):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    user = db.query(User).join(User.person).filter(User.email==email, User.password_hash==hashed).first()
    if user:
        return user.person

    worker = db.query(Worker).join(Worker.person).filter(Worker.email==email, Worker.password_hash==hashed).first()
    if worker:
        return worker.person

    return None

def authenticate_worker(db: Session, email: str, password: str):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    worker = db.query(Worker).filter(Worker.email == email).first()
    if not worker or worker.password_hash != hashed:
        return None
    return worker
