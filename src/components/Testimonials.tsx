import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  client_company: string;
  message: string;
  rating: number;
  avatar_url: string;
  is_featured: boolean;
  order_index: number;
  created_at?: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les témoignages depuis l'API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await api.testimonials.list();
        // Les témoignages sont déjà triés par order_index dans l'API
        setTestimonials(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des témoignages:', err);
        setError('Impossible de charger les témoignages');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-sky-primary via-sky-dark to-sky-primary dark:from-gray-construction dark:via-black-solid dark:to-gray-construction relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 opacity-10"
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
          <Quote className="w-64 h-64 text-white" strokeWidth={0.5} />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Témoignages <span className="text-yellow-construction">Clients</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Ce que nos clients disent de notre travail et de notre engagement
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-white text-lg">{error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/80 text-lg">
              Aucun témoignage disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto px-4 md:px-12 lg:px-16">
            <div className="overflow-hidden relative min-h-[400px] md:min-h-[350px] flex items-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 200, damping: 25 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="w-full absolute inset-0 flex items-center"
                >
                  <div className="bg-white dark:bg-gray-construction rounded-2xl p-8 md:p-12 shadow-3d-hover w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                      <motion.img
                        src={testimonials[currentIndex].avatar_url}
                        alt={testimonials[currentIndex].client_name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-yellow-construction flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {testimonials[currentIndex].client_name}
                        </h3>
                        <p className="text-sky-primary font-medium">
                          {testimonials[currentIndex].client_role}
                        </p>
                        {testimonials[currentIndex].client_company && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {testimonials[currentIndex].client_company}
                          </p>
                        )}
                        <div className="flex mt-2 justify-center sm:justify-start">
                          {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-construction fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <Quote className="w-12 h-12 text-yellow-construction/30 mb-4" />

                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                      "{testimonials[currentIndex].message}"
                    </p>

                    {testimonials[currentIndex].is_featured && (
                      <div className="mt-4">
                        <span className="inline-block bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-xs font-bold">
                          Témoignage vedette
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {testimonials.length > 1 && (
              <>
                <motion.button
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-16 bg-white dark:bg-gray-construction p-3 rounded-full shadow-3d hover:shadow-3d-hover transition-all z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => paginate(-1)}
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-6 h-6 text-sky-primary" />
                </motion.button>

                <motion.button
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-16 bg-white dark:bg-gray-construction p-3 rounded-full shadow-3d hover:shadow-3d-hover transition-all z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => paginate(1)}
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-6 h-6 text-sky-primary" />
                </motion.button>

                <div className="flex justify-center mt-8 gap-2">
                  {testimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-yellow-construction w-8'
                          : 'bg-white/50'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      aria-label={`Aller au témoignage ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}