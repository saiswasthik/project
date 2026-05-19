from bson import ObjectId
import passlib.hash
import logger

class Authservice:

    def __init__(self):
        pass

    hashed_password=passlib.hash.bcrypt.hash(password)

    async def registration(self,role,data):
        if role=="admin":
            new_admin={
                "name":data["name"],
                "email":data["email"],
                "password":data["password"],
            }
            result=await self.db.insert_one(new_admin)
            new_admin["_id"]=result.inserted_id
            logger.message("admin registered successfully")
            return new_admin
        elif role=="vendor":
            new_vendor={
                "name":data["name"],
                "email":data["email"],
                "password":data["password"]
            }
            result=await self.db.insert_one(new_vendor)
            new_vendor["_id"]=result.inserted_id
            logger.message("vendor registered successfully")
            return new_vendor
        elif role=="customer":
            new_customer={
                "name":data["name"],
                "email":data["email"],
                "password":data["password"]
            }
            result=await self.db.insert_one(new_customer)
            new_customer["_id"]=result.inserted_id
            logger.message("customer registered successfully")
            return new_customer
        else:
            logger.error("invalid role")
            return None

        
        
        
        pass

    async def login(self,email:str,password:str):
        pass
    
    async def forgot_password(self,email:str):
        pass



# class AuthService:
#     def __init__(self, db):
#         self.db = db

#     async def register_user(
#         self,
#         role: str,   # "ADMIN" | "VENDOR" | "CUSTOMER"
#         data: dict
#     ):
#         """
#         Creates a user account.
#         Vendor registration creates a user + vendor profile (status=PENDING)
#         """
#         pass

#     async def login(
#         self,
#         email: str,
#         password: str
#     ):
#         """
#         Authenticate user & return JWT tokens
#         """
#         pass

#     async def get_current_user(
#         self,
#         token: str
#     ):
#         """
#         Decode token & return user identity
#         """
#         pass

#     async def refresh_token(
#         self,
#         refresh_token: str
#     ):
#         pass

#     async def change_password(
#         self,
#         user_id: int,
#         old_password: str,
#         new_password: str
#     ):
#         pass
