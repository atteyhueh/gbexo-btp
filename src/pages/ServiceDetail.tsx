import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Video as VideoIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ServiceMedia {
  id: number;
  service_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

interface Service {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  features: string[];
  icon_name: string;
}

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [media, setMedia] = useState<ServiceMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, mediaRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/services/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/services/${id}/media`)
        ]);
        setService(serviceRes.data);
        setMedia(mediaRes.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service non trouvé</h2>
          <motion.button
            onClick={() => navigate('/services')}
            className="bg-sky-primary text-white px-6 py-3 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Retour aux services
          </motion.button>
        </div>
      </div>
    );
  }

  const allMedia = media.length > 0
    ? media
    : service.image_url
      ? [{ id: 0, service_id: service.id, media_url: service.image_url, media_type: 'image' as const, is_featured: true, order_index: 0 }]
      : [];

  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-sky-primary hover:text-sky-dark mb-8 font-semibold transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Retour aux services
        </motion.button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {allMedia.length > 0 && (
              <>
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-3d mb-6 h-96 bg-gray-900"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {currentMedia.media_type === 'video' ? (
                    <video
                      src={currentMedia.media_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={currentMedia.media_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {allMedia.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black-solid/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                            <VideoIcon className="w-6 h-6 text-white" />
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
              className="mt-8 bg-white dark:bg-gray-construction rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title}
              </h1>

              {service.short_description && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.short_description}
                </p>
              )}

              <div className="prose dark:prose-invert max-w-none mb-8">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Caractéristiques Principales
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-construction text-black-solid flex items-center justify-center font-bold text-sm mt-1">
                          ✓
                        </span>
                        <span className="text-lg">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-sky-primary to-sky-dark rounded-2xl p-8 text-white shadow-3d">
              <h3 className="text-2xl font-bold mb-4">Intéressé par ce service?</h3>
              <p className="text-white/90 mb-6">
                Contactez-nous pour discuter de vos besoins spécifiques.
              </p>
              <motion.button
                onClick={() => {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  navigate('/');
                }}
                className="w-full bg-yellow-construction text-black-solid px-6 py-3 rounded-full font-bold hover:bg-yellow-dark transition-colors mb-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demander une facture pro forma
              </motion.button>
              <motion.button
                onClick={() => navigate('/quote')}
                className="w-full bg-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-colors border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Page de facture pro forma
              </motion.button>
            </div>

            <div className="bg-gradient-to-br from-yellow-construction to-yellow-dark rounded-2xl p-8 text-black-solid shadow-3d">
              <h3 className="text-2xl font-bold mb-4">Explorez d'autres services</h3>
              <p className="text-black-solid/90 mb-6">
                Découvrez notre gamme complète de services.
              </p>
              <motion.button
                onClick={() => navigate('/services')}
                className="w-full bg-black-solid text-white px-6 py-3 rounded-full font-bold hover:bg-black-solid/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tous les Services
              </motion.button>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-3d">
              <h3 className="text-2xl font-bold mb-4">Offres d'Emploi</h3>
              <p className="text-white/90 mb-6">
                Rejoignez notre équipe d'experts.
              </p>
              <motion.button
                onClick={() => navigate('/careers')}
                className="w-full bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir les Postes
              </motion.button>
            </div>

            <div className="bg-white dark:bg-gray-construction rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Partager</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Facebook', url: `https://facebook.com/sharer/sharer.php?u=${window.location.href}` },
                  { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=${service.title}` },
                  { name: 'LinkedIn', url: `https://linkedin.com/sharing/share-offsite/?url=${window.location.href}` }
                ].map((social) => (
                  <motion.button
                    key={social.name}
                    onClick={() => window.open(social.url, '_blank', 'width=600,height=400')}
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-sky-primary hover:text-white text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors font-semibold text-sm"
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
    </div>
  );
}
