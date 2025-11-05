import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../../lib/api';
import AnnouncementMediaManager from './AnnouncementMediaManager';

type MediaItem = {
  id: number;
  announcement_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
};

type Announcement = {
  id?: number;
  title: string;
  content: string;
  cover_image_url: string;
  is_urgent: boolean;
  is_active: boolean;
  link_url?: string;
  created_at?: string;
};

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [formData, setFormData] = useState<Announcement>({
    title: '',
    content: '',
    cover_image_url: '',
    is_urgent: false,
    is_active: true,
    link_url: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.announcements.list();
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      alert('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingAnnouncement && editingAnnouncement.id) {
        await api.announcements.update(editingAnnouncement.id.toString(), formData);
      } else {
        await api.announcements.create(formData);
      }

      await fetchAnnouncements();
      closeModal();
      alert(editingAnnouncement ? 'Annonce mise à jour avec succès' : 'Annonce créée avec succès');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Erreur lors de l\'enregistrement de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      setLoading(true);
      await api.announcements.delete(id.toString());
      await fetchAnnouncements();
      alert('Annonce supprimée avec succès');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Erreur lors de la suppression de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaForAnnouncement = async (announcementId: number) => {
    try {
      const mediaData = await api.announcements.media.list(announcementId.toString());
      setMedia(mediaData || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData(announcement);
      if (announcement.id) {
        fetchMediaForAnnouncement(announcement.id);
      }
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        cover_image_url: '',
        is_urgent: false,
        is_active: true,
        link_url: ''
      });
      setMedia([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setMedia([]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Annonces
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {announcements.length} annonce(s) au total
            </p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={loading}
            className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Annonce
          </button>
        </div>

        {loading && announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucune annonce pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={announcement.cover_image_url}
                    alt={announcement.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128?text=Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Créée le {formatDate(announcement.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openModal(announcement)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id!)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {announcement.content}
                    </p>
                    {announcement.link_url && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                        🔗 {announcement.link_url}
                      </p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {announcement.is_urgent && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Urgente
                        </span>
                      )}
                      {announcement.is_active ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 rounded-full text-sm font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
              <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                </h2>
                <button
                  onClick={closeModal}
                  className="hover:bg-black/10 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Titre de l'annonce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenu <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Contenu de l'annonce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    URL de l'image de couverture <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.cover_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.cover_image_url} 
                        alt="Aperçu" 
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lien (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.link_url || ''}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="/careers ou https://example.com"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_urgent}
                      onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annonce urgente (bande défilante)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                </div>

                {editingAnnouncement && editingAnnouncement.id && (
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                    <AnnouncementMediaManager
                      announcementId={editingAnnouncement.id}
                      media={media}
                      onMediaAdded={() => fetchMediaForAnnouncement(editingAnnouncement.id!)}
                      isLoading={loading}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Chargement...' : (editingAnnouncement ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}