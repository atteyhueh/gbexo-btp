import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import UrgentAnnouncementBanner from './components/UrgentAnnouncementBanner';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import ServiceDetail from './pages/ServiceDetail';
import AnnouncementDetail from './pages/AnnouncementDetail';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import QuotePage from './pages/QuotePage';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-white dark:bg-black-solid transition-colors duration-300 flex flex-col">
                    <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <main className="flex-grow pb-[50px]">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/project/:id" element={<ProjectDetail />} />
                        {/* ✅ Changé /announcement/:id en /announcements/:id */}
                        <Route path="/announcements/:id" element={<AnnouncementDetail />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/quote" element={<QuotePage />} />
                      </Routes>
                    </main>
                    <Footer />
                    <UrgentAnnouncementBanner />
                  </div>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      )}
    </>
  );
}

export default App;