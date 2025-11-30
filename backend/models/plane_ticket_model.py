from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, Interval, ForeignKey
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class PlaneTicket(Base):
    __tablename__ = "PlaneTickets"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, nullable=False)
    airline = Column(String, nullable=False)
    departure_city = Column(String, nullable=False)
    arrival_city = Column(String, nullable=False)
    departure_date = Column(TIMESTAMP, nullable=False)
    arrival_date = Column(TIMESTAMP, nullable=False)
    duration = Column(Interval)
    price = Column(Numeric(10,2), nullable=False)
    seats_available = Column(Integer, nullable=False)
    total_seats = Column(Integer, nullable=False)

    bookings = relationship("PlaneTicketBooked", back_populates="ticket")


class PlaneTicketBooked(Base):
    __tablename__ = "PlaneTickets_booked"

    id = Column(Integer, primary_key=True, index=True)
    flight_id = Column(Integer, ForeignKey("PlaneTickets.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("Person.id", ondelete="CASCADE"))
    seat_number = Column(String(10))
    total_price = Column(Numeric(10,2))

    ticket = relationship("PlaneTicket", back_populates="bookings")
    person = relationship("Person", back_populates="plane_bookings")
    
    journey_links = relationship("JourneyPlane", back_populates="plane_ticket_booked")
