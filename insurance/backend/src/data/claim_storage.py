import json
from pathlib import Path
from typing import Dict, Any, Optional

class ClaimStorage:
    _instance = None
    _storage_file = Path("claim_storage.json")
    _data: Dict[str, Any] = {}


    def __new__(cls):
        if cls._instance is None: 
            cls._instance = super(ClaimStorage, cls).__new__(cls)
            cls._instance._load_data()
        return cls._instance
    

    def _load_data(self):
        
        if self._storage_file.exists():
            try:
                with open(self._storage_file, "r") as f:
                    self._data = json.load(f)
            except Exception as e:
                print(f"Error loading storage: {e}")
                self._data = {}
    

    def _save_data(self):
        try:
            with open(self._storage_file, "w") as f:
                json.dump(self._data, f, indent=4)
        except Exception as e:
            print(f"Error saving storage: {e}")

    def save_claim(self, claim_id: str, data: Dict[str, Any]):
        self._data[claim_id] = data
        print(self._data[claim_id])
        # print(self._data,"11111111111111111111111")
        self._save_data()
    
    def get_claim(self, claim_id: str) -> Optional[Dict[str, Any]]:
        return self._data.get(claim_id)

    def get_all_claims(self) -> Dict[str, Any]:
        return self._data
    
    # def patch_claims(self,claim_id:str,data:Dict[str,Any]):
    #     if claim_id not in self._data:
    #         return "id not found"
    #     else:
    #         self._data[claim_id].update(data)
    #         self._save_data()
    #         return self._data[claim_id]


    def delete_claim(self, claim_id: str):
        if claim_id in self._data:
            del self._data[claim_id]
            self._save_data()
            return True
        return False
    

    