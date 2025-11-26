from pydantic import BaseModel
from datetime import date

# --- RoomType ---
class RoomTypeBase(BaseModel):
    room_capacity: int
    total_rooms: int
    price_per_night: float

class RoomTypeCreate(RoomTypeBase):
    accommodation_id: int

class RoomTypeResponse(RoomTypeBase):
    id: int
    accommodation_id: int

    class Config:
        orm_mode = True

# --- Accommodation ---
class AccommodationBase(BaseModel):
    name: str
    location: str
    type: str
    description: str | None = None

class AccommodationCreate(AccommodationBase):
    pass

class AccommodationResponse(AccommodationBase):
    id: int
    room_types: list[RoomTypeResponse] = []

    class Config:
        orm_mode = True

# --- Booking ---
class BookingBase(BaseModel):
    accommodation_id: int
    room_type_id: int
    rooms_booked: int
    user_id: int
    check_in_date: date
    check_out_date: date

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    total_price: float
    status: str

    class Config:
        orm_mode = True
