import os
import requests
import json
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
api_key=os.getenv("API_KEY")
template_id=os.getenv("template_id")
class DocuveraTemplateManager:
    """
    Automation tool for creating and retrieving templates in Docuvera.
    """
    def __init__(self, api_key: str):
        self.base_url = "https://api.us1c2.docuvera.com/api/component/v2/projects"
        self.equations_url = "https://api.us1c2.docuvera.com/api/component/v2/equations"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    def get_template(self, template_id:str) -> Optional[Dict[str, Any]]:
        """
        Retrieves an existing template by its ID.
        
        Args:
            template_id (str): The ID of the template to retrieve.
            
        Returns:
            dict: The JSON response containing template details if successful, None otherwise.
        """
        try:
            url = f"{self.base_url}/{template_id}"
            logging.info(f"Retrieving template with ID: {template_id}...")
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            logging.info(f"Successfully retrieved template {template_id}.")
            return data
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Failed to retrieve template {template_id}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logging.error(f"Response details: {e.response.text}")
            return None

if __name__ == "__main__":
    if not api_key:
        logging.error("API_KEY is not set in the .env file. Please add it before running.")
    elif not template_id:
        logging.error("template_id is not set in the .env file.")
    else:
        manager = DocuveraTemplateManager(api_key=api_key)
        template_details = manager.get_template(template_id)
        
        if template_details:
            print(json.dumps(template_details, indent=2))
