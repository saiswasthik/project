from sqlalchemy import Integer,Column,String,Date,Boolean,ForeignKey
from typing import Optional
from ..db.base import Base
from datetime import date

class ReservationTable(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    resturant_id = Column(Integer, ForeignKey("resturant.id"), nullable=False)
    table_id = Column(Integer,ForeignKey("party_table.id"),nullable=False) 
    name = Column(String)
    phone_number = Column(String)
    email = Column(String, nullable=True)
    party_size = Column(Integer)
    date = Column(Date)
    table = Column(String)
    notes = Column(String, nullable=True)
    start_time = Column(String)
    end_time = Column(String, nullable=True)
    status = Column(String)
    source = Column(String, default="Phone") 
   