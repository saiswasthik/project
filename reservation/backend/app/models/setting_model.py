from sqlalchemy import Integer,Column,String,Date,ForeignKey
from ..db.base import Base

class Settings(Base):
    __tablename__="settings"
    id = Column(Integer, primary_key=True, index=True)
    resturant_id = Column(Integer, ForeignKey("resturant.id"), nullable=False)
    shift_start_time=Column(String)
    shift_end_time=Column(String)
    time_slot_intervel=Column(String)
    turn_around_time=Column(String)
    buffer_time=Column(String)
    reservation_duration=Column(String) 
    
    