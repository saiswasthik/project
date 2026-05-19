from dotenv import load_dotenv
import os
load_dotenv()


class CONFIG:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    MODEL = os.getenv("MODEL")
    url="https://api.groq.com/openai/v1"

class Firebase:
    Firebase_API_KEY=os.getenv("Firebase_API_KEY")
    Firebase_project_id=os.getenv("Firebase_project_id")
    Firebase_storage_bucket=os.getenv("Firebase_storage_bucket")
    Firebase_app_id=os.getenv("Firebase_app_id")
    Firebase_authDomain=os.getenv("Firebase_authDomain")
    Firebase_measurementId=os.getenv("Firebase_measurementId")
    Firebase_messagingSenderId=os.getenv("Firebase_measurementId")

