from pydantic import BaseModel
from datetime import date

class JourneyCreate(BaseModel):
    user_id: int
    start_date: date
    end_date: date
    number_of_people: int


class JourneyResponse(BaseModel):
    id: int
    user_id: int
    start_date: date
    end_date: date
    number_of_people: int
    total_price: float

    class Config:
        orm_mode = True


class AddCar(BaseModel):
    car_rented_id: int


class AddPlane(BaseModel):
    plane_ticket_booked_id: int


class AddAccommodation(BaseModel):
    accommodation_booked_id: int
