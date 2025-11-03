import { motion } from 'framer-motion';
import { useJobs } from '../hooks/useJobs';
import { useForm } from 'react-hook-form';
import { supabase, type JobApplication } from '../lib/supabase';
import { useState } from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

export default function CareersPage() {
  const { jobs, isLoading: jobsLoading } = useJobs();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobApplication>();

  const handleApply = async (data: JobApplication) => {
    if (!selectedJob) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            ...data,
            job_opening_id: selectedJob
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      reset();
      setTimeout(() => {
        setSubmitStatus('idle');
        setSelectedJob(null);
      }, 3000);
    } catch (err) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Rejoignez <span className="text-sky-primary">GBEXO BTP</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Faites partie d'une équipe dynamique et passionnée par les défis du BTP au Bénin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Offres d'emploi
            </h2>

            {jobsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className={`bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d cursor-pointer transition-all ${
                      selectedJob === job.id ? 'ring-2 ring-yellow-construction' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-sky-primary font-semibold text-sm mt-1">
                          {job.department}
                        </p>
                      </div>
                      <span className="bg-yellow-construction text-black-solid px-3 py-1 rounded-full text-xs font-bold">
                        {job.contract_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      {job.salary_range && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.salary_range}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: selectedJob === job.id ? 1 : 0,
                        height: selectedJob === job.id ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Critères requis:
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
                              <span className="w-1.5 h-1.5 bg-yellow-construction rounded-full mr-3 mt-1 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {selectedJob && (
            <motion.div
              className="bg-white dark:bg-gray-construction rounded-2xl p-8 shadow-3d h-fit"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Postuler
              </h3>

              <form onSubmit={handleSubmit(handleApply)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register('first_name', { required: true })}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sky-primary focus:outline-none"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('last_name', { required: true })}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sky-primary focus:outline-none"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sky-primary focus:outline-none"
                    placeholder="jean@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: true })}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sky-primary focus:outline-none"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lettre de motivation
                  </label>
                  <textarea
                    {...register('cover_letter')}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-sky-primary focus:outline-none resize-none"
                    placeholder="Parlez-nous de votre expérience..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-6 py-3 rounded-full font-bold transition-all disabled:opacity-70"
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer ma candidature'}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg text-center"
                  >
                    Candidature envoyée avec succès!
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg text-center"
                  >
                    Erreur lors de l'envoi. Veuillez réessayer.
                  </motion.div>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
