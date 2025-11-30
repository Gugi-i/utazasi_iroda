from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.utils.database import get_db
from backend.models.accommodation_model import AccommodationBooking
from backend.schemas.accommodation_schema import (
    AccommodationResponse,
    BookingCreate, BookingResponse
)
from backend.crud import accommodation_crud
from backend.crud.accommodation_crud import roomtype_belongs_to_accommodation, date_is_valid

router = APIRouter(prefix="/accommodations", tags=["Accommodations"])

# --- Accommodation Endpoints ---

@router.get("/", response_model=list[AccommodationResponse])
def list_accommodations(location: str | None = None, max_price: float | None = None, check_in: date | None = None, check_out: date | None = None, db: Session = Depends(get_db)):
    return accommodation_crud.get_all_accommodations(db=db, location=location, max_price=max_price, check_in=check_in, check_out=check_out)


# --- Booking Endpoints ---
@router.post("/book", response_model=BookingResponse)
def book_room(data: BookingCreate, db: Session = Depends(get_db)):
    booking = accommodation_crud.create_booking(db, data)
    
    if not date_is_valid(data.check_in_date, data.check_out_date):
        raise HTTPException(status_code=400, detail="Invalid check-in/check-out dates")
    
    if not roomtype_belongs_to_accommodation(db, data.accommodation_id, data.room_type_id):
        raise HTTPException(status_code=400, detail="Room type does not belong to this accommodation")

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
