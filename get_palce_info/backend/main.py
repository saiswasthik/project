from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import groq
import json

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

class PlaceRequest(BaseModel):
    city: str
    category: str

class Place(BaseModel):
    name: str
    location: str
    rating: float
    contact: str

def generate_places_with_groq(city: str, category: str) -> List[Dict[str, Any]]:
    """Generate places information using Groq LLM"""
    prompt = f"""Generate a list of 10 famous {category} in {city}. 
    For each place, provide:
    1. Name of the place
    2. Location (street address or area)
    3. Rating (out of 5.0)
    4. Contact number (in international format)
    
    IMPORTANT: Respond ONLY with a valid JSON array containing objects with these exact keys:
    - name (string)
    - location (string)
    - rating (number between 0 and 5)
    - contact (string)
    
    Example format:
    [
        {{
            "name": "Example Place",
            "location": "123 Main St",
            "rating": 4.5,
            "contact": "+1-234-567-8900"
        }}
    ]
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides accurate information about places in cities. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Get the response text
        response_text = completion.choices[0].message.content.strip()
        
        # Try to find JSON array in the response
        try:
            # First try direct JSON parsing
            places = json.loads(response_text)
        except json.JSONDecodeError:
            # If that fails, try to extract JSON array from the text
            import re
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                places = json.loads(json_match.group())
            else:
                raise ValueError("No valid JSON array found in response")
        
        # Validate and format the data
        formatted_places = []
        for place in places:
            try:
                formatted_places.append(Place(
                    name=str(place.get("name", "Unknown")),
                    location=str(place.get("location", "Address not available")),
                    rating=float(place.get("rating", 0.0)),
                    contact=str(place.get("contact", "Contact not available"))
                ))
            except (ValueError, TypeError) as e:
                print(f"Error formatting place data: {str(e)}")
                continue
        
        if not formatted_places:
            raise ValueError("No valid places were generated")
            
        return formatted_places
        
    except Exception as e:
        print(f"Error generating places with Groq: {str(e)}")
        print(f"Raw response: {response_text if 'response_text' in locals() else 'No response'}")
        return []

@app.get("/cities")
async def get_cities():
    """Get list of available cities"""
    # You can modify this list or fetch from a database
    cities = []
    return {"cities": cities}

@app.get("/categories/{city}")
async def get_categories(city: str):
    """Get categories available for a specific city"""
    # You can modify this list or fetch from a database
    categories = ["restaurants", "hotels", "schools", "colleges", "parks", "museums", "shopping malls", "tourist attractions"]
    return {"categories": categories}

@app.post("/places")
async def get_places(request: PlaceRequest):
    """Get places for a specific city and category using Groq LLM"""
    try:
        # Generate places using Groq
        places = generate_places_with_groq(request.city, request.category)
        
        if not places:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate places information. Please try again."
            )
        
        return {"places": [place.dict() for place in places]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in /places endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 