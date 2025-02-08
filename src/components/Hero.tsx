import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import { useEffect, useState, useRef } from 'react'

// TypingText bileşeni: Verilen metni karakter karakter ekrana yazdırır.
const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [showCaret, setShowCaret] = useState(true)

  useEffect(() => {
    let index = 0
    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++
      if (index > text.length) {
        clearInterval(typingInterval)
      }
    }, 10) // Her karakter için 50ms

    // Beyaz imleç (caret) yanıp sönme animasyonu
    const caretInterval = setInterval(() => {
      setShowCaret(prev => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(caretInterval)
    }
  }, [text])

  return (
    <span
      className="typing-text text-md font-mono"
      style={{ fontFamily: 'monospace' }}
    >
      {displayedText}
      <span
        className="caret inline-block"
        style={{ display: 'inline-block', width: '1ch', color: 'white' }}
      >
        {showCaret ? '|' : ' '}
      </span>
    </span>
  )
}

const Hero = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Mouse Follower
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Gradient pozisyonu
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Gelişmiş Tilt Animasyonu
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLeaving, setIsLeaving] = useState(false)

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    cursorX.set(clientX - 16)
    cursorY.set(clientY - 16)

    // Gradient pozisyonunu güncelle
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100
    setGradientPosition({ x, y })

    // Tilt efektini güncelle
    if (cardRef.current) {
      const card = cardRef.current
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = clientX - centerX
      const mouseY = clientY - centerY

      // Maksimum eğilme açısı ve yumuşatma faktörü
      const maxTiltAngle = 20
      const smoothingFactor = 0.15

      // Hedef açıları hesapla
      const targetTiltY = -(mouseX / (rect.width / 2)) * maxTiltAngle
      const targetTiltX = (mouseY / (rect.height / 2)) * maxTiltAngle

      // Yumuşak geçiş
      setTilt(prev => ({
        x: prev.x + (targetTiltX - prev.x) * smoothingFactor,
        y: prev.y + (targetTiltY - prev.y) * smoothingFactor
      }))

      setMousePosition({ x: mouseX, y: mouseY })
    }
  }

  const handleMouseLeave = () => {
    setIsLeaving(true)
    // Tilt açısını başlangıca kademeli olarak getir
    const resetTilt = () => {
      setTilt(prev => ({
        x: prev.x * 0.9,
        y: prev.y * 0.9
      }))

      if (Math.abs(tilt.x) > 0.1 || Math.abs(tilt.y) > 0.1) {
        requestAnimationFrame(resetTilt)
      } else {
        setTilt({ x: 0, y: 0 })
        setIsLeaving(false)
      }
    }
    requestAnimationFrame(resetTilt)
    setIsHovered(false)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY])

  // Paralaks derinlik efekti
  const calculateParallax = (depth: number = 20) => {
    if (!isHovered) return { x: 0, y: 0 }
    const x = (mousePosition.x / depth) * (isLeaving ? 0.5 : 1)
    const y = (mousePosition.y / depth) * (isLeaving ? 0.5 : 1)
    return { x, y }
  }

  return (
    <section id="hero" className="w-full min-h-screen relative overflow-hidden">
      {/* Grid Dokusu */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />


      {/* Arka Plan Öğeleri */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/20 to-dark" />
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 
            `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, rgba(215, 35, 35, 0.3) 0%, transparent 50%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)`
        }}
      />
      
      <motion.div 
        className="absolute top-20 -left-32 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[128px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-darkGray/50 rounded-full blur-[128px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: y2 }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center perspective-[2000px]">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ opacity }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotateX: tilt.x,
                rotateY: tilt.y,
                transition: {
                  rotateX: { duration: 0.1, ease: "linear" },
                  rotateY: { duration: 0.1, ease: "linear" }
                }
              }}
              transition={{ duration: 0.8 }}
              className="glass-morphism p-4 sm:p-8 md:p-12 mb-8 relative group transform-style-3d mt-20 sm:mt-0"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={handleMouseLeave}
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              }}
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-accent via-light to-accent opacity-0 group-hover:opacity-30 rounded-2xl blur-md transition-all duration-500"
                animate={{
                  background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, rgba(215, 35, 35, 0.5), rgba(255, 255, 255, 0.2), transparent)`,
                  backgroundSize: isHovered ? '200% 200%' : '100% 100%'
                }}
                transition={{ duration: 1 }}
                style={{
                  transform: "translateZ(50px)"
                }}
              />
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-light/60 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 tracking-wider font-light"
              >
                Merhaba, ben
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative mb-6 sm:mb-8"
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold relative z-10 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 font-mono">
                  <motion.div className="flex items-center space-x-4">
                    {/* Berk */}
                    <motion.span
                      className="relative inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <span className="relative text-light z-10 transition-colors duration-300 hover:text-accent [text-shadow:0_0_10px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.2),0_0_30px_rgba(215,35,35,0.4)]">
                        Berk
                      </span>
                      <motion.span
                        className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(215,35,35,0.7)]"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>

                    {/* Çağrı */}
                    <motion.span
                      className="relative inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <span className="relative text-accent z-10 [text-shadow:0_0_10px_rgba(215,35,35,0.5),0_0_20px_rgba(215,35,35,0.3),0_0_30px_rgba(215,35,35,0.2)]">
                        Çağrı
                      </span>
                      <motion.div
                        className="absolute -inset-2 bg-accent/5 rounded-lg -z-10 shadow-[0_0_30px_rgba(215,35,35,0.2)]"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>

                    {/* Laçin */}
                    <motion.span
                      className="relative inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <span className="relative text-light z-10 transition-colors duration-300 hover:text-accent [text-shadow:0_0_10px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.2),0_0_30px_rgba(215,35,35,0.4)]">
                        Laçin
                      </span>
                      <motion.span
                        className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(215,35,35,0.7)]"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                  </motion.div>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative inline-block"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light/80 relative z-10 font-mono">
                  <span className="relative inline-block group [text-shadow:0_0_10px_rgba(255,255,255,0.2),0_0_20px_rgba(215,35,35,0.3)]">
                    Yazılım Geliştirici
                    
                  </span>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="my-8 sm:mb-12 relative text-sm sm:text-base md:text-lg"
                style={{
                  transform: isHovered
                    ? `translateZ(50px) translate(${calculateParallax(40).x}px, ${calculateParallax(40).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                <TypingText 
                  text="Karadeniz Teknik Üniversitesi'nde Bilgisayar Mühendisliği son sınıf öğrencisiyim. Yaklaşık 4 yıldır web geliştirme üzerine çalışıyorum ve aynı zamanda ID Language Academy'de Software Developer olarak çalışıyorum. Kariyerime devam ederken yeni projeler geliştirmeye ve yeni teknolojiler öğrenmeye devam ediyorum." 
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                style={{
                  transform: isHovered
                    ? `translateZ(60px) translate(${calculateParallax(35).x}px, ${calculateParallax(35).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                <Link
                  to="contact"
                  smooth={true}
                  className="btn-primary text-center group relative overflow-hidden hover:shadow-lg hover:shadow-accent/20 transition-all duration-500"
                >
                  <motion.span 
                    className="relative z-10 flex items-center justify-center gap-2 text-accent group-hover:text-light transition-colors duration-300"
                    whileHover={{
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
                    }}
                  >
                    İletişime Geç
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-accent via-accent/90 to-accent translate-x-[110%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-[1]"
                    whileHover={{
                      filter: "brightness(1.2)"
                    }}
                    style={{
                      backgroundSize: "200% 100%"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(215,35,35,0.5),_transparent_60%)]"
                    style={{
                      transform: "translateZ(-1px)"
                    }}
                  />
                </Link>
                <Link
                  to="projects"
                  smooth={true}
                  className="btn-primary text-center group relative overflow-hidden hover:shadow-lg hover:shadow-accent/20 transition-all duration-500"
                >
                  <motion.span 
                    className="relative z-10 flex items-center justify-center gap-2 text-accent group-hover:text-light transition-colors duration-300"
                    whileHover={{
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
                    }}
                  >
                    Projelerimi Gör
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-accent via-accent/90 to-accent translate-x-[110%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-[1]"
                    whileHover={{
                      filter: "brightness(1.2)"
                    }}
                    style={{
                      backgroundSize: "200% 100%"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(215,35,35,0.5),_transparent_60%)]"
                    style={{
                      transform: "translateZ(-1px)"
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Gösterge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.p 
                className="text-light/50 text-sm uppercase tracking-widest"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Aşağı Kaydır
              </motion.p>
              <div className="w-6 h-10 border-2 border-light/20 rounded-full flex justify-center p-2">
                <motion.div
                  animate={{
                    y: [0, 12, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                  className="w-1.5 h-1.5 bg-accent rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
