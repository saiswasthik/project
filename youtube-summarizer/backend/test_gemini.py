#!/usr/bin/env python3
"""
Test script to check Gemini API functionality
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def test_gemini_api():
    """Test the Gemini API"""
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        return
    
    print("✅ GEMINI_API_KEY found")
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        print("✅ Gemini configured successfully")
        
        # Initialize model
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini model initialized successfully")
        
        # Test with a simple prompt
        test_prompt = "Hello! Please respond with 'Gemini API is working correctly!'"
        print(f"Testing with prompt: {test_prompt}")
        
        response = model.generate_content(test_prompt)
        
        if response and hasattr(response, 'text') and response.text:
            print("✅ Gemini API is working!")
            print(f"Response: {response.text}")
        else:
            print("❌ Empty response from Gemini API")
            
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        print(f"Error type: {type(e).__name__}")

if __name__ == "__main__":
    test_gemini_api() 