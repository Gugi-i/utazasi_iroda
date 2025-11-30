from pydantic import BaseModel, EmailStr

class PersonCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class PersonLogin(BaseModel):
    email: EmailStr
    password: str

class PersonResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True
