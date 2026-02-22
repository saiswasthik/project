from dotenv import load_dotenv
import os

load_dotenv()


class Config:
    DATABASE_URL =os.getenv("DATABASE_URL")