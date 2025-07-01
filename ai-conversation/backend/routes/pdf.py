from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from services import pdf_service, gemini, gemini_tts
import json
import os
from services.gemini import generate_summary
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse

router = APIRouter()

@router.get("/test-pdf")
def test_pdf_endpoint():
    """Test endpoint to verify PDF route is working."""
    return {
        "success": True,
        "message": "PDF route is working",
        "test_data": {
            "topic": "Test Topic",
            "script": {
                "person_a": ["Hello, this is a test."],
                "person_b": ["Hi, this is working!"]
            },
            "summary": "This is a test summary."
        }
    }

@router.get("/test-tts")
def test_tts_endpoint():
    """Test endpoint to verify TTS is working."""
    try:
        test_script = {
            "person_a": ["Hello, this is a test of the text to speech system."],
            "person_b": ["Hi! The audio should be working now."]
        }
        
        print("Testing TTS with sample script...")
        audio_result = gemini_tts.text_to_speech(json.dumps(test_script))
        print(f"TTS test result: {audio_result}")
        
        return {
            "success": True,
            "message": "TTS test completed",
            "audio_result": audio_result
        }
    except Exception as e:
        print(f"TTS test error: {e}")
        return {
            "success": False,
            "message": f"TTS test failed: {str(e)}"
        }

@router.post("/upload-pdf")
async def upload_and_process_pdf(pdf_file: UploadFile = File(...)):
    """
    Upload a PDF file, extract text, generate summary, and create conversation script.
    """
    try:
        # Validate file type
        if not pdf_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        print(f"=== PROCESSING PDF: {pdf_file.filename} ===")
        
        # Extract text from PDF
        extraction_result = pdf_service.extract_text_from_pdf(pdf_file)
        
        if not extraction_result["success"]:
            raise HTTPException(status_code=400, detail=extraction_result["error"])
        
        raw_text = extraction_result["text"]
        metadata = extraction_result["metadata"]
        
        print(f"Extracted {len(raw_text)} characters from PDF")
        
        # Clean the extracted text
        cleaned_text = pdf_service.clean_extracted_text(raw_text)
        print(f"Cleaned text length: {len(cleaned_text)} characters")
        
        # Extract key topics from the text
        key_topics = pdf_service.extract_key_topics_from_text(cleaned_text)
        print(f"Extracted {len(key_topics)} key topics")
        
        # Generate a topic title based on the content
        topic_title = f"PDF Content: {pdf_file.filename}"
        if key_topics:
            # Use the first key topic as the main topic
            topic_title = key_topics[0][:50] + "..." if len(key_topics[0]) > 50 else key_topics[0]
        
        # Generate summary from the PDF content
        print("Generating summary from PDF content...")
        pdf_summary = generate_summary_from_content(cleaned_text, topic_title)
        print(f"Summary generated: {len(pdf_summary)} characters")
        
        # Generate conversation script based on the PDF content
        print("Generating conversation script from PDF content...")
        script = generate_script_from_content(cleaned_text, topic_title)
        
        if script is None:
            raise HTTPException(status_code=500, detail="Failed to generate conversation script")
        
        # Parse script if it's a string
        if isinstance(script, str):
            try:
                script_json = json.loads(script)
            except Exception as e:
                print(f"Error parsing script JSON: {e}")
                raise HTTPException(status_code=500, detail="Failed to parse generated script")
        else:
            script_json = script
        
        # Generate audio for the script
        print("Generating audio from script...")
        audio_data = gemini_tts.text_to_speech(json.dumps(script_json))
        print(f"Audio result: {audio_data}")
        
        # Handle TTS result
        audio_url = None
        if isinstance(audio_data, dict):
            print(f"Audio result is dict with keys: {list(audio_data.keys())}")
            if audio_data.get("status") == "success" and audio_data.get("path"):
                audio_url = f"https://conversation-m77i.onrender.com/temp_audio/{os.path.basename(audio_data['path'])}"
                print(f"Audio URL constructed: {audio_url}")
            else:
                print(f"Audio result status: {audio_data.get('status')}, path: {audio_data.get('path')}")
                audio_url = None
        elif isinstance(audio_data, str) and os.path.exists(audio_data):
            audio_url = f"https://conversation-m77i.onrender.com/temp_audio/{os.path.basename(audio_data)}"
            print(f"Audio URL from string: {audio_url}")
        else:
            print(f"Audio result is not dict or existing file: {type(audio_data)}")
            audio_url = audio_data
        
        # Calculate line timings
        line_timings = calculate_line_timings(script_json)
        
        response_data = {
            "success": True,
            "topic": topic_title,
            "script": script_json,
            "summary": pdf_summary,
            "audio": audio_url,
            "line_timings": line_timings,
            "metadata": metadata,
            "key_topics": key_topics,
            "extracted_text_length": len(cleaned_text)
        }
        
        print("=== PDF PROCESSING COMPLETE ===")
        print(f"Topic: {topic_title}")
        print(f"Script type: {type(script_json)}")
        print(f"Script keys: {list(script_json.keys()) if isinstance(script_json, dict) else 'Not a dict'}")
        print(f"Summary length: {len(pdf_summary)}")
        print(f"Audio URL: {audio_url}")
        print(f"Response data keys: {list(response_data.keys())}")
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

def generate_summary_from_content(content: str, topic: str) -> str:
    """
    Generate a summary from PDF content using Gemini.
    """
    try:
        prompt = (
            f"You are a knowledgeable teacher creating a comprehensive summary of a document.\n\n"
            f"Document Topic: {topic}\n\n"
            f"Document Content:\n{content[:3000]}...\n\n"
            f"Requirements:\n"
            f"- Create a well-structured summary with clear headings and bullet points.\n"
            f"- Use HTML-like formatting with <h3> for headings and <ul><li> for bullet points.\n"
            f"- Include main points, key concepts, and important details.\n"
            f"- Organize information logically with sections.\n"
            f"- Keep the summary informative but concise (around 300-500 words).\n"
            f"- Focus on the most important information from the document.\n"
            f"- Use this format:\n"
            f"<h3>Main Topic</h3>\n"
            f"<ul>\n"
            f"<li>Key point 1</li>\n"
            f"<li>Key point 2</li>\n"
            f"</ul>\n"
            f"<h3>Important Details</h3>\n"
            f"<ul>\n"
            f"<li>Detail 1</li>\n"
            f"<li>Detail 2</li>\n"
            f"</ul>\n"
        )
        
        summary = gemini.generate_summary(prompt)
        return summary if summary else f"<h3>Summary of {topic}</h3><ul><li>Summary could not be generated</li></ul>"
        
    except Exception as e:
        print(f"Error generating summary from content: {e}")
        return f"<h3>Summary of {topic}</h3><ul><li>Summary could not be generated due to an error</li></ul>"

def generate_script_from_content(content: str, topic: str) -> dict:
    """
    Generate a conversation script from PDF content using Gemini.
    """
    try:
        prompt = (
            f"You are creating an educational conversation script about a document.\n\n"
            f"Document Topic: {topic}\n\n"
            f"Document Content:\n{content[:3000]}...\n\n"
            f"Requirements:\n"
            f"- Create a natural conversation between two people discussing the document content.\n"
            f"- Person A should be knowledgeable about the topic and explain concepts.\n"
            f"- Person B should ask questions and show interest in learning.\n"
            f"- Include 5-8 exchanges that cover the main points of the document.\n"
            f"- Make it educational and engaging.\n"
            f"- Keep each response concise (1-2 sentences).\n"
        )
        
        script_response = gemini.generate_script(prompt)
        
        # Handle the script response - it could be a JSON string or already a dict
        if isinstance(script_response, str):
            try:
                # Try to parse as JSON
                script = json.loads(script_response)
            except json.JSONDecodeError:
                # If it's not valid JSON, create a fallback script
                script = {
                    "person_a": [f"I found some interesting information about {topic}."],
                    "person_b": ["Tell me more about what you discovered."]
                }
        else:
            # If it's already a dict, use it directly
            script = script_response
        
        return script if script else {
            "person_a": [f"I found some interesting information about {topic}."],
            "person_b": ["Tell me more about what you discovered."]
        }
        
    except Exception as e:
        print(f"Error generating script from content: {e}")
        return {
            "person_a": ["I encountered an error while processing that document."],
            "person_b": ["Let's try a different approach."]
        }

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

def extract_content_from_url(url: str) -> str:
    """
    Extract text content from a web page URL.
    """
    try:
        print(f"Extracting content from URL: {url}")
        
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script, style, and navigation elements
        for element in soup(["script", "style", "nav", "header", "footer", "aside"]):
            element.decompose()
        
        # Remove common navigation and menu classes
        for element in soup.find_all(class_=lambda x: x and any(word in x.lower() for word in ['nav', 'menu', 'header', 'footer', 'sidebar', 'breadcrumb', 'pagination'])):
            element.decompose()
        
        # Try to find the main content area
        main_content = None
        
        # Look for common main content selectors
        main_selectors = [
            'main', 'article', '[role="main"]', '.main', '.content', '.post', '.entry',
            '#main', '#content', '#post', '#article', '.article', '.story'
        ]
        
        for selector in main_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                print(f"Found main content using selector: {selector}")
                break
        
        # If no main content found, use body
        if not main_content:
            main_content = soup.find('body')
            print("Using body as main content")
        
        if main_content:
            text = main_content.get_text()
        else:
            text = soup.get_text()
        
        # Clean up the text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common navigation text patterns
        navigation_patterns = [
            r'home\s*\|', r'about\s*\|', r'contact\s*\|', r'privacy\s*\|', r'terms\s*\|',
            r'login\s*\|', r'sign\s*up\s*\|', r'search\s*\|', r'menu\s*\|', r'navigation\s*\|',
            r'©\s*\d{4}', r'all\s*rights\s*reserved', r'cookie\s*policy', r'newsletter',
            r'subscribe', r'follow\s*us', r'share\s*this', r'print\s*this', r'email\s*this'
        ]
        
        for pattern in navigation_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        # Clean up again after removing patterns
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Limit content length but ensure we have meaningful content
        if len(text) > 5000:
            # Try to get the first 5000 characters but break at a sentence boundary
            truncated = text[:5000]
            last_period = truncated.rfind('.')
            if last_period > 4000:  # Only break at period if it's not too early
                text = truncated[:last_period + 1] + "..."
            else:
                text = truncated + "..."
        
        print(f"Extracted {len(text)} characters from URL")
        return text
        
    except Exception as e:
        print(f"Error extracting content from URL: {e}")
        return f"Error extracting content from URL: {str(e)}"

def generate_summary_from_url(url: str) -> str:
    """
    Generate a summary from URL content using Gemini.
    """
    try:
        content = extract_content_from_url(url)
        if content.startswith("Error"):
            return f"<h3>Error</h3><ul><li>{content}</li></ul>"
        
        # Extract domain name for topic
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        topic = f"Content from {domain}"
        
        prompt = (
            f"You are a knowledgeable teacher creating a comprehensive summary of the MAIN TOPIC or CONTENT of a web page.\n\n"
            f"Web Page URL: {url}\n"
            f"Domain: {domain}\n\n"
            f"IMPORTANT: Focus ONLY on the main topic, subject matter, or key information from the page content.\n"
            f"DO NOT discuss website navigation, URL structure, or how the website is organized.\n\n"
            f"Page Content:\n{content[:3000]}...\n\n"
            f"Requirements:\n"
            f"- Create a well-structured summary with clear headings and bullet points.\n"
            f"- Use HTML-like formatting with <h3> for headings and <ul><li> for bullet points.\n"
            f"- Include main points, key concepts, and important details from the MAIN CONTENT.\n"
            f"- Focus on what the page is ABOUT, not how the website works.\n"
            f"- Organize information logically with sections.\n"
            f"- Keep the summary informative but concise (around 300-500 words).\n"
            f"- Focus on the actual subject matter, facts, or information presented.\n"
            f"- Avoid discussing website features, navigation, or URL structure.\n"
            f"- Use this format:\n"
            f"<h3>Main Topic Overview</h3>\n"
            f"<ul>\n"
            f"<li>Key point about the topic</li>\n"
            f"<li>Key point about the topic</li>\n"
            f"</ul>\n"
            f"<h3>Key Information</h3>\n"
            f"<ul>\n"
            f"<li>Important detail about the topic</li>\n"
            f"<li>Important detail about the topic</li>\n"
            f"</ul>\n"
        )
        
        summary = gemini.generate_summary(prompt)
        return summary if summary else f"<h3>Summary of {domain}</h3><ul><li>Summary could not be generated</li></ul>"
        
    except Exception as e:
        print(f"Error generating summary from URL: {e}")
        return f"<h3>Error</h3><ul><li>Summary could not be generated due to an error: {str(e)}</li></ul>"

def generate_script_from_url(url: str) -> dict:
    """
    Generate a conversation script from URL content using Gemini.
    """
    try:
        content = extract_content_from_url(url)
        if content.startswith("Error"):
            return {
                "person_a": ["I'm sorry, I couldn't extract content from that URL."],
                "person_b": ["That's okay. Let's try a different approach."]
            }
        
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        topic = f"Content from {domain}"
        
        prompt = (
            f"You are creating an educational conversation script about the MAIN TOPIC or CONTENT of a web page.\n\n"
            f"Web Page URL: {url}\n"
            f"Domain: {domain}\n\n"
            f"IMPORTANT: Focus ONLY on the main topic, subject matter, or key information from the page content.\n"
            f"DO NOT discuss website navigation, URL structure, or how the website is organized.\n\n"
            f"Page Content:\n{content[:3000]}...\n\n"
            f"Requirements:\n"
            f"- Create a natural conversation between two people discussing the MAIN TOPIC of the webpage.\n"
            f"- Person A should explain the key concepts, facts, or information from the content.\n"
            f"- Person B should ask questions about the topic and show interest in learning.\n"
            f"- Focus on the actual subject matter, not website features.\n"
            f"- Include 5-8 exchanges that cover the main points of the content.\n"
            f"- Make it educational and engaging about the topic itself.\n"
            f"- Keep each response concise (1-2 sentences).\n"
            f"- Avoid discussing website navigation, menus, or URL structure.\n"
            f"- Focus on what the page is ABOUT, not how the website works.\n"
        )
        
        script_response = gemini.generate_script(prompt)
        
        # Handle the script response - it could be a JSON string or already a dict
        if isinstance(script_response, str):
            try:
                # Try to parse as JSON
                script = json.loads(script_response)
            except json.JSONDecodeError:
                # If it's not valid JSON, create a fallback script
                script = {
                    "person_a": [f"I found some interesting content from {domain}."],
                    "person_b": ["Tell me more about what you discovered."]
                }
        else:
            # If it's already a dict, use it directly
            script = script_response
        
        return script if script else {
            "person_a": [f"I found some interesting content from {domain}."],
            "person_b": ["Tell me more about what you discovered."]
        }
        
    except Exception as e:
        print(f"Error generating script from URL: {e}")
        return {
            "person_a": ["I encountered an error while processing that URL."],
            "person_b": ["Let's try a different approach or URL."]
        }

@router.post("/process-url")
async def process_url_endpoint(url: str = Body(..., embed=True)):
    """
    Process a URL to extract content and generate summary, script, and audio.
    """
    print(f"=== PROCESSING URL: {url} ===")
    
    try:
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            return {"error": "Invalid URL. Must start with http:// or https://"}
        
        # Extract domain for topic
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        topic = f"Content from {domain}"
        
        print(f"Processing URL: {url}")
        print(f"Domain: {domain}")
        
        # Generate summary
        print("Generating summary...")
        summary = generate_summary_from_url(url)
        print(f"Summary generated: {summary[:100]}..." if summary else "No summary generated")
        
        # Generate script
        print("Generating script...")
        script = generate_script_from_url(url)
        print(f"Script generated: {len(script.get('person_a', []))} exchanges")
        
        # Generate audio from script
        print("Generating audio...")
        audio_data = None
        line_timings = []
        
        if script and (script.get('person_a') or script.get('person_b')):
            try:
                # Combine script into a single text for TTS
                combined_text = ""
                current_time = 0
                
                for i, line in enumerate(script.get('person_a', [])):
                    combined_text += f"Person A: {line}\n"
                    line_timings.append({
                        "line": f"Person A: {line}",
                        "start_time": current_time,
                        "end_time": current_time + len(line) * 0.1,  # Rough estimate
                        "speaker": "person_a"
                    })
                    current_time += len(line) * 0.1
                
                for i, line in enumerate(script.get('person_b', [])):
                    combined_text += f"Person B: {line}\n"
                    line_timings.append({
                        "line": f"Person B: {line}",
                        "start_time": current_time,
                        "end_time": current_time + len(line) * 0.1,  # Rough estimate
                        "speaker": "person_b"
                    })
                    current_time += len(line) * 0.1
                
                # Generate audio using TTS service
                audio_data = gemini_tts.text_to_speech(json.dumps(script))
                print(f"Audio generated: {audio_data}")
                
                # Handle the audio result
                if isinstance(audio_data, dict) and audio_data.get("status") == "success":
                    audio_url = f"https://conversation-m77i.onrender.com/temp_audio/{os.path.basename(audio_data['path'])}"
                    print(f"Audio URL: {audio_url}")
                else:
                    audio_url = None
                    print("Audio generation failed")
                
            except Exception as e:
                print(f"Error generating audio: {e}")
                audio_data = None
        
        # Create response data
        response_data = {
            "topic": topic,
            "script": script,
            "summary": summary,
            "audio": audio_url,
            "line_timings": line_timings,
            "metadata": {
                "url": url,
                "domain": domain,
                "content_type": "web_page"
            },
            "key_topics": [domain],
            "extracted_text_length": len(extract_content_from_url(url)) if not extract_content_from_url(url).startswith("Error") else 0
        }
        
        print(f"URL processing completed successfully")
        return response_data
        
    except Exception as e:
        print(f"Error processing URL: {e}")
        return {"error": f"Failed to process URL: {str(e)}"}

@router.get("/test-url")
async def test_url_endpoint():
    """
    Test endpoint for URL processing functionality.
    """
    return {
        "message": "URL processing endpoint is working",
        "endpoints": {
            "process_url": "POST /process-url",
            "test_url": "GET /test-url"
        },
        "example_usage": {
            "url": "https://example.com",
            "method": "POST",
            "body": {"url": "https://example.com"}
        }
    } 