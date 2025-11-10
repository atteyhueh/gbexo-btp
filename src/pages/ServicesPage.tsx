import { motion } from 'framer-motion';
import { useServices } from '../hooks/useServices';
import { Building2, Construction, Wrench, FileText } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  Building2,
  Construction,
  Wrench,
  FileText
};

export default function ServicesPage() {
  const { services, isLoading } = useServices();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-sky-primary">Services</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une gamme complète de services BTP adaptés à tous vos besoins au Bénin
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon_name] || Building2;
              
              // Parse features if they're stored as JSON string
              const features = (() => {
                try {
                  if (Array.isArray(service.features)) {
                    return service.features;
                  }
                  if (typeof service.features === 'string') {
                    return JSON.parse(service.features);
                  }
                  return [];
                } catch (error) {
                  console.error('Error parsing features for service:', service.id, error);
                  return [];
                }
              })();

              return (
                <motion.div
                  key={service.id}
                  className="bg-white dark:bg-gray-construction rounded-2xl overflow-hidden shadow-3d hover:shadow-3d-hover transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-solid/80 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-primary to-sky-dark rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-3">
                      {features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                        >
                          <span className="w-2 h-2 bg-yellow-construction rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => window.location.href = '/quote'}
                      className="mt-8 w-full bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-6 py-3 rounded-full font-semibold transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Demander une facture pro forma
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}