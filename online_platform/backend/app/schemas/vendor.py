from pydantic import BaseModel
class vendor_registration_schema(BaseModel):
    store_name:str
    store_address:str
    store_category:str
    store_description:str
    store_image:str
    store_phone:str
    store_email:str
    store_website:str
    store_license:str
    store_password:str