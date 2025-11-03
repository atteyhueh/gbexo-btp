import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, Trash2 } from 'lucide-react';

type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;
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
      const { data, error } = await supabase
        .from('quotes_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      const { error } = await supabase
        .from('quotes_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchQuotes();
    } catch (error) {
      alert('Erreur');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Demandes de Devis</h2>

      <div className="grid gap-6">
        {quotes.map((quote) => (
          <motion.div
            key={quote.id}
            className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quote.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${quote.email}`} className="hover:text-sky-primary">{quote.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${quote.phone}`} className="hover:text-sky-primary">{quote.phone}</a>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="px-3 py-1 bg-sky-primary/10 text-sky-primary rounded-full text-sm font-semibold">
                    {quote.service_type || 'Non spécifié'}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{quote.project_description}</p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {quote.budget_range && <span>Budget: {quote.budget_range}</span>}
                  {quote.timeline && <span>Délai: {quote.timeline}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Reçu le: {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(quote.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
