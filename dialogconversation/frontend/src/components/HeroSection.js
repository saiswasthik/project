import React, { useState, useRef } from 'react';
import PDFUpload from './PDFUpload';
import URLUpload from './URLUpload';

const HeroSection = ({ topic, setTopic, onGenerate, inputMode, setInputMode, onPDFProcessed, onURLProcessed, loading, setLoading, setError }) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setIsRecording(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognized:', transcript);
      setTopic(transcript);
      setIsListening(false);
      setIsRecording(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsRecording(false);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else {
        alert(`Speech recognition error: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      setIsRecording(false);
    };
    
    return recognition;
  };

  const startVoiceInput = () => {
    if (isRecording) return;
    
    recognitionRef.current = initializeSpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50 p-12 text-center mb-8 hover:shadow-xl transition-shadow duration-300 rounded-2xl mx-4">
      <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">AI Learning Companion</div>
      <div className="text-xl text-gray-600 mb-8">Transform any topic into engaging conversations with AI-powered learning experiences</div>
      <div className="flex justify-center space-x-12 mb-8">
        <span className="flex items-center space-x-3 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer px-4 py-2 rounded-lg bg-white/50">
          <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> 
          <span>Interactive Dialogues</span>
        </span>
        <span className="flex items-center space-x-3 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer px-4 py-2 rounded-lg bg-white/50">
          <span className="w-3 h-3 bg-purple-500 rounded-full inline-block"></span> 
          <span>Voice Input</span>
        </span>
        <span className="flex items-center space-x-3 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer px-4 py-2 rounded-lg bg-white/50">
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> 
          <span>PDF Processing</span>
        </span>
      </div>
      
      {/* Input Mode Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setInputMode('text')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              inputMode === 'text'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📝 Text Input
          </button>
          <button
            onClick={() => setInputMode('pdf')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              inputMode === 'pdf'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📄 PDF Upload
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              inputMode === 'url'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🌐 URL Upload
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl shadow-lg p-8 max-w-7xl mx-auto hover:shadow-2xl transition-shadow duration-300">
        {inputMode === 'text' ? (
          <>
            <div className="font-bold text-2xl mb-4 text-blue-700 flex items-center justify-center space-x-3">
              <span>🎤</span>
              <span>Generate Learning Content</span>
            </div>
            <div className="text-gray-500 mb-6">Enter any topic by typing or speaking, then watch AI create an engaging conversation</div>
            <form onSubmit={e => { e.preventDefault(); onGenerate(); }} className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <input
                  className="w-full border border-gray-300 rounded-lg px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 hover:shadow-lg transition-all duration-200 pr-16"
                  placeholder="e.g., Quantum Physics, Machine Learning, Climate Change..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceInput : startVoiceInput}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-lg transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
            
            {/* Voice Input Status */}
            {isListening && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak your topic now</span>
                </div>
              </div>
            )}
            
            <button
              className="w-1/4 bg-gradient-to-r from-purple-600 to-red-400 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center text-center ml-auto justify-end hover:from-purple-700 hover:to-red-500 hover:scale-105 hover:shadow-2xl transition-all duration-200 shadow-lg"
              onClick={onGenerate}
              disabled={!topic.trim()}
            >
              <span>✨</span>
              <span>Generate Conversation</span>
            </button>
          </>
        ) : inputMode === 'pdf' ? (
          <>
            <div className="font-bold text-2xl mb-4 text-blue-700 flex items-center justify-center space-x-3">
              <span>📄</span>
              <span>Upload PDF Document</span>
            </div>
            <div className="text-gray-500 mb-6">Upload a PDF document to extract text, generate summary, and create an engaging conversation</div>
            
            <PDFUpload 
              onPDFProcessed={onPDFProcessed}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
            />
          </>
        ) : (
          <>
            <div className="font-bold text-2xl mb-4 text-blue-700 flex items-center justify-center space-x-3">
              <span>🌐</span>
              <span>Upload URL</span>
            </div>
            <div className="text-gray-500 mb-6">Enter a URL to extract text, generate summary, and create an engaging conversation</div>
            
            <URLUpload 
              onURLProcessed={onURLProcessed}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSection; 