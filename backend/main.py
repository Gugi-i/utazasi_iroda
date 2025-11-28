from fastapi import FastAPI
from backend.utils.database import Base, engine
from backend.routers import accommodations, auth, hash_helper, cars, plane_tickets, journeys
from backend.utils.init_db import init_database

init_database()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Utazási Iroda API")

app.include_router(auth.router)
app.include_router(hash_helper.router)
app.include_router(cars.router)
app.include_router(plane_tickets.router)
app.include_router(accommodations.router)
app.include_router(journeys.router)