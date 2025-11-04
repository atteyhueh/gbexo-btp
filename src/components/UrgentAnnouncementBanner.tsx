import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { X, AlertCircle } from 'lucide-react';

type UrgentAnnouncement = {
  id: string;
  title: string;
  message: string;
  link_url?: string;
  is_urgent: boolean;
  is_active: boolean;
};

export default function UrgentAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<UrgentAnnouncement[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();

    // Polling toutes les 30 secondes pour vérifier les nouvelles annonces
    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.announcements.urgent();
      setAnnouncements(data || []);
      if (data && data.length > 0) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleAnnouncementClick = (announcement: UrgentAnnouncement) => {
    if (announcement.link_url) {
      if (announcement.link_url.startsWith('http')) {
        window.open(announcement.link_url, '_blank');
      } else {
        navigate(announcement.link_url);
      }
    }
  };

  if (announcements.length === 0) {
    return null;
  }

  const allAnnouncements = [...announcements, ...announcements];

  return (
    <>
      {/* Bouton pour rouvrir la bande quand elle est fermée */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsVisible(true)}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 z-[9998] group"
            aria-label="Afficher les annonces importantes"
          >
            <div className="relative">
              <AlertCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Annonces importantes
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bande d'annonce */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black overflow-hidden shadow-2xl border-t-4 border-black"
            style={{ height: '60px', zIndex: 9999 }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-all duration-300 z-10 hover:scale-110"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="h-full flex items-center">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{
                  x: [0, '-50%']
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear'
                  }
                }}
              >
                {allAnnouncements.map((announcement, index) => (
                  <div
                    key={`${announcement.id}-${index}`}
                    onClick={() => handleAnnouncementClick(announcement)}
                    className={`inline-flex items-center px-8 py-2 ${
                      announcement.link_url ? 'cursor-pointer hover:bg-black/10' : ''
                    } transition-all duration-300`}
                  >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-bold mr-2 text-lg">{announcement.title}:</span>
                    <span className="text-base">{announcement.message}</span>
                    <span className="mx-8 text-red-600 text-2xl animate-pulse">●</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Effet de brillance animé */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'linear'
              }}
              style={{ width: '50%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}