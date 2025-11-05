import { useState, useEffect } from 'react';
import axios from 'axios';

interface MediaItem {
  id: number;
  announcement_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order_index: number;
}

export function useAnnouncementMedia(announcementId?: string) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!announcementId) return;

    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/announcements/${announcementId}/media`
        );
        setMedia(response.data || []);
      } catch (err) {
        console.error('Error fetching announcement media:', err);
        setError('Erreur lors du chargement des médias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [announcementId]);

  return { media, isLoading, error };
}
