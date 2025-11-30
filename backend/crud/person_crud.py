from sqlalchemy.orm import Session
from backend.models.person_model import Person, User, Worker

def create_person(db: Session, role: str):
    """
    Create a Person entry with a given role ("user" or "worker")
    """
    person = Person(role=role)
    db.add(person)
    db.commit()
    db.refresh(person)
    return person

def create_user_account(db: Session, person_id: int, name: str, email: str, password_hash: str):
    """
    Create a User account linked to a Person
    """
    user = User(
        id=person_id,
        name=name,
        email=email,
        password_hash=password_hash
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_login(db: Session, email: str, password_hash: str):
    """
    Authenticate a login for both users and workers.
    Returns the Person object if credentials are correct.
    """
    user = db.query(User).join(User.person).filter(User.email==email, User.password_hash==password_hash).first()
    if user:
        return user.person

    worker = db.query(Worker).join(Worker.person).filter(Worker.email==email, Worker.password_hash==password_hash).first()
    if worker:
        return worker.person

    return None

def authenticate_worker(db: Session, email: str, password_hash: str):
    """
    Authenticate a worker (checks only Worker table)
    """
    worker = db.query(Worker).filter(Worker.email == email).first()
    if not worker or worker.password_hash != password_hash:
        return None
    return worker
