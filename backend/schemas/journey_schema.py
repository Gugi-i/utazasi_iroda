from pydantic import BaseModel, EmailStr
from datetime import date

class JourneyCreate(BaseModel):
    user_id: int
    start_date: date
    end_date: date
    number_of_people: int
    email: EmailStr


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
    

# ---------- CAR RENTALS ----------
class CarRentedResponse(BaseModel):
    id: int
    car_id: int
    user_id: int
    rent_start_date: date
    rent_end_date: date
    total_price: float

    class Config:
        orm_mode = True


class JourneyCarResponse(BaseModel):
    id: int
    car_rented: CarRentedResponse

    class Config:
        orm_mode = True


# ---------- PLANE TICKETS ----------
class PlaneTicketBookedResponse(BaseModel):
    id: int
    flight_id: int
    user_id: int
    seat_number: str | None
    total_price: float

    class Config:
        orm_mode = True


class JourneyPlaneResponse(BaseModel):
    id: int
    plane_ticket_booked: PlaneTicketBookedResponse

    class Config:
        orm_mode = True


# ---------- ACCOMMODATION ----------
class AccommodationBookingResponse(BaseModel):
    id: int
    accommodation_id: int
    room_type_id: int
    user_id: int
    rooms_booked: int
    check_in_date: date
    check_out_date: date
    total_price: float

    class Config:
        orm_mode = True


class JourneyAccommodationResponse(BaseModel):
    id: int
    accommodation_booked: AccommodationBookingResponse

    class Config:
        orm_mode = True
        
class JourneyDetailResponse(JourneyResponse):
    id: int
    user_id: int
    start_date: date
    end_date: date
    number_of_people: int
    total_price: float
    email: EmailStr

    cars: list[JourneyCarResponse]
    plane_tickets: list[JourneyPlaneResponse]
    accommodations: list[JourneyAccommodationResponse]

    class Config:
        orm_mode = True