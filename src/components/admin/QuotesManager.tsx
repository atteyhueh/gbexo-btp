import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Mail, Building2, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

type QuoteRequest = {
  id: number;
  name: string;
  email: string;
  company: string;
  project_type: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
};

const projectTypeLabels: Record<string, string> = {
  'building': 'Construction & Génie Civil',
  'roads': 'Travaux Publics & Routes',
  'renovation': 'Rénovation & Maintenance',
  'studies': 'Études Techniques',
  'Contact Form': 'Formulaire de Contact',
};

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  'pending': { label: 'En attente', color: 'bg-yellow-500', icon: Clock },
  'completed': { label: 'Complété', color: 'bg-green-500', icon: CheckCircle },
  'rejected': { label: 'Rejeté', color: 'bg-red-500', icon: XCircle },
};

export default function QuotesManager() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

    try {
      await api.quotes.delete(id.toString());
      fetchQuotes();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'completed' | 'rejected') => {
    try {
      await api.quotes.updateStatus(id.toString(), newStatus);
      fetchQuotes();
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredQuotes = quotes.filter(quote => 
    filter === 'all' ? true : quote.status === filter
  );

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    completed: quotes.filter(q => q.status === 'completed').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
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
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Demandes de facture pro forma
        </h2>

        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-construction rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 shadow-md">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">En attente</p>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.pending}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow-md">
            <p className="text-sm text-green-700 dark:text-green-400">Complété</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.completed}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 shadow-md">
            <p className="text-sm text-red-700 dark:text-red-400">Rejeté</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stats.rejected}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-sky-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            En attente ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Complété ({stats.completed})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Rejeté ({stats.rejected})
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {filteredQuotes.map((quote) => {
          const StatusIcon = statusLabels[quote.status].icon;
          
          return (
            <motion.div
              key={quote.id}
              className="bg-white dark:bg-gray-construction rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-3d"
              whileHover={{ scale: 1.01 }}
              layout
            >
              <div className="flex flex-col gap-4">
                {/* Header avec nom et statut */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                      {quote.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`inline-block px-3 py-1 ${statusLabels[quote.status].color} text-white rounded-full text-xs sm:text-sm font-semibold`}>
                        {statusLabels[quote.status].label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
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

                {/* Type de projet */}
                {quote.project_type && (
                  <div>
                    <span className="inline-block px-3 py-1 bg-sky-primary/10 text-sky-primary rounded-full text-xs sm:text-sm font-semibold">
                      {projectTypeLabels[quote.project_type] || quote.project_type}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
                    {quote.description}
                  </p>
                </div>

                {/* Dates et actions de statut */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>
                      <strong>Créé:</strong> {new Date(quote.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p>
                      <strong>Modifié:</strong> {new Date(quote.updated_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Boutons de changement de statut */}
                  <div className="flex flex-wrap gap-2">
                    {quote.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(quote.id, 'pending')}
                        className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs sm:text-sm font-medium"
                      >
                        → En attente
                      </button>
                    )}
                    {quote.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(quote.id, 'completed')}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm font-medium"
                      >
                        → Complété
                      </button>
                    )}
                    {quote.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(quote.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm font-medium"
                      >
                        → Rejeter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {filter === 'all' 
              ? 'Aucune demande de facture pro forma pour le moment'
              : `Aucune demande ${statusLabels[filter].label.toLowerCase()}`
            }
          </div>
        )}
      </div>
    </div>
  );
}