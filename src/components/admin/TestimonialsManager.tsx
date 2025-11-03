import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Star, Trash2 } from 'lucide-react';

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
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gestion des Témoignages</h2>

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
    </div>
  );
}
