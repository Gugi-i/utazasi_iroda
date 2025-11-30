from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class Person(Base):
    __tablename__ = "Person"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), nullable=False)  # "user" or "worker"

    user = relationship("User", back_populates="person", uselist=False)
    worker = relationship("Worker", back_populates="person", uselist=False)

from sqlalchemy import ForeignKey

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, ForeignKey("Person.id"), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    person = relationship("Person", back_populates="user")

    rentals = relationship("CarRented", back_populates="user")
    plane_bookings = relationship("PlaneTicketBooked", back_populates="user")
    accommodation_bookings = relationship("AccommodationBooking", back_populates="user")

class Worker(Base):
    __tablename__ = "Worker"

    id = Column(Integer, ForeignKey("Person.id"), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    person = relationship("Person", back_populates="worker")
