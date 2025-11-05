import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Services - Afficher seulement 3 services avec bouton "Voir plus" */}
      <Services limit={3} showViewMore={true} />
      
      {/* Projects - Afficher seulement 3 projets avec bouton "Voir plus", sans filtres */}
      <Projects limit={3} showViewMore={true} showFilters={false} />
      
      <Testimonials />
      <Contact />
    </div>
  );
}