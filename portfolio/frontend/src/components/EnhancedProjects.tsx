
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Play, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const EnhancedProjects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Web Apps', 'Mobile', 'API', 'AI/ML'];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-1',
      liveUrl: 'https://ecommerce-demo.example.com',
      githubUrl: 'https://github.com/username/ecommerce-platform',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      category: 'Web Apps',
      featured: true
    },
    {
      title: 'Task Management Mobile App',
      description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-2',
      liveUrl: 'https://taskmanager-demo.example.com',
      githubUrl: 'https://github.com/username/task-manager',
      technologies: ['React Native', 'Firebase', 'TypeScript', 'Redux'],
      category: 'Mobile',
      featured: false
    },
    {
      title: 'AI-Powered Analytics Dashboard',
      description: 'An intelligent analytics platform using machine learning for predictive insights and automated reporting.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-3',
      liveUrl: 'https://analytics-demo.example.com',
      githubUrl: 'https://github.com/username/ai-analytics',
      technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
      category: 'AI/ML',
      featured: true
    },
    {
      title: 'RESTful API Service',
      description: 'A robust microservices architecture with comprehensive API documentation, rate limiting, and monitoring.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-4',
      liveUrl: 'https://api-demo.example.com',
      githubUrl: 'https://github.com/username/api-service',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Docker'],
      category: 'API',
      featured: false
    },
    {
      title: 'Real-time Chat Application',
      description: 'A modern chat application with real-time messaging, file sharing, and video calling capabilities.',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-5',
      liveUrl: 'https://chat-demo.example.com',
      githubUrl: 'https://github.com/username/chat-app',
      technologies: ['React', 'Socket.io', 'WebRTC', 'Redis'],
      category: 'Web Apps',
      featured: false
    },
    {
      title: 'Blockchain Voting System',
      description: 'A secure voting platform built on blockchain technology ensuring transparency and immutability.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=300&fit=crop',
      videoUrl: 'https://www.example.com/demo-video-6',
      liveUrl: 'https://voting-demo.example.com',
      githubUrl: 'https://github.com/username/blockchain-voting',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
      category: 'Web Apps',
      featured: true
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A collection of projects showcasing different technologies and solutions
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div> */}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`bg-gray-800/50 border-gray-700 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 ${
                project.featured ? 'ring-2 ring-blue-500/50' : ''
              }`}>
                <div className="relative group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-black mr-2"
                      onClick={() => window.open(project.videoUrl, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                  <div className="text-sm text-blue-400">{project.category}</div>
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
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EnhancedProjects;
