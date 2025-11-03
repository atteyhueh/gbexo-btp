import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, HardHat, Building2, Truck } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-dark via-sky-primary to-sky-light dark:from-black-solid dark:via-gray-construction dark:to-sky-dark">
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
            onClick={() => window.location.href = '/quote'}
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
    </section>
  );
}
