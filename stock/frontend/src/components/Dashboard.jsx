import React, { useState, useEffect } from 'react';
import SearchPanel from './SearchPanel';
import SidePanel from './SidePanel';
import FundamentalSection from './fundamental/FundamentalSection';
import SentimentAnalysis from './sentiment/SentimentAnalysis';
import NewsView from './news/NewsView';
import TechnicalAnalysis from './technical/TechnicalAnalysis';
// import Screener from './screener/Screener';
import Settings from './settings/Settings';
import { Heart, HeartOff, Sparkles } from 'lucide-react';
import { fetchFundamentalData } from '../config/api';
import { 
  addToWatchlist as addToFirestoreWatchlist, 
  removeFromWatchlist as removeFromFirestoreWatchlist,
  getUserWatchlist 
} from '../services/firebaseService';

const Dashboard = ({ selectedStock, showSettings, onCloseSettings, user, userProfile }) => {
  const [activeSection, setActiveSection] = useState('fundamental');
  const [stockSymbol, setStockSymbol] = useState('');
  const [resolvedSymbol, setResolvedSymbol] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's watchlist from Firestore or localStorage
  useEffect(() => {
    if (user?.uid) {
      loadUserWatchlist();
    }
  }, [user?.uid]);

  const loadUserWatchlist = async () => {
    try {
      console.log('Loading watchlist for user:', user.uid);
      
      // Try Firestore first
      try {
        const userWatchlist = await getUserWatchlist(user.uid);
        console.log('Watchlist loaded from Firestore:', userWatchlist);
        setWatchlist(userWatchlist);
        return;
      } catch (firestoreError) {
        // Handle Firebase permission errors gracefully
        if (firestoreError.message === 'firebase-permission-denied') {
          console.log('Firebase permissions not set up - using localStorage');
          showFirebaseSetupMessage();
        } else {
          console.log('Firestore failed, trying localStorage:', firestoreError);
        }
      }
      
      // Fallback to localStorage
      const localWatchlist = localStorage.getItem(`watchlist_${user.uid}`);
      if (localWatchlist) {
        const parsed = JSON.parse(localWatchlist);
        console.log('Watchlist loaded from localStorage:', parsed);
        setWatchlist(parsed);
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setWatchlist([]);
    }
  };

  // Set initial stock symbol when selectedStock prop is provided
  useEffect(() => {
    if (selectedStock) {
      setStockSymbol(selectedStock);
      setResolvedSymbol('');
      setShowAnalysis(true);
    }
  }, [selectedStock]);

  const handleSearch = (symbol) => {
    setStockSymbol(symbol);
    setResolvedSymbol(''); // Reset resolved symbol when new search starts
    setShowAnalysis(true);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const isInWatchlist = (symbol) => {
    const isWatched = watchlist.some(stock => stock.symbol === symbol);
    console.log('🔍 Watchlist check for UI only:', symbol, 'is in watchlist:', isWatched);
    console.log('📊 Note: This check is ONLY for UI button state - stock data fetch is independent');
    return isWatched;
  };

  // Helper function to show Firebase setup message
  const showFirebaseSetupMessage = () => {
    // Only show once per session
    if (!localStorage.getItem('firebase_setup_message_shown')) {
      console.log('💡 Firebase Setup Tip: To enable cloud watchlist sync, set up Firebase Authentication and Firestore security rules.');
      localStorage.setItem('firebase_setup_message_shown', 'true');
    }
  };

  const addToWatchlist = async () => {
    if (!user?.uid) {
      console.error('User not authenticated');
      return;
    }

    const currentSymbol = resolvedSymbol || stockSymbol;
    console.log('Attempting to add to watchlist:', currentSymbol);
    
    if (!currentSymbol) {
      console.log('No symbol to add');
      return;
    }
    
    if (isInWatchlist(currentSymbol)) {
      console.log('Stock already in watchlist');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching stock data for:', currentSymbol);
      
      // Fetch current stock data to get real price
      let stockData;
      try {
        stockData = await fetchFundamentalData(currentSymbol);
        console.log('Stock data fetched:', stockData);
      } catch (apiError) {
        console.log('API failed, using fallback data:', apiError);
        stockData = {
          company_info: { name: `${currentSymbol} Limited` },
          real_time_data: { current_price: '₹0.00', change_percent: '0.00%' }
        };
      }
      
      const stockInfo = {
        symbol: currentSymbol,
        name: stockData.company_info?.name || `${currentSymbol} Limited`,
        price: stockData.real_time_data?.current_price || '₹0.00',
        change: stockData.real_time_data?.change_percent || '0.00%'
      };
      
      console.log('Stock info to add:', stockInfo);
      
      // Try Firestore first
      let firestoreSuccess = false;
      try {
        const result = await addToFirestoreWatchlist(user.uid, stockInfo);
        console.log('Add to Firestore watchlist result:', result);
        firestoreSuccess = true;
      } catch (firestoreError) {
        // Handle Firebase permission errors gracefully
        if (firestoreError.message === 'firebase-permission-denied') {
          console.log('Firebase permissions not set up - using localStorage');
        } else {
          console.log('Firestore failed, using localStorage:', firestoreError);
        }
      }
      
      // Fallback to localStorage if Firestore fails
      if (!firestoreSuccess) {
        const localWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user.uid}`) || '[]');
        const updatedWatchlist = [...localWatchlist, { ...stockInfo, id: Date.now() }];
        localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(updatedWatchlist));
        console.log('Added to localStorage watchlist');
      }
      
      // Reload watchlist
      await loadUserWatchlist();
      
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    if (!user?.uid) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Try Firestore first
      try {
        await removeFromFirestoreWatchlist(user.uid, symbol);
        console.log('Removed from Firestore watchlist');
      } catch (firestoreError) {
        // Handle Firebase permission errors gracefully
        if (firestoreError.message === 'firebase-permission-denied') {
          console.log('Firebase permissions not set up - using localStorage');
        } else {
          console.log('Firestore failed, using localStorage:', firestoreError);
        }
        
        // Fallback to localStorage
        const localWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user.uid}`) || '[]');
        const updatedWatchlist = localWatchlist.filter(stock => stock.symbol !== symbol);
        localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(updatedWatchlist));
        console.log('Removed from localStorage watchlist');
      }
      
      // Reload watchlist
      await loadUserWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const renderMainContent = () => {
    if (!showAnalysis) return null;

    // Show welcome message when no stock is selected
    if (!stockSymbol) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6">📈</div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Stock Market Research</h2>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6">
              <div className="text-white/90 text-lg mb-4">💡 How to get started:</div>
              <div className="text-white/80 space-y-2 text-left">
                <p>• <strong>Search for stocks</strong> using the search box above</p>
                <p>• <strong>Try categories</strong> like "OIL", "BANK", "TECH" for suggestions</p>
                <p>• <strong>Use popular symbols</strong> like RELIANCE.NS, TCS.NS, HDFCBANK.NS</p>
                <p>• <strong>Add .NS suffix</strong> for NSE stocks or .BO for BSE stocks</p>
              </div>
            </div>
            <div className="text-white/70">
              Start by searching for a stock symbol above to view detailed analysis
            </div>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'fundamental':
        return <FundamentalSection stockSymbol={stockSymbol} onSymbolResolved={setResolvedSymbol} />;
      case 'sentiment':
        return <SentimentAnalysis symbol={stockSymbol} />;
      case 'news':
        return <NewsView symbol={stockSymbol} />;
      case 'technical':
        return <TechnicalAnalysis symbol={stockSymbol} />;
      // case 'screener':
      //   return <Screener />;
      default:
        return <FundamentalSection stockSymbol={stockSymbol} onSymbolResolved={setResolvedSymbol} />;
    }
  };

  const currentSymbol = resolvedSymbol || stockSymbol;
  const isWatched = isInWatchlist(currentSymbol);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Search Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <SearchPanel onSearch={handleSearch} />
          
          {showAnalysis && (
            <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm p-6 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Sparkles className="text-yellow-400 mr-2" size={20} />
                    Analyzing: {currentSymbol || 'Select a stock'}
                  </h3>
                  {currentSymbol && (
                    <p className="text-purple-200 text-sm">
                      Showing comprehensive analysis for {currentSymbol}
                    </p>
                  )}
                </div>
                {currentSymbol && (
                  <button
                    onClick={isWatched ? () => removeFromWatchlist(currentSymbol) : addToWatchlist}
                    disabled={loading}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      loading 
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : isWatched 
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
                          : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Processing...</span>
                      </>
                    ) : isWatched ? (
                      <>
                        <HeartOff size={18} />
                        <span>Remove from Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Heart size={18} />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Layout with Side Panel */}
        <div className="flex gap-6">
          {/* Side Panel */}
          <SidePanel activeSection={activeSection} onSectionChange={handleSectionChange} />

          {/* Main Content Area */}
          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>

        {/* Settings Panel Overlay */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-96 bg-white/10 backdrop-blur-xl h-full shadow-2xl border-l border-white/20 overflow-y-auto">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Settings</h2>
                  <button
                    onClick={onCloseSettings}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <Settings watchlist={watchlist} setWatchlist={setWatchlist} user={user} userProfile={userProfile} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 