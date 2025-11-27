from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.plane_ticket_schema import (PlaneTicketResponse,
    PlaneTicketBookingCreate, PlaneTicketBookingResponse
)
from backend.crud import plane_ticket_crud

router = APIRouter(prefix="/plane", tags=["Plane Tickets"])

@router.get("/", response_model=list[PlaneTicketResponse])
def list_tickets(departure_city: str | None = None, arrival_city: str | None = None, max_price: float | None = None, departure_date: date | None = None, arrival_date: date | None = None, db: Session = Depends(get_db)):
    return plane_ticket_crud.get_all_tickets(db, departure_city, arrival_city, max_price, departure_date, arrival_date)

@router.post("/book", response_model=list[PlaneTicketBookingResponse])
def book_ticket(data: PlaneTicketBookingCreate, db: Session = Depends(get_db)):
    return plane_ticket_crud.book_ticket(db, data)

@router.get("/flight-bookings", response_model=list[PlaneTicketBookingResponse])
def read_flight_bookings(db: Session = Depends(get_db)):
    return plane_ticket_crud.get_all_flight_bookings(db)

@router.get("/bookings/user/{user_id}", response_model=list[PlaneTicketBookingResponse])
def get_user_plane_bookings(user_id: int, db: Session = Depends(get_db)):
    return plane_ticket_crud.get_user_bookings(db, user_id)

@router.delete("/cancel/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    return plane_ticket_crud.cancel_booking(db, booking_id)
