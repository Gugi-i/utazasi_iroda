from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, ForeignKey("Person.id"), primary_key=True)

    person = relationship("Person", back_populates="user")

    rentals = relationship("CarRented", back_populates="user")
    plane_bookings = relationship("PlaneTicketBooked", back_populates="user")
    accommodation_bookings = relationship("AccommodationBooking", back_populates="user")
