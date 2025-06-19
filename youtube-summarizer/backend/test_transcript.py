#!/usr/bin/env python3
"""
Test script to check YouTube transcript API functionality
"""

import os
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi

# Load environment variables
load_dotenv()

def test_transcript_api():
    """Test the YouTube transcript API with a known video"""
    
    # Test with a popular video that should have transcripts
    test_video_id = "dQw4w9WgXcQ"  # Rick Astley - Never Gonna Give You Up
    
    print(f"Testing transcript API with video ID: {test_video_id}")
    
    try:
        # Try to get transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(test_video_id, languages=['en'])
        
        if transcript_list:
            print("✅ Successfully retrieved transcript!")
            print(f"Number of transcript entries: {len(transcript_list)}")
            
            # Show first few entries
            for i, entry in enumerate(transcript_list[:3]):
                print(f"Entry {i+1}: {entry.get('text', 'No text')[:100]}...")
            
            # Combine all text
            full_text = ' '.join([entry.get('text', '') for entry in transcript_list])
            print(f"Total transcript length: {len(full_text)} characters")
            
        else:
            print("❌ No transcript entries found")
            
    except Exception as e:
        print(f"❌ Error getting transcript: {str(e)}")
        print(f"Error type: {type(e).__name__}")

if __name__ == "__main__":
    test_transcript_api() 