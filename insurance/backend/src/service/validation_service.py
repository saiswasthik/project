from src.data.claim_storage import ClaimStorage
from src.llm.llm_service import LLMSERVICE


class RulesEngine:
    def __init__(self):
        self.storage = ClaimStorage()
        self.llm_service = LLMSERVICE()

    def updated_document_text(self,claim_id):
        text=self.storage.get_claim(claim_id=claim_id)

        # print(text,"********************")
        return text
    
