import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Star, Trash2, Plus, Edit, X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

type Testimonial = {
  id: number;
  client_name: string;
  client_role: string;
  client_company: string;
  message: string;
  rating: number;
  avatar_url: string;
  is_featured: boolean;
  order_index: number;
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_company: '',
    message: '',
    rating: 5,
    avatar_url: '',
    is_featured: false,
    order_index: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await api.testimonials.list();
      setTestimonials(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        client_name: testimonial.client_name,
        client_role: testimonial.client_role,
        client_company: testimonial.client_company,
        message: testimonial.message,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url,
        is_featured: testimonial.is_featured,
        order_index: testimonial.order_index,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        client_name: '',
        client_role: '',
        client_company: '',
        message: '',
        rating: 5,
        avatar_url: '',
        is_featured: false,
        order_index: testimonials.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await api.testimonials.update(editingTestimonial.id.toString(), formData);
      } else {
        await api.testimonials.create(formData);
      }
      fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      await api.testimonials.delete(id.toString());
      fetchTestimonials();
    } catch (error) {
      alert('Erreur');
    }
  };

  const toggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) return;

      await api.testimonials.update(id.toString(), {
        ...testimonial,
        is_featured: !isFeatured
      });
      fetchTestimonials();
    } catch (error) {
      alert('Erreur');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestion des Témoignages</h2>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-sky-primary text-white rounded-lg hover:bg-sky-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un témoignage</span>
        </motion.button>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-4">
              <img
                src={testimonial.avatar_url}
                alt={testimonial.client_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.client_name}</h3>
                <p className="text-sky-primary text-sm">{testimonial.client_role}</p>
                <div className="flex my-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-construction fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.message}"</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    testimonial.is_featured ? 'bg-yellow-construction text-black-solid' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {testimonial.is_featured ? 'Vedette' : 'Normal'}
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-construction rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
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
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Poste
                  </label>
                  <input
                    type="text"
                    value={formData.client_role}
                    onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.client_company}
                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Témoignage <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Note (1-5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="1">1 étoile</option>
                  <option value="2">2 étoiles</option>
                  <option value="3">3 étoiles</option>
                  <option value="4">4 étoiles</option>
                  <option value="5">5 étoiles</option>
                </select>
              </div>

              <ImageUpload
                value={formData.avatar_url}
                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                label="Photo du client"
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-900 dark:text-white">
                  Vedette (mis en avant)
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
                  {editingTestimonial ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
