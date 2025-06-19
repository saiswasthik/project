from setuptools import setup, find_packages

setup(
    name="youtube-summarizer-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.78.0",
        "uvicorn==0.17.6",
        "python-dotenv==0.20.0",
        "requests==2.28.1",
        "youtube-transcript-api==0.6.1",
        "google-api-python-client==2.54.0",
        "google-generativeai==0.1.0",
        "pydantic==1.9.1",
    ],
    python_requires=">=3.8",
) 