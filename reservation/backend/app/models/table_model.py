from sqlalchemy import Column,Integer,String ,Boolean,ForeignKey
from db.base import Base


class PartyTable(Base):
    __tablename__="party_table"
    id=Column(Integer,primary_key=True,index=True)
    resturant_id = Column(Integer, ForeignKey("resturant.id"), nullable=False)
    table_name=Column(String)
    table_number=Column(String)
    capacity=Column(Integer)
    is_available=Column(Boolean)
     
    
  