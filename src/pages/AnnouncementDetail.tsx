import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, AlertCircle, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnnouncementMedia {
  id: number;
  announcement_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

interface Announcement {
  id: number;
  title: string;
  short_description: string;
  content: string;
  cover_image_url: string;
  is_urgent: boolean;
  created_at: string;
  related_job_id?: number;
  related_service_id?: number;
  related_project_id?: number;
}

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [media, setMedia] = useState<AnnouncementMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🔍 Fetching announcement with ID:', id);
      
      try {
        setIsLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL || 'https://backend-gbtp.tiic-system.com/api';
        console.log('📡 API URL:', API_URL);
        
        const announcementUrl = `${API_URL}/announcements/${id}`;
        console.log('🌐 Fetching from:', announcementUrl);
        
        const announcementRes = await fetch(announcementUrl);
        console.log('📥 Response status:', announcementRes.status);
        
        if (!announcementRes.ok) {
          const errorText = await announcementRes.text();
          console.error('❌ Error response:', errorText);
          throw new Error(`Erreur ${announcementRes.status}: Impossible de charger l'annonce`);
        }
        
        const announcementData = await announcementRes.json();
        console.log('✅ Announcement data:', announcementData);
        setAnnouncement(announcementData);
        
        try {
          const mediaUrl = `${API_URL}/announcements/${id}/media`;
          console.log('🎬 Fetching media from:', mediaUrl);
          
          const mediaRes = await fetch(mediaUrl);
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            console.log('✅ Media data:', mediaData);
            setMedia(mediaData);
          } else {
            console.warn('⚠️ Media fetch failed with status:', mediaRes.status);
          }
        } catch (mediaError) {
          console.warn('⚠️ Could not fetch media:', mediaError);
        }
        
      } catch (error) {
        console.error('❌ Error fetching announcement:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      console.log('🚀 Starting fetch for ID:', id);
      fetchData();
    } else {
      console.error('❌ No ID provided');
      setError('ID d\'annonce manquant');
      setIsLoading(false);
    }
  }, [id]);

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    const imageMedia = allMedia.filter(m => m.media_type === 'image');
    const currentImageInList = imageMedia.findIndex(m => m === allMedia[modalImageIndex]);
    const nextImageInList = (currentImageInList + 1) % imageMedia.length;
    const nextIndex = allMedia.findIndex(m => m === imageMedia[nextImageInList]);
    setModalImageIndex(nextIndex);
  };

  const prevImage = () => {
    const imageMedia = allMedia.filter(m => m.media_type === 'image');
    const currentImageInList = imageMedia.findIndex(m => m === allMedia[modalImageIndex]);
    const prevImageInList = (currentImageInList - 1 + imageMedia.length) % imageMedia.length;
    const prevIndex = allMedia.findIndex(m => m === imageMedia[prevImageInList]);
    setModalImageIndex(prevIndex);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-black-solid">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-black-solid">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <motion.button
            onClick={() => navigate('/')}
            className="bg-sky-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-dark transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Retour à l'accueil
          </motion.button>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-black-solid">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Annonce non trouvée</h2>
          <motion.button
            onClick={() => navigate('/')}
            className="bg-sky-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-dark transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Retour à l'accueil
          </motion.button>
        </div>
      </div>
    );
  }

  const allMedia = media.length > 0
    ? media
    : announcement.cover_image_url
      ? [{ 
          id: 0, 
          announcement_id: announcement.id, 
          media_url: announcement.cover_image_url, 
          media_type: 'image' as const, 
          is_featured: true, 
          order_index: 0 
        }]
      : [];

  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sky-primary hover:text-sky-dark mb-8 font-semibold transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Retour aux annonces
        </motion.button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {allMedia.length > 0 && (
              <>
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-lg mb-6 h-96 bg-gray-900 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  onClick={() => currentMedia.media_type !== 'video' && openModal(currentMediaIndex)}
                >
                  {currentMedia.media_type === 'video' ? (
                    <video
                      src={currentMedia.media_url}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={currentMedia.media_url}
                      alt={announcement.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {allMedia.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {currentMediaIndex + 1} / {allMedia.length}
                    </div>
                  )}
                </motion.div>

                {allMedia.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {allMedia.map((m, idx) => (
                      <motion.button
                        key={m.id}
                        onClick={() => setCurrentMediaIndex(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 relative transition-all ${
                          idx === currentMediaIndex
                            ? 'border-yellow-construction shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 hover:border-sky-primary'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {m.media_type === 'video' ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <img
                            src={m.media_url}
                            alt={`Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}

            <motion.div
              className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {announcement.title}
                </h1>
                {announcement.is_urgent && (
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                    URGENT
                  </span>
                )}
              </div>

              {announcement.short_description && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {announcement.short_description}
                </p>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Publié le {new Date(announcement.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {announcement.related_job_id && (
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Opportunités d'Emploi</h3>
                <p className="text-white/90 mb-6">
                  Découvrez les postes disponibles liés à cette annonce.
                </p>
                <motion.button
                  onClick={() => navigate('/careers')}
                  className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir les Recrutements
                </motion.button>
              </div>
            )}

            {announcement.related_service_id && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Services Connexes</h3>
                <p className="text-white/90 mb-6">
                  Consultez nos services liés à ce domaine.
                </p>
                <motion.button
                  onClick={() => navigate('/services')}
                  className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir les Services
                </motion.button>
              </div>
            )}

            {announcement.related_project_id && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Projets Connexes</h3>
                <p className="text-white/90 mb-6">
                  Découvrez nos réalisations dans ce domaine.
                </p>
                <motion.button
                  onClick={() => navigate('/projects')}
                  className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir les Projets
                </motion.button>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Partager</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Facebook', url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(announcement.title)}` },
                  { name: 'LinkedIn', url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` }
                ].map((social) => (
                  <motion.button
                    key={social.name}
                    onClick={() => window.open(social.url, '_blank', 'width=600,height=400')}
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-sky-500 hover:text-white text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Lightbox pour les images */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.button
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allMedia[modalImageIndex].media_url}
                alt={announcement.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />

              {allMedia.filter(m => m.media_type === 'image').length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>

                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {allMedia.filter(m => m.media_type === 'image').findIndex(m => m === allMedia[modalImageIndex]) + 1} / {allMedia.filter(m => m.media_type === 'image').length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}