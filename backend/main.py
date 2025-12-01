from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    "https://localhost:5173",
    "https://localhost:5174",
    "https://localhost:5175",
    "https://localhost:5176",
    "https://localhost:5177",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
