from src.data.firebase_client import FirebaseService


class FirebaseClaimStorage():
    def __init__(self):
        self.firebase_db=FirebaseService.firestore_db
        self.storage_bucket=FirebaseService.storage_bucket
        
    def save_claim(self,claim_id,data):
        self.firebase_db.collection("claims").document(claim_id).set(data)
    def get_claim(self,claim_id):
        return self.firebase_db.collection("claims").document(claim_id).get().to_dict()
    
    def get_all_claims(self):
        return self.firebase_db.collection("claims").get()
    
    # def

    

        

