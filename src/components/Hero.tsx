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
      className="typing-text text-lg font-mono"
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

      {/* Mouse Follower */}
      <motion.div
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        {/* Ana Parıltı Katmanı */}
        <motion.div 
          className="w-full h-full relative"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Merkez Nokta */}
          <motion.div 
            className="absolute inset-0 bg-accent rounded-full"
            style={{
              boxShadow: `
                0 0 10px 2px rgba(215,35,35,0.8),
                0 0 20px 4px rgba(215,35,35,0.6),
                0 0 30px 6px rgba(215,35,35,0.4),
                0 0 40px 8px rgba(215,35,35,0.2)
              `,
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* İç Parıltı Halkası */}
          <motion.div 
            className="absolute -inset-2"
            style={{
              background: 'radial-gradient(circle at center, rgba(215,35,35,0.8) 0%, rgba(215,35,35,0) 70%)',
              filter: 'blur(4px)',
            }}
            animate={{
              scale: [1.2, 1.4, 1.2],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Orta Parıltı Halkası */}
          <motion.div 
            className="absolute -inset-4"
            style={{
              background: 'radial-gradient(circle at center, rgba(215,35,35,0.5) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)',
              filter: 'blur(8px)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Dış Parıltı Halkası */}
          <motion.div 
            className="absolute -inset-8"
            style={{
              background: 'radial-gradient(circle at center, rgba(215,35,35,0.2) 0%, rgba(215,35,35,0.1) 30%, transparent 70%)',
              filter: 'blur(12px)',
            }}
            animate={{
              scale: [1.2, 1.8, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Takip Eden Parıltı İzi */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle at center, rgba(215,35,35,0.3) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>

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
              className="glass-morphism p-8 sm:p-12 mb-8 relative group transform-style-3d"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-accent text-lg sm:text-xl mb-4 uppercase tracking-wider font-medium"
                style={{
                  transform: isHovered
                    ? `translateZ(75px) translate(${calculateParallax(30).x}px, ${calculateParallax(30).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                Merhaba, ben
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
                style={{
                  transform: isHovered
                    ? `translateZ(100px) translate(${calculateParallax(20).x}px, ${calculateParallax(20).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                <h1 className="text-6xl sm:text-8xl font-bold mb-4 relative z-10">
                  <motion.span 
                    className="text-light inline-block"
                    whileHover={{ 
                      color: '#D72323',
                      textShadow: "0 0 15px rgba(215, 35, 35, 0.5)"
                    }}
                  >
                    Berk{" "}
                  </motion.span>
                  <motion.span 
                    className="text-gradient bg-gradient-to-r from-accent via-light to-accent bg-clip-text inline-block"
                    whileHover={{
                      backgroundImage: "linear-gradient(to right, #D72323, #FFFFFF, #D72323, #FFFFFF)",
                      backgroundSize: "200% 100%",
                      textShadow: "0 0 15px rgba(215, 35, 35, 0.5)"
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    Çağrı{" "}
                  </motion.span>
                  <motion.span 
                    className="text-light inline-block"
                    whileHover={{ 
                      color: '#D72323',
                      textShadow: "0 0 15px rgba(215, 35, 35, 0.5)"
                    }}
                  >
                    Laçin
                  </motion.span>
                </h1>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-accent/20 to-light/20 blur-3xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl sm:text-5xl font-bold mb-8 text-light/80"
                whileHover={{
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  color: "rgba(255, 255, 255, 0.9)"
                }}
                style={{
                  transform: isHovered
                    ? `translateZ(75px) translate(${calculateParallax(25).x}px, ${calculateParallax(25).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                Yazılım Geliştirici
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-12 relative"
                style={{
                  transform: isHovered
                    ? `translateZ(50px) translate(${calculateParallax(40).x}px, ${calculateParallax(40).y}px)`
                    : "none",
                  transition: "transform 0.2s ease-out"
                }}
              >
                <TypingText 
                  text="Karadeniz Teknik Üniversitesi'nde Bilgisayar Mühendisliği son sınıf öğrencisiyim. ID Language Academy'de Fullstack Developer olarak çalışıyorum ve etkili yazılım çözümleri geliştirmeye tutkuyla bağlıyım." 
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6"
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
