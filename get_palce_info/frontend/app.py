import streamlit as st
import requests
import json
from typing import List, Dict, Any
import time
import pandas as pd

# Configure the page
st.set_page_config(
    page_title="City Places Explorer",
    page_icon="🏙️",
    layout="wide"
)

# Constants
BACKEND_URL = "http://localhost:8000"

def fetch_cities() -> List[str]:
    """Fetch available cities from the backend"""
    try:
        response = requests.get(f"{BACKEND_URL}/cities")
        response.raise_for_status()
        return response.json()["cities"]
    except Exception as e:
        st.error(f"Error fetching cities: {str(e)}")
        return []

def fetch_categories(city: str) -> List[str]:
    """Fetch categories for a specific city"""
    try:
        response = requests.get(f"{BACKEND_URL}/categories/{city}")
        response.raise_for_status()
        return response.json()["categories"]
    except Exception as e:
        st.error(f"Error fetching categories: {str(e)}")
        return []

def fetch_places(city: str, category: str) -> List[Dict[str, Any]]:
    """Fetch places for a specific city and category"""
    try:
        with st.spinner(f"Generating information about {category} in {city}..."):
            response = requests.post(
                f"{BACKEND_URL}/places",
                json={"city": city, "category": category}
            )
            response.raise_for_status()
            return response.json()["places"]
    except Exception as e:
        st.error(f"Error fetching places: {str(e)}")
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
            categories = fetch_categories(selected_city)
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
        
        # Fetch and display places
        places = fetch_places(selected_city, selected_category)
        
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
    Built with ❤️ using FastAPI, Streamlit, and Groq LLM
    
    *Note: All information is AI-generated and may not be 100% accurate. Please verify important details.*
    """)

if __name__ == "__main__":
    main() 