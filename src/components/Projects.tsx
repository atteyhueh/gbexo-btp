import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const categories = ['Tous', 'Bâtiment', 'Routes', 'Rénovation', 'Infrastructure'];

const projects = [
  {
    id: 1,
    title: 'Centre Commercial ModernPlaza',
    category: 'Bâtiment',
    location: 'Lomé, Togo',
    year: '2024',
    image: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Construction d\'un centre commercial moderne de 15 000 m² avec parking souterrain'
  },
  {
    id: 2,
    title: 'Autoroute Nationale A1',
    category: 'Routes',
    location: 'Région Maritime',
    year: '2023',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Réalisation de 45 km d\'autoroute avec 3 échangeurs et aires de repos'
  },
  {
    id: 3,
    title: 'Résidence Les Palmiers',
    category: 'Bâtiment',
    location: 'Kara, Togo',
    year: '2024',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Complexe résidentiel haut standing avec 120 appartements et espaces verts'
  },
  {
    id: 4,
    title: 'Rénovation Hôpital Central',
    category: 'Rénovation',
    location: 'Lomé, Togo',
    year: '2023',
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Réhabilitation complète avec mise aux normes et extension de 5000 m²'
  },
  {
    id: 5,
    title: 'Pont de la Victoire',
    category: 'Infrastructure',
    location: 'Sokodé, Togo',
    year: '2023',
    image: 'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Construction d\'un pont suspendu de 350 m sur le fleuve Mono'
  },
  {
    id: 6,
    title: 'Zone Industrielle Sud',
    category: 'Infrastructure',
    location: 'Kpalimé, Togo',
    year: '2024',
    image: 'https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Aménagement de 50 hectares avec voiries et réseaux divers'
  },
  {
    id: 7,
    title: 'Stade Municipal Rénové',
    category: 'Rénovation',
    location: 'Atakpamé, Togo',
    year: '2024',
    image: 'https://images.pexels.com/photos/274132/pexels-photo-274132.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Rénovation complète d\'un stade avec nouvelle pelouse et tribunes'
  },
  {
    id: 8,
    title: 'Boulevard Urbain',
    category: 'Routes',
    location: 'Lomé, Togo',
    year: '2023',
    image: 'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Réaménagement de 8 km de boulevard avec pistes cyclables et éclairage LED'
  }
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = selectedCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl shadow-3d cursor-pointer bg-white dark:bg-gray-construction"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={project.image}
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
                  <p className="text-xs text-yellow-construction">{project.year}</p>
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
      </div>

      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black-solid/90 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-construction rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-3d-hover"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-black-solid/50 hover:bg-black-solid/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-construction text-black-solid px-4 py-2 rounded-full text-sm font-bold">
                  {selectedProject.category}
                </span>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedProject.title}
              </h2>

              <div className="flex items-center gap-6 mb-6 text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-semibold">Lieu:</span> {selectedProject.location}
                </div>
                <div>
                  <span className="font-semibold">Année:</span> {selectedProject.year}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Détails du projet</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-construction rounded-full mr-3" />
                    Respect des délais et du budget
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-construction rounded-full mr-3" />
                    Normes de qualité et sécurité respectées
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-construction rounded-full mr-3" />
                    Équipe d'experts qualifiés
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
