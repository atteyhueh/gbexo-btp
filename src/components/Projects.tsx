import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  project_type: string;
  client_name: string;
  thumbnail_url: string;
  featured: number;
  created_at: string;
}

interface ProjectsProps {
  limit?: number; // Nombre de projets à afficher
  showViewMore?: boolean; // Afficher le bouton "Voir plus"
  showFilters?: boolean; // Afficher les filtres de catégorie
}

export default function Projects({ limit, showViewMore = false, showFilters = true }: ProjectsProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.projects.list();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Impossible de charger les projets');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extraire les catégories uniques des projets
  const categories = ['Tous', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  // Limiter le nombre de projets si nécessaire
  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  // Fonction pour extraire l'année de la date
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-black-solid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-sky-primary">Réalisations</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez nos projets réalisés avec excellence et professionnalisme
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
        ) : (
          <>
            {showFilters && (
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid shadow-3d'
                        : 'bg-white dark:bg-gray-construction text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {displayedProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun projet disponible dans cette catégorie
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="group relative overflow-hidden rounded-2xl shadow-3d cursor-pointer bg-white dark:bg-gray-construction"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-solid/80 via-black-solid/40 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-xs font-bold">
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-300 mb-1">{project.location}</p>
                        <p className="text-xs text-yellow-construction">{getYear(project.created_at)}</p>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 bg-sky-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <span className="text-white font-bold text-lg">Voir les détails</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}

            {showViewMore && filteredProjects.length > (limit || 0) && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.button
                  className="bg-gradient-to-r from-sky-primary to-sky-dark text-white px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/projects')}
                >
                  Voir tous nos projets
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}