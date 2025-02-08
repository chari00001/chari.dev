import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'

const Contact = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  const contactInfo = [
    {
      id: 'email',
      icon: <Mail className="w-6 h-6" />,
      label: 'E-posta',
      value: 'cagrilacin303@gmail.com',
      link: 'mailto:cagrilacin303@gmail.com',
      color: '#EA4335'
    },
    {
      id: 'phone',
      icon: <Phone className="w-6 h-6" />,
      label: 'Telefon',
      value: '+90 507 899 42 46',
      link: 'tel:+905078994246',
      color: '#34A853'
    },
    {
      id: 'location',
      icon: <MapPin className="w-6 h-6" />,
      label: 'Konum',
      value: 'Trabzon, Türkiye',
      link: 'https://maps.google.com/?q=Trabzon,Turkey',
      color: '#4285F4'
    }
  ]

  const socialLinks = [
    {
      id: 'github',
      label: 'GitHub',
      icon: <Github className="w-6 h-6" />,
      link: 'https://github.com/chari00001',
      color: '#333333'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      link: 'https://linkedin.com/in/berk-çağrı-laçin',
      color: '#0A66C2'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/5 to-dark" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 relative z-10"
      >
        <motion.h2 
          variants={itemVariants}
          className="section-title text-center"
        >
          İletişime Geç
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-light/70 text-lg max-w-2xl mx-auto text-center mb-16"
        >
          Yeni fırsatlar için her zaman açığım. İster bir proje teklifi, ister bir soru olsun, 
          benimle iletişime geçmekten çekinmeyin.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="glass-morphism p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gradient mb-8">İletişim Bilgileri</h3>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.id}
                  href={info.link}
                  target={info.id === 'location' ? '_blank' : undefined}
                  rel={info.id === 'location' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 group"
                  onMouseEnter={() => setHoveredIcon(info.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  whileHover={{ x: 10 }}
                  style={{
                    color: hoveredIcon === info.id ? info.color : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: hoveredIcon === info.id ? `${info.color}20` : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: hoveredIcon === info.id ? `0 0 20px ${info.color}30` : 'none'
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-light/50">{info.label}</p>
                    <p className="font-medium transition-colors duration-300">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="glass-morphism p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gradient mb-8">Sosyal Medya</h3>
            <div className="space-y-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                  onMouseEnter={() => setHoveredIcon(social.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  whileHover={{ x: 10 }}
                  style={{
                    color: hoveredIcon === social.id ? social.color : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: hoveredIcon === social.id ? `${social.color}20` : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: hoveredIcon === social.id ? `0 0 20px ${social.color}30` : 'none'
                      }}
                    >
                      {social.icon}
                    </div>
                    <span className="font-medium">{social.label}</span>
                  </div>
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ 
                      x: hoveredIcon === social.id ? 0 : -10,
                      opacity: hoveredIcon === social.id ? 1 : 0
                    }}
                    className="text-xl"
                  >
                    →
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Contact 