import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#181829] border-t border-[#23234a] py-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent select-none">
          Your Name
          <div className="text-base font-normal text-gray-400">Full Stack Developer</div>
        </div>
        <div className="text-gray-400 text-center">
          © 2025 Your Name. Made with <span className="text-red-400">♥</span> and lots of coffee.
        </div>
        <div className="flex gap-4 text-2xl">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400" aria-label="GitHub"><FaGithub /></a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="mailto:your.email@example.com" className="hover:text-purple-400" aria-label="Email"><FaEnvelope /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 