
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Database, Globe, Smartphone, Cloud, GitBranch } from 'lucide-react';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
    { name: 'JavaScript/TypeScript', level: 95, icon: Code, color: 'from-yellow-400 to-orange-500' },
    { name: 'React/Next.js', level: 90, icon: Globe, color: 'from-blue-400 to-cyan-500' },
    { name: 'Node.js/Express', level: 85, icon: Database, color: 'from-green-400 to-emerald-500' },
    { name: 'Python/Django', level: 80, icon: Code, color: 'from-blue-500 to-purple-500' },
    { name: 'Mobile Development', level: 75, icon: Smartphone, color: 'from-pink-400 to-red-500' },
    { name: 'Cloud & DevOps', level: 85, icon: Cloud, color: 'from-indigo-400 to-blue-500' },
    { name: 'Git/GitHub', level: 90, icon: GitBranch, color: 'from-gray-400 to-gray-600' },
    { name: 'Database Design', level: 88, icon: Database, color: 'from-purple-400 to-pink-500' },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${skill.color} rounded-lg flex items-center justify-center mr-4`}>
                  <skill.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className={`h-3 bg-gradient-to-r ${skill.color} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
