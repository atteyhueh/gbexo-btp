import { useState } from 'react';
import { Upload, X, Loader, Eye, Video, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id?: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

interface MultiMediaUploadProps {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  label?: string;
  maxItems?: number;
}

export function MultiMediaUpload({
  value,
  onChange,
  label = 'Médias (Photos/Vidéos)',
  maxItems = 10
}: MultiMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=4d755673c2dc94a168dd770852ca7e62', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Erreur upload');
    const data = await response.json();
    return data.data.url;
  };

  const getMediaType = (file: File): 'image' | 'video' => {
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (value.length + files.length > maxItems) {
      setUploadError(`Maximum ${maxItems} fichiers autorisés`);
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 50 * 1024 * 1024) {
          setUploadError(`Fichier ${file.name} trop volumineux (max 50MB)`);
          continue;
        }

        const mediaType = getMediaType(file);
        const url = await uploadToImgBB(file);

        newItems.push({
          media_url: url,
          media_type: mediaType,
          is_featured: value.length === 0 && i === 0,
          order_index: value.length + i
        });
      }

      onChange([...value, ...newItems]);
    } catch (error) {
      setUploadError('Erreur lors du téléchargement');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSetFeatured = (index: number) => {
    onChange(value.map((item, i) => ({
      ...item,
      is_featured: i === index
    })));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...value];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    onChange(newItems.map((item, idx) => ({ ...item, order_index: idx })));
  };

  const currentPreview = previewIndex !== null ? value[previewIndex] : null;

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
        {label}
      </label>

      <div className="space-y-4">
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading || value.length >= maxItems}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="text-center pointer-events-none">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-6 h-6 animate-spin text-sky-primary" />
                <span className="text-sky-primary font-semibold">Téléchargement...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Glissez vos fichiers ici ou cliquez
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Images, vidéos (max 50MB) - {value.length}/{maxItems}
                </p>
              </>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {uploadError}
          </div>
        )}

        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {value.map((item, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square"
              >
                {item.media_type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={item.media_url}
                    alt={`Media ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-construction text-black-solid px-2 py-1 rounded text-xs font-bold">
                    VEDETTE
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-5 h-5 text-gray-900" />
                  </button>
                  {!item.is_featured && (
                    <button
                      type="button"
                      onClick={() => handleSetFeatured(idx)}
                      className="p-2 bg-yellow-construction rounded-full hover:bg-yellow-dark transition-colors"
                      title="Définir comme vedette"
                    >
                      ⭐
                    </button>
                  )}
                  {value.length > 1 && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(idx, idx - 1)}
                      className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                      title="Monter"
                    >
                      ↑
                    </button>
                  )}
                  {value.length > 1 && idx < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(idx, idx + 1)}
                      className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                      title="Descendre"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-3xl w-full">
            {currentPreview.media_type === 'video' ? (
              <video
                src={currentPreview.media_url}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <img
                src={currentPreview.media_url}
                alt="Aperçu"
                className="w-full rounded-lg"
              />
            )}
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
