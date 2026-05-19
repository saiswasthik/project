
from bson import ObjectId
import logger
from pydantic import BaseModel

class Adminservice:
    def __init__(self,db):
        self.db=db

    

    async def get_vendor_profile(self, vendor_id: str):
        vendor_result=await self.db.find_one({"_id":ObjectId(vendor_id)})
        if vendor_result:
            return vendor_result
        else:
            logger.error("vendor not found")
            return None
        
        
    
    async def get_all_vendors(self):
        vendors_data=await self.db.find().to_list()
        return vendors_data

        

    async def vendor_review_status(self,vendor_id:str,status:bool):  #accept/reject
        vendor_status=await self.db.find_one(
            {"_id":ObjectId(vendor_id)}
        )
        if vendor_status:
            if status==True:
                await self.db.update_one(
                    {"_id":ObjectId(vendor_id)},
                    {"$set":{"status":"APPROVED"}}
                )
            else:
                await self.db.update_one(
                    {"_id":ObjectId(vendor_id)},
                    {"$set":{"status":"REJECTED"}}
                )
        else:
            logger.error("vendor not found")
            return None
       

    async def vendor_block_status(self,vendor_id:int):
        pass

   
    async def get_vendor_all_orders(self,vendor_id:int):
        pass
    
   