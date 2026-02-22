from schemas.table_schema import Table_Validation
from sqlalchemy.orm import Session
from models.resturants_model import Resturant
from db.session import get_db
from models.table_model import PartyTable


class TableService:
    def __init__(self,db):
        self.db=db
    
    
    def list_all_tables(self,resturant_id):
        # resturant=self.db.query(Resturant).filter(Resturant.id==resturant_id).all()
        tables=self.db.query(PartyTable).filter(PartyTable.resturant_id==resturant_id).all()
        if not tables:
            return "table not found"
        return tables
    
    def table_creation(self,table_data:Table_Validation,resturant_id):
        # restaurant = self.db.query(Resturant).filter(Resturant.id == resturant_id).first()
        table=PartyTable(
            resturant_id=resturant_id,
            table_name=table_data.table_name,
            table_number=table_data.table_number,
            capacity=table_data.capacity,
            is_available=table_data.is_available
        )
        self.db.add(table)
        self.db.commit()
        self.db.refresh(table)
        return table
    
    def edit_table(self,table_info:Table_Validation,table_name:str,resturant_id):
         
        table=self.db.query(PartyTable).filter(PartyTable.resturant_id==resturant_id and PartyTable.table_name==table_name).first()
        
        table.table_name = table_info.table_name
        table.table_number = table_info.table_number
        table.capacity = table_info.capacity
        table.is_available = table_info.is_available
        self.db.commit()
        
        return table
    
    def delete_table(self,table_name:str,resturant_id):
        table=self.db.query(PartyTable).filter(PartyTable.resturant_id==resturant_id and PartyTable.table_name==table_name).first()
        self.db.delete(table)
        self.db.commit()
        return table
        
    
        
        
        