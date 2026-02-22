from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.reservation_schema import Reservation_Validation
from ...services.reservation_service import ReservationService
from datetime import date

router = APIRouter()

@router.get("/reservations")
def list_all_reservations(resturant_id,db: Session = Depends(get_db)):
    reserv = ReservationService(db)
    result = reserv.all_reservations(resturant_id)
    return result

@router.post("/reservations")
def new_reservation(reservation_data: Reservation_Validation, resturant_id,table_id,db: Session = Depends(get_db)):
    reservation_service = ReservationService(db)
    result = reservation_service.new_reservation(reservation_data,resturant_id,table_id)
    return result

@router.put("/reservation/{id}")
def edit_reservation(id: int, reservation_data: Reservation_Validation, resturant_id,db: Session = Depends(get_db)):
    reser_edit = ReservationService(db)
    result = reser_edit.edit_reserve_data(reservation_data, id,resturant_id)
    return result

@router.get("/available-slots")
def get_available_slots(
    table_id: str, 
    selected_date: date, 
    resturant_id,
    db: Session = Depends(get_db)
):
    service = ReservationService(db)
    # The service method uses table_id as string to match our current DB implementation
    # slot_duration is currently defined in settings so we pass dummy or handle in service
    return service.time_slots_check(table_id, 0, selected_date,resturant_id)

@router.get("/available-tables")
def get_available_tables(resturant_id,db: Session = Depends(get_db)):
    service = ReservationService(db)
    return service.available_table(resturant_id)
