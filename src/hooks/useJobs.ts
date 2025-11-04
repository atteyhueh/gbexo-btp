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
      
      // Parse requirements if they come as JSON strings from the database
      const parsedJobs = (data || []).map(job => ({
        ...job,
        requirements: (() => {
          try {
            // If requirements is already an array, use it
            if (Array.isArray(job.requirements)) {
              return job.requirements;
            }
            // If requirements is a string, parse it
            if (typeof job.requirements === 'string') {
              return JSON.parse(job.requirements);
            }
            // Fallback to empty array
            return [];
          } catch (err) {
            console.error('Error parsing requirements for job:', job.id, err);
            return [];
          }
        })()
      }));
      
      setJobs(parsedJobs);
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