import { motion, useScroll, useTransform } from 'framer-motion'

const experiences = [
  {
    title: 'Fullstack Developer',
    company: 'ID Language Academy',
    period: '2022 - Şu anda',
    description: [
      '1500+ kullanıcıya sahip ücretli online dil eğitimi platformu',
      'Canlı dersler, dokümanlar, videolar, sözlük ve oyun gibi özellikleri içeren kapsamlı bir eğitim platformu',
      'Modern web teknolojileri kullanarak kullanıcı dostu arayüz ve güçlü backend altyapısı geliştirme'
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    link: '#'
  },
  {
    title: 'Stajyer',
    company: 'Monilas Bilişim',
    period: 'Temmuz 2024 - Eylül 2024',
    description: [
      'Java ve Spring Boot ile 2 proje geliştirme',
      'Üniversite için Bilgi Yönetim Sistemi geliştirme',
      'Kitap Mağazası uygulaması geliştirme'
    ],
    tech: ['Java', 'Spring Boot', 'TypeScript', 'Next.js'],
    link: '#'
  }
]

const Experience = () => {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/5 to-dark" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        style={{ scale, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl"
      >
        <motion.h2 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title mb-16"
        >
          Deneyim
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent to-accent/50 transform -translate-x-1/2" />

          <div className="space-y-20">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-6 h-6 bg-dark border-2 border-accent rounded-full transform -translate-x-1/2 z-10">
                  <div className="absolute inset-1 bg-accent rounded-full animate-pulse" />
                </div>

                {/* Content */}
                <div className={`glass-morphism p-8 ${index % 2 === 0 ? 'md:text-right md:mr-16' : 'md:ml-16 md:order-1'}`}>
                  <h3 className="text-2xl font-bold text-gradient mb-2">{exp.title}</h3>
                  <p className="text-xl text-light mb-4">{exp.company}</p>
                  <p className="text-accent/80 font-medium mb-6">{exp.period}</p>
                  <ul className="space-y-3 text-light/70">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-1.5">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className={`${index % 2 === 0 ? 'md:ml-16' : 'md:mr-16 md:text-right'}`}>
                  <div className="glass-morphism p-8 h-full flex flex-col justify-center">
                    <h4 className="text-light/80 text-sm uppercase tracking-wider mb-4">Kullanılan Teknolojiler</h4>
                    <div className="flex flex-wrap gap-3 items-center justify-start md:justify-center">
                      {exp.tech.map((tech, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="px-4 py-2 bg-accent/10 rounded-full text-accent border border-accent/20
                            hover:bg-accent/20 transition-colors duration-300 text-sm"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Experience 