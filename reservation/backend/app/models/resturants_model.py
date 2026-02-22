from ..db.base import Base
from sqlalchemy import Column,Integer,String

class Resturant(Base):
    __tablename__="resturant"
    
    id = Column(Integer, primary_key=True, index=True)
    name=Column(String)
    restaurant_name=Column(String)
    email=Column(String)
    address=Column(String)
    password=Column(String)
    
    
    
    
    