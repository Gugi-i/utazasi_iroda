from pydantic import BaseModel
from datetime import datetime

class PlaneTicketBase(BaseModel):
    flight_number: str
    airline: str
    departure_city: str
    arrival_city: str
    departure_date: datetime
    arrival_date: datetime
    price: float
    total_seats: int
    seats_available: int


class PlaneTicketCreate(PlaneTicketBase):
    pass


class PlaneTicketResponse(PlaneTicketBase):
    id: int

    class Config:
        orm_mode = True


class PlaneTicketBookingCreate(BaseModel):
    ticket_id: int
    user_id: int
    quantity: int


class PlaneTicketBookingResponse(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    seat_number: str
    total_price: float

    class Config:
        orm_mode = True
