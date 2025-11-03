import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2 } from 'lucide-react';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  order_index: number;
};

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await api.team.list();
      setMembers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      await api.team.delete(id.toString());
      fetchMembers();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gestion de l'Équipe</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white dark:bg-gray-construction rounded-2xl overflow-hidden shadow-3d"
            whileHover={{ scale: 1.02 }}
          >
            <img src={member.image_url} alt={member.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sky-primary font-semibold text-sm mb-2">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(member.id)}
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
