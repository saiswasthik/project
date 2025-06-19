import os
import re
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
from youtubesearchpython import VideosSearch
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from googleapiclient.discovery import build
import google.generativeai as genai
import time

# Load environment variables
load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not GEMINI_API_KEY or not YOUTUBE_API_KEY:
    raise ValueError("Missing API keys in .env file.")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# FastAPI App
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# YouTube Client
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# Pydantic Models
class Video(BaseModel):
    title: str
    channel: str
    channel_id: str
    video_id: str
    thumbnail: str
    published_at: str
    duration_seconds: Optional[int] = None
    transcript_available: bool = False
    views: int = 0
    likes: int = 0
    comments: int = 0
    subscriber_count: int = 0

class SearchResponse(BaseModel):
    videos: List[Video]
    message: Optional[str] = None

class SummaryRequest(BaseModel):
    video_ids: List[str]
    min_words: Optional[int] = 500
    max_words: Optional[int] = 600

class VideoSummary(BaseModel):
    video_id: str
    title: str
    summary: str
    key_points: List[str] = []
    action_items: List[str] = []
    takeaways: List[str] = []
    actionable_insights: List[str] = []

class SummaryResponse(BaseModel):
    summaries: List[VideoSummary]
    message: Optional[str] = None

# Utility Functions
def parse_duration(duration: str) -> int:
    match = re.match(r'PT(\d+H)?(\d+M)?(\d+S)?', duration)
    if not match:
        return 0
    hours = int(match.group(1)[:-1]) if match.group(1) else 0
    minutes = int(match.group(2)[:-1]) if match.group(2) else 0
    seconds = int(match.group(3)[:-1]) if match.group(3) else 0
    return hours * 3600 + minutes * 60 + seconds

def get_video_transcript(video_id: str) -> str:
    try:
        print(f"Attempting to get transcript for video: {video_id}")
        
        # Try multiple approaches to get the transcript
        transcript_list = None
        error_messages = []
        
        # Method 1: Try with English language
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            print("Successfully retrieved transcript with English language")
        except Exception as e:
            error_msg = f"Method 1 (English) failed: {str(e)}"
            error_messages.append(error_msg)
            print(error_msg)
        
        # Method 2: Try with auto-generated transcripts
        if not transcript_list:
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'], preserve_formatting=True)
                print("Successfully retrieved transcript with auto-generated option")
            except Exception as e:
                error_msg = f"Method 2 (Auto-generated) failed: {str(e)}"
                error_messages.append(error_msg)
                print(error_msg)
        
        # Method 3: Try without language specification
        if not transcript_list:
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
                print("Successfully retrieved transcript without language specification")
            except Exception as e:
                error_msg = f"Method 3 (No language) failed: {str(e)}"
                error_messages.append(error_msg)
                print(error_msg)
        
        # Method 4: Try with different language codes
        if not transcript_list:
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en-US', 'en-GB', 'en'])
                print("Successfully retrieved transcript with multiple language codes")
            except Exception as e:
                error_msg = f"Method 4 (Multiple languages) failed: {str(e)}"
                error_messages.append(error_msg)
                print(error_msg)
        
        # If all methods failed
        if not transcript_list:
            print("All transcript retrieval methods failed")
            print("Error messages:", error_messages)
            
            # Check if it's a specific error type
            for error_msg in error_messages:
                if "TranscriptsDisabled" in error_msg:
                    raise HTTPException(status_code=404, detail="Transcripts are disabled for this video")
                elif "NoTranscriptFound" in error_msg:
                    raise HTTPException(status_code=404, detail="No transcript found for this video")
                elif "VideoUnavailable" in error_msg:
                    raise HTTPException(status_code=404, detail="Video is unavailable or private")
                elif "no element found" in error_msg.lower():
                    raise HTTPException(status_code=404, detail="Transcript parsing error - video may not have captions")
            
            raise HTTPException(status_code=404, detail=f"Could not retrieve video transcript. Errors: {'; '.join(error_messages)}")
        
        # Extract text from transcript entries
        if not isinstance(transcript_list, list):
            raise HTTPException(status_code=404, detail="Invalid transcript format received")
        
        transcript_text = ""
        for entry in transcript_list:
            if isinstance(entry, dict) and 'text' in entry:
                transcript_text += entry['text'] + " "
        
        transcript_text = transcript_text.strip()
        
        if not transcript_text:
            raise HTTPException(status_code=404, detail="Transcript is empty or contains no text")
        
        print(f"Successfully retrieved transcript with {len(transcript_text)} characters")
        
        # Truncate transcript if it's too long (Gemini has a token limit)
        if len(transcript_text) > 30000:
            print(f"Transcript too long ({len(transcript_text)} chars), truncating to 30000 chars")
            transcript_text = transcript_text[:30000]
            print(f"Final transcript length: {len(transcript_text)} chars")
            
        return transcript_text
        
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        print(f"Unexpected error getting transcript: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(status_code=404, detail=f"Could not retrieve video transcript: {str(e)}")

def generate_summary_with_gemini(transcript: str, min_words: Optional[int] = None, max_words: Optional[int] = None) -> dict:
    def create_prompt(target_words: int = None) -> str:
        # Check if this is a fallback case (title + description only)
        is_fallback = "Title:" in transcript and "Description:" in transcript and len(transcript) < 5000
        
        if is_fallback:
            base_prompt = f"""
Please analyze this YouTube video information and provide a comprehensive summary based on the available content. Focus on the main subject matter and key information.

Requirements:
1. A detailed summary that captures the essential points and main takeaways
2. 5 key points that highlight the most important aspects
3. 3-5 actionable items or takeaways
4. 3-5 final takeaways (conclusions and recommendations)
5. 3-5 actionable insights (if applicable)

Guidelines:
- Focus on the main topic and relevant information
- Include specific details, examples, and explanations
- Ensure the summary is coherent and well-structured
- Avoid irrelevant information or tangents
- Note: This summary is based on video title and description only, as transcript was not available
"""
        else:
            base_prompt = f"""
Please analyze this YouTube video transcript and provide a comprehensive, topic-focused summary. Focus on the main subject matter and key information.

Requirements:
1. A detailed summary that captures the essential points and main takeaways
2. 5 key points that highlight the most important aspects
3. 3-5 actionable items or takeaways
4. 3-5 final takeaways (conclusions and recommendations)
5. 3-5 actionable insights (if applicable)

Guidelines:
- Focus on the main topic and relevant information
- Include specific details, examples, and explanations
- Ensure the summary is coherent and well-structured
- Avoid irrelevant information or tangents
"""
        
        if target_words:
            base_prompt += f"\nIMPORTANT: The summary MUST be approximately {target_words} words long. "
            base_prompt += "Expand on the details and examples to reach this length while maintaining quality and relevance."

        base_prompt += f"""

Content: {transcript}

IMPORTANT: Respond ONLY with a valid JSON object in this exact format:
{{
    "summary": "Your detailed, topic-focused summary here",
    "key_points": [
        "Key point 1",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5"
    ],
    "action_items": [
        "Action item 1",
        "Action item 2",
        "Action item 3"
    ],
    "takeaways": [
        "Takeaway 1",
        "Takeaway 2",
        "Takeaway 3"
    ],
    "actionable_insights": [
        "Actionable insight 1",
        "Actionable insight 2",
        "Actionable insight 3"
    ]
}}
    """
        return base_prompt

    def adjust_summary_length(summary_data: dict, min_words: int, max_words: int) -> dict:
        """Adjust the summary length to be within the specified word count range."""
        summary = summary_data["summary"]
        words = summary.split()
        word_count = len(words)
        
        if word_count < min_words:
            # If summary is too short, add more details from key points
            print(f"Summary too short ({word_count} words), adding more details...")
            additional_points = summary_data["key_points"][:3]  # Take first 3 key points
            for point in additional_points:
                if len(words) >= min_words:
                    break
                summary += f"\n\nAdditional Detail: {point}"
                words = summary.split()
                word_count = len(words)
        
        elif word_count > max_words:
            # If summary is too long, trim it while preserving complete sentences
            print(f"Summary too long ({word_count} words), trimming...")
            sentences = summary.split('. ')
            new_summary = []
            current_word_count = 0
            
            for sentence in sentences:
                sentence_words = sentence.split()
                if current_word_count + len(sentence_words) <= max_words:
                    new_summary.append(sentence)
                    current_word_count += len(sentence_words)
                else:
                    break
            
            summary = '. '.join(new_summary) + '.'
            word_count = len(summary.split())
        
        summary_data["summary"] = summary
        return summary_data

    def generate_with_prompt(prompt: str) -> dict:
        # Initialize Gemini model
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            print("Gemini model initialized successfully")
        except Exception as e:
            print(f"Error initializing Gemini model: {str(e)}")
            raise ValueError(f"Failed to initialize Gemini model: {str(e)}")
        
        max_retries = 3
        base_delay = 2  # Base delay in seconds
        max_delay = 30  # Maximum delay in seconds

        for attempt in range(max_retries):
            try:
                print(f"Attempting Gemini API call (attempt {attempt + 1}/{max_retries})")
                
                # Generate content with Gemini
                response = model.generate_content(prompt)
                
                print(f"Gemini response received: {type(response)}")
                print(f"Response has text: {hasattr(response, 'text')}")
                
                if response and hasattr(response, 'text') and response.text:
                    content = response.text.strip()
                    print(f"Raw response content: {content[:200]}...")  # Log first 200 chars for debugging
                    
                    # Clean up the response content
                    content = re.sub(r"^```json\s*|\s*```$", "", content).strip()
                    content = re.sub(r"^\{|\}$", "", content).strip()
                    
                    # Try to parse the content as JSON
                    try:
                        # First try direct JSON parsing
                        summary_data = json.loads(content)
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {str(e)}")
                        # If that fails, try to extract JSON-like structure
                        try:
                            # Extract summary
                            summary_match = re.search(r'"summary":\s*"([^"]*)"', content)
                            if not summary_match:
                                raise ValueError("Could not find summary in response")
                            summary = summary_match.group(1)
                            
                            # Extract key points
                            key_points_match = re.search(r'"key_points":\s*\[(.*?)\]', content, re.DOTALL)
                            if not key_points_match:
                                raise ValueError("Could not find key points in response")
                            key_points = [point.strip().strip('"') for point in key_points_match.group(1).split(',')]
                            
                            # Extract action items
                            action_items_match = re.search(r'"action_items":\s*\[(.*?)\]', content, re.DOTALL)
                            if not action_items_match:
                                raise ValueError("Could not find action items in response")
                            action_items = [item.strip().strip('"') for item in action_items_match.group(1).split(',')]
                            
                            # Extract takeaways
                            takeaways_match = re.search(r'"takeaways":\s*\[(.*?)\]', content, re.DOTALL)
                            if not takeaways_match:
                                raise ValueError("Could not find takeaways in response")
                            takeaways = [takeaway.strip().strip('"') for takeaway in takeaways_match.group(1).split(',')]
                            
                            # Extract actionable insights
                            actionable_insights_match = re.search(r'"actionable_insights":\s*\[(.*?)\]', content, re.DOTALL)
                            if not actionable_insights_match:
                                raise ValueError("Could not find actionable insights in response")
                            actionable_insights = [insight.strip().strip('"') for insight in actionable_insights_match.group(1).split(',')]
                            
                            summary_data = {
                                "summary": summary,
                                "key_points": key_points,
                                "action_items": action_items,
                                "takeaways": takeaways,
                                "actionable_insights": actionable_insights
                            }
                        except Exception as e:
                            print(f"Failed to parse response content: {str(e)}")
                            raise ValueError(f"Failed to parse response content: {str(e)}")

                    # Validate the summary data
                    if not isinstance(summary_data, dict):
                        raise ValueError("Response is not a dictionary")

                    required_keys = ["summary", "key_points", "action_items", "takeaways", "actionable_insights"]
                    if not all(key in summary_data for key in required_keys):
                        raise ValueError(f"Missing required keys in summary data. Found: {list(summary_data.keys())}")

                    # Clean up the data
                    summary_data["summary"] = summary_data["summary"].strip()
                    summary_data["key_points"] = [point.strip() for point in summary_data["key_points"] if point.strip()]
                    summary_data["action_items"] = [item.strip() for item in summary_data["action_items"] if item.strip()]
                    summary_data["takeaways"] = [takeaway.strip() for takeaway in summary_data["takeaways"] if takeaway.strip()]
                    summary_data["actionable_insights"] = [insight.strip() for insight in summary_data["actionable_insights"] if insight.strip()]
                    
                    print("Successfully parsed and validated summary data")
                    return summary_data
                else:
                    print(f"Empty or invalid response from Gemini: {response}")
                    raise ValueError("Empty response from Gemini")
                
            except Exception as e:
                print(f"Error in attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:  # Last attempt
                    print(f"Final attempt failed: {str(e)}")
                    raise ValueError(f"Failed to generate summary after {max_retries} attempts: {str(e)}")
                
                delay = min(base_delay * (2 ** attempt), max_delay)
                print(f"Request failed (attempt {attempt + 1}/{max_retries}). Retrying in {delay} seconds...")
                time.sleep(delay)
                continue
        
        raise ValueError(f"Failed to generate summary after {max_retries} attempts")

    try:
        # Set default values if not provided
        if min_words is None:
            min_words = 500
        if max_words is None:
            max_words = 600
            
        # Calculate target word count (middle of the range)
        target_words = (min_words + max_words) // 2
        
        # First attempt with target word count
        summary_data = generate_with_prompt(create_prompt(target_words))
        word_count = len(summary_data["summary"].split())
        print(f"Initial summary word count: {word_count}")

        # If summary is outside the desired range, try again with adjusted target
        if word_count < min_words or word_count > max_words:
            print(f"Summary length ({word_count} words) is outside the required range ({min_words}-{max_words} words)")
            
            # Adjust target based on whether it's too short or too long
            if word_count < min_words:
                # If too short, aim for the middle of the range
                new_target = (min_words + max_words) // 2
            else:
                # If too long, aim for the lower end of the range
                new_target = min_words + (max_words - min_words) // 3
                
            print(f"Retrying with target of {new_target} words")
            summary_data = generate_with_prompt(create_prompt(new_target))
            word_count = len(summary_data["summary"].split())
            print(f"Retry summary word count: {word_count}")
            
            # If still outside range, try one more time with more explicit instructions
            if word_count < min_words or word_count > max_words:
                print(f"Summary still outside range ({word_count} words), making final attempt")
                
                # Create a more explicit prompt
                explicit_prompt = f"""
Please analyze this YouTube video transcript and provide a comprehensive, topic-focused summary.

IMPORTANT REQUIREMENTS:
1. The summary MUST be between {min_words} and {max_words} words long.
2. Include 5 key points that highlight the most important aspects.
3. Include 3-5 actionable items or takeaways.
4. Include 3-5 final takeaways (conclusions and recommendations).
5. Include 3-5 actionable insights (if applicable).

Guidelines:
- Focus on the main topic and relevant information
- Include specific details, examples, and explanations
- Ensure the summary is coherent and well-structured
- Avoid irrelevant information or tangents
- If the summary is too short, expand on the details and examples
- If the summary is too long, focus on the most important points

Transcript: {transcript}

IMPORTANT: Respond ONLY with a valid JSON object in this exact format:
{{
    "summary": "Your detailed, topic-focused summary here",
    "key_points": [
        "Key point 1",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5"
    ],
    "action_items": [
        "Action item 1",
        "Action item 2",
        "Action item 3"
    ],
    "takeaways": [
        "Takeaway 1",
        "Takeaway 2",
        "Takeaway 3"
    ],
    "actionable_insights": [
        "Actionable insight 1",
        "Actionable insight 2",
        "Actionable insight 3"
    ]
}}
"""
                summary_data = generate_with_prompt(explicit_prompt)
                word_count = len(summary_data["summary"].split())
                print(f"Final attempt summary word count: {word_count}")

        # If still outside range, use post-processing to adjust the length
        if word_count < min_words or word_count > max_words:
            print(f"Using post-processing to adjust summary length from {word_count} words")
            summary_data = adjust_summary_length(summary_data, min_words, max_words)
            word_count = len(summary_data["summary"].split())
            print(f"Post-processed summary word count: {word_count}")

        # Validate minimum content
        if word_count < 100:
            raise ValueError("Summary is too short. Please provide more detail.")
        
        print(f"Successfully generated summary with {word_count} words")
        return summary_data

    except Exception as e:
        print(f"Error in generate_summary_with_gemini: {str(e)}")
        raise ValueError(f"Failed to generate summary: {str(e)}")

# Routes
@app.get("/test-gemini")
async def test_gemini():
    """Test endpoint to verify Gemini API is working"""
    try:
        # Test Gemini API
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hello, please respond with 'Gemini API is working!'")
        
        if response and hasattr(response, 'text') and response.text:
            return {"status": "success", "message": "Gemini API is working!", "response": response.text}
        else:
            return {"status": "error", "message": "Empty response from Gemini API"}
            
    except Exception as e:
        return {"status": "error", "message": f"Gemini API test failed: {str(e)}"}

@app.get("/test-transcript/{video_id}")
async def test_transcript(video_id: str):
    """Test endpoint to check if a video has transcripts available"""
    try:
        # Try to get transcript
        transcript = get_video_transcript(video_id)
        return {
            "status": "success", 
            "message": "Transcript available", 
            "transcript_length": len(transcript),
            "preview": transcript[:200] + "..." if len(transcript) > 200 else transcript
        }
    except HTTPException as e:
        return {"status": "error", "message": e.detail}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}

@app.get("/search-videos", response_model=SearchResponse)
async def search_videos(
    query: str = Query(..., description="Search term for YouTube videos"),
    max_results: int = Query(10, ge=1, le=50, description="Number of videos to fetch (1-50)"),
    duration: str = Query("any", description="Filter by video duration (any, short, medium, long)"),
    min_subscribers: int = Query(6000, description="Minimum number of channel subscribers")
):
    try:
        # Handle empty query
        if not query or query.strip() == "":
            return SearchResponse(videos=[], message="Please enter a search term")
            
        print(f"Searching for: {query}")
        print(f"Max results: {max_results}")
        print(f"Duration filter: {duration}")
        print(f"Minimum subscribers: {min_subscribers}")
        
        # Request more videos initially to ensure we have enough after filtering
        search_multiplier = 5
        search_results = max_results * search_multiplier
        
        # Search for videos using YouTube Data API
        search_response = youtube.search().list(
            q=query,
            part="snippet",
            maxResults=search_results,
            type="video",
            videoDefinition="high",
            relevanceLanguage="en",
            order="relevance"
        ).execute()

        print(f"Search response items count: {len(search_response.get('items', []))}")
        
        if not search_response.get('items'):
            print("No items found in search response")
            return SearchResponse(videos=[], message="No videos found")

        # Get video IDs and channel IDs
        video_ids = []
        channel_ids = set()
        for item in search_response['items']:
            video_ids.append(item['id']['videoId'])
            channel_ids.add(item['snippet']['channelId'])
        
        # Get channel information
        channels_response = youtube.channels().list(
            part="statistics",
            id=','.join(channel_ids)
        ).execute()
        
        # Create a map of channel IDs to subscriber counts
        channel_subscribers = {}
        for channel in channels_response.get('items', []):
            channel_subscribers[channel['id']] = int(channel['statistics'].get('subscriberCount', 0))
        
        # Process videos in batches to avoid API limits
        batch_size = 50
        all_videos = []
        seen_video_ids = set()
        
        for i in range(0, len(video_ids), batch_size):
            batch_ids = video_ids[i:i+batch_size]
        
        # Get video details including duration and statistics
        videos_response = youtube.videos().list(
            part="snippet,contentDetails,statistics",
                id=','.join(batch_ids)
        ).execute()
        
        for item in videos_response.get('items', []):
            try:
                video_id = item['id']
                
                # Skip if we've already seen this video
                if video_id in seen_video_ids:
                    continue
                
                seen_video_ids.add(video_id)
                
                snippet = item['snippet']
                content_details = item['contentDetails']
                statistics = item.get('statistics', {})
                
                # Get channel subscriber count
                channel_id = snippet['channelId']
                subscriber_count = channel_subscribers.get(channel_id, 0)
                
                # Skip videos from channels with fewer subscribers than the threshold
                if subscriber_count < min_subscribers:
                    continue
                
                # Parse duration
                duration_str = content_details.get('duration', 'PT0S')
                duration_seconds = parse_duration(duration_str)
                
                # Check if video matches duration filter
                if duration != "any":
                    print(f"Filtering video {video_id} with duration {duration_seconds}s against filter {duration}")
                    print(f"Filtering video {video_id} with duration {duration_seconds}s against filter {duration}")
                    if duration == "short" and (duration_seconds < 60 or duration_seconds >= 300):  # 1-5 minutes
                        print(f"Skipping video {video_id} - duration {duration_seconds}s not in short range (1-5 min)")
                        continue
                    elif duration == "medium" and (duration_seconds < 300 or duration_seconds >= 1800):  # 5-30 minutes
                        print(f"Skipping video {video_id} - duration {duration_seconds}s not in medium range (5-30 min)")
                        continue
                    elif duration == "long" and duration_seconds < 1800:  # 30+ minutes
                        print(f"Skipping video {video_id} - duration {duration_seconds}s not in long range (>30 min)")
                        continue
                    else:
                        print(f"Including video {video_id} - duration {duration_seconds}s matches filter {duration}")
                
                # Check if transcript is available
                transcript_available = True  # Assume available initially
                
                video = Video(
                    title=snippet['title'],
                    channel=snippet['channelTitle'],
                    channel_id=channel_id,
                    video_id=video_id,
                    thumbnail=snippet['thumbnails']['high']['url'],
                    published_at=snippet['publishedAt'],
                    duration_seconds=duration_seconds,
                    transcript_available=transcript_available,
                    views=int(statistics.get('viewCount', 0)),
                    likes=int(statistics.get('likeCount', 0)),
                    comments=int(statistics.get('commentCount', 0)),
                    subscriber_count=subscriber_count
                )
                all_videos.append(video)
                    
            except Exception as e:
                print(f"Error processing video {video_id}: {str(e)}")
                continue
        
        # Sort videos by publication date (most recent first)
        all_videos.sort(key=lambda x: x.published_at, reverse=True)
        
        # Take only the requested number of videos
        videos = all_videos[:max_results]
        
        # If we still don't have enough videos, try a broader search
        if len(videos) < max_results and len(query.split()) > 1:
            # Try with a broader query (remove the last word)
            broader_query = ' '.join(query.split()[:-1])
            print(f"Trying broader search with: {broader_query}")
            
            # Recursively call the search function with the broader query
            broader_results = await search_videos(
                query=broader_query,
                max_results=max_results - len(videos),
                duration=duration,
                min_subscribers=min_subscribers
            )
            
            # Combine the results, avoiding duplicates
            for video in broader_results.videos:
                if video.video_id not in seen_video_ids and len(videos) < max_results:
                    videos.append(video)
                    seen_video_ids.add(video.video_id)
        
        return SearchResponse(videos=videos)
        
    except Exception as e:
        print(f"Error in search_videos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize-videos", response_model=SummaryResponse)
async def summarize_videos(request: SummaryRequest):
    try:
        if not request.video_ids:
            return SummaryResponse(summaries=[], message="No video IDs provided")

        if len(request.video_ids) > 1:
            return SummaryResponse(summaries=[], message="Only one video can be summarized at a time")
        
        video_id = request.video_ids[0]
        min_words = request.min_words
        max_words = request.max_words
        
        print(f"=== Starting summary generation for video: {video_id} ===")
        print(f"Word count range: {min_words}-{max_words}")
        
        try:
            # Get video details
            print("Getting video details...")
            video_response = youtube.videos().list(
                part="snippet",
                id=video_id
            ).execute()
            
            if not video_response.get('items'):
                print("Video not found in YouTube API")
                return SummaryResponse(summaries=[], message="Video not found")
            
            video_title = video_response['items'][0]['snippet']['title']
            video_description = video_response['items'][0]['snippet'].get('description', '')
            print(f"Found video: {video_title}")
            print(f"Video description length: {len(video_description)} characters")
            
            # Get transcript
            transcript = None
            try:
                print("Attempting to get transcript...")
                transcript = get_video_transcript(video_id)
                print(f"Successfully retrieved transcript for video: {video_id}")
                print(f"Transcript length: {len(transcript)} characters")
            except HTTPException as e:
                print(f"HTTP Exception getting transcript: {str(e)}")
                # Try fallback with video title and description
                print("Attempting fallback with video title and description...")
                fallback_content = f"Title: {video_title}\n\nDescription: {video_description}"
                if len(fallback_content) > 100:  # Only use fallback if we have meaningful content
                    transcript = fallback_content
                    print(f"Using fallback content with {len(transcript)} characters")
                else:
                    return SummaryResponse(summaries=[], message=str(e.detail))
            except Exception as e:
                print(f"Unexpected error getting transcript: {str(e)}")
                print(f"Error type: {type(e).__name__}")
                # Try fallback with video title and description
                print("Attempting fallback with video title and description...")
                fallback_content = f"Title: {video_title}\n\nDescription: {video_description}"
                if len(fallback_content) > 100:  # Only use fallback if we have meaningful content
                    transcript = fallback_content
                    print(f"Using fallback content with {len(transcript)} characters")
                else:
                    return SummaryResponse(summaries=[], message=f"Could not retrieve video transcript: {str(e)}")
            
            # Generate summary
            try:
                print("Starting Gemini summary generation...")
                summary_data = generate_summary_with_gemini(transcript, min_words, max_words)
                print(f"Successfully generated summary data for video: {video_id}")
                print(f"Summary length: {len(summary_data.get('summary', ''))} characters")
                print(f"Key points count: {len(summary_data.get('key_points', []))}")
            except Exception as e:
                print(f"Error generating summary: {str(e)}")
                print(f"Error type: {type(e).__name__}")
                return SummaryResponse(summaries=[], message=f"Failed to generate summary: {str(e)}")
            
            # Create summary object
            try:
                summary = VideoSummary(
                    video_id=video_id,
                    title=video_title,
                    summary=summary_data["summary"],
                    key_points=summary_data["key_points"],
                    action_items=summary_data["action_items"],
                    takeaways=summary_data["takeaways"],
                    actionable_insights=summary_data["actionable_insights"]
                )
                
                print(f"Successfully created summary object for video: {video_id}")
                print("=== Summary generation completed successfully ===")
                return SummaryResponse(summaries=[summary])
            except Exception as e:
                print(f"Error creating summary object: {str(e)}")
                return SummaryResponse(summaries=[], message=f"Error creating summary object: {str(e)}")
            
        except Exception as e:
            print(f"Error processing video {video_id}: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            return SummaryResponse(summaries=[], message=f"Error processing video: {str(e)}")
            
    except Exception as e:
        print(f"Top level error in summarize_videos: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=str(e))
