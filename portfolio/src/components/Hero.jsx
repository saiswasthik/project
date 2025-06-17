import React from "react";
import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-16 text-center relative z-10">
      <img
        src="saiswasthik_image.jpeg"
        alt="Avatar"
        className="w-50 h-60 rounded-full border-4 border-purple-400 shadow-lg mb-6 object-cover"
      />
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">M sai swasthik</h1>
      <h2 className="text-2xl md:text-3xl font-medium mb-2 text-purple-300">
        AI+ Python backend Developer
      </h2>
      <p className="max-w-xl mx-auto text-lg text-gray-300 mb-8">
        I craft digital experiences that blend innovation with functionality, turning ideas into reality through code.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <Link
          to="projects"
          smooth={true}
          duration={500}
          offset={-70}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition-transform duration-200 cursor-pointer"
        >
          View My Work
        </Link>
        <a
          href="/Mende_Saiswasthik.pdf"
          download
          className="bg-[#181829] border border-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 hover:scale-105 transition-all duration-200"
        >
          Download CV
        </a>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          offset={-70}
          className="bg-[#181829] border border-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Get In Touch
        </Link>
      </div>
      <div className="flex gap-6 justify-center mb-8 text-2xl">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 hover:scale-125 transition-transform duration-200" aria-label="GitHub"><FaGithub /></a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 hover:scale-125 transition-transform duration-200" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href="mailto:your.email@example.com" className="hover:text-purple-400 hover:scale-125 transition-transform duration-200" aria-label="Email"><FaEnvelope /></a>
      </div>
      <div className="animate-bounce mt-8">
        <Link to="about" smooth={true} duration={500} offset={-70} className="text-3xl text-purple-400 cursor-pointer">↓</Link>
      </div>
    </div>
  );
};

export default Hero; 