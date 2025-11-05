import { useState } from 'react';
import { Plus, Trash2, Video, Upload, X, Loader } from 'lucide-react';
import { api } from '../../lib/api';
import { uploadService } from '../../lib/uploadService';

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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Vérifier la taille totale
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      setUploadError('Taille totale trop volumineuse (max 200MB)');
      return;
    }

    // Vérifier chaque fichier
    const validFiles: File[] = [];
    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        setUploadError(`${file.name}: Format non supporté`);
        continue;
      }

      // Limite: 5MB pour images (ImgBB), 100MB pour vidéos (Cloudinary)
      const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError(`${file.name}: Fichier trop volumineux (max ${isVideo ? '100MB' : '5MB'})`);
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
    setUploadError('');

    // Créer des aperçus
    const previews: string[] = [];
    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          setPreviewUrls([...previews]);
        };
        reader.readAsDataURL(file);
      } else {
        previews.push('video');
      }
    });
  };

  const handleUploadMultiple = async () => {
    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      let successCount = 0;
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const isVideo = file.type.startsWith('video/');
        
        setUploadProgress(
          `Téléchargement ${i + 1}/${totalFiles}: ${file.name} ${isVideo ? '(Cloudinary)' : '(ImgBB)'}`
        );

        try {
          // Upload automatique selon le type
          const { url, type } = await uploadService.uploadFile(file);

          // Ajouter à la base de données
          await api.announcements.media.add(announcementId.toString(), {
            media_url: url,
            media_type: type,
            is_featured: false,
            order_index: media.length + i,
          });

          successCount++;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadError(`Erreur: ${file.name}`);
        }
      }

      // Reset
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowForm(false);
      onMediaAdded();
      alert(`${successCount}/${totalFiles} média(s) ajouté(s) avec succès`);
    } catch (error) {
      console.error('Error uploading media:', error);
      setUploadError('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleSubmitUrl = async (e: React.FormEvent) => {
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

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
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
          {/* Boutons de sélection de méthode */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Télécharger fichiers
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              URL externe
            </button>
          </div>

          {uploadMethod === 'file' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sélectionner plusieurs fichiers
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors disabled:opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{uploadProgress}</span>
                  </div>
                )}
                {uploadError && (
                  <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                )}
                {!uploadError && !uploading && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    📷 Images: ImgBB (Max 5MB) | 🎥 Vidéos: Cloudinary (Max 100MB)
                  </p>
                )}
              </div>

              {/* Aperçu des fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {selectedFiles.length} fichier(s) sélectionné(s)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {file.type.startsWith('video/') ? (
                          <div className="w-full h-20 flex flex-col items-center justify-center bg-gray-800">
                            <Video className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-400 mt-1 truncate px-1 max-w-full">
                              {file.name}
                            </span>
                          </div>
                        ) : previewUrls[index] ? (
                          <img
                            src={previewUrls[index]}
                            alt={file.name}
                            className="w-full h-20 object-cover"
                          />
                        ) : (
                          <div className="w-full h-20 flex items-center justify-center">
                            <Loader className="w-4 h-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadMultiple}
                  disabled={uploading || selectedFiles.length === 0}
                  className="flex-1 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded hover:bg-yellow-400 disabled:opacity-50"
                >
                  {uploading ? 'Téléchargement...' : `Ajouter ${selectedFiles.length} média(s)`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitUrl} className="space-y-3">
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
          )}
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