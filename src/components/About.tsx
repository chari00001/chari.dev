import { motion, useScroll, useTransform } from 'framer-motion'
import { GraduationCap, Building2, Mail, Phone, MapPin } from 'lucide-react'

const About = () => {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="about" className="py-32 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/20 to-dark" />
      
      <motion.div
        style={{ scale, opacity }}
        className="container mx-auto relative z-10"
      >
        <motion.h2 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Hakkımda
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-morphism p-8 space-y-6 text-light/80"
          >
            <div className="flex items-center gap-4 text-accent">
              <Building2 className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Profesyonel Profil</h3>
            </div>
            <p className="text-lg leading-relaxed">
              Merhaba! Ben Berk Çağrı Laçin, yazılım geliştirme konusunda tutkulu bir geliştiriciyim. 
              Karadeniz Teknik Üniversitesi'nde Bilgisayar Mühendisliği son sınıf öğrencisi olarak, 
              hem teorik hem de pratik anlamda sağlam bir temel oluşturdum.
            </p>
            <p className="text-lg leading-relaxed">
              Şu anda ID Language Academy'de Fullstack Developer olarak çalışıyorum. Bu pozisyonda, 
              1500'den fazla kullanıcıya hizmet veren bir online eğitim platformunun geliştirilmesine 
              katkıda bulunuyorum.
            </p>
            <p className="text-lg leading-relaxed">
              Teknoloji aracılığıyla anlamlı bir fark yaratma ve sürekli öğrenme isteği, 
              yazılım geliştirme yolculuğumun itici gücü. Modern web teknolojileri, 
              veritabanı yönetimi ve yazılım mimarisi konularında sürekli kendimi geliştiriyorum.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-morphism p-8 group hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-darkGray/30 p-2 group-hover:bg-darkGray/50 transition-all duration-300">
                  <img
                    src="/ktu.png"
                    alt="KTÜ Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <GraduationCap className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Eğitim</h3>
                  </div>
                  <p className="text-lg font-medium text-light">Karadeniz Teknik Üniversitesi</p>
                  <p className="text-light/70">Bilgisayar Mühendisliği</p>
                  <p className="text-accent/80">2021 - devam ediyor</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-morphism p-8 space-y-4"
            >
              <div className="flex items-center gap-2 text-accent mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xl font-semibold">İletişim Bilgileri</h3>
              </div>
              <div className="space-y-4 text-light/70">
                <p className="flex items-center gap-3 group hover:text-accent transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                  cagrilacin303@gmail.com
                </p>
                <p className="flex items-center gap-3 group hover:text-accent transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                  +90 507 899 42 46
                </p>
                <p className="flex items-center gap-3 group hover:text-accent transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                  Trabzon, Türkiye
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default About 