from pydantic import BaseModel
from datetime import date

class CarBase(BaseModel):
    make: str
    model: str
    year: int
    space: int | None
    city: str
    price_per_day: float
    status: str | None = "available"

class CarCreate(CarBase):
    pass

class RentResponse(BaseModel):
    id: int
    car_id: int
    rent_start_date: date
    rent_end_date: date
    total_price: float | None = None
    booking_date: date | None = None
    status: str

    class Config:
        from_attributes = True
        
class CarResponse(CarBase):
    id: int
    rentals: list[RentResponse] = []

    class Config:
        from_attributes = True

class RentCreate(BaseModel):
    car_id: int
    rent_start_date: date
    rent_end_date: date

class RentResponse(BaseModel):
    id: int
    car_id: int
    rent_start_date: date
    rent_end_date: date
    total_price: float
    status: str
    class Config:
        from_attributes = True