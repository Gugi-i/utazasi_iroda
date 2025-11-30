from pydantic import BaseModel
from datetime import date
from typing import List, Optional


# -------------------- CAR -----------------------

class CarBase(BaseModel):
    image_url: Optional[str] = None
    make: str
    model: str
    year: int
    space: Optional[int] = None
    city: str
    price_per_day: float


class RentalShort(BaseModel):
    id: int
    rent_start_date: date
    rent_end_date: date
    status: str

    class Config:
        orm_mode = True


class CarResponse(CarBase):
    id: int
    status: str
    rentals: List[RentalShort]

    class Config:
        orm_mode = True


# ------------------- RENT -----------------------

class RentCreate(BaseModel):
    car_id: int
    user_id: int
    rent_start_date: date
    rent_end_date: date


class RentResponse(BaseModel):
    id: int
    car_id: int
    user_id: int
    rent_start_date: date
    rent_end_date: date
    total_price: float
    status: str

    class Config:
        orm_mode = True
