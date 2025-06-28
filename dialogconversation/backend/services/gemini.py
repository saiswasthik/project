import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
except ValueError as e:
    print(f"Error: {e}")
    # You might want to handle this more gracefully
    exit()

  


def clean_json_response(text):
    """Extract JSON from markdown code blocks or return the text as-is if it's already JSON."""
    # Remove markdown code blocks if present
    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()  
    elif text.startswith("```"):
        text = text.replace("```", "").strip()
    
    return text

def generate_summary(topic: str):
    """
    Generates a summary for a given prompt/topic using the Gemini API.
    """
    try:
        prompt = (
        f"You are a knowledgeable teacher creating a quick revision guide for students preparing for an exam.\n\n"
        f"Write a well-structured and clear study summary on the topic: {topic}.\n\n"
        f"Requirements:\n"
        f"- Start with an engaging title.\n"
        f"- Use bolded headings and bullet points for clarity.\n"
        f"- Include important definitions, classifications, key characteristics, examples, and differences.\n"
        f"- Provide helpful comparisons in table form (if applicable).\n"
        f"- Use simple, readable language suited for school or college students.\n"
        f"- End with a quick revision tip or takeaway for exams.\n"
        f"- Ensure the summary is about 500 words, avoids markdown (** or ##), and includes all key points."
    )
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        summary = response.text.strip()
        return summary
    except Exception as e:
        # Fallback summary
        return f"Summary could not be generated: {e}"


def generate_script(topic: str):
    """
    Generates a two-person conversation script using the Gemini API.
    """
    try:
        # Use the correct model name - try gemini-1.5-pro instead of gemini-pro
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"You are a professional scriptwriter. Write a realistic, engaging, and emotionally nuanced conversation between two people about the following topic: {topic}.\n"
            "Requirements:\n"
            "- Alternate lines between Person A and Person B, as in a real conversation.\n"
            "- Make the dialogue natural, with some back-and-forth, questions, and reactions.\n"
            "- Include at least 6 lines per person.\n"
            "- Avoid generic or robotic responses; use everyday language and show personality.\n"
            "- Do not include any introductory or concluding remarks, narration, or stage directions—just the dialogue.\n"
            "- Output ONLY a valid JSON object with two keys: 'person_a' and 'person_b'.\n"
            "- Each key should map to a list of that person's lines, in order.\n"
            "- Do NOT use markdown, code blocks, or any extra formatting—just the JSON object.\n"
            "Example output:\n"
            "{\n"
            "  \"person_a\": [\"line 1\", \"line 3\", ...],\n"
            "  \"person_b\": [\"line 2\", \"line 4\", ...]\n"
            "}\n"
        )
        
        response = model.generate_content(prompt)
        raw_text = response.text
        
        # Clean the response
        cleaned_text = clean_json_response(raw_text)
        
        # Validate that it's valid JSON
        try:
            json.loads(cleaned_text)
            return cleaned_text
        except json.JSONDecodeError:
            # If it's not valid JSON, return a simple fallback
            return json.dumps({
                "person_a": [f"Let's talk about {topic}.", "That's interesting."],
                "person_b": [f"Yes, {topic} is fascinating.", "I agree completely."]
            })
            
    except Exception as e:
        return f"An error occurred while generating the script: {e}"
       