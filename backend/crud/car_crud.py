from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from backend.models.car_model import Car, CarRented
from backend.schemas.car_schema import CarCreate, RentCreate
from datetime import datetime

from datetime import datetime
from sqlalchemy import and_, or_

def get_all_cars(db: Session, filters: dict):
    query = db.query(Car)

    if filters.get("city"):
        query = query.filter(Car.city.ilike(f"%{filters['city']}%"))

    if filters.get("min_price"):
        query = query.filter(Car.price_per_day >= filters["min_price"])

    if filters.get("max_price"):
        query = query.filter(Car.price_per_day <= filters["max_price"])

    if filters.get("min_space"):
        query = query.filter(Car.space >= filters["min_space"])

    start = filters.get("start_date")
    end = filters.get("end_date")

    if start and end:

        overlapping_rentals = db.query(CarRented.car_id).filter(
            or_(
                and_(CarRented.rent_start_date <= start, CarRented.rent_end_date >= start),
                and_(CarRented.rent_start_date <= end, CarRented.rent_end_date >= end),
                and_(CarRented.rent_start_date >= start, CarRented.rent_end_date <= end)
            )
        )

        query = query.filter(~Car.id.in_(overlapping_rentals.subquery()))

    cars = query.all()

    result = []
    for car in cars:
        rentals = db.query(CarRented).filter(CarRented.car_id == car.id).all()

        result.append({
            "id": car.id,
            "make": car.make,
            "model": car.model,
            "year": car.year,
            "space": car.space,
            "city": car.city,
            "price_per_day": float(car.price_per_day),
            "status": car.status,
            "rentals": [
                {
                    "id": r.id,
                    "car_id": r.car_id,
                    "rent_start_date": r.rent_start_date,
                    "rent_end_date": r.rent_end_date,
                    "status": r.status
                }
                for r in rentals
            ]
        })
    return result



def create_car(db: Session, data: CarCreate):
    new_car = Car(**data.dict())
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car


def rent_car(db: Session, data: RentCreate, user_id: int):
    car = db.query(Car).filter(Car.id == data.car_id).first()

    if not car or car.status != "available":
        return None

    rental_days = (data.rent_end_date - data.rent_start_date).days
    total_price = rental_days * float(car.price_per_day)

    rental = CarRented(
        car_id=car.id,
        user_id=user_id,
        rent_start_date=data.rent_start_date,
        rent_end_date=data.rent_end_date,
        total_price=total_price,
        booking_date=datetime.now()
    )

    car.status = "rented"

    db.add(rental)
    db.commit()
    db.refresh(rental)

    return rental


def cancel_rent(db: Session, rent_id: int):
    rent = db.query(CarRented).filter(CarRented.id == rent_id).first()
    if not rent:
        return None

    car = db.query(Car).filter(Car.id == rent.car_id).first()
    if car:
        car.status = "available"

    db.delete(rent)
    db.commit()

    return True
