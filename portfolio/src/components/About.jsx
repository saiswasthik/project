import React from "react";

const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"];
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
            I'm a passionate developer with over 5 years of experience creating digital solutions that make a difference. My journey began with curiosity about how things work, and it has evolved into a career dedicated to building innovative applications.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            I specialize in modern web technologies and love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies, contributing to open source, or mentoring other developers.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {skills.map((skill) => (
              <span key={skill} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=400&h=300&q=22"
            alt="About"
            className="rounded-2xl shadow-lg w-96 h-64 object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-[#10101a] rounded-2xl p-8 flex flex-col items-center shadow-md">
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