import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectById } from '../hooks/useProjects';
import { ChevronLeft, Share2, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, images, isLoading } = useProjectById(id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projet non trouvé</h2>
          <motion.button
            onClick={() => navigate('/projects')}
            className="bg-sky-primary text-white px-6 py-3 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Retour aux projets
          </motion.button>
        </div>
      </div>
    );
  }

  const currentImage = images.length > 0
    ? images[currentImageIndex]
    : { image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-sky-primary hover:text-sky-dark mb-8 font-semibold transition-colors"
          whileHover={{ x: -5 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Retour aux réalisations
        </motion.button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-3d mb-6 h-96"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={currentImage.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-yellow-construction'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}

            <motion.div
              className="mt-8 bg-white dark:bg-gray-construction rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-yellow-construction" />
                  {project.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-sm font-semibold">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                {project.duration_months && (
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Durée</div>
                    <div className="text-2xl font-bold text-sky-primary">{project.duration_months} mois</div>
                  </div>
                )}
                {project.client_name && (
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Client</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{project.client_name}</div>
                  </div>
                )}
                {project.team_size && (
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Équipe</div>
                    <div className="text-2xl font-bold text-sky-primary">{project.team_size}+</div>
                  </div>
                )}
                {project.budget && (
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Budget</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{project.budget}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-sky-primary to-sky-dark rounded-2xl p-8 text-white shadow-3d">
              <h3 className="text-2xl font-bold mb-4">Intéressé par ce type de projet?</h3>
              <p className="text-white/90 mb-6">
                Contactez-nous pour un devis personnalisé basé sur cette expertise.
              </p>
              <motion.button
                className="w-full bg-yellow-construction text-black-solid px-6 py-3 rounded-full font-bold hover:bg-yellow-dark transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demander un devis
              </motion.button>
            </div>

            <div className="bg-white dark:bg-gray-construction rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Partager</h3>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                  <motion.button
                    key={social}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-sky-primary hover:text-white text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                    {social}
                  </motion.button>
                ))}
              </div>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white dark:bg-gray-construction rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-primary/10 text-sky-primary px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
