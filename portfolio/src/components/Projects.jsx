import React, { useState } from "react";

// const categories = ["All", "Web Apps", "Mobile", "API", "AI/ML"];
const projects = [
  {
    title: "AI-Stock-Market Research ",
    category: "Web Apps",
    description:
      "An AI-driven stock analysis platform built with python, React, FastAPI, and Gemini LLM. Features include stock screening, fundamental insights, sentiment analysis, and investment recommendations..",
    tags: ["Python", "React", "FastAPI", "Gemini LLM"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=400&h=300&q=80",
    featured: false,
    demo: "https://project-hvgn.vercel.app/",
    code: "https://github.com/",
  },
  {
    title: "AI-Youtube-Summerizer",
    category: "Web Apps",
    description:"A YouTube summarizer built with Python, FastAPI, React, and Gemini LLM. It fetches videos via the YouTube API and generates concise summaries within a selected word limit.",
    tags: ["Python", "FastAPI", "React", "Gemini LLM"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=facearea&w=400&h=300&q=80",
    featured: false,
    demo: "https://ai-youtube-summerizer.vercel.app/",
    code: "https://github.com/",
  },
  {
    title: "LLM-Token-Calculator",
    category: "AI/ML",
    description:"An LLM tokenizer built with Python and React. Upload a PDF to calculate token count and estimate processing time based on LLM token limits—helpful for identifying large documents.",
    tags: ["Python", "React"],
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=300&q=80",
    featured: false,
    demo: "https://llm-token-calculator-phi.vercel.app/",
    code: "https://github.com/",
  },
  {
    title: "AI-weather-prediction",
    category: "Web Apps",
    description:
      "An AI-powered weather app built with Python and React. Uses Gemini and a weather API to provide today's weather and intelligent forecasts.",
    tags: ["Python", "FastAPI", "React", "Gemini LLM"],
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=300&q=80",
    featured: false,
    demo: "https://ai-weather-prediction.vercel.app/",
    code: "https://github.com/",
  },
  {
    title: "AI-Voice-Clone",
    category: "Web Apps",
    description:"A voice cloning app using Python and React. Upload a voice sample and a PDF — the extracted text is read aloud in the cloned voice.",
    tags: ["Python", "React", "TTS", "PDF Extraction", "Voice Cloning"],
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=300&q=80",
    featured: false,
    demo: "https://ai-voice-clone-nine.vercel.app/",
    code: "https://github.com/",
  },
  // {
  //   title: "Blockchain Voting System",
  //   category: "Web Apps",
  //   description:
  //     "A secure voting platform built on blockchain technology ensuring transparency and immutability.",
  //   tags: ["Solidity", "Web3.js", "React", "Ethereum"],
  //   image:
  //     "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=facearea&w=400&h=300&q=80",
  //   featured: false,
  //   demo: "https://example.com/demo6",
  //   code: "https://github.com/",
  // },
];

const Projects = () => {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = projects.filter(
    (p) =>
      (selected === "All" || p.category === selected) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="projects">
      <h2 className="text-4xl font-bold text-center mb-2">Featured Projects</h2>
      <p className="text-center text-lg text-gray-300 mb-8">
        A collection of projects showcasing different technologies and solutions
      </p>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* <input
          type="text"
          placeholder="Search projects or technologies..."
          className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-[#23234a] text-white placeholder-gray-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
        {/* <div className="flex gap-2 flex-wrap justify-center md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 rounded-full font-semibold border transition-colors ${
                selected === cat
                  ? "bg-purple-500 text-white"
                  : "bg-[#181829] border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <div
            key={project.title}
            className={`bg-[#181829] rounded-2xl shadow-lg overflow-hidden flex flex-col border-2 transition-transform duration-200 hover:scale-105 hover:shadow-2xl ${
              project.featured ? "border-purple-400" : "border-transparent"
            }`}
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              {project.featured && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full text-black">
                  Featured
                </span>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-1 text-white">{project.title}</h3>
              <span className="text-sm text-purple-300 mb-2">{project.category}</span>
              <p className="text-gray-300 text-sm mb-4 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-[#23234a] text-xs px-3 py-1 rounded-full text-purple-200">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:scale-110 hover:from-purple-500 hover:to-blue-500 transition-transform duration-200"
                >
                  Live Demo
                </a>
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#181829] border border-gray-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-gray-800 hover:scale-110 transition-all duration-200"
                >
                  Code
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects; 