from schemas.reservation_schema import Reservation_Validation
from models.reservation_model import ReservationTable
from models.resturants_model import Resturant
from models.setting_model import Settings
from models.table_model import PartyTable
from fastapi import HTTPException
from datetime import datetime,timedelta

class ReservationService:
    def __init__(self,db):
        self.db=db
    
    def _time_to_minutes(self, time_str: str) -> int:
        """Helper to convert various time formats to minutes from midnight."""
        if not time_str: return 0
        time_str = time_str.strip().upper()
        try:
            if 'AM' in time_str or 'PM' in time_str:
                dt = datetime.strptime(time_str, "%I:%M %p")
            else:
                dt = datetime.strptime(time_str, "%H:%M")
            return dt.hour * 60 + dt.minute
        except Exception:
            return 0
        
    def _minutes_to_time(self, minutes: int) -> str:
        """Helper to convert minutes from midnight back to AM/PM format."""
        h = (minutes // 60) % 24
        m = minutes % 60
        period = "PM" if h >= 12 else "AM"
        display_h = h % 12
        if display_h == 0: display_h = 12
        return f"{display_h}:{m:02d} {period}"
    
    def all_reservations(self,resturant_id):
        reservations=self.db.query(ReservationTable).filter(ReservationTable.resturant_id==resturant_id).all()
        return reservations
    

    def edit_reserve_data(self,reservation_data:Reservation_Validation,id:int,resturant_id):
        reservation=self.db.query(ReservationTable).filter(ReservationTable.id==id,ReservationTable.resturant_id==resturant_id).first()
        
        reservation.name=reservation_data.name
        reservation.phone_number=reservation_data.phone_number
        reservation.email=reservation_data.email        
        reservation.party_size=reservation_data.party_size
        reservation.date=reservation_data.date
        reservation.notes=reservation_data.notes
        reservation.table=reservation_data.table
        reservation.status=reservation_data.status
        reservation.source=reservation_data.source
        reservation.start_time=reservation_data.start_time
        reservation.end_time=reservation_data.end_time
    
        self.db.commit()
        return reservation
    
    
    def new_reservation(self, reservation_data: Reservation_Validation,resturant_id,table_id):
        # 1. Logic to find a specific table if provided, or any suitable table
        # If the frontend sent a table name/id, we should try to use that
        tables = self.db.query(PartyTable).filter(
            PartyTable.resturant_id==resturant_id,
            PartyTable.capacity >= reservation_data.party_size,
            PartyTable.is_available == True 
        ).all()
 
        if not tables:
            raise HTTPException(status_code=400, detail="No table available for this party size")

        settings = self.db.query(Settings).filter(Settings.resturant_id == resturant_id).first()
        if not settings:
            raise HTTPException(status_code=500, detail="Restaurant settings not configured")

        turnaround = int(settings.turn_around_time)
        buffer = int(settings.buffer_time)
        shift_end = self._time_to_minutes(settings.shift_end_time)
        req_start = self._time_to_minutes(reservation_data.start_time)
        req_end_actual = req_start + turnaround+buffer
        req_end_with_buffer = req_end_actual + buffer

        # Check if booking fits in operating hours
        if req_end_actual > shift_end:
            raise HTTPException(status_code=400, detail="Reservation duration exceeds shift end time")

        # Find the first available table that has no conflicts
        target_table = None
        for table in tables:
            # If reservation_data.table is provided, prioritize it
            if reservation_data.table and table.table_name != reservation_data.table:
                continue

            # Check for overlap on this specific table
            conflicts = self.db.query(ReservationTable).filter(
                ReservationTable.table_id == table.id,
                ReservationTable.resturant_id == resturant_id,
                ReservationTable.date == reservation_data.date
            ).all()

            has_conflict = False
            for res in conflicts:
                res_start = self._time_to_minutes(res.start_time)
                # Use actual duration from settings for overlap check
                res_end = res_start + turnaround + buffer
                
                # Overlap Algorithm: StartA < EndB AND StartB < EndA
                if req_start < res_end and res_start < req_end_actual:
                    has_conflict = True
                    break
            if not has_conflict:
                target_table = table
                break
        if not target_table:
            raise HTTPException(status_code=400, detail="Table is already booked or unavailable for this time slot")

        try:
            reservation = ReservationTable(
                name=reservation_data.name,
                resturant_id=resturant_id,
                table_id=target_table.id,
                phone_number=reservation_data.phone_number,
                email=reservation_data.email,
                party_size=reservation_data.party_size,
                date=reservation_data.date,
                notes=reservation_data.notes,
                start_time=reservation_data.start_time,
                end_time=self._minutes_to_time(req_end_actual), # Store actual exit time
                table=str(target_table.table_name),
                status=reservation_data.status or "Confirmed",
                source=reservation_data.source or "Phone"
            )
            self.db.add(reservation)
            self.db.commit()
            self.db.refresh(reservation)
            return reservation
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    def available_table(self,resturant_id):
        table_names = self.db.query(PartyTable).filter(PartyTable.resturant_id==resturant_id,PartyTable.is_available == True).all()
        return [table.table_name for table in table_names]
        
    def time_slots_check(self, table_id: int, slot_duration: int, selected_date,resturant_id):
        records = self.db.query(Settings).filter(Settings.resturant_id == resturant_id).first()
        if not records:
            return []
        shift_start = self._time_to_minutes(records.shift_start_time)
        shift_end = self._time_to_minutes(records.shift_end_time)
        turn_around = int(records.turn_around_time)
        buffer_time = int(records.buffer_time)
        interval = int(records.time_slot_intervel) if records.time_slot_intervel else 30
        
        duration_total = turn_around + buffer_time
        # Get existing reservations for this table
        existing_reservations = self.db.query(ReservationTable).filter(
            ReservationTable.table_id == int(table_id),
            ReservationTable.resturant_id == resturant_id,
            ReservationTable.date == selected_date
        ).all() 
        booked_ranges = []
        for res in existing_reservations:
            start_m = self._time_to_minutes(res.start_time)
            booked_ranges.append((start_m, start_m + duration_total))
        
        available_slots = []
        current_m = shift_start
        
        # from datetime import time
        # # (
        # time_a=datetime.now()
        # aa=self._time_to_minutes(time_a)
        # )
        today = datetime.now().date()
        current_time_m = self._time_to_minutes(datetime.now().strftime("%H:%M"))
         
        while current_m + turn_around <= shift_end:
            is_blocked = False
            if selected_date == today and current_m < current_time_m:
                current_m += interval
                continue
            # Check for overlaps with existing bookings
            for b_start, b_end in booked_ranges:
                # Slot window: [current_m, current_m + duration_total)
                if current_m < b_end and b_start < current_m + duration_total:
                    is_blocked = True
                    break
            
            if not is_blocked:
                available_slots.append(self._minutes_to_time(current_m))
            
            current_m += interval
            
        return available_slots