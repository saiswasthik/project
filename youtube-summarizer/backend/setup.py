from setuptools import setup, find_packages

setup(
    name="youtube-summarizer-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.88.0",
        "uvicorn==0.20.0",
        "python-dotenv==0.21.1",
        "requests==2.28.2",
        "youtube-transcript-api==0.6.1",
        "google-api-python-client==2.86.0",
        "google-generativeai==0.2.0",
        "pydantic==1.10.4",
    ],
    python_requires=">=3.8",
) 