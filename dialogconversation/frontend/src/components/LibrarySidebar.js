import React from 'react';

const LibrarySidebar = ({ history, onSelectTopic, loading, onDebugReload, userConversations, userSummaries }) => (
  <div className="w-80 bg-white border-r border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 rounded-r-2xl flex flex-col h-screen">
    {/* Fixed Header */}
    <div className="font-bold text-xl mb-6 text-gray-800 hover:shadow-md transition-shadow duration-200 px-2 py-1 rounded flex-shrink-0">
      Your Library
      {history.length > 0 && (
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({history.length} topics)
        </span>
      )}
    </div>
    
    {/* Fixed Debug section */}
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
      <div className="text-xs text-yellow-800 mb-2">Debug Info:</div>
      <div className="text-xs text-gray-600 mb-2">Loading: {loading ? 'Yes' : 'No'}</div>
      <div className="text-xs text-gray-600 mb-2">Topics: {history.length}</div>
      <div className="text-xs text-gray-600 mb-2">Conversations: {userConversations?.length || 0}</div>
      <div className="text-xs text-gray-600 mb-2">Summaries: {userSummaries?.length || 0}</div>
      <div className="flex space-x-2">
        <button 
          onClick={onDebugReload}
          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
        >
          Reload Data
        </button>
        {/* <button 
          onClick={() => window.testFirebaseConnection && window.testFirebaseConnection()}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          Test Firebase
        </button> */}
        {/* <button 
          onClick={() => window.handleTestProgressive && window.handleTestProgressive()}
          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
        >
          Test Progressive
        </button> */}
      </div>
    </div>
    
    {/* Scrollable Topics Section */}
    <div className="flex-1 overflow-y-auto mb-2 min-h-40">
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading your conversations...</div>
          </div>
        ) : history && history.length > 0 ? (
          history.map((topic, idx) => (
            <div
              key={idx}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-blue-600 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              onClick={() => onSelectTopic(topic)}
            >
              <div className="font-medium text-gray-800">{topic}</div>
              <div className="text-xs text-gray-500 mt-1">Click to view conversation</div>
              <div className="text-xs text-blue-600 mt-1">✓ Saved to your account</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm">No conversations yet.</div>
            <div className="text-xs mt-1">Generate your first conversation to see it here.</div>
            <div className="text-xs mt-2 text-gray-500">
              Your conversations will be saved and available when you log back in.
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Fixed Learning Tips */}
    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 hover:shadow-xl transition-shadow duration-200 flex-shrink-0">
      <div className="font-semibold mb-4 text-purple-800 flex items-center space-x-2">
        <span>💡</span>
        <span>Learning Tips</span>
      </div>
      <ul className="text-sm list-disc pl-5 space-y-2 text-gray-700">
        <li className="hover:text-purple-700 hover:shadow-sm transition-all duration-200 px-2 py-1 rounded">Click any topic to view its interactive conversation</li>
        {/* <li className="hover:text-purple-700 hover:shadow-sm transition-all duration-200 px-2 py-1 rounded">Use play controls to follow along with the dialogue</li> */}
        <li className="hover:text-purple-700 hover:shadow-sm transition-all duration-200 px-2 py-1 rounded">Generate multiple topics to build your knowledge base</li>
        {/* <li className="hover:text-purple-700 hover:shadow-sm transition-all duration-200 px-2 py-1 rounded">Your conversations are saved and synced across devices</li> */}
        {/* <li className="hover:text-purple-700 hover:shadow-sm transition-all duration-200 px-2 py-1 rounded">Log out and back in to see your data persistence</li> */}
      </ul>
    </div>
  </div>
);

export default LibrarySidebar; 