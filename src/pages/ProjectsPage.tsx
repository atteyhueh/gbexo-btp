import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ExternalLink, Search } from 'lucide-react';

const categories = ['Tous', 'Bâtiment', 'Routes', 'Rénovation', 'Infrastructure'];
const statuses = ['Tous', 'completed', 'ongoing', 'planned'];
const statusLabels: { [key: string]: string } = {
  'Tous': 'Tous les statuts',
  'completed': 'Terminé',
  'ongoing': 'En cours',
  'planned': 'Planifié'
};

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = selectedCategory === 'Tous' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Tous' || project.status === selectedStatus;
      const matchesSearch = searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-sky-primary">Réalisations</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Découvrez nos projets réalisés au Bénin
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un projet
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom du projet, lieu, description..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid shadow-3d'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedStatus === status
                      ? 'bg-sky-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {statusLabels[status]}
                </motion.button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'Tous' || selectedStatus !== 'Tous') && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl shadow-3d cursor-pointer bg-white dark:bg-gray-construction"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-solid/80 via-black-solid/40 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-xs font-bold">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-300">{project.location}</p>
                  </div>
                </div>

                <motion.div
                  className="absolute inset-0 bg-sky-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Link to={`/project/${project.id}`} className="text-white font-bold text-lg hover:underline flex items-center gap-2">
                    Voir détails <ExternalLink className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
