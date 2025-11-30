from pydantic import BaseModel
from datetime import date

# --- RoomType ---
class RoomTypeBase(BaseModel):
    room_capacity: int
    total_rooms: int
    price_per_night: float


class RoomTypeResponse(RoomTypeBase):
    id: int
    accommodation_id: int

    class Config:
        orm_mode = True

# --- Accommodation ---
class AccommodationBase(BaseModel):
    image_url: str | None = None
    name: str
    location: str
    type: str
    description: str | None = None


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

class AccommodationInfo(BaseModel):
    id: int
    name: str
    location: str
    image_url: str | None
    type: str | None

    class Config:
        orm_mode = True
        
class RoomTypeInfo(BaseModel):
    id: int
    room_capacity: int
    price_per_night: float
    accommodation: AccommodationInfo

    class Config:
        orm_mode = True

class BookingDetailedResponse(BaseModel):
    id: int
    rooms_booked: int
    check_in_date: date
    check_out_date: date
    total_price: float
    room_type: RoomTypeInfo

    class Config:
        orm_mode = True
        
class BookingResponse(BookingBase):
    id: int
    total_price: float

    class Config:
        orm_mode = True