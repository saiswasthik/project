from schemas.reservation_schema import Reservation_Validation
from models.reservation_model import ReservationTable
from models.setting_model import Settings
from models.table_model import PartyTable
from fastapi import HTTPException
from datetime import datetime

class ReservationStockSchema:
    def __init__(self,db):
        self.db=db
        
    def new_table_reservataion(self,data:Reservation_Validation,resturant_id):
        tables=self.db.query(PartyTable).filter(
            PartyTable.resturant_id==resturant_id,
            PartyTable.capacity==data.party_size,
            PartyTable.is_available==True)
            
        settings=self.db.query(Settings).filter(Settings.resturant_id==resturant_id)
       
        shift_start= settings.shift_start_time,
        shift_end=settings.shift_end,
        buffer_time=settings.buffer_time,
        booking_start=data.start_time,
        turnaround_time=settings.turnaround_time,
        total_time=booking_start+buffer_time+turnaround_time
                                                         
        if total_time > shift_end:
            return "slot booking time is greater then the shift end time"
        
        for table in tables:
            if data.table and table.table_name != data.table:
                continue
            
            check_conflicts=self.db.query(ReservationTable).filter(
                ReservationTable.table_id==table.id,
                ReservationTable.resturant_id==resturant_id,
                ReservationTable.date==data.date).all()

            for reservation_conflicts in check_conflicts:
                booking_start_in_db=reservation_conflicts.start_time
                booking_end_in_db=booking_start_in_db +turnaround_time +buffer_time
                
                if booking_start<booking_end_in_db and booking_start_in_db <total_time:
                    conflict=True
                    break
            if not conflict:
                targeted_table=table
        if not targeted_table:
            return "the targeted table is not available at these time slot "
        
                 
        new=ReservationTable(
            name=data.name,
            table_id=targeted_table.id,
            email=data.email ,
            start_time=data.start_time,
            date=data.date,
            phone=data.phone,
        )     
        self.db.add(new)
        self.db.commit()
        self.db.refresh(new)
        
    def slots_check(self,resturant_id,selected_date,table_id) :
        settings=self.db.query(Settings).filter(Settings.resturant_id==resturant_id).first()
        if not settings:
            return "resturant shift timings are not created"
        shift_start=settings.shift_start_time
        shift_end=settings.shift_end
        turn_around=settings.turn_around_time
        buffer_time=settings.buffer_time
        interval=settings.slot_intervel
        
        total_duration=turn_around +buffer_time
        
        existing_reservation=self.db.query(ReservationTable).filter(
            ReservationTable.table_id==table_id,
            ReservationTable.date==selected_date,
            ReservationTable.resturant_id==resturant_id).all()
        existing_bookings=[]
        
        tables=self.db.query(ReservationTable).filter(
            ReservationTable.table_id==table_id,
            ReservationTable.date==selected_date,
            ReservationTable
        )
        
        
        
        
        for reservation in existing_reservation:
            start=reservation.start_time,
            existing_bookings.append(start , start+total_duration)
            
            available_slots=[]
            current_time=shift_start
            today=datetime.now().date()
            current_time_=datetime.now().strftime("%H:%M")
            
        while  current_time +turn_around < current_time_ :
            block=False
            if selected_date==today and current_time < current_time_:
                current_time_ +=interval
            for existing_booking_start , existing_booking_end in existing_bookings:
                if current_time_ < existing_booking_end and existing_booking_start < current_time + total_duration :
                    blocked =True
                    break
            if not blocked:
                available_slots.append(current_time)  
            current_time += interval
        return available_slots
                
            
         
                    
                    
                
                
            
            
            
            
            
                
        

        
        
        