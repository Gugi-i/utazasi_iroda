from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, date
from backend.models.accommodation_model import Accommodation, AccommodationRoomType, AccommodationBooking
from backend.schemas.accommodation_schema import AccommodationCreate, RoomTypeCreate, BookingCreate

# --- Accommodation ---
def create_accommodation(db: Session, data: AccommodationCreate):
    new_acc = Accommodation(**data.dict())
    db.add(new_acc)
    db.commit()
    db.refresh(new_acc)
    return new_acc

def get_all_accommodations(db: Session, location: str | None = None, max_price: float | None = None, check_in: date | None = None, check_out: date | None = None,):
    query = db.query(Accommodation)

    if location:
        query = query.filter(Accommodation.location.ilike(f"%{location}%"))

    accommodations = query.all()
    results = []

    for acc in accommodations:
        room_types = db.query(AccommodationRoomType).filter(
            AccommodationRoomType.accommodation_id == acc.id
        )

        if max_price:
            room_types = room_types.filter(AccommodationRoomType.price_per_night <= max_price)

        room_types = room_types.all()

        if not room_types:
            continue

        if check_in and check_out:
            available_room_types = []

            for rt in room_types:
                overlapping_bookings = db.query(
                    func.coalesce(func.sum(AccommodationBooking.rooms_booked), 0)
                ).filter(
                    AccommodationBooking.room_type_id == rt.id,
                    AccommodationBooking.check_in_date < check_out,
                    AccommodationBooking.check_out_date > check_in
                ).scalar()

                rooms_left = rt.total_rooms - overlapping_bookings

                if rooms_left > 0:
                    available_room_types.append(rt)

            if not available_room_types:
                continue

            acc.room_types = available_room_types

        else:
            acc.room_types = room_types

        results.append(acc)

    return results

# --- RoomType ---
def create_room_type(db: Session, data: RoomTypeCreate):
    room = AccommodationRoomType(**data.dict())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

def get_room_types_by_accommodation(db: Session, acc_id: int):
    return db.query(AccommodationRoomType).filter(AccommodationRoomType.accommodation_id == acc_id).all()

# --- Booking ---
def check_availability(db: Session, room_type_id: int, rooms_needed: int, check_in_date, check_out_date):
    booked_rooms = db.query(func.sum(AccommodationBooking.rooms_booked)).filter(
        AccommodationBooking.room_type_id == room_type_id,
        AccommodationBooking.status == "booked",
        and_(
            AccommodationBooking.check_in_date < check_out_date,
            AccommodationBooking.check_out_date > check_in_date
        )
    ).scalar() or 0

    total_rooms = db.query(AccommodationRoomType.total_rooms).filter(
        AccommodationRoomType.id == room_type_id
    ).scalar()

    available = total_rooms - booked_rooms
    return available >= rooms_needed

def create_booking(db: Session, data: BookingCreate):
    if not check_availability(db, data.room_type_id, data.rooms_booked, data.check_in_date, data.check_out_date):
        return None

    price_per_night = db.query(AccommodationRoomType.price_per_night).filter(
        AccommodationRoomType.id == data.room_type_id
    ).scalar()

    nights = (data.check_out_date - data.check_in_date).days
    total_price = price_per_night * nights * data.rooms_booked

    booking = AccommodationBooking(
        **data.dict(),
        total_price=total_price,
        booking_date=datetime.now()
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def list_user_bookings(db: Session, user_id: int):
    return db.query(AccommodationBooking).filter(AccommodationBooking.user_id == user_id).all()

def list_all_bookings(db: Session):
    return db.query(AccommodationBooking).all()
