import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectById } from '../hooks/useProjects';
import { ChevronLeft, Share2, MapPin, X, ChevronRight, Video as VideoIcon } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, images, isLoading } = useProjectById(id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

  const allImages = project.thumbnail_url 
    ? [{ image_url: project.thumbnail_url, order_index: 0, id: 0, project_id: project.id }, ...images]
    : images;

  const currentImage = allImages.length > 0
    ? allImages[currentImageIndex]
    : { image_url: 'https://placehold.co/800x600/cccccc/white?text=Aucune+image', order_index: 0, id: 0, project_id: project.id };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
              className="relative rounded-2xl overflow-hidden shadow-3d mb-6 h-96 bg-gray-900 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => (currentImage as any).media_type !== 'video' && openModal(currentImageIndex)}
            >
              {(currentImage as any).media_type === 'video' ? (
                <video
                  src={currentImage.image_url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={currentImage.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black-solid/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={img.id || idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 relative transition-all ${
                      idx === currentImageIndex
                        ? 'border-yellow-construction shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-sky-primary'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {(img as any).media_type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <VideoIcon className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <img
                        src={img.image_url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
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
                {project.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-yellow-construction" />
                    {project.location}
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                )}
                {project.project_type && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="bg-sky-primary/10 text-sky-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {project.project_type}
                    </span>
                  </div>
                )}
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
                onClick={() => {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  navigate('/');
                }}
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
                {[
                  { name: 'Facebook', url: `https://facebook.com/sharer/sharer.php?u=${window.location.href}` },
                  { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=${project.title}` },
                  { name: 'LinkedIn', url: `https://linkedin.com/sharing/share-offsite/?url=${window.location.href}` }
                ].map((social) => (
                  <motion.button
                    key={social.name}
                    onClick={() => window.open(social.url, '_blank', 'width=600,height=400')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-sky-primary hover:text-white text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                    {social.name}
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

            {project.featured === 1 && (
              <div className="bg-gradient-to-br from-yellow-construction to-yellow-dark rounded-2xl p-8 text-black-solid">
                <h3 className="text-xl font-bold mb-2">⭐ Projet Vedette</h3>
                <p className="text-sm">
                  Ce projet fait partie de nos réalisations les plus prestigieuses.
                </p>
              </div>
            )}
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
                src={allImages[modalImageIndex].image_url}
                alt={project.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />

              {allImages.length > 1 && (
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
                    {modalImageIndex + 1} / {allImages.length}
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