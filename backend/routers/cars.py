from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(prefix="/cars", tags=["cars"])

@router.get("/", response_model=list[schemas.CarResponse])
def list_cars(
    db: Session = Depends(database.get_db),
    city: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    min_space: int | None = None
):
    query = db.query(models.Car).filter(models.Car.status == "available")
    if city:
        query = query.filter(models.Car.city.ilike(f"%{city}%"))
    if min_price:
        query = query.filter(models.Car.price_per_day >= min_price)
    if max_price:
        query = query.filter(models.Car.price_per_day <= max_price)
    if min_space:
        query = query.filter(models.Car.space >= min_space)
    return query.all()