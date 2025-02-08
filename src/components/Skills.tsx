import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Skill {
  name: string
  icon: string
  level: number
  color: string
  category: string
  description: string
}

const getSkillLevel = (level: number): string => {
  if (level >= 90) return 'Uzman'
  if (level >= 85) return 'İleri Düzey'
  if (level >= 80) return 'Profesyonel'
  if (level >= 75) return 'Orta-İleri Düzey'
  return 'Orta Düzey'
}

const skills: Skill[] = [
  // Frontend
  { 
    name: 'Next.js', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 
    level: 90, 
    color: '#000000',
    category: 'Frontend',
    description: 'SSR, ISR, ve dinamik routing konularında uzmanlaşma'
  },
  { 
    name: 'React', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 
    level: 90, 
    color: '#61DAFB',
    category: 'Frontend',
    description: 'Hooks, Context API ve performans optimizasyonu konularında deneyim'
  },
  { 
    name: 'TypeScript', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 
    level: 85, 
    color: '#3178C6',
    category: 'Frontend',
    description: 'Generic types ve advanced patterns konularında uzmanlaşma'
  },
  { 
    name: 'JavaScript', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 
    level: 90, 
    color: '#F7DF1E',
    category: 'Frontend',
    description: 'ES6+, async/await ve modern JavaScript özellikleri'
  },
  { 
    name: 'Tailwind', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', 
    level: 90, 
    color: '#06B6D4',
    category: 'Frontend',
    description: 'Responsive tasarım ve custom konfigürasyon deneyimi'
  },
  { 
    name: 'CSS', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 
    level: 85, 
    color: '#1572B6',
    category: 'Frontend',
    description: 'Flexbox, Grid ve modern CSS özellikleri'
  },
  { 
    name: 'HTML', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 
    level: 90, 
    color: '#E34F26',
    category: 'Frontend',
    description: 'Semantik HTML ve SEO optimizasyonu'
  },

  // Backend
  { 
    name: 'Node.js', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 
    level: 85, 
    color: '#339933',
    category: 'Backend',
    description: 'REST API ve microservices geliştirme deneyimi'
  },
  { 
    name: 'Express', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 
    level: 85, 
    color: '#000000',
    category: 'Backend',
    description: 'Middleware geliştirme ve route optimizasyonu'
  },
  { 
    name: 'Spring', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', 
    level: 80, 
    color: '#6DB33F',
    category: 'Backend',
    description: 'Spring Boot ve Spring Security deneyimi'
  },
  { 
    name: 'Java', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', 
    level: 85, 
    color: '#007396',
    category: 'Backend',
    description: 'OOP prensipleri ve design patterns uygulaması'
  },
  { 
    name: 'C++', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 
    level: 75, 
    color: '#00599C',
    category: 'Backend',
    description: 'Algoritma ve veri yapıları implementasyonu'
  },
  { 
    name: 'C', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', 
    level: 75, 
    color: '#A8B9CC',
    category: 'Backend',
    description: 'Sistem programlama ve memory management'
  },

  // Database
  { 
    name: 'PostgreSQL', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 
    level: 85, 
    color: '#4169E1',
    category: 'Database',
    description: 'Complex queries ve performans optimizasyonu'
  },
  { 
    name: 'MySQL', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 
    level: 80, 
    color: '#4479A1',
    category: 'Database',
    description: 'Database tasarımı ve normalizasyon'
  },
  { 
    name: 'MongoDB', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 
    level: 85, 
    color: '#47A248',
    category: 'Database',
    description: 'NoSQL veritabanı modelleme ve aggregation'
  },

  // DevOps
  { 
    name: 'Git', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 
    level: 90, 
    color: '#F05032',
    category: 'DevOps',
    description: 'Branch stratejileri ve CI/CD entegrasyonu'
  },
  { 
    name: 'Linux', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', 
    level: 85, 
    color: '#FCC624',
    category: 'DevOps',
    description: 'Sistem yönetimi ve shell scripting'
  },
  { 
    name: 'Bash', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg', 
    level: 80, 
    color: '#4EAA25',
    category: 'DevOps',
    description: 'Otomasyon ve task scheduling'
  },
  { 
    name: 'Nginx', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg', 
    level: 75, 
    color: '#009639',
    category: 'DevOps',
    description: 'Reverse proxy ve load balancing konfigürasyonu'
  }
]

const certificates = [
  {
    name: 'Back End Development and APIs',
    org: 'FreeCodeCamp',
    link: '#'
  },
  {
    name: 'Relational Database',
    org: 'FreeCodeCamp',
    link: '#'
  },
  {
    name: 'JavaScript Algorithms and Data Structures',
    org: 'FreeCodeCamp',
    link: '#'
  },
  {
    name: 'Front End Development Libraries',
    org: 'FreeCodeCamp',
    link: '#'
  },
  {
    name: 'Responsive Web Design',
    org: 'FreeCodeCamp',
    link: '#'
  }
]

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('Frontend')
  const categories = Array.from(new Set(skills.map(skill => skill.category)))
  const filteredSkills = skills.filter(skill => skill.category === selectedCategory)

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/5 to-dark" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl"
      >
        <motion.h2 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title mb-16"
        >
          Yetenekler
        </motion.h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-accent text-dark'
                  : 'bg-darkGray/30 text-light hover:bg-darkGray/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-morphism p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
              whileHover={{ y: -5 }}
              style={{
                background: `linear-gradient(135deg, ${skill.color}10, ${skill.color}05)`,
                borderColor: `${skill.color === '#000000' ? '#FFFFFF30' : `${skill.color}30`}`
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg p-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: `${skill.color}15`,
                    boxShadow: `0 0 20px ${skill.color}20`
                  }}
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-light group-hover:text-accent transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <p 
                    className="text-sm font-medium mt-1"
                    style={{ color: skill.color === '#000000' ? '#FFFFFF' : skill.color }}
                  >
                    {getSkillLevel(skill.level)}
                  </p>
                  <p className="text-light/60 text-sm mt-2 line-clamp-2">
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24"
        >
          <h3 className="text-2xl font-bold text-gradient mb-12 text-center">Sertifikalar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.a
                key={cert.name}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-morphism p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-darkGray/30 p-3 group-hover:bg-darkGray/50 transition-colors duration-300">
                    <img
                      src={cert.icon || "/fcc.png"}
                      alt={cert.org}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-light group-hover:text-accent transition-colors duration-300">
                      {cert.name}
                    </h4>
                    <p className="text-light/60 text-sm mt-1">{cert.org}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills 