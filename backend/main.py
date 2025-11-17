from fastapi import FastAPI
from backend.database import Base, engine
from backend.routers import cars

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Utazási Iroda API")

#app.include_router(auth.router)
app.include_router(cars.router)