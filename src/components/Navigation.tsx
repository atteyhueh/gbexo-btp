import { motion, useScroll, useTransform } from 'framer-motion';
import { HardHat, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';


interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navigation({ darkMode, toggleDarkMode }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(10, 10, 10, 0.95)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Projets', href: '/projects' },
    { name: 'À propos', href: '/about' },
    { name: 'Carrières', href: '/careers' },
  ];

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'shadow-3d' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/">
              <motion.div
                className="flex items-center space-x-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <HardHat className="w-10 h-10 text-yellow-construction" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">
                  GBEXO <span className="text-yellow-construction">BTP</span>
                </h1>
              </div>
            </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className={`text-white hover:text-yellow-construction transition-colors cursor-pointer font-medium ${
                      location.pathname === item.href ? 'text-yellow-construction' : ''
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}

              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-yellow-construction/20 hover:bg-yellow-construction/30 transition-colors"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-construction" />
                ) : (
                  <Moon className="w-5 h-5 text-yellow-construction" />
                )}
              </motion.button>

              <Link to="/quote">
                <motion.button
                  className="bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-6 py-2 rounded-full font-semibold shadow-3d hover:shadow-3d-hover transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Devis Gratuit
                </motion.button>
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-yellow-construction/20"
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-construction" />
                ) : (
                  <Moon className="w-5 h-5 text-yellow-construction" />
                )}
              </motion.button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <motion.div
            className="md:hidden bg-black-solid/95 backdrop-blur-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    className={`block text-white hover:text-yellow-construction transition-colors cursor-pointer font-medium text-lg ${
                      location.pathname === item.href ? 'text-yellow-construction' : ''
                    }`}
                    whileHover={{ x: 10 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <Link to="/quote" onClick={() => setIsOpen(false)}>
                <motion.button
                  className="w-full bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-6 py-3 rounded-full font-semibold shadow-3d"
                  whileTap={{ scale: 0.95 }}
                >
                  Devis Gratuit
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}
