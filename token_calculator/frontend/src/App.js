import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSingleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://llm-token-calculator.onrender.com', {
        method: 'POST',
        body: formData,
      });
      // for local host "http://localhost:8000/api/calculate-single-pdf"

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      setResult({
        results: [{
          filename: data.filename,
          token_count: data.token_count,
          text_length: data.text_length,
          word_count: data.word_count,
          processing_time: data.processing_time
        }],
        total_files: 1,
        successful_files: 1,
        total_processing_time: data.processing_time
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleFilesUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('https://llm-token-calculator.onrender.com', {
        method: 'POST',
        body: formData,
      });
      // for local host "http://localhost:8000/api/calculate-folder"

      if (!response.ok) {
        throw new Error('Failed to process PDFs');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (results) => {
    return results.reduce((acc, item) => {
      if (!item.error) {
        acc.tokens += item.token_count || 0;
        acc.characters += item.text_length || 0;
        acc.words += item.word_count || 0;
        acc.time += item.processing_time || 0;
      }
      return acc;
    }, { tokens: 0, characters: 0, words: 0, time: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">PDF Token Calculator</h1>
                
                {/* Single File Upload */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Single PDF Upload</h2>
                  <form onSubmit={handleSingleFileUpload} className="space-y-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <button
                      type="submit"
                      disabled={!file || loading}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {loading ? 'Processing...' : 'Calculate Tokens'}
                    </button>
                  </form>
                </div>

                {/* Multiple Files Upload */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Multiple PDFs Upload</h2>
                  <form onSubmit={handleMultipleFilesUpload} className="space-y-4">
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <button
                      type="submit"
                      disabled={files.length === 0 || loading}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {loading ? 'Processing...' : 'Calculate Tokens for All'}
                    </button>
                  </form>
                </div>

                {/* Results Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Results:</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Characters</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Words</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {result.results.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.filename}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.error ? '-' : item.page_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.error ? '-' : item.token_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.error ? '-' : item.text_length}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.error ? '-' : item.word_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.error ? '-' : item.processing_time.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {item.error ? (
                                  <span className="text-red-600">{item.error}</span>
                                ) : (
                                  <span className="text-green-600">Success</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 font-semibold">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{result.total_pages}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{calculateTotals(result.results).tokens}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{calculateTotals(result.results).characters}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{calculateTotals(result.results).words}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{result.total_processing_time.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {result.successful_files} of {result.total_files} files
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 