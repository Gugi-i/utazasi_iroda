from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class Worker(Base):
    __tablename__ = "Worker"

    id = Column(Integer, ForeignKey("Person.id"), primary_key=True)

    person = relationship("Person", back_populates="worker")
