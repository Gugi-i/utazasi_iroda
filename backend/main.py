from fastapi import FastAPI
from backend.database import Base, engine
from backend.routers import cars
from backend.init_db import init_database

init_database()

app = FastAPI(title="Utazási Iroda API")

app.include_router(cars.router)