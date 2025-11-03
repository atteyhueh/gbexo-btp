import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase, type JobOpening } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

export default function JobsManager() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      alert('Erreur');
    }
  };

  const toggleOpen = async (id: string, isOpen: boolean) => {
    try {
      const { error } = await supabase
        .from('job_openings')
        .update({ is_open: !isOpen })
        .eq('id', id);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      alert('Erreur');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Offres d'Emploi</h2>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-sky-primary/10 text-sky-primary rounded-full text-sm font-semibold">
                    {job.department}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {job.contract_type}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{job.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">📍 {job.location}</p>
                {job.salary_range && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">💰 {job.salary_range}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleOpen(job.id, job.is_open)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    job.is_open ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {job.is_open ? 'Ouvert' : 'Fermé'}
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
