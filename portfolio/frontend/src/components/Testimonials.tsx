
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager at TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'Working with this developer was an absolute pleasure. The attention to detail and code quality exceeded our expectations.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CTO at StartupHub',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Exceptional problem-solving skills and delivery speed. Our project was completed ahead of schedule with outstanding results.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Design Lead at CreativeStudio',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The collaboration was seamless. Great communication and the ability to turn our designs into pixel-perfect implementations.',
      rating: 5
    },
    {
      name: 'David Rodriguez',
      role: 'Founder of InnovateLab',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: 'Professional, reliable, and incredibly skilled. I would definitely recommend and work together again on future projects.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

//   return (
//     <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
//       <div className="container mx-auto px-6">
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 50 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//             What Clients Say
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Feedback from clients and colleagues I've had the pleasure to work with
//           </p>
//         </motion.div>

//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             key={currentTestimonial}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl">
//               <CardContent className="p-12 text-center">
//                 <Quote className="w-12 h-12 text-blue-600 mx-auto mb-6" />
//                 <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
//                   "{testimonials[currentTestimonial].content}"
//                 </p>
                
//                 <div className="flex justify-center mb-6">
//                   {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                   ))}
//                 </div>
                
//                 <div className="flex items-center justify-center">
//                   <img
//                     src={testimonials[currentTestimonial].image}
//                     alt={testimonials[currentTestimonial].name}
//                     className="w-16 h-16 rounded-full mr-4 border-4 border-blue-200 dark:border-blue-800"
//                   />
//                   <div>
//                     <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
//                       {testimonials[currentTestimonial].name}
//                     </h4>
//                     <p className="text-gray-600 dark:text-gray-400">
//                       {testimonials[currentTestimonial].role}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <div className="flex justify-center mt-8 space-x-2">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentTestimonial(index)}
//                 className={`w-3 h-3 rounded-full transition-colors duration-300 ${
//                   index === currentTestimonial
//                     ? 'bg-blue-600'
//                     : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
};

export default Testimonials;