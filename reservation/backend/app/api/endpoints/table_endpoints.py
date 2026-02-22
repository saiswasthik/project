from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.table_schema import Table_Validation
from ...services.table_service import TableService

router=APIRouter()

@router.get("/tables")
def list_all_tables(resturant_id,db:Session=Depends(get_db)):
    table_service=TableService(db)
    tables=table_service.list_all_tables(resturant_id)
    return tables

@router.post("/tables")
def create_table(table_data:Table_Validation,resturant_id,db: Session = Depends(get_db)):
    table_service=TableService(db)
    aa=table_service.table_creation(table_data,resturant_id)
    return aa

@router.put("/tables/{table_name}")
def edit_table(table_info:Table_Validation,resturant_id,table_name:str,db:Session=Depends(get_db)):
    table_service=TableService(db)
    data=table_service.edit_table(table_info,table_name,resturant_id)
    return data


@router.delete("/tables/{table_name}")
def delete_table(table_name:str,resturant_id,db:Session=Depends(get_db)):
    table_service=TableService(db)
    data=table_service.delete_table(table_name,resturant_id)
    return data