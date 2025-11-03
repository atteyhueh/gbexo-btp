import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Kofi Mensah',
    role: 'Directeur Général, TechCorp',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'GBEXO BTP a réalisé notre nouveau siège social avec un professionnalisme remarquable. La qualité du travail et le respect des délais ont dépassé nos attentes. Je recommande vivement leurs services.'
  },
  {
    id: 2,
    name: 'Amina Diallo',
    role: 'Maire, Ville de Kara',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'L\'équipe de GBEXO BTP a transformé notre infrastructure urbaine. Leur expertise en travaux publics et leur engagement pour la qualité font d\'eux un partenaire de choix pour nos projets municipaux.'
  },
  {
    id: 3,
    name: 'Jean-Pierre Martin',
    role: 'Promoteur Immobilier',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Après 5 projets ensemble, je peux affirmer que GBEXO BTP est le meilleur partenaire pour les projets de construction complexes. Leur réactivité et leur savoir-faire sont exceptionnels.'
  },
  {
    id: 4,
    name: 'Fatou Touré',
    role: 'Propriétaire, Villa Les Orchidées',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'La rénovation de ma propriété par GBEXO BTP a été une expérience formidable. Leur attention aux détails et leur capacité d\'écoute ont fait toute la différence. Un grand merci à toute l\'équipe!'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
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

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
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
                className="w-full"
              >
                <div className="bg-white dark:bg-gray-construction rounded-2xl p-8 md:p-12 shadow-3d-hover">
                  <div className="flex items-center mb-6">
                    <motion.img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-yellow-construction"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-sky-primary font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      <div className="flex mt-2">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
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
                    "{testimonials[currentIndex].text}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 bg-white dark:bg-gray-construction p-3 rounded-full shadow-3d hover:shadow-3d-hover transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-6 h-6 text-sky-primary" />
          </motion.button>

          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 bg-white dark:bg-gray-construction p-3 rounded-full shadow-3d hover:shadow-3d-hover transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
