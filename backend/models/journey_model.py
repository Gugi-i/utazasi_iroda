from sqlalchemy import Column, Integer, Numeric, Date, ForeignKey, String
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class Journey(Base):
    __tablename__ = "Journey"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Person.id", ondelete="CASCADE"), nullable=False)
    total_price = Column(Numeric(10, 2), default=0)
    start_date = Column(Date)
    end_date = Column(Date)
    number_of_people = Column(Integer)
    email = Column(String(255), nullable=False)

    plane_tickets = relationship("JourneyPlane", back_populates="journey", cascade="all, delete")
    cars = relationship("JourneyCar", back_populates="journey", cascade="all, delete")
    accommodations = relationship("JourneyAccommodation", back_populates="journey", cascade="all, delete")


class JourneyPlane(Base):
    __tablename__ = "Journey_PlaneTickets"

    id = Column(Integer, primary_key=True)
    journey_id = Column(Integer, ForeignKey("Journey.id", ondelete="CASCADE"))
    plane_ticket_booked_id = Column(Integer, ForeignKey("PlaneTickets_booked.id", ondelete="CASCADE"))

    journey = relationship("Journey", back_populates="plane_tickets")
    plane_ticket_booked = relationship("PlaneTicketBooked", back_populates="journey_links")


class JourneyCar(Base):
    __tablename__ = "Journey_Cars"

    id = Column(Integer, primary_key=True)
    journey_id = Column(Integer, ForeignKey("Journey.id", ondelete="CASCADE"))
    car_rented_id = Column(Integer, ForeignKey("Car_rented.id", ondelete="CASCADE"))

    journey = relationship("Journey", back_populates="cars")
    car_rented = relationship("CarRented", back_populates="journey_links")


class JourneyAccommodation(Base):
    __tablename__ = "Journey_Accommodation"

    id = Column(Integer, primary_key=True)
    journey_id = Column(Integer, ForeignKey("Journey.id", ondelete="CASCADE"))
    accommodation_booked_id = Column(Integer, ForeignKey("AccommodationBooking.id", ondelete="CASCADE"))

    journey = relationship("Journey", back_populates="accommodations")
    accommodation_booked = relationship("AccommodationBooking", back_populates="journey_links")
