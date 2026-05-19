from pathlib import Path
from typing import List
from fastapi import UploadFile
from src.service.text_extract_service import TEXTEXTRACTOR
from src.llm.llm_service import LLMSERVICE
from src.data.claim_storage import ClaimStorage
import json
import traceback

class GetDocumentsService:
    def __init__(self):
        self.extractor = TEXTEXTRACTOR()
        self.llm_service = LLMSERVICE()
        self.storage = ClaimStorage()
        

    async def process_claim_submission(self, files: List[UploadFile], claim_details: dict):
        # 1. Handle Files
        document_paths = []
        UPLOAD_DIR = Path("uploaded_files")
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        for file in files:
            file_path = UPLOAD_DIR / file.filename
            with open(file_path, "wb") as f:
                f.write(await file.read())
            document_paths.append(str(file_path))
            print(f"Saved file to: {file_path}")

        # 2. Extract & LLM
        extracted_text_data = {}
        combined_text_for_llm = ""
        llm_response = {}
        
        try:
            print("Starting Text Extraction...")
            # extracted_text_data is now a dict {filename: text}
            extracted_text_data = self.extractor.extract_all_text(document_paths)
            print(f"Extraction Complete. Documents processed: {len(extracted_text_data)}")
            
            # Combine text for LLM
            for doc_name, text in extracted_text_data.items():
                combined_text_for_llm += f"Document {doc_name}:\n{text}\n\n"

            # Simple check to avoid sending empty text to LLM
            if not combined_text_for_llm.strip():
                print("Warning: No text extracted from documents.")
                llm_response = {"error": "No text extracted from uploaded documents."}
            else:
               
                raw_llm_response = self.llm_service.generate_text(combined_text_for_llm, claim_context=claim_details)
                # print("LLM Validation Complete.")
            
                try:
                    # Clean up markdown code blocks if present
                    clean_response = raw_llm_response.replace('```json', '').replace('```', '').strip()
                    llm_response = json.loads(clean_response)
                except Exception as e:
                    print(f"Error parsing LLM JSON: {e}")
                    # If it's not JSON, return it as a simple text field or wrap it
                    llm_response = {"validation_notes": raw_llm_response, "parsing_error": "Could not parse strict JSON"}
                
        except Exception as e:
           
            error_msg = f"Error during processing: {str(e)}"
            print(error_msg)
            traceback.print_exc()
            llm_response = {"error": error_msg, "details": str(e)}


        print(f"LLM Response: {llm_response}")
        

        # 3. Save Data
        claim_id = claim_details.get("claim_id_ref_no")
        full_record = {
            "claim_details": claim_details,
            "document_paths": document_paths,
            "extracted_text": extracted_text_data, 
            "validation_report": llm_response,
            "status": "Submitted" if not llm_response.get("error") else "Processed with Errors"
        }
        if claim_id:
            self.storage.save_claim(claim_id, full_record)
            print(f"Saved claim data for ID: {claim_id}")

        return {
            "message": "Claim submitted successfully",
            "claim_id": claim_id,
            "files_processed": len(document_paths),
            "status": full_record["status"],
            "extracted_text_preview": combined_text_for_llm[:500] if combined_text_for_llm else "",
            "validation_report": llm_response
        }
    
    
    

       
