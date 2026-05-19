
from openai import OpenAI
import os
from dotenv import load_dotenv
from src.service.text_extract_service import TEXTEXTRACTOR
from config import CONFIG


load_dotenv()
class LLMSERVICE:
    def __init__(self):
        self.client = OpenAI(
            api_key=CONFIG.GROQ_API_KEY,
            base_url=CONFIG.url,
        )
        self.prompt="""You are an insurance claim assistant. You are given multiple documents for the same patient.
            Each document may contain information like: patient name, hospital, discharge summary, prescriptions, bills, dates, treatment details etc.

            Your task:
            1. Context: You are validating a claim for specific patient.
               Claim Details provided by User: {claim_context}
            
            2. Compare the uploaded documents text against the Claim Details.
               - **CRITICAL**: Check if the Patient Name in documents matches matches "{claim_context}".
               - Check if dates and policy numbers line up.

            3. Identify any **missing fields** in each document required for an insurance claim.
            4. Return a **structured report**, for example:

            Document 1:
            - Missing fields: ...
            - Notes on inconsistencies: ...
            
            Overall Validation:
            - Patient Name Match: [Yes/No] (Explain if No)
            - Policy Match: [Yes/No]
            - Critical Discrepancies: ...

            missing information justification have to be document wise.
            provide the output in the json format with keys as Document 1, Document 2 etc and values as another json with keys missing fields and details.
            provide the missing fields and the details in the documants as in the comparision formate 
            from the result remove ** and the <br>** \n characters tags
            output have to be structured json only.
        
            Output format example:
            {{
            "Document 1": {{
                "missing_fields": ["discharge_date"],
                "details": "Discharge date not found"
            }},
            "Document 2": {{
                "missing_fields": ["itemized_bill"],
                "details": "Itemized bill missing"
            }}.....
            }}


            {input_text}
            """
    def generate_text(self, input_text, claim_context=None):
        context_str = str(claim_context) if claim_context else "No specific patient context provided."
        formatted_prompt = self.prompt.format(input_text=input_text, claim_context=context_str)
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful insurance claim validation assistant. Return only JSON."},
                    {"role": "user", "content": formatted_prompt}
                ],
                model=CONFIG.MODEL,
                temperature=0.5
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"LLM Call Error: {e}")
            return "{}"
        #     if item.type == "output_text":
        #         output_text += item.text

        # return output_text

 
