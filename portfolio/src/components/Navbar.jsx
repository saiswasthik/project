import React from "react";
import { Link } from "react-scroll";

const navLinks = [
  { name: "Home", to: "hero" },
  { name: "About", to: "about" },
  { name: "Skills", to: "skills" },
  { name: "Projects", to: "projects" },
//   { name: "Testimonials", to: "testimonials" },
//   { name: "Blog", to: "blog" },
  { name: "Contact", to: "contact" },
];

const Navbar = () => {
  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-[#181829]/90 backdrop-blur border-b border-[#23234a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent select-none cursor-pointer">
          M sai swasthik
        </span>
        <ul className="flex space-x-8 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth={true}
                duration={500}
                offset={-70}
                className="cursor-pointer hover:text-purple-400 hover:underline underline-offset-4 transition-colors duration-200"
                activeClass="text-purple-400"
                spy={true}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Optionally add a theme toggle here */}
      </div>
    </nav>
  );
};

export default Navbar; 