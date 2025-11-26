from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models.plane_ticket_model import PlaneTicket, PlaneTicketBooked
from backend.schemas.plane_ticket_schema import PlaneTicketBookingCreate

from datetime import date

def get_all_tickets(db: Session, departure_city=None, arrival_city=None, max_price=None, departure_date: date | None = None, arrival_date: date | None = None):
    query = db.query(PlaneTicket)

    if departure_city:
        query = query.filter(PlaneTicket.departure_city.ilike(f"%{departure_city}%"))

    if arrival_city:
        query = query.filter(PlaneTicket.arrival_city.ilike(f"%{arrival_city}%"))

    if max_price:
        query = query.filter(PlaneTicket.price <= max_price)

    if departure_date:
        query = query.filter(PlaneTicket.departure_date == departure_date)

    if arrival_date:
        query = query.filter(PlaneTicket.arrival_date == arrival_date)

    return query.all()


def book_ticket(db: Session, data):
    ticket = db.query(PlaneTicket).filter(PlaneTicket.id == data.flight_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.seats_available < data.quantity:
        raise HTTPException(status_code=400, detail="Not enough seats available")

    existing_seats = (
        db.query(PlaneTicketBooked.seat_number)
        .filter(PlaneTicketBooked.flight_id == data.flight_id)
        .all()
    )

    occupied = {int(s[0]) for s in existing_seats}

    all_seats = list(range(1, ticket.total_seats + 1))
    free_seats = [s for s in all_seats if s not in occupied]

    if len(free_seats) < data.quantity:
        raise HTTPException(status_code=400, detail="Not enough free seats")

    assigned = free_seats[:data.quantity]

    bookings = []

    for seat in assigned:
        b = PlaneTicketBooked(
            flight_id=data.flight_id,
            user_id=data.user_id,
            seat_number=str(seat),
            total_price=float(ticket.price)
        )
        db.add(b)
        bookings.append(b)

    ticket.seats_available -= data.quantity

    db.commit()

    for b in bookings:
        db.refresh(b)

    return bookings

def cancel_booking(db: Session, booking_id: int):
    booking = db.query(PlaneTicketBooked).filter(PlaneTicketBooked.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    ticket = booking.ticket
    ticket.seats_available += 1

    db.delete(booking)
    db.commit()

    return {"message": "Booking cancelled"}

def get_all_flight_bookings(db: Session):
    return db.query(PlaneTicketBooked).all()