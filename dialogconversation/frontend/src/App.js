import React, { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { 
  initializeUserData, 
  saveConversation, 
  getUserTopics, 
  getUserSummaries,
  updateUserSummary,
  getUserConversations
} from './services/userDataService';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import LibrarySidebar from './components/LibrarySidebar';
import ConversationView from './components/ConversationView';
import SummarySidebar from './components/SummarySidebar';
import Login from './components/Login';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState([]);
  const [summary, setSummary] = useState(''); // script-based summary
  const [overallSummary, setOverallSummary] = useState(''); // overall summary
  const [history, setHistory] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const [userSummaries, setUserSummaries] = useState([]); // Add this state for user summaries
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProgressive, setShowProgressive] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [lineTimings, setLineTimings] = useState([]); // Store timing for each line
  const audioRef = useRef(null);

  // Load user data when user changes
  const loadUserData = async (userId, email) => {
    setUserDataLoading(true);
    setError('');
    
    try {
      console.log('=== STARTING DATA LOAD ===');
      console.log('Loading data for user:', userId);
      console.log('User email:', email);
      
      // Initialize user data
      console.log('Step 1: Initializing user data...');
      await initializeUserData(userId, email);
      console.log('✓ User data initialized');
      
      // Load user's topics
      console.log('Step 2: Loading user topics...');
      const userTopics = await getUserTopics(userId);
      console.log('Loaded topics:', userTopics);
      console.log('Topics count:', userTopics.length);
      setHistory(userTopics);
      console.log('✓ Topics set to state');
      
      // Load user's conversations
      console.log('Step 3: Loading user conversations...');
      const conversations = await getUserConversations(userId);
      console.log('Loaded conversations:', conversations);
      console.log('Conversations count:', conversations.length);
      setUserConversations(conversations);
      console.log('✓ Conversations set to state');
      
      // Load user's summaries
      console.log('Step 4: Loading user summaries...');
      const summaries = await getUserSummaries(userId);
      console.log('Loaded summaries:', summaries);
      console.log('Summaries count:', summaries.length);
      setUserSummaries(summaries);
      console.log('✓ Summaries set to state');
      
      console.log('=== DATA LOAD COMPLETE ===');
      console.log('Final history state:', userTopics);
      console.log('Final conversations state:', conversations);
      console.log('Final summaries state:', summaries);
      
    } catch (error) {
      console.error('❌ ERROR LOADING USER DATA:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setError(`Failed to load user data: ${error.message}`);
    } finally {
      setUserDataLoading(false);
      console.log('Data loading finished, loading state set to false');
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      setUser(user);
      setAuthLoading(false);
      
      if (user) {
        // Load user data when user logs in
        await loadUserData(user.uid, user.email);
      } else {
        // Clear user data when logged out
        console.log('Clearing user data on logout');
        setHistory([]);
        setUserConversations([]);
        setUserSummaries([]);
        setScript([]);
        setSummary('');
        setOverallSummary('');
        setTopic('');
        setAudioUrl(null);
        setError('');
        setCurrentLineIndex(-1);
        setShowProgressive(false);
        setLineTimings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(`Failed to sign out: ${error.message}`);
    }
  };

  const processScript = (scriptObj) => {
    if (scriptObj && scriptObj.person_a && scriptObj.person_b) {
      // Interleave person_a and person_b
      const a = scriptObj.person_a;
      const b = scriptObj.person_b;
      const maxLen = Math.max(a.length, b.length);
      const merged = [];
      for (let i = 0; i < maxLen; i++) {
        if (a[i]) merged.push(a[i]);
        if (b[i]) merged.push(b[i]);
      }
      return merged;
    } else if (Array.isArray(scriptObj)) {
      return scriptObj;
    } else if (typeof scriptObj === 'string') {
      return scriptObj.split('\n');
    }
    return [];
  };

  const fetchOverallSummary = async (topicToSummarize) => {
    try {
      const response = await fetch('http://localhost:8000/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToSummarize }),
      });
      const data = await response.json();
      const summaryText = data.summary || '';
      setOverallSummary(summaryText);
      
      // Save summary to user's data
      if (user) {
        try {
          await updateUserSummary(user.uid, topicToSummarize, summaryText);
          
          // Update local summaries state
          setUserSummaries(prevSummaries => {
            const existingIndex = prevSummaries.findIndex(s => s.topic === topicToSummarize);
            const newSummary = { topic: topicToSummarize, summary: summaryText, updatedAt: new Date() };
            
            if (existingIndex >= 0) {
              // Update existing summary
              const updatedSummaries = [...prevSummaries];
              updatedSummaries[existingIndex] = newSummary;
              return updatedSummaries;
            } else {
              // Add new summary
              return [...prevSummaries, newSummary];
            }
          });
          
        } catch (firebaseError) {
          console.error('Firebase error saving summary:', firebaseError);
          setError(`Failed to save summary: ${firebaseError.message}`);
        }
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setOverallSummary('Could not generate summary.');
      setError(`Failed to generate summary: ${err.message}`);
    }
  };

  const onGenerate = async () => {
    if (!topic.trim() || !user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/generate-dialog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const processedScript = processScript(data.script);
      const summaryText = data.summary || '';
      
      setScript(processedScript);
      setSummary(summaryText);
      
      // Set line timings if provided by backend
      if (data.line_timings && Array.isArray(data.line_timings)) {
        console.log('Received line timings from backend:', data.line_timings);
        setLineTimings(data.line_timings);
      } else {
        console.log('No line timings provided, using fallback timing');
        setLineTimings([]);
      }

      // Handle audio (base64 or URL)
      let audioUrlToSave = null;
      if (data.audio) {
        if (data.audio.startsWith('http')) {
          audioUrlToSave = data.audio;
          setAudioUrl(data.audio);
        } else {
          audioUrlToSave = `data:audio/wav;base64,${data.audio}`;
          setAudioUrl(`data:audio/wav;base64,${data.audio}`);
        }
      } else {
        setAudioUrl(null);
      }

      // Save conversation to user's data - NO FALLBACK
      try {
        console.log('=== SAVING CONVERSATION ===');
        console.log('Saving for user:', user.uid);
        console.log('Topic:', topic);
        console.log('Script length:', processedScript.length);
        console.log('Summary:', summaryText);
        console.log('Audio URL:', audioUrlToSave ? 'Present' : 'None');
        
        await saveConversation(user.uid, topic, processedScript, summaryText, audioUrlToSave);
        console.log('✓ Conversation saved successfully to Firebase');
        
        // Reload user data to get updated history
        console.log('Reloading user data after save...');
        await loadUserData(user.uid, user.email);
        console.log('✓ User data reloaded after save');
        
      } catch (firebaseError) {
        console.error('❌ FIREBASE ERROR SAVING CONVERSATION:', firebaseError);
        console.error('Firebase error details:', {
          message: firebaseError.message,
          code: firebaseError.code,
          stack: firebaseError.stack
        });
        setError(`Failed to save conversation: ${firebaseError.message}`);
        setLoading(false);
        return; // Stop here if Firebase save fails
      }
      
      // Fetch overall summary for the topic
      await fetchOverallSummary(topic);
      
    } catch (err) {
      console.error('Error generating conversation:', err);
      setScript(["Error generating conversation. Please try again."]);
      setSummary('');
      setAudioUrl(null);
      setOverallSummary('');
      setLineTimings([]);
      setError(`Failed to generate conversation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onSelectTopic = async (selectedTopic) => {
    if (!user) return;
    
    setTopic(selectedTopic);
    setLoading(true);
    setError('');
    setCurrentLineIndex(-1); // Reset progressive display
    setShowProgressive(false); // Reset progressive display toggle
    setLineTimings([]); // Clear line timings
    
    try {
      // First, try to find the conversation in user's saved conversations
      const existingConversation = userConversations.find(conv => conv.topic === selectedTopic);
      
      if (existingConversation) {
        console.log('Loading existing conversation for topic:', selectedTopic);
        setScript(existingConversation.script || []);
        setSummary(existingConversation.summary || '');
        setAudioUrl(existingConversation.audioUrl || null);
        
        // Try to load the summary from already loaded summaries
        const topicSummary = userSummaries.find(s => s.topic === selectedTopic);
        if (topicSummary) {
          console.log('Found existing summary for topic:', selectedTopic);
          setOverallSummary(topicSummary.summary);
        } else {
          console.log('No existing summary found, generating new one...');
          // Generate new summary if not found
          await fetchOverallSummary(selectedTopic);
        }
      } else {
        console.log('No existing conversation found for topic:', selectedTopic);
        setScript([]);
        setSummary('');
        setAudioUrl(null);
        setOverallSummary('');
      }
    } catch (error) {
      console.error('Error loading topic:', error);
      setError(`Failed to load topic: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onPlay = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new window.Audio(audioUrl);
      audioRef.current = audio;
      setIsPlaying(true);
      if (showProgressive) {
        setCurrentLineIndex(0); // Reset to first line when starting
      }
      audio.onended = () => {
        setIsPlaying(false);
        if (showProgressive) {
          setCurrentLineIndex(script.length - 1); // Show all lines when finished
        }
      };
      audio.onerror = () => setIsPlaying(false);
      audio.play();
    }
  };

  const onRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      if (showProgressive) {
        setCurrentLineIndex(0); // Reset to first line when restarting
      }
    }
  };

  const onStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (showProgressive) {
        setCurrentLineIndex(-1); // Hide all lines when stopped
      }
    }
  };

  // Debug function to manually reload data
  const handleDebugReload = async () => {
    if (user) {
      console.log('=== MANUAL DEBUG RELOAD ===');
      await loadUserData(user.uid, user.email);
    }
  };

  // Debug function to test progressive display
  const handleTestProgressive = () => {
    if (script.length > 0) {
      console.log('=== TESTING PROGRESSIVE DISPLAY ===');
      console.log('Current line index:', currentLineIndex);
      console.log('Script length:', script.length);
      console.log('Show progressive:', showProgressive);
      
      // Test showing different lines
      const testIndex = Math.min(currentLineIndex + 1, script.length - 1);
      console.log('Setting line index to:', testIndex);
      setCurrentLineIndex(testIndex);
    }
  };

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    if (user) {
      console.log('=== TESTING FIREBASE CONNECTION ===');
      try {
        // Test 1: Check if user document exists
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        console.log('Firebase connection test result:', userDoc.exists() ? 'User document exists' : 'User document does not exist');
        console.log('User document data:', userDoc.data());
        
        // Test 2: Try to write a test document
        console.log('Testing write operation...');
        const testRef = doc(db, 'test', 'connection-test');
        await setDoc(testRef, {
          test: true,
          timestamp: new Date(),
          userId: user.uid
        });
        console.log('✓ Write test successful');
        
        // Test 3: Try to read the test document
        console.log('Testing read operation...');
        const testDoc = await getDoc(testRef);
        console.log('✓ Read test successful:', testDoc.data());
        
        // Test 4: Clean up test document
        console.log('Cleaning up test document...');
        await deleteDoc(testRef);
        console.log('✓ Cleanup successful');
        
        console.log('🎉 ALL FIREBASE TESTS PASSED!');
        
      } catch (error) {
        console.error('❌ FIREBASE CONNECTION TEST FAILED:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
      }
    }
  };

  // Make audioRef and test function accessible globally for debugging
  React.useEffect(() => {
    window.audioRef = audioRef;
    window.testFirebaseConnection = testFirebaseConnection;
    window.toggleProgressiveDisplay = setShowProgressive;
    window.handleTestProgressive = handleTestProgressive;
  }, []);

  // Audio event listeners for progressive display
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!showProgressive || !script.length) return;
      
      // If we have line timings, use them for precise synchronization
      if (lineTimings.length > 0) {
        const currentTime = audio.currentTime;
        
        // Find which line should be visible based on actual timing
        let lineIndex = 0;
        for (let i = 0; i < lineTimings.length; i++) {
          if (currentTime >= lineTimings[i].startTime) {
            lineIndex = i;
          } else {
            break;
          }
        }
        
        console.log('Audio progress with line timings:', {
          currentTime: currentTime.toFixed(2),
          lineIndex: lineIndex,
          currentLineTiming: lineTimings[lineIndex] || 'N/A',
          scriptLength: script.length
        });
        
        setCurrentLineIndex(lineIndex);
        return;
      }
      
      // Fallback to equal time distribution if no line timings available
      const progress = audio.currentTime / audio.duration;
      const totalLines = script.length;
      const timePerLine = audio.duration / totalLines;
      const currentLineTime = audio.currentTime;
      
      // Add a small buffer (0.5 seconds) to show lines slightly before they're spoken
      const bufferTime = 0.5;
      const adjustedTime = Math.max(0, currentLineTime - bufferTime);
      const lineIndex = Math.floor(adjustedTime / timePerLine);
      
      // Ensure we don't go beyond the total lines
      const adjustedLineIndex = Math.min(Math.max(0, lineIndex), totalLines - 1);
      
      console.log('Audio progress (fallback):', {
        currentTime: audio.currentTime.toFixed(2),
        duration: audio.duration.toFixed(2),
        progress: progress.toFixed(3),
        timePerLine: timePerLine.toFixed(2),
        adjustedTime: adjustedTime.toFixed(2),
        lineIndex: lineIndex,
        adjustedLineIndex: adjustedLineIndex,
        scriptLength: script.length
      });
      
      setCurrentLineIndex(adjustedLineIndex);
    };

    const handlePlay = () => {
      if (showProgressive) {
        console.log('Audio started, setting currentLineIndex to 0');
        setCurrentLineIndex(0); // Start from first line
      }
    };

    const handleEnded = () => {
      if (showProgressive) {
        console.log('Audio ended, showing all lines');
        setCurrentLineIndex(script.length - 1); // Show all lines when finished
      }
    };

    const handlePause = () => {
      console.log('Audio paused, keeping current line index:', currentLineIndex);
      // Keep current line index when paused
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [showProgressive, script.length, currentLineIndex]);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-lg flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavBar user={user} onLogout={handleLogout} />
      
      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto w-full px-6 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      
      <HeroSection topic={topic} setTopic={setTopic} onGenerate={onGenerate} />
      <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 pb-8">
        <div className="flex flex-1 mb-8">
          <LibrarySidebar 
            history={history} 
            onSelectTopic={onSelectTopic}
            loading={userDataLoading}
            onDebugReload={handleDebugReload}
            userConversations={userConversations}
            userSummaries={userSummaries}
          />
        <ConversationView
          script={script}
          onPlay={onPlay}
            onStop={onStop}
          onRestart={onRestart}
          isPlaying={isPlaying}
            currentLineIndex={currentLineIndex}
            showProgressive={showProgressive}
        />
        </div>
        <SummarySidebar summary={overallSummary} topic={topic} />
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-lg flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span>Generating conversation...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
