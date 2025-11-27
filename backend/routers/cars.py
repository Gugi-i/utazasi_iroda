from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.car_schema import CarResponse, RentCreate, RentResponse
from backend.crud import car_crud

router = APIRouter(prefix="/cars", tags=["Cars"])


# ---- LIST CARS -----------------------------------------------------
@router.get("/", response_model=list[CarResponse])
def list_cars(
    city: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    min_space: int | None = None,
    start_date: date | None = Query(None, description="Keresett intervallum kezdete"),
    end_date: date | None = Query(None, description="Keresett intervallum vége"),
    db: Session = Depends(get_db)
):
    filters = {
        "city": city,
        "min_price": min_price,
        "max_price": max_price,
        "min_space": min_space,
        "start_date": start_date,
        "end_date": end_date
    }

    return car_crud.get_all_cars(db, filters)


# ---- RENT CAR ------------------------------------------------------
@router.post("/rent", response_model=RentResponse)
def rent_car(data: RentCreate, db: Session = Depends(get_db)):
    rental = car_crud.rent_car(db, data)
    if not rental:
        raise HTTPException(status_code=400, detail="Car not available")
    return rental

@router.get("/rent", response_model=list[RentResponse])
def list_rentals(db: Session = Depends(get_db)):
    return car_crud.get_all_rentals(db)

@router.get("/user/rentals/{user_id}")
def list_user_rentals(user_id: int, db: Session = Depends(get_db)):
    rentals = car_crud.get_user_rentals(db, user_id)
    return rentals


# ---- CANCEL RENT ---------------------------------------------------
@router.delete("/rent/{rent_id}")
def cancel_rent(rent_id: int, db: Session = Depends(get_db)):
    success = car_crud.cancel_rent(db, rent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rental not found")
    return {"message": "Rental cancelled"}


