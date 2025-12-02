import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def get_gemini_summary(text):
    """Updated to handle potential API errors gracefully"""
    if not text or len(text) < 100:
        return "Text too short."
    try:
        # Use the standard model name. 
        # If this fails, try 'gemini-1.5-pro' or 'gemini-1.0-pro'
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = (
            """"
            You are an expert FDA regulatory analyst. Extract the key findings from the FDA Warning Letter text below, even if the information is implied, scattered, or partially stated.

                Rewrite the content into a clean, structured, presentation-ready summary using plain text only.

                Rules:
                1. Use plain text only. No markdown, no asterisks, no special characters.
                2. Always produce the following headings, even if some have limited details:
                Background of the Company or Product
                Summary of FDA Inspection Findings
                Major Violations Identified
                CGMP or Quality System Deficiencies
                Labeling or Advertising Violations
                Clinical or Safety Concerns
                Corrective Actions Requested by FDA
                Potential Regulatory Consequences
                3. Under each heading, provide 2 to 6 concise bullet-style lines (begin with a hyphen).
                4. If the FDA letter lacks explicit details, infer the most reasonable meaning based on regulatory patterns, but do not fabricate facts. 
                5. Avoid generic phrases like “no information provided.” Instead, state what the available text suggests.
                6. Keep tone formal and compliant with FDA documentation standards.            
                """
            f"TEXT: {text}"
        )
        response = model.generate_content(prompt)
        print(response.text.strip())
        return response.text.strip()
    except Exception as e:
        return f"AI Summary Failed: {str(e)}"