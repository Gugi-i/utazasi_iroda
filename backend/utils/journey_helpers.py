from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.models.accommodation_model import Accommodation, AccommodationBooking, AccommodationRoomType
from backend.models.car_model import Car, CarRented
from backend.models.plane_ticket_model import PlaneTicket, PlaneTicketBooked


# ---- DATE CHECKS ----
def valid_date_range(start: date, end: date) -> bool:
    return start < end and start >= date.today()

# ---- CAR CHECKS ----
def car_exists(db: Session, car_id: int):
    return db.query(Car).filter(Car.id == car_id).first()

def car_is_available(db: Session, car_id: int, start_date: date, end_date: date) -> bool:
    conflict = db.query(CarRented).filter(
        CarRented.car_id == car_id,
        CarRented.rent_start_date < end_date,
        CarRented.rent_end_date > start_date
    ).first()
    return conflict is None

# ---- ACCOMMODATION CHECKS ----
def accommodation_exists(db: Session, accommodation_id: int):
    return db.query(Accommodation).filter(Accommodation.id == accommodation_id).first()

def roomtype_belongs_to_accommodation(db: Session, accommodation_id: int, room_type_id: int) -> bool:
    exists = db.query(AccommodationRoomType).filter(
        AccommodationRoomType.id == room_type_id,
        AccommodationRoomType.accommodation_id == accommodation_id
    ).first()
    return exists is not None

def enough_rooms_available(db: Session, room_type_id: int, check_in: date, check_out: date, requested_rooms: int):
    room_type = db.query(AccommodationRoomType).filter_by(id=room_type_id).first()
    if not room_type:
        return False
    booked_rooms = db.query(AccommodationBooking).filter(
        AccommodationBooking.room_type_id == room_type_id,
        AccommodationBooking.check_in_date < check_out,
        AccommodationBooking.check_out_date > check_in
    ).with_entities(func.sum(AccommodationBooking.rooms_booked)).scalar() or 0

    return (room_type.total_rooms - booked_rooms) >= requested_rooms

# ---- PLANE CHECKS ----
def plane_ticket_exists(db: Session, ticket_id: int):
    return db.query(PlaneTicket).filter(PlaneTicket.id == ticket_id).first()

def enough_plane_seats(db: Session, ticket_id: int, passengers: int):
    ticket = db.query(PlaneTicket).filter_by(id=ticket_id).first()
    if not ticket:
        return False
    return ticket.seats_available >= passengers

# ---- CREATION HELPERS ----
def create_car_rental(db: Session, data):
    days = (data.rent_end_date - data.rent_start_date).days
    car = db.query(Car).filter_by(id=data.car_id).first()
    price = float(car.price_per_day) * days
    rental = CarRented(
        car_id=data.car_id,
        user_id=data.user_id,
        rent_start_date=data.rent_start_date,
        rent_end_date=data.rent_end_date,
        total_price=price
    )
    rental.car = car
    db.add(rental)
    return rental

def create_accommodation_booking(db: Session, data):
    nights = (data.check_out - data.check_in).days
    room_type = db.query(AccommodationRoomType).filter_by(id=data.room_type_id).first()
    price = float(room_type.price_per_night) * nights * data.rooms_booked
    booking = AccommodationBooking(
        accommodation_id=data.accommodation_id,
        room_type_id=data.room_type_id,
        user_id=data.user_id,
        rooms_booked=data.rooms_booked,
        check_in_date=data.check_in,
        check_out_date=data.check_out,
        total_price=price
    )
    booking.room_type = room_type
    booking.accommodation = room_type.accommodation
    db.add(booking)
    return booking

def create_plane_booking(db: Session, data):
    ticket = db.query(PlaneTicket).filter_by(id=data.flight_id).first()
    bookings = []
    for _ in range(data.quantity):
        booking = PlaneTicketBooked(
                flight_id=data.flight_id,
                user_id=data.user_id,
                flight_number=ticket.flight_number,
                airline=ticket.airline,
                departure_city=ticket.departure_city,
                arrival_city=ticket.arrival_city,
                departure_date=ticket.departure_date,
                arrival_date=ticket.arrival_date,
                seat_number=None,
                total_price=ticket.price
            )
        booking.plane_ticket = ticket
        db.add(booking)
        bookings.append(booking)
    ticket.seats_available -= data.quantity
    return bookings