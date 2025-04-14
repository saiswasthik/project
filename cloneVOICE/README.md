# Voice Cloning and PDF Reader

A full-stack application that clones your voice and uses it to read PDF documents. Built with FastAPI, React, and advanced voice cloning technologies.

## Features

- 🎤 Voice Recording & Upload
  - Record your voice directly in the browser
  - Upload existing voice recordings
  - Support for various audio formats

- 📄 PDF Processing
  - Upload and parse PDF documents
  - Extract text with formatting preserved
  - Support for multiple pages

- 🗣️ Voice Cloning
  - High-quality voice cloning using YourTTS
  - Natural-sounding speech synthesis
  - Multiple voice models support (Coqui-TTS, Bark)
  - Voice analysis and preprocessing

- 🎵 Audio Playback
  - Interactive audio player
  - Playback speed control
  - Volume adjustment
  - Download in MP3/WAV formats

- 💻 Modern UI
  - React + Tailwind CSS
  - Responsive design
  - Dark mode
  - Loading animations
  - Progress indicators

## Tech Stack

### Backend
- FastAPI
- Coqui TTS / Bark
- PyTorch
- Whisper
- FFmpeg

### Frontend
- React
- Tailwind CSS
- Web Audio API
- Heroicons

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- FFmpeg
- Git

### Backend Setup
```bash
# Clone the repository
git clone [repository-url]
cd [repository-name]

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. **Record or Upload Voice**
   - Visit the home page
   - Record a voice sample or upload an audio file
   - Wait for voice analysis to complete

2. **Upload PDF**
   - Navigate to document upload page
   - Upload your PDF file
   - Review extracted text

3. **Generate Speech**
   - Click "Generate Speech"
   - Wait for processing
   - Use the audio player controls
   - Download in preferred format

## API Endpoints

- `POST /api/voice/upload` - Upload voice recording
- `POST /api/pdf/upload` - Upload PDF document
- `POST /api/pdf/read` - Generate speech from text
- `GET /api/voices/{filename}` - Get generated audio

## Environment Variables

Create a `.env` file in the backend directory:

```env
VOICE_MODELS_DIR=models/voice
AUDIO_OUTPUT_DIR=output/audio
MAX_UPLOAD_SIZE=10485760  # 10MB
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Coqui TTS](https://github.com/coqui-ai/TTS)
- [Bark](https://github.com/suno-ai/bark)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/) 