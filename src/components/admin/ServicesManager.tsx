import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2, Plus, Edit, X } from 'lucide-react';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  order_index: number;
};

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.services.list();
      setServices(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        order_index: service.order_index,
        is_active: service.is_active,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: '',
        order_index: services.length,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.services.update(editingService.id, formData);
      } else {
        await api.services.create(formData);
      }
      fetchServices();
      handleCloseModal();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      await api.services.delete(id);
      fetchServices();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.services.update(id, { is_active: !isActive });
      fetchServices();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600 dark:text-gray-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Services
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-sky-primary text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un service</span>
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="bg-white dark:bg-gray-construction rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-3d"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{service.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
                  {service.description}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(service.id, service.is_active)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base ${
                    service.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {service.is_active ? 'Actif' : 'Inactif'}
                </button>
                <button
                  onClick={() => handleOpenModal(service)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-construction rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingService ? 'Modifier le service' : 'Ajouter un service'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Icône (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="🏗️"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-900 dark:text-white">
                  Service actif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-primary text-white rounded-lg hover:bg-sky-600"
                >
                  {editingService ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}