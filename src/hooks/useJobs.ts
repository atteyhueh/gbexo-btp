import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface JobOpening {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  is_open: boolean;
  created_at: string;
}

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
      const data = await api.jobs.list();
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
