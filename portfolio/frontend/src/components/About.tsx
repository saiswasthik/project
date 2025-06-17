
import { Code, Palette, Rocket, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    {
      icon: Code,
      title: "Development",
      description: "Full-stack development with modern technologies like React, Node.js, and TypeScript."
    },
    {
      icon: Palette,
      title: "Design",
      description: "Creating beautiful, user-friendly interfaces with attention to detail and user experience."
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Optimizing applications for speed, scalability, and excellent performance metrics."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working effectively in teams and communicating complex technical concepts clearly."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
            I'm a passionate full-stack developer with a strong foundation in backend  currently diving deep into the world of AI-powered applications. My journey started with curiosity about how the web works and has grown into a mission to build impactful, intelligent digital solutions.
I specialize in technologies like Python, FastAPI, MySQL, and more recently, I’ve been integrating AI models using OpenAI APIs, LangChain, and Generative AI frameworks.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
            I’m passionate about using AI to solve real-world problems — whether it's automating data extraction, building conversational agents, or creating personalized recommendations. When I’m not building apps, I’m either learning the latest in LLMs and prompt engineering, contributing to open source, or exploring AI-driven development workflows.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Python",  "Azure","FastAPI","OpenAI","LangChain","Generative AI"].map((tech) => (
                <span 
                  key={tech}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop"
              alt="Workspace"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white-900 mb-3">{skill.title}</h3>
                <p className="text-white-900 text-sm leading-relaxed">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
