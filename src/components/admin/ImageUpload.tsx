import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, label = 'Image', placeholder = 'https://example.com/photo.jpg' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=251ac2f178688b4ed065eefc7cff049e', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Échec du téléchargement');
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux (max 5MB)');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const url = await uploadToImgBB(file);
      setPreviewUrl(url);
      onChange(url);
    } catch (error) {
      setUploadError('Erreur lors du téléchargement');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreviewUrl(url);
    setUploadError('');
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    setUploadError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
        {label}
      </label>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUploadMethod('file')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              uploadMethod === 'file'
                ? 'bg-sky-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            Fichier Local
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('url')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              uploadMethod === 'url'
                ? 'bg-sky-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            URL
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-sky-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && (
              <div className="flex items-center gap-2 mt-2 text-sky-primary">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Téléchargement en cours...</span>
              </div>
            )}
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">
                {uploadError}
              </p>
            )}
            {!uploadError && !uploading && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: JPG, PNG, WebP (Max 5MB) - Hébergé gratuitement sur ImgBB
              </p>
            )}
          </div>
        ) : (
          <input
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        )}

        {previewUrl && (
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-48 object-cover"
              onError={() => setPreviewUrl('')}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
