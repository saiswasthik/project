
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCV = () => {
    // You can replace this with your actual CV download link
    const cvUrl = "Saiswasthik.pdf";
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Mende Saiswasthik.pdf';
    link.click();
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop&crop=face"
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 shadow-2xl"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            M Sai Swasthik
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            AI + Python Full Stack Developer
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
              I craft digital experiences that blend innovation with functionality, 
              turning ideas into reality through code.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={() => scrollToSection('projects')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </Button>
            <Button
              onClick={downloadCV}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300"
            >
              Get In Touch
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex justify-center space-x-6"
          >
            <motion.a
              whileHover={{ scale: 1.2, y: -5 }}
              href="https://github.com/saiswasthik"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, y: -5 }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, y: -5 }}
              href="mailto:saiswasthikyadav8@gmail.com"
            >
              <Mail className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown 
            className="w-6 h-6 text-white/60 cursor-pointer hover:text-white transition-colors duration-300"
            onClick={() => scrollToSection('about')}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
