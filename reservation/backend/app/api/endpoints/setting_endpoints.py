
from fastapi import APIRouter,Depends
from ...schemas.setting_schema import Settings_Validation
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...services.setting_service import SettingService

router=APIRouter()

@router.post("/setting")
def setting_info(data:Settings_Validation,resturant_id,db:Session=Depends(get_db)):
    sett=SettingService(db)
    result=sett.settings_data(data,resturant_id)
    return result

@router.get("/setting")
def get_setting_info(resturant_id, db:Session=Depends(get_db)):
    sett=SettingService(db)
    result=sett.get_settings(resturant_id)
    return result