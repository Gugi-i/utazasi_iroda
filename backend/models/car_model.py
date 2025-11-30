from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, TIMESTAMP
from sqlalchemy.orm import relationship
from backend.utils.database import Base


class Car(Base):
    __tablename__ = "Car"

    id = Column(Integer, primary_key=True)
    image_url = Column(String(255))
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    space = Column(Integer)
    city = Column(String(100))
    price_per_day = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), default="available")

    rentals = relationship("CarRented", back_populates="car")


class CarRented(Base):
    __tablename__ = "Car_rented"

    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("Car.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    rent_start_date = Column(Date, nullable=False)
    rent_end_date = Column(Date, nullable=False)
    total_price = Column(Numeric(10, 2))
    booking_date = Column(TIMESTAMP)
    status = Column(String(50), default="booked")

    car = relationship("Car", back_populates="rentals")
    user = relationship("User", back_populates="rentals")
