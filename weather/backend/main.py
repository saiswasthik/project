from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv
import uvicorn
import asyncio

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# Configure Gemini if API key is available
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Weather API", description="Weather forecast API with AI-generated reports")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-weather-prediction.vercel.app"],  # In local host"http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_weather(city):
    if not WEATHER_API_KEY:
        return {"error": "Weather API key not configured. Please add WEATHER_API_KEY to your .env file."}
    
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "city": city,
            "temperature": round(data["main"]["temp"], 1), 
            "temp_min": round(data["main"]["temp_min"], 1),
            "temp_max": round(data["main"]["temp_max"], 1),
            "condition": data["weather"][0]["description"],
            "feels_like": round(data["main"]["feels_like"], 1),
            "wind_speed": round(data["wind"]["speed"], 1),
            "humidity": data["main"]["humidity"]
        }
    else:
        return {"error": f"Could not fetch weather for {city}. Ensure the city name is correct."}

def get_weekly_forecast(city):
    if not WEATHER_API_KEY:
        return {"error": "Weather API key not configured. Please add WEATHER_API_KEY to your .env file."}
    
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": f"Could not fetch weekly forecast for {city}."}

    data = response.json()
    daily_forecasts = {}

    for entry in data["list"]:
        date = entry["dt_txt"].split(" ")[0]
        if date not in daily_forecasts:
            daily_forecasts[date] = {
                "temps_min": [],
                "temps_max": [],
                "conditions": {},
                "pops": []
            }
        
        daily_forecasts[date]["temps_min"].append(entry["main"]["temp_min"])
        daily_forecasts[date]["temps_max"].append(entry["main"]["temp_max"])
        
        condition = entry["weather"][0]["description"]
        daily_forecasts[date]["conditions"][condition] = daily_forecasts[date]["conditions"].get(condition, 0) + 1
        
        if "pop" in entry:
            daily_forecasts[date]["pops"].append(entry["pop"])

    processed_forecast = []
    # Sort dates to ensure chronological order
    for date in sorted(daily_forecasts.keys()):
        day_data = daily_forecasts[date]
        
        # Find the most frequent condition for the day
        most_common_condition = max(day_data["conditions"], key=day_data["conditions"].get)

        processed_forecast.append({
            "date": date,
            "temp_min": round(min(day_data["temps_min"])),
            "temp_max": round(max(day_data["temps_max"])),
            "condition": most_common_condition,
            "pop": round(max(day_data["pops"]) * 100) if day_data["pops"] else 0, # Convert to percentage
        })

    from datetime import datetime
    today_str = datetime.utcnow().strftime('%Y-%m-%d')
    
    # Filter out today's forecast and take the next 5 days
    final_forecast = [f for f in processed_forecast if f['date'] != today_str][:5]
    
    return final_forecast

def generate_weather_report(city):
    current_weather = get_current_weather(city)
    weekly_forecast = get_weekly_forecast(city)

    if "error" in current_weather:
        return {"error": f"Unable to fetch current weather data for {city}. Please check the city name and API keys."}
    if "error" in weekly_forecast:
         # Still return current weather if forecast fails
        return {
            "city": city,
            "current_weather": current_weather,
            "forecast": [],
            "report": "Could not retrieve 5-day forecast."
        }


    # The original forecast data included min/max temps, let's format it for the text report
    forecast_str = "\n".join(
        [f"📅 {day['date']}: High {day['temp_max']}°C, Low {day['temp_min']}°C - {day['condition']}" for day in weekly_forecast]
    )

    prompt = f"""
    You are a professional weather assistant. Generate a concise, engaging weather report based on the data below.
    Keep it friendly and easy to read.
    
    **Current Weather in {city}**:
    - Temperature: {current_weather['temperature']}°C (Feels like: {current_weather['feels_like']}°C)
    - Condition: {current_weather['condition']}
    - Wind: {current_weather['wind_speed']} km/h
    - Humidity: {current_weather['humidity']}%

    **5-Day Forecast for {city}**:
    {forecast_str}
    """

    try:
        if not GEMINI_API_KEY:
             # Create a simple, non-AI report
            simple_report = (
                f"**Current Weather:** {current_weather['temperature']}°C and {current_weather['condition']}. "
                f"Feels like {current_weather['feels_like']}°C.\n"
                f"**Forecast:**\n{forecast_str}"
            )
            return {
                "city": city,
                "current_weather": current_weather,
                "forecast": weekly_forecast,
                "report": simple_report
            }
        
        model = genai.GenerativeModel("gemini-1.5-flash") # Using 1.5-flash as it's often available and efficient 
        response = model.generate_content(prompt)
        return {
            "city": city,
            "current_weather": current_weather,
            "forecast": weekly_forecast,
            "report": response.text
        }
    except Exception as e:
        return {"error": f"Error generating weather report: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "Weather API is running! Use /weather/{city} to get weather data."}

# @app.get("/weather/{city}")
# async def weather_report(city: str):
#     return generate_weather_report(city)


@app.get("/weather/{city}")
async def weather_report(city: str):
    return await asyncio.to_thread(generate_weather_report, city)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
