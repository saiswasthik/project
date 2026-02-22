from schemas.resturants_schema import Resturant_Validation
from models.resturants_model import Resturant
from fastapi import HTTPException
import bcrypt


class ResturantService:
    def __init__(self,db):
        self.db=db
    
   
    def new_resturant(self, data: Resturant_Validation):
        email = data.email.strip().lower()
        password = data.password.strip()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))
        
        resturant_data = Resturant(
            name=data.name.strip(),
            restaurant_name=data.restaurant_name.strip(),
            email=email,
            address=data.address.strip(),
            password=hashed_password.decode('utf-8')
        )
        
        self.db.add(resturant_data)
        self.db.commit()
        self.db.refresh(resturant_data)
        
        # Return same sanitized structure as authenticate
        return {
            "id": resturant_data.id,
            "name": resturant_data.name,
            "restaurant_name": resturant_data.restaurant_name,
            "email": resturant_data.email,
            "address": resturant_data.address,
            "role": "Administrator"
        }
    
    
   
    def delete_resturant(self, id: int):
        resturant = self.db.query(Resturant).filter(Resturant.id == id).first()

        if not resturant:
            raise HTTPException(status_code=404, detail="Restaurant not found")

        self.db.delete(resturant)
        self.db.commit()

        return resturant
    
    def authenticate(self, data):
        # email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        # 1️⃣ Get restaurant by unique field
        resturant = self.db.query(Resturant).filter(
            Resturant.email == data.get("email")
        ).first()

        if not resturant:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # 2️⃣ Check password using bcrypt
        stored_password = resturant.password
        # Handle legacy "b'String'" storage if it exists
        if stored_password.startswith("b'") and stored_password.endswith("'"):
            stored_password = stored_password[2:-1]

        try:
            if not bcrypt.checkpw(
                password.encode("utf-8"),        # plain password from user
                stored_password.encode("utf-8") # hashed password from DB
            ):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        except ValueError:
            # Fallback for plain text or corrupted hashes
            if stored_password != password:
                raise HTTPException(status_code=401, detail="Invalid credentials")

        # 3️⃣ Return sanitized data for frontend sync
        return {
            "id": resturant.id,
            "name": resturant.name,
            "restaurant_name": resturant.restaurant_name,
            "email": resturant.email,
            "address": resturant.address,
            "role": "Administrator"
        }
    