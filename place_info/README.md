# City Places Explorer

An AI-powered application that helps users explore famous places in any city using Groq LLM.

## Features

- Enter any city name
- Choose from predefined categories or enter custom categories
- View AI-generated information about top places
- Get location details with Google Maps integration
- Clickable links for viewing locations and getting directions

## Deployment on Streamlit Cloud

1. Fork this repository
2. Go to [Streamlit Cloud](https://share.streamlit.io/)
3. Click "New app"
4. Select your forked repository
5. Set the following:
   - Main file path: `app.py`
   - Python version: 3.9 or higher
6. Add your Groq API key as a secret:
   - Go to app settings
   - Click "Secrets"
   - Add your Groq API key:
     ```toml
     GROQ_API_KEY = "your-api-key-here"
     ```

## Local Development

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with your Groq API key:
   ```
   GROQ_API_KEY=your-api-key-here
   ```
5. Run the app:
   ```bash
   streamlit run app.py
   ```

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key (required)

## Note

All information is AI-generated and may not be 100% accurate. Please verify important details.

## Project Structure

```
.
├── app.py              # Main Streamlit application
├── requirements.txt    # Project dependencies
├── .streamlit/        # Streamlit configuration
│   └── config.toml    # Theme and settings
└── README.md          # This file
```

## API Endpoints

- `