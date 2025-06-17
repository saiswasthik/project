import React from "react";

const skills = [
  { name: "Python", percent: 80, color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
  { name: "Generative Ai", percent: 70, color: "bg-gradient-to-r from-blue-400 to-cyan-400" },
  { name: "Azure", percent: 75, color: "bg-gradient-to-r from-green-400 to-emerald-400" },
  { name: "MYSQL/NOSQL", percent: 75, color: "bg-gradient-to-r from-purple-400 to-indigo-400" },
  { name: "FastAPI", percent: 75, color: "bg-gradient-to-r from-pink-400 to-red-400" },
  { name: "REST APIs", percent: 70, color: "bg-gradient-to-r from-blue-400 to-indigo-400" },
];

const Skills = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="skills">
      <h2 className="text-4xl font-bold text-center mb-2">Skills & Expertise</h2>
      <p className="text-center text-lg text-gray-300 mb-12">Here are the technologies and tools I work with to bring ideas to life</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills.map((skill) => (
          <div key={skill.name} className="bg-[#181829] rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">{skill.name}</span>
              <span className="font-bold text-gray-300">{skill.percent}%</span>
            </div>
            <div className="w-full h-3 bg-[#23234a] rounded-full overflow-hidden">
              <div
                className={`${skill.color} h-3 rounded-full transition-all`}
                style={{ width: `${skill.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills; 