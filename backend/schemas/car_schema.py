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

class CarResponse(CarBase):
    id: int
    class Config:
        orm_mode = True


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
        orm_mode = True