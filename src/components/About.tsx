import { motion } from 'framer-motion';
import { Award, Users, Target, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 10, suffix: '+', label: 'Ans d\'Expérience' },
  { value: 200, suffix: '+', label: 'Projets Réalisés' },
  { value: 150, suffix: '+', label: 'Clients Satisfaits' },
  { value: 50, suffix: '+', label: 'Employés Qualifiés' }
];

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'Nous visons l\'excellence dans chaque projet, en maintenant les plus hauts standards de qualité.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Nous travaillons en étroite collaboration avec nos clients pour réaliser leur vision.'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'Nous adoptons les dernières technologies et méthodes pour optimiser nos réalisations.'
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'La sécurité de nos équipes et de nos chantiers est notre priorité absolue.'
  }
];

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <div ref={counterRef}>{count}</div>;
}

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-construction relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-construction rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            À Propos de <span className="text-sky-primary">GBEXO BTP</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leader dans le domaine du bâtiment et des travaux publics, nous transformons vos ambitions en réalité
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-extrabold text-sky-primary mb-2"
                whileHover={{ scale: 1.1 }}
              >
                <AnimatedCounter end={stat.value} />
                <span>{stat.suffix}</span>
              </motion.div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Notre Histoire
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Fondée il y a plus de 10 ans, GBEXO BTP s'est imposée comme une référence dans le secteur de la construction et des travaux publics au Togo et dans la sous-région.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Notre expertise couvre l'ensemble des domaines du BTP, de la conception à la réalisation, en passant par les études techniques et le suivi de chantier.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Avec une équipe de plus de 50 professionnels qualifiés et un parc matériel moderne, nous sommes en mesure de répondre aux projets les plus ambitieux tout en respectant les délais et les budgets.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="rounded-2xl overflow-hidden shadow-3d"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Équipe GBEXO BTP"
                className="w-full h-96 object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-construction rounded-2xl shadow-3d"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nos Valeurs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-sky-primary/10 to-sky-dark/10 dark:from-sky-primary/20 dark:to-sky-dark/20 rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-sky-primary to-sky-dark rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </motion.div>

                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h4>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-16 bg-gradient-to-r from-sky-primary to-sky-dark rounded-2xl p-8 md:p-12 text-center text-white shadow-3d"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold mb-4">Notre Mission</h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Construire un avenir durable en offrant des solutions de construction innovantes, fiables et respectueuses de l'environnement, tout en dépassant les attentes de nos clients.
          </p>
          <motion.button
            className="bg-yellow-construction text-black-solid px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Rejoignez-nous
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
