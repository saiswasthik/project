import React from 'react';

const news = [
  {
    title: "Apple's AI Strategy Shows Promise in Early Demos",
    summary: "New AI features in iOS demonstrate Apple's capability to compete with tech giants in the AI space.",
    source: "TechCrunch",
    time: "2 hours ago",
    sentiment: "bullish",
    score: "+0.8"
  },
  {
    title: "iPhone Sales Face Headwinds in Chinese Market",
    summary: "Competition from local brands and economic slowdown affecting Apple's market share in China.",
    source: "Reuters",
    time: "4 hours ago",
    sentiment: "bearish",
    score: "-0.6"
  },
  {
    title: "Analysts Maintain Strong Buy on Services Growth",
    summary: "Services revenue continues to show resilient growth, offsetting hardware volatility.",
    source: "Bloomberg",
    time: "6 hours ago",
    sentiment: "bullish",
    score: "+0.7"
  },
  {
    title: "Regulatory Scrutiny Increases in EU Markets",
    summary: "New regulations may impact App Store policies but unlikely to affect near-term earnings.",
    source: "Financial Times",
    time: "8 hours ago",
    sentiment: "neutral",
    score: "-0.2"
  }
];

const getBadge = (sentiment) => {
  if (sentiment === "bullish") return "bg-green-100 text-green-700";
  if (sentiment === "bearish") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const NewsAnalysis = ({ data }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Recent News with Sentiment Analysis</h3>
    <div className="space-y-4">
      {(data && data.length > 0) ? data.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-gray-900">{item.title}</div>
            <div className="text-gray-600 text-sm">{item.summary}</div>
            <div className="text-xs text-gray-400 mt-1">{item.source} • {item.time}</div>
          </div>
          <div className="flex flex-col items-end mt-2 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-1 ${getBadge(item.sentiment)}`}>
              {item.sentiment}
            </span>
            <span className="text-xs text-gray-500">Score: {item.score}</span>
          </div>
        </div>
      )) : (
        <div className="text-gray-400 text-center">No news data available.</div>
      )}
    </div>
  </div>
);

export default NewsAnalysis; 