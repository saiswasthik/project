
import { ExternalLink, Github, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
      videoUrl: "https://www.example.com/demo-video-1",
      liveUrl: "https://ecommerce-demo.example.com",
      githubUrl: "https://github.com/username/ecommerce-platform",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"]
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop",
      videoUrl: "https://www.example.com/demo-video-2",
      liveUrl: "https://taskmanager-demo.example.com",
      githubUrl: "https://github.com/username/task-manager",
      technologies: ["React", "Firebase", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Weather Dashboard",
      description: "An interactive weather dashboard with location-based forecasts, historical data visualization, and severe weather alerts.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=300&fit=crop",
      videoUrl: "https://www.example.com/demo-video-3",
      liveUrl: "https://weather-dashboard-demo.example.com",
      githubUrl: "https://github.com/username/weather-dashboard",
      technologies: ["React", "D3.js", "OpenWeather API", "Chart.js"]
    },
    {
      title: "Social Media Analytics",
      description: "A comprehensive analytics platform for social media metrics with real-time data processing and visualization dashboards.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
      videoUrl: "https://www.example.com/demo-video-4",
      liveUrl: "https://analytics-demo.example.com",
      githubUrl: "https://github.com/username/social-analytics",
      technologies: ["Vue.js", "Python", "MongoDB", "Docker"]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Here are some of the projects I've worked on recently. Each one represents 
            a unique challenge and learning experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-black mr-2"
                    onClick={() => window.open(project.videoUrl, '_blank')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Demo Video
                  </Button>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-white text-xl">{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open(project.liveUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
