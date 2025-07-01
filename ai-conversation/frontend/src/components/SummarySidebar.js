import React, { useState } from 'react';

const SummarySidebar = ({ summary, topic }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadPDF = async () => {
    if (!summary) {
      alert('No summary available to download.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      console.log('Starting PDF generation...');
      console.log('Summary text:', summary);
      console.log('Summary length:', summary.length);
      
      // Import jsPDF dynamically to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      
      // Create PDF with proper font support for multiple languages
      const doc = new jsPDF();
      
      // Set up the PDF document
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const title = topic ? `Summary: ${topic}` : 'Conversation Summary';
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 30);
      
      // Add date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const date = new Date().toLocaleDateString();
      doc.text(`Generated on: ${date}`, margin, 45);
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 50, pageWidth - margin, 50);
      
      // Add summary content with proper text handling
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Check if text contains non-ASCII characters
      const hasNonAscii = /[^\x00-\x7F]/.test(summary);
      
      if (hasNonAscii) {
        console.log('Non-ASCII characters detected, using fallback method');
        
        // For non-ASCII text, create a simple text file instead
        const parseHTMLToText = (htmlContent) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlContent;
          
          let formattedText = '';
          
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tagName = node.tagName.toLowerCase();
              
              if (tagName === 'h3') {
                formattedText += '\n\n' + node.textContent.trim() + '\n';
                formattedText += '─'.repeat(node.textContent.trim().length) + '\n';
              } else if (tagName === 'ul') {
                Array.from(node.children).forEach(li => {
                  if (li.tagName.toLowerCase() === 'li') {
                    formattedText += '• ' + li.textContent.trim() + '\n';
                  }
                });
                formattedText += '\n';
              } else if (tagName === 'p') {
                formattedText += node.textContent.trim() + '\n\n';
              } else {
                formattedText += node.textContent.trim() + '\n';
              }
            } else if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent.trim();
              if (text) {
                formattedText += text + '\n';
              }
            }
          });
          
          return formattedText.trim();
        };
        
        const formattedSummary = parseHTMLToText(summary);
        const blob = new Blob([formattedSummary], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = topic 
          ? `summary_${topic.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
          : `conversation_summary_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Text file downloaded successfully');
        alert('Summary downloaded as text file due to special characters. PDF format may not display correctly for this language.');
        return;
      }
      
      // For ASCII text, proceed with PDF generation
      console.log('ASCII text detected, generating PDF');
      
      // Parse HTML content and convert to plain text with proper formatting
      const parseHTMLToText = (htmlContent) => {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        let formattedText = '';
        
        // Process each child node
        Array.from(tempDiv.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            
            if (tagName === 'h3') {
              // Add heading with spacing
              formattedText += '\n\n' + node.textContent.trim() + '\n';
              // Add underline for heading
              formattedText += '─'.repeat(node.textContent.trim().length) + '\n';
            } else if (tagName === 'ul') {
              // Process list items
              Array.from(node.children).forEach(li => {
                if (li.tagName.toLowerCase() === 'li') {
                  formattedText += '• ' + li.textContent.trim() + '\n';
                }
              });
              formattedText += '\n';
            } else if (tagName === 'p') {
              formattedText += node.textContent.trim() + '\n\n';
            } else {
              // For other elements, just get the text content
              formattedText += node.textContent.trim() + '\n';
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            // Handle plain text nodes
            const text = node.textContent.trim();
            if (text) {
              formattedText += text + '\n';
            }
          }
        });
        
        return formattedText.trim();
      };
      
      // Convert HTML summary to formatted text
      const formattedSummary = parseHTMLToText(summary);
      console.log('Formatted summary for PDF:', formattedSummary);
      
      // Split summary into lines that fit the page width
      const lines = doc.splitTextToSize(formattedSummary, maxWidth);
      
      let yPosition = 70;
      const lineHeight = 7;
      
      // Add content with proper line breaks and formatting
      lines.forEach((line, index) => {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Check if this is a heading (starts with underline characters)
        if (line.startsWith('─')) {
          // Skip the underline line
          return;
        }
        
        // Check if this is a heading (has underline characters after it)
        const nextLine = lines[index + 1];
        if (nextLine && nextLine.startsWith('─')) {
          // This is a heading - format it differently
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(line, margin, yPosition);
          yPosition += 10; // Extra space after heading
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
        } else if (line.startsWith('• ')) {
          // This is a bullet point - add some indentation
          doc.text(line, margin + 5, yPosition);
        } else {
          // Regular text
          doc.text(line, margin, yPosition);
        }
        
        yPosition += lineHeight;
      });
      
      // Add footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const footerText = 'Generated by AI Learning Companion';
      const footerWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (pageWidth - footerWidth) / 2, doc.internal.pageSize.getHeight() - 20);
      
      // Generate filename
      const filename = topic 
        ? `summary_${topic.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        : `conversation_summary_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      // Show success message
      console.log('PDF generated successfully:', filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback: create a text file if PDF generation fails
      try {
        console.log('PDF generation failed, trying text file fallback...');
        const parseHTMLToText = (htmlContent) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlContent;
          
          let formattedText = '';
          
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tagName = node.tagName.toLowerCase();
              
              if (tagName === 'h3') {
                formattedText += '\n\n' + node.textContent.trim() + '\n';
                formattedText += '─'.repeat(node.textContent.trim().length) + '\n';
              } else if (tagName === 'ul') {
                Array.from(node.children).forEach(li => {
                  if (li.tagName.toLowerCase() === 'li') {
                    formattedText += '• ' + li.textContent.trim() + '\n';
                  }
                });
                formattedText += '\n';
              } else if (tagName === 'p') {
                formattedText += node.textContent.trim() + '\n\n';
              } else {
                formattedText += node.textContent.trim() + '\n';
              }
            } else if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent.trim();
              if (text) {
                formattedText += text + '\n';
              }
            }
          });
          
          return formattedText.trim();
        };
        
        const formattedSummary = parseHTMLToText(summary);
        const blob = new Blob([formattedSummary], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = topic 
          ? `summary_${topic.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
          : `conversation_summary_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('PDF generation failed. Summary downloaded as text file instead.');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        alert('Failed to generate PDF. Please try again or copy the summary manually.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 p-8 flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <div className="font-bold text-2xl mb-6 text-gray-800 hover:shadow-md transition-shadow duration-200 px-2 py-1 rounded flex items-center justify-between">
        <span>Summary</span>
        {summary && (
          <button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md flex items-center space-x-2 ${
              isGeneratingPDF
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-xl'
            }`}
            title="Download Summary as PDF"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Download PDF</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-purple-100 hover:shadow-xl transition-shadow duration-200">
          <div className="font-semibold mb-4 text-purple-800 flex items-center space-x-2">
            <span>📝</span>
            <span>Conversation Summary</span>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed">
            {summary ? (
              <div 
                className="summary-content"
                dangerouslySetInnerHTML={{ 
                  __html: summary
                }}
              />
            ) : (
              'No summary available. Generate a conversation to see the summary here.'
            )}
          </div>
        </div>
        
        {/* Quick Actions Section */}
        {summary && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-xl transition-shadow duration-200">
            <div className="font-semibold mb-4 text-green-800 flex items-center space-x-2">
              <span>⚡</span>
              <span>Quick Actions</span>
            </div>
            <div className="space-y-3">
              <button 
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className={`w-full font-bold py-3 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center space-x-2 ${
                  isGeneratingPDF
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-xl'
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Download Summary PDF</span>
                  </>
                )}
              </button>
              <div className="text-xs text-gray-600 text-center">
                Save your conversation summary as a PDF document for offline reading and sharing.
              </div>
            </div>
          </div>
        )}
      </div>
  </div>
);
};

export default SummarySidebar; 