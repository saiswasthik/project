
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import EnhancedProjects from "@/components/EnhancedProjects";
// import Testimonials from "@/components/Testimonials";
// import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <About />
        <Skills />
        <EnhancedProjects />
        {/* <Testimonials />
        <Blog /> */}
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
