import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import Firebase

class FirebaseService:
    def __init__(self):
        self.storage_bucket_name = Firebase.Firebase_storage_bucket

        cred = credentials.Certificate("firebase_key.json")

        firebase_admin.initialize_app(
            cred,
            {
                "storageBucket": self.storage_bucket_name
            }
        )

        self.firestore_db = firestore.client()
        self.storage_bucket = storage.bucket()

# firebase_service = FirebaseService()
