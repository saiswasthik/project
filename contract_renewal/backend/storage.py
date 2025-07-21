import firebase_admin
from firebase_admin import credentials, firestore
from config import FIREBASE_CREDENTIALS_FILE

# Initialize Firebase app for Firestore if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_FILE)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def save_contract_to_firestore(contract):
    """Save contract details to Firestore 'contracts' collection and return doc ID."""
    doc_ref = db.collection('contracts').add(contract)
    return doc_ref[1].id  # Returns the document ID

def delete_contract_from_firestore(doc_id):
    """Delete contract from Firestore by document ID."""
    db.collection('contracts').document(doc_id).delete()

def load_contracts_from_firestore():
    contracts = []
    docs = db.collection('contracts').stream()
    for doc in docs:
        contract = doc.to_dict()
        contract['firebase_doc_id'] = doc.id  # Include the doc ID for deletion
        contracts.append(contract)
    return contracts 