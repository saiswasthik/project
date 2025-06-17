
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const blogPosts = [
    {
      title: 'Building Scalable React Applications',
      excerpt: 'Learn the best practices for creating maintainable and scalable React applications that can grow with your business needs.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'React',
      url: '#'
    },
    {
      title: 'The Future of Web Development',
      excerpt: 'Exploring emerging technologies and trends that are shaping the future of web development in 2024 and beyond.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      date: '2024-01-10',
      readTime: '12 min read',
      category: 'Technology',
      url: '#'
    },
    {
      title: 'Optimizing Performance in Modern Apps',
      excerpt: 'Deep dive into performance optimization techniques for modern web applications, including code splitting and lazy loading.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      date: '2024-01-05',
      readTime: '10 min read',
      category: 'Performance',
      url: '#'
    }
  ];

//   return (
//     <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
//       <div className="container mx-auto px-6">
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 50 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//             Latest Blog Posts
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Thoughts, insights, and tutorials about web development and technology
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {blogPosts.map((post, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 50 }}
//               animate={inView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//             >
//               <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
//                 <div className="relative overflow-hidden rounded-t-lg">
//                   <img
//                     src={post.image}
//                     alt={post.title}
//                     className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//                   />
//                   <div className="absolute top-4 left-4">
//                     <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                       {post.category}
//                     </span>
//                   </div>
//                 </div>
                
//                 <CardHeader className="pb-3">
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
//                     {post.title}
//                   </h3>
//                 </CardHeader>
                
//                 <CardContent className="pt-0">
//                   <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
//                     {post.excerpt}
//                   </p>
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-1" />
//                       {new Date(post.date).toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-1" />
//                       {post.readTime}
//                     </div>
//                   </div>
                  
//                   <Button
//                     variant="ghost"
//                     className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
//                     onClick={() => window.open(post.url, '_blank')}
//                   >
//                     Read More
//                     <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={inView ? { opacity: 1 } : {}}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="text-center mt-12"
//         >
//           <Button
//             size="lg"
//             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
//           >
//             View All Posts
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   );
};

export default Blog;
