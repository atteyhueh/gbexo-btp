import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

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

    const channel = supabase
      .channel('urgent_announcements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'urgent_announcements'
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('urgent_announcements')
        .select('*')
        .eq('is_urgent', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
      setIsVisible(true);
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

  if (announcements.length === 0 || !isVisible) {
    return null;
  }

  const allAnnouncements = [...announcements, ...announcements];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white overflow-hidden shadow-3d"
      style={{ height: '50px', zIndex: 9999 }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors z-10"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="h-full flex items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -50 + '%']
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
              className={`inline-flex items-center px-8 ${
                announcement.link_url ? 'cursor-pointer hover:bg-white/10' : ''
              } transition-colors`}
            >
              <span className="font-bold mr-2">{announcement.title}:</span>
              <span>{announcement.message}</span>
              <span className="mx-8 text-yellow-300">★</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
