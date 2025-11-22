from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, ForeignKey, Interval
from sqlalchemy.orm import relationship
from backend.database import Base

class PlaneTicket(Base):
    __tablename__ = "PlaneTickets"

    id = Column(Integer, primary_key=True)
    flight_number = Column(String(50), nullable=False)
    airline = Column(String(100), nullable=False)
    departure_city = Column(String(100), nullable=False)
    arrival_city = Column(String(100), nullable=False)
    departure_date = Column(TIMESTAMP, nullable=False)
    arrival_date = Column(TIMESTAMP, nullable=False)
    duration = Column(Interval)
    price = Column(Numeric(10,2), nullable=False)
    seats_available = Column(Integer, nullable=False)
    total_seats = Column(Integer, nullable=False)
    class_type = Column(String(50))
    status = Column(String(50), default="available")

    bookings = relationship("PlaneTicketBooked", back_populates="ticket")

class PlaneTicketBooked(Base):
    __tablename__ = "PlaneTickets_booked"

    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("PlaneTickets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    booking_date = Column(TIMESTAMP)
    seat_number = Column(String(10))
    total_price = Column(Numeric(10,2))
    status = Column(String(50), default="booked")

    ticket = relationship("PlaneTicket", back_populates="bookings")
