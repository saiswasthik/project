import streamlit as st
import json
from typing import List, Dict, Any
import time
import pandas as pd
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Configure the page
st.set_page_config(
    page_title="City Places Explorer",
    page_icon="🏙️",
    layout="wide"
)

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
                formatted_places.append({
                    "name": str(place.get("name", "Unknown")),
                    "location": str(place.get("location", "Address not available")),
                    "rating": float(place.get("rating", 0.0)),
                    "contact": str(place.get("contact", "Contact not available"))
                })
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

def create_places_table(places: List[Dict[str, Any]]) -> pd.DataFrame:
    """Convert places data to a pandas DataFrame with clickable links"""
    # Create a list of dictionaries with formatted data
    table_data = []
    for place in places:
        location_query = f"{place['name']}, {place['location']}"
        maps_url = f"https://www.google.com/maps/search/?api=1&query={location_query}"
        nav_url = f"https://www.google.com/maps/dir/?api=1&destination={location_query}"
        
        # Create HTML link for location with both view and navigation options
        location_link = f"""
        <a href="{maps_url}" target="_blank">📍 View</a> | 
        <a href="{nav_url}" target="_blank">🚗 Navigate</a>
        """
        
        table_data.append({
            "Name": place['name'],
            "Location": f"{place['location']} {location_link}",
            "Rating": f"⭐ {place['rating']}",
            "Contact": place['contact']
        })
    
    # Create DataFrame
    df = pd.DataFrame(table_data)
    return df

def main():
    # Title and description
    st.title("🏙️ City Places Explorer")
    st.markdown("""
    Explore famous places in different cities. Enter a city and either choose from predefined categories or enter your own custom category.
    """)

    # Create two columns for the dropdowns
    col1, col2 = st.columns(2)

    with col1:
        # Custom city input
        selected_city = st.text_input(
            "Enter City Name",
            placeholder="e.g., Tokyo, Paris, New York, London, Dubai..."
        ).strip()

    with col2:
        # Category selection or custom input
        if selected_city:
            categories = ["Restaurants", "Hotels", "Tourist Attractions", "Shopping Malls", "Parks", "Museums", "Schools", "Hospitals"]
            category_option = st.radio(
                "Choose Category Input Method",
                ["Select from List", "Enter Custom Category"]
            )
            
            if category_option == "Select from List":
                selected_category = st.selectbox(
                    "Select a Category",
                    options=[""] + categories,
                    format_func=lambda x: "Choose a category..." if x == "" else x
                )
            else:
                selected_category = st.text_input(
                    "Enter Custom Category",
                    placeholder="e.g., coffee shops, art galleries, bookstores..."
                ).strip()
        else:
            selected_category = ""

    # Display places if both city and category are selected
    if selected_city and selected_category:
        st.markdown(f"### 📍 Top Places in {selected_city}")
        st.markdown(f"*Showing AI-generated information about {selected_category}*")
        
        # Generate and display places
        places = generate_places_with_groq(selected_city, selected_category)
        
        if places:
            # Create and display the table
            df = create_places_table(places)
            st.markdown(df.to_html(escape=False), unsafe_allow_html=True)
        else:
            st.warning("No places found for the selected criteria.")

    # Add some spacing at the bottom
    st.markdown("<br>" * 2, unsafe_allow_html=True)

    # Footer
    st.markdown("---")
    st.markdown("""
    Built with ❤️ using Streamlit and Groq LLM
    
    *Note: All information is AI-generated and may not be 100% accurate. Please verify important details.*
    """)

if __name__ == "__main__":
    main() 