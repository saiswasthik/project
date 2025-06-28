import React from 'react';

const ConversationView = ({ 
  script, 
  onPlay, 
  onStop, 
  onRestart, 
  isPlaying, 
  currentLineIndex = -1, // -1 means show all lines, >= 0 means show up to that index
  showProgressive = false // Whether to show progressive display
}) => {
  // Determine which lines to show
  const linesToShow = showProgressive && currentLineIndex >= 0 
    ? script.slice(0, currentLineIndex + 1) 
    : script;

  return (
    <div className="flex-1 flex flex-col bg-white p-8 min-h-[400px] rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 ml-6">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-2xl text-gray-800 hover:shadow-md transition-shadow duration-200 px-2 py-1 rounded">
          AI Conversation
          {showProgressive && currentLineIndex >= 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({currentLineIndex + 1} / {script.length})
            </span>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-md disabled:hover:scale-100 disabled:hover:shadow-md"
            onClick={onPlay}
            disabled={!script || script.length === 0 || isPlaying}
            aria-label="Play Conversation"
          >
            ▶ Play
          </button>
          <button
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-md disabled:hover:scale-100 disabled:hover:shadow-md"
            onClick={onStop}
            disabled={!isPlaying}
            aria-label="Stop Conversation"
          >
            ⏹ Stop
          </button>
          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-md"
            onClick={onRestart}
            aria-label="Restart Conversation"
          >
            ⟲ Restart
          </button>
        </div>
      </div>
      
      {/* Progressive Display Toggle */}
      {script && script.length > 0 && (
        <div className="mb-4 flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showProgressive}
              onChange={(e) => {
                // This will be handled by parent component
                if (window.toggleProgressiveDisplay) {
                  window.toggleProgressiveDisplay(e.target.checked);
                }
              }}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Progressive Display (show lines as audio plays)</span>
          </label>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 p-4 hover:shadow-inner transition-shadow duration-300 rounded-lg" style={{ maxHeight: 900 }}>
        {linesToShow && linesToShow.length > 0 ? (
          linesToShow.map((line, displayIndex) => {
            // Calculate the original index in the full script
            const originalIndex = showProgressive && currentLineIndex >= 0 
              ? displayIndex 
              : displayIndex;
            const isCurrentLine = showProgressive && displayIndex === currentLineIndex;
            
            return (
              <div key={displayIndex} className={originalIndex % 2 === 0 ? 'flex' : 'flex justify-end'}>
                <div className={
                  originalIndex % 2 === 0
                    ? `bg-gradient-to-r from-purple-400 to-red-400 text-white px-8 py-5 rounded-2xl shadow-lg mr-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 max-w-[80%] ${
                        isCurrentLine ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                      }`
                    : `bg-gradient-to-r from-red-300 to-pink-300 text-black px-8 py-5 rounded-2xl shadow-lg ml-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 max-w-[80%] ${
                        isCurrentLine ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                      }`
                }>
                  <div className="text-lg leading-relaxed">{line}</div>
                  {isCurrentLine && (
                    <div className="text-xs mt-2 opacity-75">🎤 Speaking now...</div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-lg">Enter a topic and generate a conversation to see the dialogue here.</div>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      {showProgressive && script && script.length > 0 && currentLineIndex >= 0 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentLineIndex + 1) / script.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {currentLineIndex + 1} of {script.length} lines
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationView; 