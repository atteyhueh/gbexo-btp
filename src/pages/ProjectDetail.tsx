import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Play, 
  Share2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Briefcase,
  Clock,
  CheckCircle
} from 'lucide-react';
import { api } from '../lib/api';

interface ProjectMedia {
  id: number;
  project_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  project_type: string;
  client_name: string;
  thumbnail_url: string;
  status: string;
  duration_months?: number;
  budget?: number;
  team_size?: number;
  featured: number;
  technologies?: string[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les informations du projet
        const projectData = await api.projects.get(id);
        setProject(projectData);

        // Récupérer les médias du projet
        const mediaData = await api.projects.media.list(id);
        setMedia(mediaData);
        
        // Sélectionner le premier média par défaut
        if (mediaData.length > 0) {
          setSelectedMediaIndex(0);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement du projet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // Séparer images et vidéos
  const allMedia = project?.thumbnail_url && media.length > 0
    ? [{ 
        id: 0, 
        project_id: project.id, 
        media_url: project.thumbnail_url, 
        media_type: 'image' as const, 
        is_featured: true, 
        order_index: -1 
      }, ...media]
    : media.length > 0
    ? media
    : project?.thumbnail_url
    ? [{ 
        id: 0, 
        project_id: project.id, 
        media_url: project.thumbnail_url, 
        media_type: 'image' as const, 
        is_featured: true, 
        order_index: -1 
      }]
    : [];

  // Filtrer images et vidéos séparément
  const images = allMedia.filter(item => item.media_type === 'image');
  const videos = allMedia.filter(item => item.media_type === 'video');

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const shareProject = (platform: string) => {
    const url = window.location.href;
    const text = project ? `Découvrez ${project.title}` : 'Découvrez ce projet';
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black-solid flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin inline-block mb-4">
            <div className="w-16 h-16 border-4 border-yellow-construction border-t-transparent rounded-full" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black-solid flex items-center justify-center pt-24">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Projet non trouvé
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'Ce projet n\'existe pas ou a été supprimé.'}
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/projects')}
            className="bg-sky-primary text-white px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-sky-dark transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux projets
          </motion.button>
        </div>
      </div>
    );
  }

  const statusConfig: { [key: string]: { label: string; color: string; icon: any } } = {
    completed: { label: 'Terminé', color: 'bg-green-500', icon: CheckCircle },
    ongoing: { label: 'En cours', color: 'bg-blue-500', icon: Clock },
    planned: { label: 'Planifié', color: 'bg-orange-500', icon: Calendar }
  };

  const currentStatus = statusConfig[project.status] || { 
    label: project.status, 
    color: 'bg-gray-500', 
    icon: Tag 
  };
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sky-primary hover:text-sky-600 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Retour aux projets
          </Link>
          
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-sky-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-sky-primary transition-colors">Projets</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
              {project.title}
            </span>
          </nav>
        </div>

        {/* Project Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-construction flex-shrink-0" />
                  <span className="font-medium">{project.location}</span>
                </div>
                {project.client_name && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sky-primary flex-shrink-0" />
                    <span className="font-medium">{project.client_name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-construction text-black-solid px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap">
                <Tag className="w-4 h-4" />
                {project.category}
              </span>
              <span className={`${currentStatus.color} text-white px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap`}>
                <StatusIcon className="w-4 h-4" />
                {currentStatus.label}
              </span>
              {project.featured === 1 && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                  ⭐ Vedette
                </span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-construction rounded-xl p-6 shadow-md">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Stats - Déplacé en haut */}
            {(project.duration_months || project.team_size || project.budget) && (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5 }}
              >
                {project.duration_months && (
                  <div className="bg-white dark:bg-gray-construction rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                    <Calendar className="w-7 h-7 text-sky-primary mb-3" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Durée</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.duration_months} <span className="text-base font-normal text-gray-600 dark:text-gray-400">mois</span>
                    </div>
                  </div>
                )}
                {project.team_size && (
                  <div className="bg-white dark:bg-gray-construction rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                    <Users className="w-7 h-7 text-sky-primary mb-3" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Équipe</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.team_size}+ <span className="text-base font-normal text-gray-600 dark:text-gray-400">pers.</span>
                    </div>
                  </div>
                )}
                {project.budget && (
                  <div className="bg-white dark:bg-gray-construction rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow sm:col-span-1">
                    <DollarSign className="w-7 h-7 text-sky-primary mb-3" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.budget.toLocaleString()} <span className="text-base font-normal text-gray-600 dark:text-gray-400">FCFA</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Main Media Display - Images seulement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-construction rounded-2xl overflow-hidden shadow-3d">
                {images.length > 0 ? (
                  <div 
                    className="relative aspect-video bg-black cursor-pointer group"
                    onClick={() => openModal(selectedMediaIndex)}
                  >
                    <img
                      src={images[selectedMediaIndex]?.media_url || images[0].media_url}
                      alt={`${project.title} - Image ${selectedMediaIndex + 1}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full text-sm font-semibold">
                        Cliquez pour agrandir
                      </div>
                    </div>
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        {selectedMediaIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                      <Tag className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune image disponible</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnails Gallery - Images */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Galerie d'images <span className="text-sky-primary">({images.length} {images.length > 1 ? 'images' : 'image'})</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {images.map((item, idx) => (
                    <motion.button
                      key={`${item.id}-${idx}`}
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedMediaIndex === idx
                          ? 'ring-4 ring-sky-primary shadow-lg scale-105'
                          : 'ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-sky-primary/50 hover:shadow-md'
                      }`}
                      whileHover={{ scale: selectedMediaIndex === idx ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={item.media_url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section Vidéos séparée */}
            {videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Play className="w-6 h-6 text-sky-primary" />
                  Vidéos du projet <span className="text-sky-primary">({videos.length})</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {videos.map((video, idx) => (
                    <motion.div
                      key={`video-${video.id}-${idx}`}
                      className="bg-white dark:bg-gray-construction rounded-xl overflow-hidden shadow-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative aspect-video bg-black">
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={video.media_url}
                          poster={images[0]?.media_url}
                        >
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Vidéo {idx + 1}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <motion.div
              className="bg-gradient-to-br from-sky-primary to-sky-dark rounded-2xl p-6 text-white shadow-3d"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Intéressé par ce projet?</h3>
              <p className="text-white/90 mb-6 text-sm leading-relaxed">
                Contactez-nous pour obtenir un devis personnalisé basé sur cette expertise.
              </p>
              <motion.button
                onClick={() => {
                  navigate('/#contact');
                  setTimeout(() => {
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full bg-yellow-construction text-black-solid px-6 py-3 rounded-full font-bold hover:bg-yellow-dark transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Demander un devis
              </motion.button>
            </motion.div>

            {/* Project Type */}
            {project.project_type && (
              <motion.div
                className="bg-white dark:bg-gray-construction rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-sky-primary" />
                  Type de projet
                </h3>
                <span className="inline-block bg-sky-primary/10 text-sky-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {project.project_type}
                </span>
              </motion.div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                className="bg-white dark:bg-gray-construction rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technologies utilisées</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              className="bg-white dark:bg-gray-construction rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-sky-primary" />
                Partager ce projet
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Facebook', platform: 'facebook', color: 'hover:bg-blue-600 hover:text-white', icon: '📘' },
                  { name: 'Twitter', platform: 'twitter', color: 'hover:bg-sky-400 hover:text-white', icon: '🐦' },
                  { name: 'LinkedIn', platform: 'linkedin', color: 'hover:bg-blue-700 hover:text-white', icon: '💼' }
                ].map((social) => (
                  <motion.button
                    key={social.platform}
                    onClick={() => shareProject(social.platform)}
                    className={`w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-all font-semibold text-sm ${social.color}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{social.icon}</span>
                    {social.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && images[modalImageIndex] && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.button
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[modalImageIndex].media_url}
                alt={`${project.title} - Image ${modalImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />

              {images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prevModalImage();
                    }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>

                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nextModalImage();
                    }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {modalImageIndex + 1} / {images.length}
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