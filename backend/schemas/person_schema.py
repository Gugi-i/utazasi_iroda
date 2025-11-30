from pydantic import BaseModel, EmailStr
class PersonBase(BaseModel):
    role: str

class PersonResponse(BaseModel):
    id: int
    role: str

    class Config:
        orm_mode = True
        
class PersonResponseWithEmail(BaseModel):
    id: int
    role: str
    name: str
    email: str
    password_hash: str

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class PersonLogin(BaseModel):
    email: str
    password: str
    
class WorkerLogin(BaseModel):
    email: str
    password: str