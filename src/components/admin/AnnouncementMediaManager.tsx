import { useState } from 'react';
import { Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';

interface MediaItem {
  id: number;
  announcement_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

interface Props {
  announcementId: number;
  media: MediaItem[];
  onMediaAdded: () => void;
  isLoading?: boolean;
}

export default function AnnouncementMediaManager({ announcementId, media, onMediaAdded, isLoading }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.media_url.trim()) {
      alert('Veuillez entrer une URL');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.announcements.media.add(announcementId.toString(), {
        ...formData,
        order_index: media.length,
      });
      setFormData({ media_url: '', media_type: 'image', is_featured: false });
      setShowForm(false);
      onMediaAdded();
      alert('Média ajouté avec succès');
    } catch (error) {
      console.error('Error adding media:', error);
      alert('Erreur lors de l\'ajout du média');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;

    try {
      setIsSubmitting(true);
      await api.announcements.media.delete(announcementId.toString(), mediaId.toString());
      onMediaAdded();
      alert('Média supprimé avec succès');
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          Photos et Vidéos ({media.length})
        </h4>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          disabled={isLoading || isSubmitting}
          className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de média
              </label>
              <select
                value={formData.media_type}
                onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL du média
              </label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white text-sm"
                placeholder="https://example.com/media.jpg"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-yellow-500 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mettre en avant (afficher en premier)
              </span>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded hover:bg-yellow-400 disabled:opacity-50"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              {item.media_type === 'video' ? (
                <div className="w-full h-32 flex items-center justify-center bg-gray-800">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              ) : (
                <img
                  src={item.media_url}
                  alt="Media"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/128?text=Image';
                  }}
                />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {item.is_featured && (
                  <span className="text-yellow-400 text-xs font-bold bg-black/70 px-2 py-1 rounded">
                    Vedette
                  </span>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                disabled={isSubmitting}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
          Aucun média pour cette annonce
        </div>
      )}
    </div>
  );
}
