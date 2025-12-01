from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, joinedload
from backend.models.journey_model import Journey, JourneyCar, JourneyPlane, JourneyAccommodation
from backend.models.car_model import CarRented
from backend.models.plane_ticket_model import PlaneTicketBooked
from backend.models.accommodation_model import AccommodationBooking

from backend.schemas.journey_schema import JourneyCreateComplete
import backend.utils.journey_helpers as help

def recalculate_journey_price(db: Session, journey_id: int):
    journey = db.query(Journey).filter(Journey.id == journey_id).first()
    if not journey:
        return None

    total = 0

    # ---- CAR RENTALS ----
    car_links = db.query(JourneyCar).filter(JourneyCar.journey_id == journey_id).all()
    for link in car_links:
        rental = db.query(CarRented).filter(CarRented.id == link.car_rented_id).first()
        if rental and rental.total_price:
            total += float(rental.total_price)

    # ---- PLANE TICKETS ----
    plane_links = db.query(JourneyPlane).filter(JourneyPlane.journey_id == journey_id).all()
    for link in plane_links:
        ticket = db.query(PlaneTicketBooked).filter(PlaneTicketBooked.id == link.plane_ticket_booked_id).first()
        if ticket and ticket.total_price:
            total += float(ticket.total_price)

    # ---- ACCOMMODATION ----
    accommodation_links = db.query(JourneyAccommodation).filter(JourneyAccommodation.journey_id == journey_id).all()
    for link in accommodation_links:
        booking = db.query(AccommodationBooking).filter(AccommodationBooking.id == link.accommodation_booked_id).first()
        if booking and booking.total_price:
            total += float(booking.total_price)

    # Save new result
    journey.total_price = total
    db.commit()
    db.refresh(journey)

    return journey

def create_journey(db: Session, data):
    journey = Journey(
        user_id=data.user_id,
        start_date=data.start_date,
        end_date=data.end_date,
        number_of_people=data.number_of_people,
        email=data.email,
        total_price=0
    )
    db.add(journey)
    db.commit()
    db.refresh(journey)
    return journey

def create_complete_journey(db: Session, data: JourneyCreateComplete):
    # ---- VALIDATIONS ----
    for car in data.cars:
        if not help.valid_date_range(car.rent_start_date, car.rent_end_date):
            raise HTTPException(400, "Invalid car rental date range")
        if not help.car_exists(db, car.car_id):
            raise HTTPException(400, f"Car {car.car_id} does not exist")
        if not help.car_is_available(db, car.car_id, car.rent_start_date, car.rent_end_date):
            raise HTTPException(400, f"Car {car.car_id} not available")

    for acc in data.accommodations:
        if not help.accommodation_exists(db, acc.accommodation_id):
            raise HTTPException(400, f"Accommodation {acc.accommodation_id} does not exist")
        if not help.roomtype_belongs_to_accommodation(db, acc.accommodation_id, acc.room_type_id):
            raise HTTPException(400, "Room type does not belong to this accommodation")
        if not help.valid_date_range(acc.check_in, acc.check_out):
            raise HTTPException(400, "Invalid accommodation date range")
        if not help.enough_rooms_available(db, acc.room_type_id, acc.check_in, acc.check_out, acc.rooms_booked):
            raise HTTPException(400, "Not enough rooms available")

    for plane in data.planes:
        if not help.plane_ticket_exists(db, plane.flight_id):
            raise HTTPException(400, f"Plane ticket {plane.flight_id} does not exist")
        if not help.enough_plane_seats(db, plane.flight_id, plane.quantity):
            raise HTTPException(400, "Not enough seats available")

    # ---- CREATION PHASE ----
    try:
        journey = Journey(
            user_id=data.user_id,
            start_date=data.start_date,
            end_date=data.end_date,
            number_of_people=data.number_of_people,
            email=data.email,
            total_price=0
        )
        db.add(journey)

        total_price = 0

        for car in data.cars:
            rental = help.create_car_rental(db, car)
            db.flush()
            if not getattr(rental, "id", None):
                raise HTTPException(500, "Failed to create rental (no id)")
            db.add(JourneyCar(journey_id=journey.id, car_rented_id=rental.id))
            total_price += float(rental.total_price)

        for acc in data.accommodations:
            booking = help.create_accommodation_booking(db, acc)
            db.flush()
            if not getattr(booking, "id", None):
                raise HTTPException(500, "Failed to create accommodation booking (no id)")
            db.add(JourneyAccommodation(journey_id=journey.id, accommodation_booked_id=booking.id))
            total_price += float(booking.total_price)

        for plane in data.planes:
            bookings = help.create_plane_booking(db, plane)
            db.flush()
            if not all(getattr(booking, "id", None) for booking in bookings):
                raise HTTPException(500, "Failed to create plane booking (no id)")
            for booking in bookings:
                db.add(JourneyPlane(journey_id=journey.id, plane_ticket_booked_id=booking.id))
                db.refresh(booking)
                total_price += float(booking.total_price)

        journey.total_price = total_price
        db.commit()
        db.refresh(journey)
        return journey

    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as e:
        db.rollback()
        print("DB ERROR:", str(e))
        raise HTTPException(500, "Database error during journey creation")


def get_all_journeys(db: Session):
    return (
        db.query(Journey)
        .options(
            joinedload(Journey.cars),
            joinedload(Journey.plane_tickets),
            joinedload(Journey.accommodations)
        )
        .all()
    )


def get_user_journeys(db: Session, user_id: int):
    return (
        db.query(Journey)
        .filter(Journey.user_id == user_id)
        .options(
            joinedload(Journey.cars),
            joinedload(Journey.plane_tickets),
            joinedload(Journey.accommodations)
        )
        .all()
    )
    
def get_journey_by_email(db: Session, email: str):
    return (
        db.query(Journey)
        .filter(Journey.email == email)
        .options(
            joinedload(Journey.cars),
            joinedload(Journey.plane_tickets),
            joinedload(Journey.accommodations)
        )
        .all()
    )


def delete_journey(db: Session, journey_id: int):
    journey = db.query(Journey).filter_by(id=journey_id).first()
    if journey:
        db.delete(journey)
        db.commit()
        return True
    return False


# -------- ADD ITEMS TO JOURNEY --------
def add_car_to_journey(db: Session, journey_id: int, car_rented_id: int):
    journey = db.query(Journey).filter(Journey.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    rental = db.query(CarRented).filter(CarRented.id == car_rented_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Car rental not found")

    item = JourneyCar(journey_id=journey_id, car_rented_id=car_rented_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    recalculate_journey_price(db, journey_id)
    return item

def add_plane_to_journey(db: Session, journey_id: int, plane_ticket_booked_id: int):
    journey = db.query(Journey).filter(Journey.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    booking = db.query(PlaneTicketBooked).filter(PlaneTicketBooked.id == plane_ticket_booked_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Plane ticket booking not found")

    item = JourneyPlane(journey_id=journey_id, plane_ticket_booked_id=plane_ticket_booked_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    recalculate_journey_price(db, journey_id)
    return item

def add_accommodation_to_journey(db: Session, journey_id: int, accommodation_booked_id: int):
    journey = db.query(Journey).filter(Journey.id == journey_id).first()
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")

    booking = db.query(AccommodationBooking).filter(AccommodationBooking.id == accommodation_booked_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Accommodation booking not found")

    item = JourneyAccommodation(journey_id=journey_id, accommodation_booked_id=accommodation_booked_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    recalculate_journey_price(db, journey_id)
    return item

# -------- REMOVE INDIVIDUAL ITEMS --------
def remove_car(db: Session, item_id: int):
    item = db.query(JourneyCar).filter(JourneyCar.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Journey car item not found")

    db.delete(item)
    db.commit()
    recalculate_journey_price(db, item.journey_id)
    return True

def remove_plane(db: Session, item_id: int):
    item = db.query(JourneyPlane).filter(JourneyPlane.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Journey plane item not found")

    db.delete(item)
    db.commit()
    recalculate_journey_price(db, item.journey_id)
    return True

def remove_accommodation(db: Session, item_id: int):
    item = db.query(JourneyAccommodation).filter(JourneyAccommodation.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Journey accommodation item not found")

    db.delete(item)
    db.commit()
    recalculate_journey_price(db, item.journey_id)
    return True