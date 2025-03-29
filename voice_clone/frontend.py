
import streamlit as st
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# FastAPI Backend URL
BACKEND_URL = "http://localhost:8000"

# Configure the page
st.set_page_config(
    page_title="Document Reader with Voice Cloning",
    page_icon="📚",
    layout="wide"
)

# Title and description
st.title("📚 Document Reader with Voice Cloning")

st.markdown("""
    This application allows you to:
    1. Upload a PDF document and extract its text
    2. Upload a voice sample to clone
    3. Generate speech from the document text using the cloned voice
""")

# Initialize session state for extracted text
if "extracted_text" not in st.session_state:
    st.session_state["extracted_text"] = ""

col1, col2 = st.columns(2)

with col1:
    st.subheader("📄 Document Upload")
    uploaded_file = st.file_uploader("Upload your PDF document", type=['pdf'])
    
    if uploaded_file is not None and st.button("Process Document"):
        with st.spinner("Processing document..."):
            files = {"file": uploaded_file}
            response = requests.post(f"{BACKEND_URL}/process-pdf", files=files)
            
            if response.status_code == 200:
                st.session_state["extracted_text"] = response.json().get("text", "")
                st.success("✅ Text extracted successfully!")

    # Show the extracted text (persistent across interactions)
    text = st.session_state["extracted_text"]
    st.text_area("Extracted Text", text, height=200)

with col2:
    st.subheader("🎤 Voice Cloning")
    voice_sample = st.file_uploader("Upload voice sample (mp3 format)", type=['mp3'])
    
    if voice_sample is not None and st.session_state["extracted_text"]:
        if st.button("Clone Voice"):
            with st.spinner("Generating speech..."):
                files = {"voice_sample": voice_sample}
                data = {"text": st.session_state["extracted_text"]}
                response = requests.post(f"{BACKEND_URL}/clone-voice", files=files, data=data)
                
                if response.status_code == 200:
                    audio_url = response.json()["audio_url"]
                    st.audio(audio_url, format="audio/mp3")

# Footer
st.markdown("---")
st.markdown("Made with ❤️ using Streamlit, FastAPI, and Groq LLM")
