import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, X, Upload, Video, Loader, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { ImageUpload } from './ImageUpload';

type MediaItem = {
  id?: number;
  announcement_id?: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
  file?: File;
  preview?: string;
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
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState('');
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

  // Upload vers ImgBB pour les images
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=251ac2f178688b4ed065eefc7cff049e', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Échec du téléchargement sur ImgBB');
    }

    const data = await response.json();
    return data.data.url;
  };

  // Upload vers Cloudinary pour les vidéos
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Gbexobtp'); // À configurer dans Cloudinary
    formData.append('cloud_name', 'dcfk7tioq'); // Votre cloud name Cloudinary

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dcfk7tioq/video/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Échec du téléchargement sur Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Upload automatique selon le type
  const uploadFile = async (file: File): Promise<string> => {
    const isVideo = file.type.startsWith('video/');
    
    if (isVideo) {
      return await uploadToCloudinary(file);
    } else {
      return await uploadToImgBB(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia: MediaItem[] = [];
    
    files.forEach((file, index) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        alert(`${file.name}: Format non supporté`);
        return;
      }

      // Limite: 5MB pour images (ImgBB), 100MB pour vidéos (Cloudinary)
      const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name}: Fichier trop volumineux (max ${isVideo ? '100MB' : '5MB'})`);
        return;
      }

      const mediaItem: MediaItem = {
        media_url: '',
        media_type: isVideo ? 'video' : 'image',
        is_featured: false,
        order_index: pendingMedia.length + media.length + index,
        file: file
      };

      // Créer un aperçu pour les images
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          mediaItem.preview = e.target?.result as string;
          setPendingMedia(prev => [...prev.filter(m => m.file !== file), mediaItem]);
        };
        reader.readAsDataURL(file);
      } else {
        mediaItem.preview = 'video';
      }

      newMedia.push(mediaItem);
    });

    setPendingMedia(prev => [...prev, ...newMedia]);
  };

  const removePendingMedia = (index: number) => {
    setPendingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaId: number) => {
    if (!confirm('Supprimer ce média ?')) return;

    try {
      await api.announcements.media.delete(
        editingAnnouncement!.id!.toString(),
        mediaId.toString()
      );
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      alert('Média supprimé');
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let announcementId: number;

      // Créer ou mettre à jour l'annonce
      if (editingAnnouncement && editingAnnouncement.id) {
        await api.announcements.update(editingAnnouncement.id.toString(), formData);
        announcementId = editingAnnouncement.id;
      } else {
        const result = await api.announcements.create(formData);
        announcementId = result.id;
      }

      // Upload des médias en attente avec le bon service
      if (pendingMedia.length > 0) {
        setUploadProgress('Upload des médias en cours...');
        
        for (let i = 0; i < pendingMedia.length; i++) {
          const mediaItem = pendingMedia[i];
          const isVideo = mediaItem.media_type === 'video';
          const serviceName = isVideo ? 'Cloudinary' : 'ImgBB';
          
          setUploadProgress(
            `Upload ${i + 1}/${pendingMedia.length}: ${mediaItem.file?.name || 'média'} (${serviceName})`
          );

          try {
            // Upload vers le bon service selon le type
            const url = await uploadFile(mediaItem.file!);
            
            // Ajouter le média à l'annonce
            await api.announcements.media.add(announcementId.toString(), {
              media_url: url,
              media_type: mediaItem.media_type,
              is_featured: mediaItem.is_featured,
              order_index: mediaItem.order_index,
            });
          } catch (error) {
            console.error(`Error uploading ${mediaItem.file?.name}:`, error);
            alert(`Erreur d'upload: ${mediaItem.file?.name}`);
          }
        }
      }

      await fetchAnnouncements();
      closeModal();
      alert(editingAnnouncement ? 'Annonce mise à jour avec succès' : 'Annonce créée avec succès');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Erreur lors de l\'enregistrement de l\'annonce');
    } finally {
      setLoading(false);
      setUploadProgress('');
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
    setPendingMedia([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setMedia([]);
    setPendingMedia([]);
    setUploadProgress('');
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-4 flex items-center justify-between rounded-t-xl">
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

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
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

                <ImageUpload
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                  label="Image de couverture *"
                  placeholder="https://example.com/image.jpg"
                />

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

                {/* Section Médias */}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Photos et Vidéos {editingAnnouncement ? `(${media.length})` : ''}
                    </h3>
                    <label className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Ajouter des fichiers
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    📷 Images: ImgBB (Max 5MB) | 🎥 Vidéos: Cloudinary (Max 100MB)
                  </p>

                  {uploadProgress && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Loader className="w-5 h-5 animate-spin text-yellow-600" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-400">{uploadProgress}</span>
                    </div>
                  )}

                  {/* Médias existants (en édition) */}
                  {editingAnnouncement && media.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Médias existants</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                            <button
                              type="button"
                              onClick={() => removeExistingMedia(item.id!)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Médias en attente d'upload */}
                  {pendingMedia.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {pendingMedia.length} fichier(s) à uploader
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {pendingMedia.map((item, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {item.media_type === 'video' ? (
                              <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-800">
                                <Video className="w-8 h-8 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1 truncate px-1 max-w-full">
                                  {item.file?.name}
                                </span>
                              </div>
                            ) : item.preview && item.preview !== 'video' ? (
                              <img
                                src={item.preview}
                                alt={item.file?.name}
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removePendingMedia(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {media.length === 0 && pendingMedia.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      Aucun média ajouté
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
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
                    {loading ? 'Enregistrement...' : (editingAnnouncement ? 'Mettre à jour' : 'Créer')}
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