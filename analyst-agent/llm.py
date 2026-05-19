import os
from google import genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def get_llm_response(prompt: str, is_json: bool = False) -> str:
    gemini_error = ""
    try:
        if os.environ.get("GEMINI_API_KEY"):
            client = genai.Client()
            config = None
            if is_json:
                from google.genai import types
                config = types.GenerateContentConfig(response_mime_type="application/json")
                
            response = client.models.generate_content(
                model='gemini-2.5-pro',
                contents=prompt,
                config=config
            )
            return response.text
        else:
            gemini_error = "GEMINI_API_KEY is not set."
    except Exception as e:
        gemini_error = str(e)
        
    try:
        if os.environ.get("GROQ_API_KEY"):
            groq_client = Groq()
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"} if is_json else None,
                messages=[{"role": "user", "content": prompt}],
            )
            return completion.choices[0].message.content
        else:
            raise Exception(f"Gemini failed ({gemini_error}) and GROQ_API_KEY not set.")
    except Exception as e:
        return f'{{"error": "Both Gemini and Groq failed. {str(e)}" }}' if is_json else f"Error: Both Gemini and Groq failed.\n{str(e)}"
