import { useState, useEffect } from 'react';
import { supabase, type Testimonial } from '../lib/supabase';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { testimonials, isLoading, error };
}
