import { motion, AnimatePresence } from 'framer-motion';
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
  UserCircle,
  Megaphone,
  Menu,
  X
} from 'lucide-react';
import ProjectsManager from '../../components/admin/ProjectsManager';
import ServicesManager from '../../components/admin/ServicesManager';
import TeamManager from '../../components/admin/TeamManager';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import QuotesManager from '../../components/admin/QuotesManager';
import JobsManager from '../../components/admin/JobsManager';
import Overview from '../../components/admin/Overview';
import AnnouncementsManagement from '../../components/admin/AnnouncementsManagement';

type Tab = 'overview' | 'projects' | 'services' | 'team' | 'testimonials' | 'quotes' | 'jobs' | 'announcements';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { id: 'announcements', label: 'Annonces', icon: Megaphone },
  ];

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black-solid">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-construction shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                )}
              </button>
              
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                GBEXO <span className="text-yellow-construction">Admin</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-gray-600 dark:text-gray-300 text-sm truncate max-w-[150px]">
                {user?.email}
              </span>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-construction min-h-[calc(100vh-4rem)] shadow-lg sticky top-16">
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

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
              />

              {/* Sidebar */}
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed left-0 top-16 w-72 bg-white dark:bg-gray-construction h-[calc(100vh-4rem)] shadow-2xl z-50 overflow-y-auto"
              >
                <nav className="p-4">
                  <ul className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <li key={tab.id}>
                          <button
                            onClick={() => handleTabChange(tab.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              activeTab === tab.id
                                ? 'bg-yellow-construction text-black-solid'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'team' && <TeamManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'quotes' && <QuotesManager />}
          {activeTab === 'jobs' && <JobsManager />}
          {activeTab === 'announcements' && <AnnouncementsManagement />}
        </main>
      </div>
    </div>
  );
}