from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.accommodation_model import AccommodationBooking
from backend.schemas.accommodation_schema import (
    AccommodationCreate, AccommodationResponse,
    RoomTypeCreate, RoomTypeResponse,
    BookingCreate, BookingResponse
)
from backend.crud import accommodation_crud

router = APIRouter(prefix="/accommodations", tags=["Accommodations"])

# --- Accommodation Endpoints ---
@router.post("/", response_model=AccommodationResponse)
def create_accommodation(data: AccommodationCreate, db: Session = Depends(get_db)):
    return accommodation_crud.create_accommodation(db, data)

@router.get("/", response_model=list[AccommodationResponse])
def list_accommodations(db: Session = Depends(get_db)):
    return accommodation_crud.get_all_accommodations(db)


# --- RoomType Endpoints ---
@router.post("/room_type", response_model=RoomTypeResponse)
def create_room_type(data: RoomTypeCreate, db: Session = Depends(get_db)):
    return accommodation_crud.create_room_type(db, data)


# --- Booking Endpoints ---
@router.post("/book", response_model=BookingResponse)
def book_room(data: BookingCreate, db: Session = Depends(get_db)):
    booking = accommodation_crud.create_booking(db, data)
    if not booking:
        raise HTTPException(status_code=400, detail="Not enough rooms available")
    return booking

@router.delete("/accommodation/booking/{booking_id}")
def delete_accommodation_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(AccommodationBooking).filter_by(id=booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted successfully", "booking_id": booking_id}

@router.get("/bookings", response_model=list[BookingResponse])
def all_bookings(db: Session = Depends(get_db)):
    return accommodation_crud.list_all_bookings(db)

@router.get("/bookings/user/{user_id}", response_model=list[BookingResponse])
def user_bookings(user_id: int, db: Session = Depends(get_db)):
    return accommodation_crud.list_user_bookings(db, user_id)


@router.get("/{acc_id}", response_model=AccommodationResponse)
def get_accommodation(acc_id: int, db: Session = Depends(get_db)):
    return accommodation_crud.get_accommodation_by_id(db, acc_id)

