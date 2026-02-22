from ..schemas.setting_schema import Settings_Validation
from ..models.setting_model import Settings

class SettingService:
    
    def __init__(self,db):
        self.db=db
    
    def settings_data(self,data:Settings_Validation,resturant_id):
        
        reservation_durations = (
            data.turn_around_time + data.buffer_time
        )
        setting_record=Settings(
            resturant_id=resturant_id,
            shift_start_time=data.shift_start_time.strftime("%H:%M"),
            shift_end_time=data.shift_end_time.strftime("%H:%M"),
            time_slot_intervel=data.time_slot_intervel,
            turn_around_time=data.turn_around_time,
            buffer_time=data.buffer_time,
            reservation_duration=reservation_durations
            
        )
        
        self.db.add(setting_record)
        self.db.commit()
        self.db.refresh(setting_record)
        
        return setting_record

    def get_settings(self, resturant_id):
        return self.db.query(Settings).filter(Settings.resturant_id == resturant_id).first()
    