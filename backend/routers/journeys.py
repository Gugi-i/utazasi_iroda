from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr
from sqlalchemy.orm import Session

from backend.utils.auth import get_current_user
from backend.utils.database import get_db
from backend.schemas.journey_schema import (
    JourneyCreate, JourneyResponse,
    AddCar, AddPlane, AddAccommodation, JourneyDetailResponse
)
from backend.crud import journey_crud

router = APIRouter(prefix="/journeys", tags=["Journeys"])


# ---- CREATE ----
@router.post("/", response_model=JourneyResponse)
def create_journey(data: JourneyCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return journey_crud.create_journey(db, data)


# ---- GET ALL ----
@router.get("/", response_model=list[JourneyDetailResponse])
def all_journeys(db: Session = Depends(get_db)):
    return journey_crud.get_all_journeys(db)


# ---- GET USER JOURNEYS ----
@router.get("/user/{user_id}", response_model=list[JourneyDetailResponse])
def user_journeys(user_id: int, db: Session = Depends(get_db)):
    return journey_crud.get_user_journeys(db, user_id)

# ---- GET JOURNEY BY EMAIL ----
@router.get("/email/{email}", response_model=list[JourneyDetailResponse])
def journey_by_email(email: str, db: Session = Depends(get_db)):
    journeys = journey_crud.get_journey_by_email(db, email)
    if journeys:
        return journeys
    raise HTTPException(404, "Journey not found")


# ---- DELETE JOURNEY ----
@router.delete("/{journey_id}")
def cancel_journey(journey_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if journey_crud.delete_journey(db, journey_id):
        return {"message": "Journey deleted", "id": journey_id}
    raise HTTPException(404, "Journey not found")


# ---- ADD ELEMENTS ----
@router.post("/{journey_id}/add_car")
def add_car(journey_id: int, data: AddCar, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return journey_crud.add_car_to_journey(db, journey_id, data.car_rented_id)


@router.post("/{journey_id}/add_plane")
def add_plane(journey_id: int, data: AddPlane, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return journey_crud.add_plane_to_journey(db, journey_id, data.plane_ticket_booked_id)


@router.post("/{journey_id}/add_accommodation")
def add_accommodation(journey_id: int, data: AddAccommodation, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return journey_crud.add_accommodation_to_journey(db, journey_id, data.accommodation_booked_id)


# ---- REMOVE ELEMENTS ----
@router.delete("/cars/{item_id}")
def delete_car(item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if journey_crud.remove_car(db, item_id):
        return {"deleted": item_id}
    raise HTTPException(404, "Car not found in journey")


@router.delete("/planes/{item_id}")
def delete_plane(item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if journey_crud.remove_plane(db, item_id):
        return {"deleted": item_id}
    raise HTTPException(404, "Plane ticket not found in journey")


@router.delete("/accommodations/{item_id}")
def delete_accommodation(item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if journey_crud.remove_accommodation(db, item_id):
        return {"deleted": item_id}
    raise HTTPException(404, "Accommodation not found in journey")
