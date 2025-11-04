import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2, Plus, Edit, MapPin, DollarSign, Briefcase } from 'lucide-react';

type JobOpening = {
  id?: string;
  title: string;
  department: string;
  contract_type: string;
  description: string;
  location: string;
  salary_range?: string;
  is_open: boolean;
  requirements?: string[];
  responsibilities?: string[];
  created_at?: string;
};

export default function JobsManager() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [formData, setFormData] = useState<JobOpening>({
    title: '',
    department: '',
    contract_type: 'CDI',
    description: '',
    location: '',
    salary_range: '',
    is_open: true,
    requirements: [],
    responsibilities: []
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.jobs.list();
      setJobs(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      alert('Erreur lors du chargement des offres d\'emploi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.department || !formData.description || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingJob && editingJob.id) {
        await api.jobs.update(editingJob.id, formData);
        alert('Offre mise à jour avec succès');
      } else {
        await api.jobs.create(formData);
        alert('Offre créée avec succès');
      }

      await fetchJobs();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      setLoading(true);
      await api.jobs.delete(id);
      await fetchJobs();
      alert('Offre supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = async (id: string, isOpen: boolean) => {
    try {
      setLoading(true);
      await api.jobs.update(id, { is_open: !isOpen });
      await fetchJobs();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job?: JobOpening) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        department: '',
        contract_type: 'CDI',
        description: '',
        location: '',
        salary_range: '',
        is_open: true,
        requirements: [],
        responsibilities: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Offres d'Emploi</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {jobs.length} offre(s) au total
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Offre
        </button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                    <Briefcase className="w-4 h-4" />
                    {job.department}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-semibold">
                    {job.contract_type}
                  </span>
                  {job.is_open ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                      Ouvert
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400 rounded-full text-sm font-semibold">
                      Fermé
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </p>
                  {job.salary_range && (
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.salary_range}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openModal(job)}
                  disabled={loading}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => job.id && toggleOpen(job.id, job.is_open)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    job.is_open 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200'
                  }`}
                  title={job.is_open ? 'Fermer l\'offre' : 'Ouvrir l\'offre'}
                >
                  {job.is_open ? 'Ouvert' : 'Fermé'}
                </button>
                <button
                  onClick={() => job.id && handleDelete(job.id)}
                  disabled={loading}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucune offre d'emploi pour le moment</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold">
                {editingJob ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}
              </h2>
              <button
                onClick={closeModal}
                className="hover:bg-black/10 rounded-full p-2 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre du poste <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingénieur Civil Senior"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Département <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Construction"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de contrat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.contract_type}
                    onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Localisation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Cotonou, Bénin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fourchette salariale (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.salary_range || ''}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="500,000 - 800,000 FCFA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Description du poste..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_open"
                  checked={formData.is_open}
                  onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                  className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                />
                <label htmlFor="is_open" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Offre ouverte aux candidatures
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : (editingJob ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}