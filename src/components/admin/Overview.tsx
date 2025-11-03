import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Briefcase, FileText, Users, MessageSquare, Mail, UserCircle } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    team: 0,
    testimonials: 0,
    quotes: 0,
    jobs: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, services, team, testimonials, quotes, jobs] = await Promise.all([
        api.projects.list(),
        api.services.list(),
        api.team.list(),
        api.testimonials.list(),
        api.quotes.list(),
        api.jobs.list(),
      ]);

      setStats({
        projects: projects?.length || 0,
        services: services?.length || 0,
        team: team?.length || 0,
        testimonials: testimonials?.length || 0,
        quotes: quotes?.length || 0,
        jobs: jobs?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    { title: 'Projets', value: stats.projects, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { title: 'Services', value: stats.services, icon: FileText, color: 'from-green-500 to-green-600' },
    { title: 'Équipe', value: stats.team, icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: 'Témoignages', value: stats.testimonials, icon: MessageSquare, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Demandes de devis', value: stats.quotes, icon: Mail, color: 'from-red-500 to-red-600' },
    { title: 'Offres d\'emploi', value: stats.jobs, icon: UserCircle, color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Vue d'ensemble</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-3d`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <Icon className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-4xl font-bold">{card.value}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
