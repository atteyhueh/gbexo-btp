import { useState, useEffect } from 'react';
import { supabase, type JobOpening } from '../lib/supabase';

export function useJobs() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('is_open', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { jobs, isLoading, error };
}
