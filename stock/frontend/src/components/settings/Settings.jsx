import React, { useState } from 'react';
import { User, Heart, Shield, Globe, LogIn, Plus } from 'lucide-react';

const Settings = ({ watchlist = [], setWatchlist, user, userProfile }) => {
  const [isSignedIn, setIsSignedIn] = useState(!!user);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const addToWatchlist = () => {
    // This would typically open a modal or form to add a stock
    console.log('Add to watchlist clicked');
  };

  const removeFromWatchlist = (symbol) => {
    console.log('Removing from watchlist:', symbol);
    // This will be handled by the parent component
    if (setWatchlist) {
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    }
  };

  // Get user display name or email from Firestore profile
  const getUserDisplayName = () => {
    if (userProfile?.display_name) {
      return userProfile.display_name;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use part before @ as display name
    }
    return 'User';
  };

  // Get user email from Firestore profile
  const getUserEmail = () => {
    return userProfile?.email || user?.email || 'No email available';
  };

  // Get user avatar or initials from Firestore profile
  const getUserAvatar = () => {
    if (userProfile?.photo_url) {
      return (
        <img 
          src={userProfile.photo_url} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
      );
    }
    
    if (user?.photoURL) {
      return (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
      );
    }
    
    const initials = getUserDisplayName()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-medium text-sm">{initials}</span>
      </div>
    );
  };

  // Get provider information from Firestore profile
  const getProviderInfo = () => {
    if (userProfile?.provider) {
      return userProfile.provider.replace('.com', '');
    }
    if (user?.providerData?.[0]?.providerId) {
      return user.providerData[0].providerId.replace('.com', '');
    }
    return null;
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    try {
      if (timestamp.toDate) {
        return new Date(timestamp.toDate()).toLocaleDateString();
      }
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign In Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <User size={20} className="text-purple-400 mr-2" />
          Account
        </h3>
        <div className="space-y-4">
          {!user ? (
            <div className="text-center py-4">
              <div className="text-gray-300 mb-3">Sign in to sync your data across devices</div>
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getUserAvatar()}
                  <div className="ml-3">
                    <div className="font-semibold text-white">{getUserDisplayName()}</div>
                    <div className="text-sm text-gray-300">{getUserEmail()}</div>
                    {getProviderInfo() && (
                      <div className="text-xs text-purple-300 mt-1">
                        Signed in with {getProviderInfo()}
                      </div>
                    )}
                    {userProfile?.created_at && (
                      <div className="text-xs text-gray-400">
                        Member since {formatDate(userProfile.created_at)}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watch List Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Heart size={20} className="text-pink-400 mr-2" />
            Watch List
          </h3>
          <button
            onClick={addToWatchlist}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all duration-300 border border-purple-500/30"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
        <div className="space-y-3">
          {watchlist.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <Heart size={32} className="mx-auto mb-2 text-gray-500" />
              <p>No stocks in your watch list</p>
              <p className="text-sm">Add stocks to track their performance</p>
            </div>
          ) : (
            watchlist.map((stock) => (
              <div key={stock.symbol || stock.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{stock.symbol}</div>
                      <div className="text-sm text-gray-300">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{stock.price}</div>
                      <div className={`text-sm ${stock.change?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  className="ml-3 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Shield size={20} className="text-blue-400 mr-3" />
            <div>
              <div className="font-semibold text-white">Data Privacy</div>
              <div className="text-sm text-gray-300">Your data is encrypted and never shared</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Globe size={20} className="text-purple-400 mr-3" />
            <div>
              <div className="font-semibold text-white">API Usage</div>
              <div className="text-sm text-gray-300">Current usage: 1,234 calls this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 