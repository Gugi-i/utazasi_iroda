from fastapi import HTTPException
from pydantic import EmailStr
from sqlalchemy.orm import Session, joinedload
from backend.models.journey_model import Journey, JourneyCar, JourneyPlane, JourneyAccommodation
from backend.models.car_model import CarRented
from backend.models.plane_ticket_model import PlaneTicketBooked
from backend.models.accommodation_model import AccommodationBooking

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