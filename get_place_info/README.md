# City Places Explorer

An interactive web application that allows users to explore famous places in different cities. Built with FastAPI and Streamlit.

## Features

- Select from a list of major cities
- Choose from various categories (restaurants, hotels, schools, etc.)
- View top 10 places in each category with details:
  - Name
  - Location
  - Rating
  - Contact information

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

4. In a new terminal, start the frontend:
```bash
cd frontend
streamlit run app.py
```

5. Open your browser and navigate to:
```
http://localhost:8501
```

## Project Structure

```
.
├── backend/
│   └── main.py          # FastAPI backend
├── frontend/
│   └── app.py           # Streamlit frontend
├── requirements.txt     # Project dependencies
└── README.md           # This file
```

## API Endpoints

- `GET /cities`: Get list of available cities
- `GET /categories/{city}`: Get categories for a specific city
- `POST /places`: Get places for a city and category

## Technologies Used

- FastAPI (Backend)
- Streamlit (Frontend)
- Python 3.8+
- HTTPX (Async HTTP client) 