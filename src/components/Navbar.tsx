import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavbarProps {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const navItems = [
    { name: 'Hakkımda', to: 'about' },
    { name: 'Deneyim', to: 'experience' },
    { name: 'Projeler', to: 'projects' },
    { name: 'Yetenekler', to: 'skills' },
    { name: 'İletişim', to: 'contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isHomePage ? (
              <Link 
                to="hero" 
                smooth={true} 
                className="text-2xl font-bold text-accent cursor-pointer"
              >
                BCL
              </Link>
            ) : (
              <RouterLink 
                to="/" 
                className="text-2xl font-bold text-accent cursor-pointer"
              >
                BCL
              </RouterLink>
            )}
          </motion.div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {isHomePage && navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    smooth={true}
                    className="nav-link"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <RouterLink
                  to="/lab"
                  className={`nav-link ${location.pathname === '/lab' ? 'text-accent' : ''}`}
                >
                  Lab
                </RouterLink>
              </motion.div>
            </div>
          </div>
          
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-light hover:text-accent transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-darkGray/90 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isHomePage && navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    smooth={true}
                    className="nav-link block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navItems.length) * 0.1 }}
              >
                <RouterLink
                  to="/lab"
                  className={`nav-link block px-3 py-2 ${location.pathname === '/lab' ? 'text-accent' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lab
                </RouterLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar 