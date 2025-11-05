import { motion } from 'framer-motion';
import { Building2, Construction, Wrench, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

// Map des icônes pour les différents types de services
const iconMap: { [key: string]: any } = {
  'Building2': Building2,
  'Construction': Construction,
  'Wrench': Wrench,
  'FileText': FileText,
};

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category?: string;
  order_index?: number;
}

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await api.services.list();
        
        // 🔧 Parser les features si elles sont stockées en JSON
        const parsedServices = data.map((service: any) => {
          let features = [];
          
          // Si features est déjà un tableau
          if (Array.isArray(service.features)) {
            features = service.features;
          } 
          // Si features est une chaîne JSON
          else if (typeof service.features === 'string' && service.features.trim() !== '') {
            try {
              const parsed = JSON.parse(service.features);
              features = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              console.warn(`Impossible de parser features pour service ${service.id}`);
              features = [];
            }
          }
          
          return {
            ...service,
            features
          };
        });
        
        setServices(parsedServices);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError('Impossible de charger les services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fonction pour obtenir l'icône appropriée
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Building2;
  };

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-construction relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-sky-primary">Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une gamme complète de services pour tous vos besoins en construction et travaux publics
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-sky-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun service disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  className="relative transform-style-3d"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <motion.div
                    className={`h-full bg-white dark:bg-black-solid rounded-2xl p-6 shadow-3d border-2 ${
                      hoveredIndex === index
                        ? 'border-yellow-construction'
                        : 'border-transparent'
                    } transition-all duration-300 cursor-pointer`}
                    whileHover={{
                      y: -10,
                      rotateX: 5,
                      rotateY: hoveredIndex === index ? 5 : 0,
                      scale: 1.02
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-sky-primary to-sky-dark rounded-xl flex items-center justify-center mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                          >
                            <span className="w-1.5 h-1.5 bg-yellow-construction rounded-full mr-2" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        onClick={() => window.location.href = '/services'}
                        className="text-sky-primary font-semibold text-sm hover:text-sky-dark transition-colors flex items-center"
                      >
                        En savoir plus
                        <motion.span
                          animate={{ x: hoveredIndex === index ? 5 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          →
                        </motion.span>
                      </button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            className="bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Demander un Devis Personnalisé
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}