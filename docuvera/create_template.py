import os
import requests
import json
import logging
from dotenv import load_dotenv

load_dotenv(override=True)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
import uuid

def generate_id():
    return str(uuid.uuid4())
    
def create_template_from_json(json_file_path: str):
    api_key = os.getenv("API_KEY")
    if not api_key:
        logging.error("API_KEY is not set in the .env file.")
        return
        
    url = "https://api.us1c2.docuvera.com/api/component/v2/projects"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    if not os.path.exists(json_file_path):
        logging.error(f"Could not find JSON file: {json_file_path}")
        return
        
    with open(json_file_path, "r") as f:
        payload = json.load(f)
        
    # --- DYNAMIC ID GENERATION ---
    # We need to give every component instance a fresh UUID so we don't reuse IDs across different templates.
    if "containedComponents" in payload:
        id_mapping = {}
        
        # 1. Generate a brand new ID for every contained component instance
        for comp in payload["containedComponents"]:
            old_id = comp.get("id")
            if old_id:
                new_id = generate_id()
                id_mapping[old_id] = new_id
                
        # 2. Replace all occurrences of the old IDs with the new IDs everywhere in the payload.
        # Converting the JSON to a string and doing a global replace is the safest way, 
        # because Docuvera hides these IDs both inside arrays AND inside HTML string fields!
        payload_str = json.dumps(payload)
        for old_id, new_id in id_mapping.items():
            payload_str = payload_str.replace(old_id, new_id)
            
        # Parse it back into a dictionary
        payload = json.loads(payload_str)
        logging.info(f"Dynamically generated {len(id_mapping)} fresh component instance IDs.")
    # ------------------------------
        
    # Remove any read-only fields that might cause validation errors
    read_only_fields = [
        "id", "isProtected", "revision", "auditDetails", "workspaceId", "owner",
        "isActive", "owningUsers", "confidentialViewers", "isConfidential",
        "createdOn", "modifiedOn", "createdByUserId", "modifiedByUserId", "derivedFrom"
    ]
    for field in read_only_fields:
        if field in payload:
            del payload[field]
            
    logging.info(f"Creating a new template by POSTing to {url}...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        logging.info("Successfully created the template!")
        
        # Save the returned template to a file so the user can easily track the new IDs
        output_filename = "created_template_response.json"
        with open(output_filename, "w") as out_f:
            json.dump(data, out_f, indent=2)
            
        logging.info(f"The completed template JSON (including your new dynamic IDs) has been saved to: {output_filename}")
        print("\n=== NEW TEMPLATE DETAILS (Preview) ===")
        print(json.dumps(data, indent=2)[:500] + "\n... (Output truncated, see file for full JSON)")
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to create template: {e}")
        if hasattr(e, 'response') and e.response is not None:
            logging.error(f"Response details: {e.response.text}")

if __name__ == "__main__":
    # You can change this to whatever JSON file contains your template payload
    create_template_from_json("template_payload.json")
