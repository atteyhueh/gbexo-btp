import { motion } from 'framer-motion';
import { HardHat, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Réalisations', href: '#projects' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Construction & Génie Civil',
    'Travaux Publics & Routes',
    'Rénovation & Maintenance',
    'Études Techniques'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-black-solid text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-yellow-construction rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <HardHat className="w-10 h-10 text-yellow-construction" strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-extrabold">
                GBEXO <span className="text-yellow-construction">BTP</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Leader dans le domaine du bâtiment et des travaux publics, nous construisons l'avenir avec solidité et confiance.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-construction rounded-full flex items-center justify-center hover:bg-yellow-construction hover:text-black-solid transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 className="text-lg font-bold mb-6 text-yellow-construction">Liens Rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-construction transition-colors flex items-center group"
                    whileHover={{ x: 5 }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className="w-0 h-0.5 bg-yellow-construction group-hover:w-4 transition-all mr-0 group-hover:mr-2" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 className="text-lg font-bold mb-6 text-yellow-construction">Nos Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-construction rounded-full mr-3 mt-2" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-lg font-bold mb-6 text-yellow-construction">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+22890123456" className="flex items-start text-gray-400 hover:text-yellow-construction transition-colors group">
                  <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
                  <span>+228 90 12 34 56</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@gbexobtp.com" className="flex items-start text-gray-400 hover:text-yellow-construction transition-colors group">
                  <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
                  <span>contact@gbexobtp.com</span>
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>Boulevard du 13 Janvier, Lomé, Togo</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p className="mb-4 md:mb-0">
              &copy; {currentYear} GBEXO BTP. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-construction transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="hover:text-yellow-construction transition-colors">
                Conditions d'Utilisation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
