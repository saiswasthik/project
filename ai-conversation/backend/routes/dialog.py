from fastapi import APIRouter, Body
from services import gemini, gemini_tts
import os
import json
from services.gemini import generate_summary

router = APIRouter()

def calculate_line_timings(script_json):
    """
    Calculate approximate timing for each line in the script.
    Assumes average speaking rate of 150 words per minute.
    """
    try:
        if not script_json or not isinstance(script_json, list):
            return []
        
        timings = []
        current_time = 0
        
        for line in script_json:
            if isinstance(line, dict) and 'text' in line:
                # Count words in the text
                word_count = len(line['text'].split())
                # Calculate duration (150 words per minute = 2.5 words per second)
                duration = word_count / 2.5
                
                timings.append({
                    'start': current_time,
                    'end': current_time + duration,
                    'text': line['text']
                })
                
                current_time += duration
            elif isinstance(line, str):
                # Handle string lines
                word_count = len(line.split())
                duration = word_count / 2.5
                
                timings.append({
                    'start': current_time,
                    'end': current_time + duration,
                    'text': line
                })
                
                current_time += duration
        
        return timings
    except Exception as e:
        print(f"Error calculating line timings: {e}")
        return []

# def generate_summary(topic: str):
#     """
#     Generates a structured, easy-to-understand, exam-focused summary using an LLM like Gemini.
#     """
#     try:
#         prompt = (
#         f"You are a knowledgeable teacher creating a quick revision guide for students preparing for an exam.\n\n"
#         f"Write a well-structured and clear study summary on the topic: {topic}.\n\n"
#         f"Requirements:\n"
#         f"- Start with an engaging title.\n"
#         f"- Use bolded headings and bullet points for clarity.\n"
#         f"- Include important definitions, classifications, key characteristics, examples, and differences.\n"
#         f"- Provide helpful comparisons in table form (if applicable).\n"
#         f"- Use simple, readable language suited for school or college students.\n"
#         f"- End with a quick revision tip or takeaway for exams.\n"
#         f"- Ensure the summary is about 500 words, avoids markdown (** or ##), and includes all key points."
#     )
#         summary = gemini.generate_summary(prompt)
#         if summary:
#             return summary
#     except Exception:
#         pass
    # return f"A helpful revision summary about {topic} will appear here."
  # Fallback summary 

# @router.post("/generate-summary")
# def generate_summary_endpoint(topic: str = Body(..., embed=True)):
#     summary = generate_summary(topic)
#     return {"summary": summary}

@router.post("/generate-dialog")
def generate_dialog_endpoint(topic: str = Body(..., embed=True)):
    try:
        print(f"=== GENERATING DIALOG FOR TOPIC: {topic} ===")
        
        script = gemini.generate_script(topic)
        print(f"Script generated: {script is not None}")
        
        # Check if script generation failed
        if script is None:
            print("Script generation failed")
            return {
                "script": [], 
                "audio": None, 
                "summary": f"Failed to generate script for topic: {topic}. Please try again."
            }
        
        # If script is a string, parse it as JSON
        if isinstance(script, str):
            try:
                script_json = json.loads(script)
                print("Script parsed as JSON successfully")
            except Exception as e:
                print(f"Error parsing script JSON: {e}")
                return {
                    "script": [], 
                    "audio": None, 
                    "summary": "Script generation failed (invalid format)."
                }
        else:
            script_json = script
            print("Script is already JSON object")

        # Generate audio
        print("Generating audio...")
        audio_result = gemini_tts.text_to_speech(json.dumps(script_json))
        print(f"Audio generation result: {audio_result}")

        # Generate summary
        print("Generating summary...")
        summary = generate_summary(topic)
        print(f"Summary generated: {summary[:100]}..." if summary else "No summary generated")

        # Handle TTS result
        audio_url = None
        if isinstance(audio_result, dict):
            if audio_result.get("status") == "success" and audio_result.get("path"):
                audio_url = f"https://conversation-m77i.onrender.com/temp_audio/{os.path.basename(audio_result['path'])}"
            else:
                audio_url = None
        elif isinstance(audio_result, str) and os.path.exists(audio_result):
            audio_url = f"https://conversation-m77i.onrender.com/temp_audio/{os.path.basename(audio_result)}"
        else:
            audio_url = audio_result

        # Calculate line timings
        line_timings = calculate_line_timings(script_json)

        response_data = {
            "script": script_json,
            "audio": audio_url,
            "summary": summary,
            "line_timings": line_timings
        }
        
        print(f"Returning response with script length: {len(script_json) if isinstance(script_json, list) else 'N/A'}")
        print(f"Audio URL: {audio_url}")
        print(f"Summary length: {len(summary) if summary else 0}")
        
        return response_data
        
    except Exception as e:
        print(f"Error in generate_dialog for topic '{topic}': {str(e)}")
        return {
            "script": [], 
            "audio": None, 
            "summary": f"An error occurred while generating conversation for '{topic}'. Please try again."
        } 