import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash2, X, Eye } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import ProjectMediaManager from './ProjectMediaManager';

type ImageItem = {
  id: number;
  project_id: string;
  image_url: string;
  order_index: number;
};

type Project = {
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  budget?: string;
  status: string;
  client_name?: string;
  technologies?: string[];
  team_size?: number;
  featured?: boolean;
  order_index?: number;
  created_at?: string;
  image_url?: string;
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ImageItem[]>([]);
  const [projectMedia, setProjectMedia] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    location: '',
    category: 'Bâtiment',
    project_type: '',
    start_date: '',
    end_date: '',
    duration_months: 0,
    budget: '',
    status: 'completed',
    client_name: '',
    technologies: [],
    team_size: 0,
    featured: false,
    order_index: 0,
    image_url: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.projects.list();
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (editingProject && editingProject.id) {
        await api.projects.update(editingProject.id, formData);
        alert('Projet mis à jour avec succès');
      } else {
        await api.projects.create(formData);
        alert('Projet créé avec succès');
      }

      setShowModal(false);
      setEditingProject(null);
      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) return;

    try {
      setLoading(true);
      await api.projects.delete(id);
      await fetchProjects();
      alert('Projet supprimé avec succès');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const fetchImagesForProject = async (projectId: string) => {
    try {
      const imagesData = await api.projects.images.list(projectId);
      setProjectImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchMediaForProject = async (projectId: string) => {
    try {
      const mediaData = await api.projects.media.list(projectId);
      setProjectMedia(mediaData || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    if (project.id) {
      fetchImagesForProject(project.id);
      fetchMediaForProject(project.id);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'Bâtiment',
      project_type: '',
      start_date: '',
      end_date: '',
      duration_months: 0,
      budget: '',
      status: 'completed',
      client_name: '',
      technologies: [],
      team_size: 0,
      featured: false,
      order_index: 0,
      image_url: '',
    });
    setProjectImages([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else if (name === 'technologies') {
      setFormData({ ...formData, [name]: value.split(',').map(t => t.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Projets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {projects.length} projet(s) au total
          </p>
        </div>
        <motion.button
          onClick={() => {
            resetForm();
            setEditingProject(null);
            setShowModal(true);
          }}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-construction text-black-solid px-6 py-3 rounded-lg font-semibold hover:bg-yellow-dark transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Ajouter un projet
        </motion.button>
      </div>

      {/* Vue Desktop - Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-construction rounded-2xl shadow-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-black-solid">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Lieu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    {project.title}
                    {project.featured && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ⭐ Vedette
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      project.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {project.status === 'completed' ? 'Terminé' : 
                       project.status === 'ongoing' ? 'En cours' : 'Planifié'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <motion.button
                        onClick={() => handleEdit(project)}
                        disabled={loading}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => project.id && handleDelete(project.id)}
                        disabled={loading}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vue Mobile - Cards */}
      <div className="lg:hidden grid gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.location}</p>
              </div>
              {project.featured && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex-shrink-0">
                  ⭐
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                {project.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                project.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {project.status === 'completed' ? 'Terminé' : 
                 project.status === 'ongoing' ? 'En cours' : 'Planifié'}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => project.id && handleDelete(project.id)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun projet pour le moment</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black-solid/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            className="bg-white dark:bg-gray-construction rounded-2xl shadow-3d-hover p-4 sm:p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lieu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="Bâtiment">Bâtiment</option>
                    <option value="Routes">Routes</option>
                    <option value="Rénovation">Rénovation</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de projet
                  </label>
                  <input
                    type="text"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Durée (mois)
                  </label>
                  <input
                    type="number"
                    name="duration_months"
                    value={formData.duration_months}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                    placeholder="Ex: 50,000,000 FCFA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taille de l'équipe
                  </label>
                  <input
                    type="number"
                    name="team_size"
                    value={formData.team_size}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="completed">Terminé</option>
                    <option value="ongoing">En cours</option>
                    <option value="planned">Planifié</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                    placeholder="Ex: Béton armé, Charpente métallique"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    value={formData.image_url || ''}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    label="Photo du projet"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Projet vedette (mis en avant sur la page d'accueil)
                    </span>
                  </label>
                </div>

                {editingProject && editingProject.id && (
                  <div className="md:col-span-2 border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                    <ProjectMediaManager
                      projectId={editingProject.id}
                      media={projectMedia}
                      onMediaAdded={() => fetchMediaForProject(editingProject.id!)}
                      isLoading={loading}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2 bg-yellow-construction text-black-solid rounded-lg hover:bg-yellow-dark font-semibold disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Enregistrement...' : (editingProject ? 'Mettre à jour' : 'Créer')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}