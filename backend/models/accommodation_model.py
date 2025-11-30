from sqlalchemy import Column, Integer, String, Numeric, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from backend.utils.database import Base

class Accommodation(Base):
    __tablename__ = "Accommodation"

    id = Column(Integer, primary_key=True)
    image_url = Column(String(255))
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  
    description = Column(String)
    
    room_types = relationship("AccommodationRoomType", back_populates="accommodation")


class AccommodationRoomType(Base):
    __tablename__ = "AccommodationRoomType"

    id = Column(Integer, primary_key=True)
    accommodation_id = Column(Integer, ForeignKey("Accommodation.id"), nullable=False)
    room_capacity = Column(Integer, nullable=False)  
    total_rooms = Column(Integer, nullable=False)    
    price_per_night = Column(Numeric(10,2), nullable=False)

    accommodation = relationship("Accommodation", back_populates="room_types")
    bookings = relationship("AccommodationBooking", back_populates="room_type")


class AccommodationBooking(Base):
    __tablename__ = "AccommodationBooking"

    id = Column(Integer, primary_key=True)
    accommodation_id = Column(Integer, ForeignKey("Accommodation.id"), nullable=False)
    room_type_id = Column(Integer, ForeignKey("AccommodationRoomType.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    rooms_booked = Column(Integer, nullable=False)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    total_price = Column(Numeric(10,2))
    status = Column(String(50), default="booked")

    room_type = relationship("AccommodationRoomType", back_populates="bookings")
