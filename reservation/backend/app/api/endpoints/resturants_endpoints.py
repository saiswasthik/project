from fastapi import APIRouter,Depends
from schemas.resturants_schema import Resturant_Validation
from services.resturants_service import ResturantService
from sqlalchemy.orm import Session
from db.session import get_db

router=APIRouter()


@router.post("/resturant")
def resturant_creation(data:Resturant_Validation,db:Session=Depends(get_db)):
    resturant=ResturantService(db)
    result=resturant.new_resturant(data)
    return result

@router.delete("/resturant/{id}")
def del_resturant(id:str,db:Session=Depends(get_db)):
    res=ResturantService(db)
    name=res.delete_resturant(id)
    return {"message": f"Restaurant with name {name.restaurant_name} was deleted successfully"}

@router.post("/login")
def login_resturant(data: dict, db: Session = Depends(get_db)):
    res = ResturantService(db)
    return res.authenticate(data)