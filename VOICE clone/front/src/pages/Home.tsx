import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  LinearProgress,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Slider,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface VoiceModelDetails {
  name: string;
  sampleDuration: string;
  quality: string;
  status: string;
}

type AppState = 'initial' | 'recording' | 'processing' | 'ready' | 'generating';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'voice-cloning' | 'text-to-speech'>('voice-cloning');
  const [appState, setAppState] = useState<AppState>('initial');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioVisualizerData, setAudioVisualizerData] = useState<number[]>([]);
  const [voiceModelDetails, setVoiceModelDetails] = useState<VoiceModelDetails>({
    name: 'My Voice Clone',
    sampleDuration: '0:00',
    quality: 'N/A',
    status: 'Processing...'
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [inputText, setInputText] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [stability, setStability] = useState(50);
  const [clarity, setClarity] = useState(75);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
    };
  }, []);

  const visualize = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
    }

    const source = audioContextRef.current.createMediaStreamSource(stream);
    if (analyserRef.current) {
      source.connect(analyserRef.current);
    }

    const dataArray = new Uint8Array(analyserRef.current?.frequencyBinCount || 32);
    
    const updateVisualizer = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioVisualizerData(Array.from(dataArray).map(value => value / 255));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      }
    };

    updateVisualizer();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      visualize(stream);

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        handleUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAppState('processing');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleUpload = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Update voice model details
      setVoiceModelDetails({
        name: 'My Voice Clone',
        sampleDuration: formatTime(audioBlob.size / (16000 * 2)), // Approximate duration
        quality: 'High',
        status: 'Processing...'
      });

      // Start progress simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setProcessingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setVoiceModelDetails(prev => ({
            ...prev,
            status: 'Ready'
          }));
          // Automatically switch to text-to-speech tab after processing
          setTimeout(() => {
            setIsProcessing(false);
            setCurrentTab('text-to-speech');
          }, 500); // Small delay for smooth transition
        }
      }, 100);

    } catch (err) {
      setError('Error uploading audio. Please try again.');
      setIsProcessing(false);
      setVoiceModelDetails(prev => ({
        ...prev,
        status: 'Error'
      }));
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current) return;

    if (isPlaying) {
      audioElementRef.current.pause();
    } else {
      audioElementRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePdfUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from PDF');
      }

      const data = await response.json();
      setInputText(data.text);
      setPdfError(null);
    } catch (error) {
      setPdfError('Error processing PDF file. Please try again.');
      console.error('PDF processing error:', error);
    }
  };

  const handleGenerateSpeech = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate speech.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          settings: {
            speed,
            pitch,
            stability,
            clarity
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        audioElementRef.current.onloadedmetadata = () => {
          if (audioElementRef.current) {
            setDuration(audioElementRef.current.duration);
          }
        };
        audioElementRef.current.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        audioElementRef.current.ontimeupdate = () => {
          if (audioElementRef.current) {
            setCurrentTime(audioElementRef.current.currentTime);
          }
        };
      }
      
      setAudioUrl(audioUrl);
      setIsPlaying(false);
      setCurrentTime(0);
      setIsGenerating(false);
    } catch (error) {
      setError('Error generating speech. Please try again.');
      setIsGenerating(false);
      console.error('Speech generation error:', error);
    }
  };

  const handleReset = () => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="md">
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ 
            color: '#fff', 
            mb: 1, 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', md: '2rem' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <VolumeUpIcon sx={{ color: '#7C3AED' }} />
            Echo.ai
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontStyle: 'italic'
          }}>
            Echo your voice for your documents
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: 2,
              p: 0.5,
              transition: 'all 0.3s ease'
            }}
          >
            <Tabs 
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none'
                },
                '& .MuiTab-root': {
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Tab 
                value="voice-cloning"
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    color: currentTab === 'voice-cloning' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease'
                  }}>
                    <MicIcon fontSize="small" />
                    Voice Cloning
                  </Box>
                }
                sx={{
                  bgcolor: currentTab === 'voice-cloning' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  borderRadius: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: currentTab === 'voice-cloning' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                  }
                }}
              />
              <Tab 
                value="text-to-speech"
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    color: currentTab === 'text-to-speech' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease'
                  }}>
                    <DescriptionIcon fontSize="small" />
                    Text-to-Speech
                  </Box>
                }
                sx={{
                  bgcolor: currentTab === 'text-to-speech' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  borderRadius: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: currentTab === 'text-to-speech' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                  }
                }}
              />
            </Tabs>
          </Paper>
        </Box>

        <Box sx={{ 
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.3s ease',
          ...(isProcessing && {
            opacity: 0.7,
            pointerEvents: 'none'
          })
        }}>
          {currentTab === 'voice-cloning' && (
            <>
              <Typography variant="h4" align="center" sx={{ 
                color: '#fff', 
                mb: 2, 
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}>
                Create Your Voice Clone
              </Typography>
              <Typography variant="body1" align="center" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}>
                Upload or record a clear voice sample (30-60 seconds) to create your AI voice clone
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                    color: '#ff5252',
                    '& .MuiAlert-icon': {
                      color: '#ff5252'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(66.666% - 12px)' } }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 3, md: 4 },
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    {appState === 'initial' && !audioUrl && (
                      <Box sx={{ 
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.5)', mb: 1 }} />
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Record or upload a voice sample (30-60 seconds)
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                          WAV, MP3, or M4A format
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={startRecording}
                            sx={{
                              bgcolor: '#7C3AED',
                              color: '#fff',
                              '&:hover': {
                                bgcolor: '#6D28D9'
                              },
                              textTransform: 'none',
                              borderRadius: '50px',
                              px: 4,
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 500
                            }}
                            startIcon={<MicIcon />}
                          >
                            Start Recording
                          </Button>
                          <Button
                            variant="outlined"
                            component="label"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                bgcolor: 'rgba(255, 255, 255, 0.05)'
                              },
                              textTransform: 'none',
                              borderRadius: '50px',
                              px: 4
                            }}
                          >
                            Upload File
                            <input
                              type="file"
                              hidden
                              accept="audio/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setAudioUrl(url);
                                  handleUpload(file);
                                }
                              }}
                            />
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {isRecording && (
                      <Box sx={{ 
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <Box sx={{ display: 'flex', gap: 1, height: 100, alignItems: 'center' }}>
                          {audioVisualizerData.map((value, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 3,
                                height: `${value * 100}%`,
                                bgcolor: '#7C3AED',
                                transition: 'height 0.1s'
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          00:03
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={stopRecording}
                          sx={{
                            bgcolor: '#DC2626',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#B91C1C'
                            },
                            textTransform: 'none',
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 500
                          }}
                          startIcon={<StopIcon />}
                        >
                          Stop Recording
                        </Button>
                      </Box>
                    )}

                    {audioUrl && !isProcessing && (
                      <Box>
                        <Box sx={{ 
                          height: 200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: 2
                        }}>
                          <VolumeUpIcon sx={{ fontSize: 48, color: '#7C3AED' }} />
                          <Box sx={{ width: '100%', maxWidth: 400 }}>
                            <Box sx={{ 
                              height: 4, 
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: 2,
                              position: 'relative',
                              mb: 1
                            }}>
                              <Box sx={{ 
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${(currentTime / duration) * 100}%`,
                                bgcolor: '#7C3AED',
                                borderRadius: 2,
                                transition: 'width 0.1s linear'
                              }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                {formatTime(currentTime)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                {formatTime(duration)}
                              </Typography>
                            </Box>
                          </Box>
                          <audio
                            ref={audioElementRef}
                            src={audioUrl || ''}
                            onTimeUpdate={() => {
                              if (audioElementRef.current) {
                                setCurrentTime(audioElementRef.current.currentTime);
                              }
                            }}
                            onLoadedMetadata={() => {
                              if (audioElementRef.current) {
                                setDuration(audioElementRef.current.duration);
                              }
                            }}
                            onEnded={() => setIsPlaying(false)}
                          />
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <IconButton
                              onClick={togglePlayback}
                              sx={{
                                bgcolor: '#7C3AED',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: '#6D28D9'
                                },
                                width: 48,
                                height: 48,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton
                              onClick={handleReset}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                '&:hover': {
                                  color: '#fff',
                                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              <ReplayIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setAudioUrl(null);
                                setIsPlaying(false);
                                setCurrentTime(0);
                              }}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                '&:hover': {
                                  color: '#ff5252',
                                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 3, md: 4 },
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      color: '#fff', 
                      mb: 3,
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}>
                      Voice Model Details
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Name:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{voiceModelDetails.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Sample Duration:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{voiceModelDetails.sampleDuration}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Quality:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{voiceModelDetails.quality}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Status:</Typography>
                        <Typography variant="body2" sx={{ 
                          color: voiceModelDetails.status === 'Ready' ? '#10B981' : '#fff'
                        }}>
                          {voiceModelDetails.status}
                        </Typography>
                      </Box>
                    </Box>

                    {isProcessing && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                          Processing your voice sample...
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={processingProgress}
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 1,
                            height: 6,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#7C3AED',
                              borderRadius: 1
                            }
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, textAlign: 'right' }}>
                          {processingProgress}%
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
            </>
          )}

          {currentTab === 'text-to-speech' && (
            <>
              <Typography variant="h4" align="center" sx={{ 
                color: '#fff', 
                mb: 2, 
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}>
                Generate Speech in Your Voice
              </Typography>
              <Typography variant="body1" align="center" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}>
                Enter text or upload a PDF to convert to speech using your cloned voice
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(66.666% - 12px)' } }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 3, md: 4 },
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#fff' }}>Text Input</Typography>
                      <Button
                        startIcon={<DescriptionIcon />}
                        component="label"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            color: '#fff',
                            bgcolor: 'rgba(255, 255, 255, 0.05)'
                          },
                          textTransform: 'none'
                        }}
                      >
                        Import PDF
                        <input
                          type="file"
                          hidden
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handlePdfUpload(file);
                            }
                          }}
                        />
                      </Button>
                    </Box>
                    
                    {pdfError && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 2,
                          bgcolor: 'rgba(211, 47, 47, 0.1)',
                          color: '#ff5252',
                          '& .MuiAlert-icon': {
                            color: '#ff5252'
                          }
                        }}
                      >
                        {pdfError}
                      </Alert>
                    )}

                    <TextField
                      multiline
                      rows={6}
                      placeholder="Enter text to convert to speech..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#7C3AED'
                          }
                        }
                      }}
                    />

                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Speed</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{speed}x</Typography>
                      </Box>
                      <Slider
                        value={speed}
                        onChange={(_, value) => setSpeed(value as number)}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        sx={{
                          color: '#7C3AED',
                          '& .MuiSlider-rail': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 3 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Pitch</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{pitch}x</Typography>
                      </Box>
                      <Slider
                        value={pitch}
                        onChange={(_, value) => setPitch(value as number)}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        sx={{
                          color: '#7C3AED',
                          '& .MuiSlider-rail': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 3 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Stability</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{stability}%</Typography>
                      </Box>
                      <Slider
                        value={stability}
                        onChange={(_, value) => setStability(value as number)}
                        sx={{
                          color: '#7C3AED',
                          '& .MuiSlider-rail': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 3 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Clarity & Quality</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{clarity}%</Typography>
                      </Box>
                      <Slider
                        value={clarity}
                        onChange={(_, value) => setClarity(value as number)}
                        sx={{
                          color: '#7C3AED',
                          '& .MuiSlider-rail': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                          variant="contained"
                          onClick={handleGenerateSpeech}
                          disabled={isGenerating || !inputText.trim()}
                          sx={{
                            bgcolor: '#7C3AED',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#6D28D9'
                            },
                            '&:disabled': {
                              bgcolor: 'rgba(124, 58, 237, 0.5)',
                              color: 'rgba(255, 255, 255, 0.5)'
                            },
                            textTransform: 'none',
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 500
                          }}
                        >
                          {isGenerating ? 'Generating...' : 'Generate Speech'}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 3, md: 4 },
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      color: '#fff', 
                      mb: 3,
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}>
                      Voice Clone Settings
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Voice Model:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>My Voice Clone</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Languages:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>English</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Max Input Length:</Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>5,000 characters</Typography>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ 
                      color: '#fff', 
                      mb: 2,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}>
                      Recent Generations
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontStyle: 'italic' }}>
                      No generations yet
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Container>

      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        p: 2,
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '0.75rem'
      }}>
        © 2024 Echo.ai - AI Voice Cloning Technology
        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.3)' }}>
          This is a demo application. In a real-world implementation, integration with APIs like ElevenLabs would be required.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home; 