import React from "react";

const skills = ["Python","Generative AI", "Azure", "FastAPI", "MySQL", "REST APIs"];
const features = [
  {
    icon: "<>",
    title: "Development",
    desc: "Full-stack development with modern technologies like React, Node.js, and TypeScript.",
  },
  {
    icon: "🎨",
    title: "Design",
    desc: "Creating beautiful, user-friendly interfaces with attention to detail and user experience.",
  },
  {
    icon: "🚀",
    title: "Performance",
    desc: "Optimizing applications for speed, scalability, and excellent performance metrics.",
  },
  {
    icon: "👥",
    title: "Collaboration",
    desc: "Working effectively in teams and communicating complex technical concepts clearly.",
  },
];

const About = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="about">
      <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
      <div className="flex flex-col md:flex-row items-center gap-12 mb-10">
        <div className="flex-1">
          <p className="text-lg text-gray-300 mb-6">
          I'm an AI + Python Backend Developer passionate about building scalable, intelligent systems. What began as curiosity for automation evolved into a drive to create backend solutions that power real-world impact.

With hands-on experience in Python, FastAPI, MySQL, and REST APIs, I specialize in turning complex problems into clean, high-performance systems. I'm especially excited by the intersection of AI and backend development — from integrating ML models to designing API-driven architectures that learn and adapt.
          </p>
          <p className="text-lg text-gray-300 mb-6">
          Beyond coding, I explore emerging tech, contribute to open-source, and dive into LLMs and Generative AI. I believe in continuous learning, collaboration, and building tech that solves real problems.

Let's create something innovative — together.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {skills.map((skill) => (
              <span key={skill} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-1 rounded-full text-sm font-semibold transition-transform duration-200 hover:scale-110 hover:shadow-lg cursor-pointer">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=400&h=300&q=22"
            alt="About"
            className="rounded-2xl shadow-lg w-160 h-120 object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-[#10101a] rounded-2xl p-8 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="text-4xl mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full w-16 h-16 flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white text-center">{feature.title}</h3>
            <p className="text-gray-400 text-center text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About; 