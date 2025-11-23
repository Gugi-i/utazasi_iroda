from fastapi import FastAPI
from backend.database import Base, engine
from backend.routers import auth, hash_helper, cars, plane_tickets
from backend.init_db import init_database

init_database()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Utazási Iroda API")

app.include_router(auth.router)
app.include_router(hash_helper.router)
app.include_router(cars.router)
app.include_router(plane_tickets.router)
