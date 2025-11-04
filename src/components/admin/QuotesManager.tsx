import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Mail, Phone, Trash2, Building2 } from 'lucide-react';

type QuoteRequest = {
  id: number;
  name: string;
  email: string;
  company: string;
  project_type: string;
  description: string;
  created_at: string;
};

export default function QuotesManager() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const data = await api.quotes.list();
      setQuotes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      await api.quotes.delete(id.toString());
      fetchQuotes();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600 dark:text-gray-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Demandes de Devis
      </h2>

      <div className="grid gap-4 sm:gap-6">
        {quotes.map((quote) => (
          <motion.div
            key={quote.id}
            className="bg-white dark:bg-gray-construction rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-3d"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 break-words">
                  {quote.name}
                </h3>
                
                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <a
                      href={`mailto:${quote.email}`}
                      className="hover:text-sky-primary truncate"
                    >
                      {quote.email}
                    </a>
                  </div>
                  {quote.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{quote.company}</span>
                    </div>
                  )}
                </div>

                {quote.project_type && (
                  <div className="mb-3">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-sky-primary/10 text-sky-primary rounded-full text-xs sm:text-sm font-semibold">
                      {quote.project_type}
                    </span>
                  </div>
                )}

                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 break-words">
                  {quote.description}
                </p>

                <p className="text-xs text-gray-400">
                  Reçu le: {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex justify-end lg:justify-start shrink-0">
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {quotes.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune demande de devis pour le moment
          </div>
        )}
      </div>
    </div>
  );
}