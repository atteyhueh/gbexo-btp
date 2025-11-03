import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Mail,
  UserCircle
} from 'lucide-react';
import ProjectsManager from '../../components/admin/ProjectsManager';
import ServicesManager from '../../components/admin/ServicesManager';
import TeamManager from '../../components/admin/TeamManager';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import QuotesManager from '../../components/admin/QuotesManager';
import JobsManager from '../../components/admin/JobsManager';
import Overview from '../../components/admin/Overview';

type Tab = 'overview' | 'projects' | 'services' | 'team' | 'testimonials' | 'quotes' | 'jobs';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: Briefcase },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'testimonials', label: 'Témoignages', icon: MessageSquare },
    { id: 'quotes', label: 'Demandes de devis', icon: Mail },
    { id: 'jobs', label: 'Offres d\'emploi', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid">
      <nav className="bg-white dark:bg-gray-construction shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              GBEXO <span className="text-yellow-construction">Admin</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-construction min-h-screen shadow-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <motion.button
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-yellow-construction text-black-solid'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'team' && <TeamManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'quotes' && <QuotesManager />}
          {activeTab === 'jobs' && <JobsManager />}
        </main>
      </div>
    </div>
  );
}
