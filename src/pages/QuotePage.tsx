import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '../lib/api';
import { Building2, Construction, Wrench, FileText } from 'lucide-react';

export default function QuotePage() {
  const [clientType, setClientType] = useState<'particulier' | 'entreprise'>('particulier');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project_type: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const projectTypes = [
    { value: 'building', label: 'Construction & Génie Civil', icon: Building2 },
    { value: 'roads', label: 'Travaux Publics & Routes', icon: Construction },
    { value: 'renovation', label: 'Rénovation & Maintenance', icon: Wrench },
    { value: 'studies', label: 'Études Techniques', icon: FileText },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Si c'est un particulier, on envoie "Particulier" comme company
      const dataToSubmit = {
        ...formData,
        company: clientType === 'particulier' ? 'Particulier' : formData.company,
      };
      await api.quotes.create(dataToSubmit);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        project_type: '',
        description: '',
      });
      setClientType('particulier');

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-primary via-sky-dark to-black-solid pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Demander un <span className="text-yellow-construction">Devis</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Recevez une estimation gratuite pour votre projet de construction
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-construction rounded-2xl shadow-3d-hover p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélecteur Type de client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type de client *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setClientType('particulier')}
                  className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
                    clientType === 'particulier'
                      ? 'border-sky-primary bg-sky-primary/10 text-sky-primary dark:text-sky-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Particulier
                </button>
                <button
                  type="button"
                  onClick={() => setClientType('entreprise')}
                  className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
                    clientType === 'entreprise'
                      ? 'border-sky-primary bg-sky-primary/10 text-sky-primary dark:text-sky-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Entreprise
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Champ Entreprise - affiché uniquement pour les entreprises */}
            {clientType === 'entreprise' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entreprise *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de projet *
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
              >
                <option value="">Sélectionnez un type</option>
                {projectTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description du projet *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors resize-none"
                placeholder="Décrivez votre projet en détail..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </motion.button>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-4 rounded-lg text-center"
              >
                Votre demande a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg text-center"
              >
                Une erreur est survenue. Veuillez réessayer.
              </motion.div>
            )}
          </form>
        </motion.div>

        <motion.div
          className="mt-12 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {projectTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.value}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Icon className="w-10 h-10 text-yellow-construction mb-3" />
                <h3 className="text-lg font-bold mb-2">{type.label}</h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}