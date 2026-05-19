from pydantic import BaseModel

class newclames(BaseModel):
    health_policy_number: str
    insurance_company: str
    tpa_name: str | None = None
    claim_id_ref_no: str
    patient_name: str
    policyholder_name: str
    employee_id: str | None = None
    valid_id_proof: str
  

class updatedinfo(BaseModel):
    patient_name:str
    