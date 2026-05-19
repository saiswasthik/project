import React, { useState } from 'react';

const URLUpload = ({ onURLProcessed }) => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleURLSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Processing URL:', url);
      
      const response = await fetch('http://localhost:8000/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('URL processed successfully:', data);
      onURLProcessed(data);
      
      // Clear the URL input after successful processing
      setUrl('');
      
    } catch (error) {
      console.error('Error processing URL:', error);
      setError(error.message || 'Failed to process URL. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const testURLProcessing = () => {
    console.log('=== TESTING URL PROCESSING ===');
    const testData = {
      topic: "Artificial Intelligence Technology",
      script: {
        person_a: ["Artificial Intelligence is transforming how we live and work today."],
        person_b: ["What are some of the key applications of AI that we're seeing?"]
      },
      summary: `<h3>Main Topic Overview</h3>
<ul>
<li>Artificial Intelligence (AI) is a branch of computer science focused on creating intelligent machines</li>
<li>AI systems can perform tasks that typically require human intelligence</li>
<li>Machine learning and deep learning are key components of modern AI</li>
</ul>
<h3>Key Information</h3>
<ul>
<li>AI applications include natural language processing, computer vision, and robotics</li>
<li>Machine learning algorithms improve performance through experience and data</li>
<li>Deep learning uses neural networks to process complex patterns</li>
<li>AI is being used in healthcare, finance, transportation, and entertainment</li>
</ul>
<h3>Current Developments</h3>
<ul>
<li>Large language models like GPT are advancing natural language understanding</li>
<li>AI is helping solve complex problems in climate change and medical research</li>
<li>Ethical considerations around AI bias and job displacement are important</li>
</ul>`,
      audio: null,
      line_timings: [],
      metadata: { 
        url: "https://example.com/ai-article", 
        domain: "example.com",
        content_type: "web_page" 
      },
      key_topics: ["Artificial Intelligence", "Technology"],
      extracted_text_length: 100
    };
    
    console.log('Calling onURLProcessed with test data:', testData);
    onURLProcessed(testData);
  };

  const testRealURL = async () => {
    console.log('=== TESTING REAL URL PROCESSING ===');
    setIsProcessing(true);
    setError('');

    try {
      // Test with a real URL (Wikipedia article)
      const testURL = "https://en.wikipedia.org/wiki/Artificial_intelligence";
      console.log('Testing with real URL:', testURL);
      
      const response = await fetch('http://localhost:8000/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: testURL }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Real URL processed successfully:', data);
      onURLProcessed(data);
      
    } catch (error) {
      console.error('Error processing real URL:', error);
      setError(error.message || 'Failed to process real URL. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 p-8 flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <div className="font-bold text-2xl mb-6 text-gray-800 hover:shadow-md transition-shadow duration-200 px-2 py-1 rounded flex items-center justify-between">
        <span>🌐 URL Processing</span>
        <div className="flex space-x-2">
          <button
            onClick={testURLProcessing}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-xl"
            title="Test URL Processing"
          >
            Test
          </button>
          <button
            onClick={testRealURL}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
              isProcessing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-xl'
            }`}
            title="Test with Real URL"
          >
            {isProcessing ? 'Processing...' : 'Real Test'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-xl transition-shadow duration-200">
          <div className="font-semibold mb-4 text-blue-800 flex items-center space-x-2">
            <span>🔗</span>
            <span>Process Web Page</span>
          </div>
          
          <form onSubmit={handleURLSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Website URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isProcessing}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isProcessing || !url.trim()}
              className={`w-full font-bold py-3 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center space-x-2 ${
                isProcessing || !url.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing URL...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Process URL</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 hover:shadow-xl transition-shadow duration-200">
          <div className="font-semibold mb-4 text-yellow-800 flex items-center space-x-2">
            <span>ℹ️</span>
            <span>How It Works</span>
          </div>
          <div className="text-gray-700 text-sm space-y-2">
            <p>• Enter any website URL to extract its content</p>
            <p>• AI will generate a comprehensive summary with headings and bullet points</p>
            <p>• Creates an educational conversation script about the content</p>
            <p>• Generates audio narration of the script</p>
            <p>• Perfect for learning from articles, blogs, and web pages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLUpload; 