from schemas.vendor import vendor_registration_schema
from bson import ObjectId
import logger
from pydantic import BaseModel

    
    
class VenderService:
    def __init__(self,db):
        self.db = db
        pass

    async def vendor_registration(self, data:dict ,vendor_details:vendor_registration_schema):
        # phone=vendor_details.phone_number
        # for vendor_mobile in self.db:
        #    if phone==vendor_mobile["phone_number"]:
        #        logger.error("vendor exists")
        #        return None
         
        # new_vendor={
        #     "name":vendor_details.name,
        #     "phone_number":vendor_details.phone_number,
        #     "email":vendor_details.email,
        #     "password":vendor_details.password,
        # }
        # self.db.append(new_vendor)
        # return new_vendor
        phone=vendor_details.store_phone
        existing_vendor=await self.db.find_one({"store_phone":phone})
        if existing_vendor:
            logger.error("vendor already exists")
            return None
        hashed_password=vendor_details.store_password
        new_vendor={
            "store_name":vendor_details.store_name,
            "store_address":vendor_details.store_address,
            "store_category":vendor_details.store_category,
            "store_password":hashed_password,
            "store_description":vendor_details.store_description,
            "store_image":vendor_details.store_image,
            "store_phone":vendor_details.store_phone,
            "store_email":vendor_details.store_email,
            "store_website":vendor_details.store_website,
            "store_license":vendor_details.store_license,

        }

        result=await self.insert_one(new_vendor)
        new_vendor["_id"] = result.inserted_id
        logger.message("vendor registered successfully")

        return new_vendor

        
    async def get_vendor_profile(self, vendor_id: str):
        vendor_result=await self.db.find_one({"_id":ObjectId(vendor_id)})
        if vendor_result:
            return vendor_result
        else:
            logger.error("vendor not found")
            return None
        
        
        # vendor=self.db.get(vendor_id)
        # if vendor is None:
        #     logger.error("vendor not found")
        #     return None
        # else:
        #     return vendor
            
        pass

    async def update_vendor_profile(self, vendor_id: str, data: dict):
        result=await self.db.update_one(
            {"_id":ObjectId(vendor_id)},
            {"$set":data}
            )
        if result.matched_count ==0:
            logger.error("vendor not found")
            return None
        return await self.db.find_one({"_id":ObjectId(vendor_id)})
        
        

    async def get_vendor_dashboard(self, vendor_id: int):
        pass
    

   

  