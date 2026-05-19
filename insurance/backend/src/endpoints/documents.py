from importlib.resources import files
from fastapi import APIRouter
from fastapi import UploadFile, File, Form
from typing import List
from src.schemas.clames import newclames
from src.service.get_documents_service import GetDocumentsService
# from src.service.validation_service import Validationservice 
from src.service.text_extract_service import TEXTEXTRACTOR
from src.data.claim_storage import ClaimStorage
from src.llm.llm_service import LLMSERVICE
from src.data.firebase_storage import FirebaseClaimStorage
import os
import json

router = APIRouter()

@router.post("/submit_claim")
async def submit_claim(
    files: List[UploadFile] = File(...),
    health_policy_number: str = Form(...),
    insurance_company: str = Form(...),
    tpa_name: str = Form(None),
    claim_id_ref_no: str = Form(...),
    patient_name: str = Form(...),
    policyholder_name: str = Form(...),
    employee_id: str = Form(None),
    valid_id_proof: str = Form(...),

):
    """
    Submit a new claim with documents and details in a single request.
    """
    claim_data = {
        "health_policy_number": health_policy_number,
        "insurance_company": insurance_company,
        "tpa_name": tpa_name,
        "claim_id_ref_no": claim_id_ref_no,
        "patient_name": patient_name,
        "policyholder_name": policyholder_name,
        "employee_id": employee_id,
        "valid_id_proof": valid_id_proof
    }
    
    return await GetDocumentsService().process_claim_submission(files, claim_data)

@router.get("/get_claim_text")
def get_claim_text(claim_id: str):
    storage = ClaimStorage()
    claim_data = storage.get_claim(claim_id)
    
    if claim_data:
        return {"extracted_text": claim_data.get("extracted_text", ""), "status": "Found"}
    else:
        return {"extracted_text": "", "status": "Not Found", "message": "Claim ID not found"}

@router.get("/get_claim_details")
def get_claim_details(claim_id: str):
    storage = ClaimStorage()
    claim_data = storage.get_claim(claim_id)
    return claim_data if claim_data else {"error": "Claim not found"}

@router.post("/update_claim_data")
def update_claim_data(claim_id: str = Form(...), document_name: str = Form(...), corrected_text: str = Form(...)):
    storage = ClaimStorage()
    from src.service.validation_service import RulesEngine
    claim_data = storage.get_claim(claim_id)
    
    if not claim_data:
        return {"error": "Claim not found"}
    
    # Initialize updated_text if not present
    if "updated_text" not in claim_data:
        claim_data["updated_text"] = {}
    rules=RulesEngine()
    # rules.updated_document_text(claim_id)
    
    # Save the corrected text for this specific document
    claim_data["updated_text"][document_name] = corrected_text
    storage.save_claim(claim_id, claim_data)
    rules.updated_document_text(claim_id)
    
    return {"status": "Success", "message": f"Updated text for {document_name}"}

@router.post("/revalidate_claim")
async def revalidate_claim(claim_id: str = Form(...)):
    
    storage = ClaimStorage()
    claim_data = storage.get_claim(claim_id)
    
    if not claim_data:
        return {"error": "Claim not found"}
    
    # Use updated_text if it exists, otherwise extracted_text
    text_source = claim_data.get("updated_text", claim_data.get("extracted_text", {}))
    
    if not text_source:
        return {"error": "No text content found to validate."}
        
    combined_text = ""
    for doc_name, text in text_source.items():
        combined_text += f"\nDocument {doc_name}:\n{text}\n"
    
    try:
        llm_service = LLMSERVICE()
        raw_response = llm_service.generate_text(combined_text, claim_context=claim_data.get("claim_details"))
        
        # Parse JSON
        clean_response = raw_response.replace('```json', '').replace('```', '').strip()
        new_report = json.loads(clean_response)
        
        # Update storage
        claim_data["validation_report"] = new_report
        storage.save_claim(claim_id, claim_data)
        
        return {"status": "Success", "validation_report": new_report}
    except Exception as e:
        return {"error": f"Re-validation failed: {str(e)}"}

@router.get("/all_claims")
def get_all_claims():
    storage = ClaimStorage()
    return storage.get_all_claims()


@router.delete("/{claim_id}")
def delete_claim_data(claim_id: str):
    storage = ClaimStorage()
    if storage.delete_claim(claim_id):
        return {"status": "Success", "message": f"Claim {claim_id} deleted successfully"}
    else:
        return {"error": f"Claim {claim_id} not found"}