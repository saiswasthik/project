from pydantic import BaseModel
from datetime import date,time

class Settings_Validation(BaseModel):
    shift_start_time:time
    shift_end_time:time
    time_slot_intervel:int
    turn_around_time:int
    buffer_time:int
    # reservation_duration:str
    
    
    
    