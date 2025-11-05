import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, HardHat, Building2, Truck, Bell, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Announcement = {
  id: number;
  title: string;
  content: string;
  cover_image_url: string;
  link_url?: string;
  created_at: string;
};

export default function Hero() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.announcements.list();
      setAnnouncements(data || []);
      setCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleViewMore = (announcement: Announcement) => {
    navigate(`/announcements/${announcement.id}`);
    setIsOpen(false);
  };

  const handleScrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-dark via-sky-primary to-sky-light dark:from-black-solid dark:via-gray-construction dark:to-sky-dark">
      {/* Bouton de notification en haut à droite */}
      <div className="fixed top-20 right-6 z-20" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all duration-200 border border-white/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"

          animate={{
            rotate: count > 0 ? [0, -40, 40, -40, 40, -30, 30, 0] : 0,
            scale: count > 0 ? [1, 1.1, 1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 3,
            repeat: count > 0 ? Infinity : 0,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        >
          <Bell className={`w-7 h-7 ${isOpen ? 'text-yellow-construction' : 'text-white'} transition-colors`} />
          
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            >
              {count > 9 ? '9+' : count}
            </motion.span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="sticky top-0 bg-gradient-to-r from-yellow-construction to-yellow-dark text-black px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-lg">Annonces ({count})</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-black/10 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[520px] custom-scrollbar">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune annonce pour le moment</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {announcements.map((announcement) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={announcement.cover_image_url}
                            alt={announcement.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                              {announcement.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {announcement.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(announcement.created_at)}
                              </span>
                              <button
                                onClick={() => handleViewMore(announcement)}
                                className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 dark:hover:text-yellow-500 hover:underline transition-all duration-200"
                              >
                                Voir plus →
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 opacity-10"
          animate={{
            y: [0, 30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Building2 className="w-64 h-64 text-white" strokeWidth={0.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 opacity-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Truck className="w-48 h-48 text-white" strokeWidth={0.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/4 opacity-5"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <HardHat className="w-96 h-96 text-yellow-construction" strokeWidth={0.3} />
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{
              y: [0, -15, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <HardHat className="w-20 h-20 md:w-28 md:h-28 text-yellow-construction mx-auto drop-shadow-2xl" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 text-shadow-3d"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          GBEXO <span className="text-yellow-construction">BTP</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-3xl text-white/90 mb-4 font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Construire l'avenir avec solidité et confiance
        </motion.p>

        <motion.p
          className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Expert en bâtiment et travaux publics, nous transformons vos projets en réalité avec professionnalisme et innovation
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <motion.button
            className="bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/quote')}
          >
            Demander un Devis
          </motion.button>

          <motion.button
            className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToServices}
          >
            Découvrir nos Services
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col sm:flex-row gap-8 justify-center items-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-construction">10+</div>
            <div className="text-sm text-white/70">Ans d'Expérience</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-construction">200+</div>
            <div className="text-sm text-white/70">Projets Réalisés</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-construction">100%</div>
            <div className="text-sm text-white/70">Clients Satisfaits</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        onClick={handleScrollToServices}
      >
        <ChevronDown className="w-8 h-8 text-white/70" />
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </section>
  );
}