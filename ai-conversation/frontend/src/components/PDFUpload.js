import React, { useState, useRef } from 'react';

const PDFUpload = ({ onPDFProcessed, loading, setLoading, setError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.type.includes('pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      console.log('=== STARTING PDF UPLOAD ===');
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      const formData = new FormData();
      formData.append('pdf_file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.detail || 'Failed to process PDF');
      }

      const data = await response.json();
      console.log('Backend response data:', data);
      
      if (data.success) {
        console.log('PDF processing successful, calling onPDFProcessed...');
        // Call the parent component's callback with the processed data
        onPDFProcessed({
          topic: data.topic,
          script: data.script,
          summary: data.summary,
          audio: data.audio,
          line_timings: data.line_timings,
          metadata: data.metadata,
          key_topics: data.key_topics,
          extracted_text_length: data.extracted_text_length
        });
        console.log('onPDFProcessed called successfully');
      } else {
        console.error('PDF processing failed - success flag is false');
        throw new Error('PDF processing failed');
      }

    } catch (error) {
      console.error('Error processing PDF:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(`Failed to process PDF: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Test function to simulate PDF processing
  const testPDFProcessing = () => {
    console.log('=== TESTING PDF PROCESSING ===');
    const testData = {
      topic: "Test PDF Topic",
      script: {
        person_a: ["Hello, this is a test conversation from a PDF."],
        person_b: ["Hi! I'm interested in learning more about this topic."]
      },
      summary: `<h3>Main Concepts</h3>
<ul>
<li>This is a test summary with proper formatting</li>
<li>It includes headings and bullet points for better readability</li>
<li>The content is organized in a structured way</li>
</ul>
<h3>Key Points</h3>
<ul>
<li>First important point about the topic</li>
<li>Second important point with additional details</li>
<li>Third point highlighting the main takeaways</li>
</ul>
<h3>Important Details</h3>
<ul>
<li>Specific detail that supports the main concepts</li>
<li>Another detail that provides context</li>
<li>Final detail that ties everything together</li>
</ul>`,
      audio: null,
      line_timings: [],
      metadata: { filename: "test.pdf", total_pages: 1 },
      key_topics: ["Test Topic"],
      extracted_text_length: 100
    };
    
    console.log('Calling onPDFProcessed with test data:', testData);
    onPDFProcessed(testData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Test Button */}
      <div className="mb-4 text-center">
        <button
          onClick={testPDFProcessing}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          🧪 Test PDF Processing
        </button>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Processing PDF...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {uploadProgress < 100 ? 'Uploading and processing...' : 'Finalizing...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">
                Upload PDF Document
              </h3>
              <p className="text-sm text-white-500">
                Drag and drop your PDF file here, or{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  browse files
                </button>
              </p>
            </div>

            <div className="text-xs text-white-400 space-y-1">
              <p>• Maximum file size: 10MB</p>
              <p>• Supported format: PDF only</p>
              <p>• The PDF will be processed to extract text, generate summary, and create a conversation</p>
            </div>
          </div>
        )}
      </div>

      {dragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
};

export default PDFUpload; 