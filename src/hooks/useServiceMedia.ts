import { useState, useEffect } from 'react';
import axios from 'axios';

interface MediaItem {
  id: number;
  service_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

export function useServiceMedia(serviceId?: string) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}/media`
        );
        setMedia(response.data || []);
      } catch (err) {
        console.error('Error fetching service media:', err);
        setError('Erreur lors du chargement des médias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [serviceId]);

  return { media, isLoading, error };
}
