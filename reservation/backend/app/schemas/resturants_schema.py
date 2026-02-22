from pydantic import BaseModel,EmailStr

class Resturant_Validation(BaseModel):
    name:str
    restaurant_name:str
    email:EmailStr
    address:str
    password:str