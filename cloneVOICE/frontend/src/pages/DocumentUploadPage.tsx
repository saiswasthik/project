import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface AudioControls {
  speed: number;
  volume: number;
}

const DocumentUploadPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTextSection, setShowTextSection] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controls, setControls] = useState<AudioControls>({
    speed: 1,
    volume: 1,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      setPdfFile(file);
      setExtractedText('');
      setShowTextSection(false);
    }
  };

  const handleExtractText = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      const response = await fetch('http://localhost:8000/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to extract text from PDF');
      }
      
      const data = await response.json();
      setExtractedText(data.text);
      setShowTextSection(true);
      console.log('Text extracted successfully:', data);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert(`Error extracting text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSpeech = async () => {
    if (!extractedText) {
      alert('Please extract text from the PDF first');
      return;
    }

    const voicePath = localStorage.getItem('voicePath');
    if (!voicePath) {
      alert('No voice model found. Please record your voice first');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/pdf/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          voice_path: voicePath,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate speech');
      }
      
      const data = await response.json();
      console.log('Speech generated successfully:', data);
      
      const url = `http://localhost:8000${data.audio_path}`;
      setAudioUrl(url);
      
      // Create new audio element
      const audio = new Audio(url);
      audioRef.current = audio;
      
      // Set up audio event listeners
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

    } catch (error) {
      console.error('Error generating speech:', error);
      alert(`Error generating speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setControls(prev => ({ ...prev, speed }));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setControls(prev => ({ ...prev, volume }));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-glow">Document Upload</h1>
        
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-white">Upload PDF Document</h2>
          <div className="flex flex-col items-center">
            <button
              onClick={() => document.getElementById('pdf-upload')?.click()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 mb-4 shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            >
              Choose File
            </button>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            {pdfFile && (
              <div className="text-blue-300 mt-2 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600">
                Selected file: {pdfFile.name}
              </div>
            )}
          </div>
          {pdfFile && !showTextSection && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleExtractText}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
              >
                {isLoading ? 'Extracting Text...' : 'Extract Text'}
              </button>
            </div>
          )}
        </div>

        {showTextSection && extractedText && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-white">Extracted Text</h2>
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto border border-gray-700/50">
              <p className="text-gray-300 whitespace-pre-wrap">{extractedText}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleGenerateSpeech}
                disabled={isLoading}
                className={`group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed ${
                  isLoading ? 'pl-12' : ''
                }`}
              >
                {isLoading && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  </div>
                )}
                <div className="relative overflow-hidden">
                  <span className={`inline-block transition-transform duration-300 ${
                    isLoading ? 'translate-y-0 opacity-100' : ''
                  }`}>
                    {isLoading ? 'Generating Speech...' : 'Generate Speech'}
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-white rounded-full animate-bounce"
                            style={{
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '1s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-700/50">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin animate-delay-150" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Generating Speech</h3>
                <p className="text-gray-300 text-center">Please wait while we process your text...</p>
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex flex-col space-y-4">
              {/* Audio Player UI */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex items-center space-x-4 border border-gray-700/50">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-6 h-6 text-white" />
                  ) : (
                    <PlayIcon className="w-6 h-6 text-white" />
                  )}
                </button>

                <div className="flex-1 flex items-center space-x-3">
                  <span className="text-sm text-blue-300 font-medium">{formatTime(currentTime)}</span>
                  <div
                    ref={progressBarRef}
                    className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer relative group"
                    onClick={handleProgressBarClick}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  <span className="text-sm text-blue-300 font-medium">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Speed Control */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={controls.speed}
                      onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500/50 transition-colors duration-200"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-3">
                    <SpeakerWaveIcon className="w-5 h-5 text-blue-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={controls.volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline flex items-center space-x-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to Voice Recording</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage; 