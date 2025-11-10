import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Mail, FileText } from 'lucide-react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-gbtp.tiic-system.com/api';

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }

  return response.json();
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStep, setChatStep] = useState<'greeting' | 'menu' | 'proforma' | 'contact'>('greeting');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Bonjour ! 👋 Bienvenue chez GBEXO BTP. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [clientType, setClientType] = useState<'particulier' | 'entreprise'>('particulier');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'bot' | 'user', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type,
      text,
      timestamp: new Date(),
    }]);
  };

  const handleMenuChoice = (choice: 'proforma' | 'contact') => {
    if (choice === 'proforma') {
      addMessage('user', 'Je souhaite demander un pro forma');
      setTimeout(() => {
        addMessage('bot', 'Parfait ! Pour établir votre devis pro forma, j\'aurais besoin de quelques informations. Êtes-vous un particulier ou une entreprise ?');
        setChatStep('proforma');
      }, 500);
    } else {
      addMessage('user', 'Je veux vous contacter');
      setTimeout(() => {
        addMessage('bot', 'Excellent ! Je vais vous aider à nous contacter. Veuillez remplir le formulaire ci-dessous.');
        setChatStep('contact');
      }, 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProformaSubmit = async () => {
    if (!formData.name || !formData.email || !formData.projectType || !formData.message) {
      addMessage('bot', 'Veuillez remplir tous les champs obligatoires (*) svp.');
      return;
    }

    if (clientType === 'entreprise' && !formData.company) {
      addMessage('bot', 'Veuillez indiquer le nom de votre entreprise.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        company: clientType === 'particulier' ? 'Particulier' : formData.company,
        project_type: formData.projectType,
        description: formData.message,
      };

      await apiCall('/quotes', {
        method: 'POST',
        body: JSON.stringify(dataToSubmit),
      });
      
      addMessage('bot', `Merci ${formData.name} ! Votre demande de pro forma a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais à ${formData.email}. 🎉`);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        message: '',
      });
      
      setTimeout(() => {
        setChatStep('greeting');
        addMessage('bot', 'Y a-t-il autre chose pour laquelle je peux vous aider ?');
      }, 2000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      addMessage('bot', 'Désolé, une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement au +229 01 40 93 56 56.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      addMessage('bot', 'Veuillez remplir tous les champs obligatoires (*) svp.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message,
      };

      await apiCall('/contact', {
        method: 'POST',
        body: JSON.stringify(dataToSubmit),
      });
      
      addMessage('bot', `Merci ${formData.name} ! Votre message a été envoyé avec succès. Nous vous répondrons rapidement ! 📧`);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        message: '',
      });
      
      setTimeout(() => {
        setChatStep('greeting');
        addMessage('bot', 'Puis-je vous aider avec autre chose ?');
      }, 2000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      addMessage('bot', 'Désolé, une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous appeler au +229 01 40 93 56 56.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { value: 'building', label: 'Construction & Génie Civil' },
    { value: 'roads', label: 'Travaux Publics & Routes' },
    { value: 'renovation', label: 'Rénovation & Maintenance' },
    { value: 'studies', label: 'Études Techniques' },
  ];

  return (
    <>
      {/* Bouton flottant - POSITION MOBILE OPTIMISÉE */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 sm:bottom-6 sm:right-6 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-yellow-400/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Bulle d'invitation - Desktop uniquement */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-7 right-20 sm:bottom-8 sm:right-24 bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-2xl z-40 hidden md:block max-w-xs"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👋</span>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Besoin d'aide ?</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Notre équipe est là pour vous</p>
              </div>
            </div>
            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white dark:border-l-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat - RESPONSIVE OPTIMISÉ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden
                       w-[calc(100vw-2rem)] max-w-[380px]
                       h-[480px] max-h-[calc(100vh-200px)]
                       sm:right-6 sm:w-[400px] sm:h-[550px] sm:max-h-[600px]"
          >
            {/* Header - COMPACT */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">GBEXO BTP</h3>
                  <div className="flex items-center space-x-1">
                    <motion.div
                      className="w-1.5 h-1.5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="text-xs text-white/90">En ligne</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages - SCROLL OPTIMISÉ */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-800">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Menu de choix - COMPACT */}
              {chatStep === 'greeting' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2 pt-1"
                >
                  <motion.button
                    onClick={() => handleMenuChoice('proforma')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-xs sm:text-sm">Demander un Pro forma</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Devis gratuit</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleMenuChoice('contact')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-xs sm:text-sm">Nous contacter</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Message direct</p>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* Formulaire Pro forma - COMPACT */}
              {chatStep === 'proforma' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setClientType('particulier')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          clientType === 'particulier'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Particulier
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType('entreprise')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          clientType === 'entreprise'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Entreprise
                      </button>
                    </div>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nom complet *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    {clientType === 'entreprise' && (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Nom de l'entreprise *"
                        className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}

                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Type de projet *</option>
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Description du projet *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />

                    <button
                      onClick={handleProformaSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xs sm:text-sm"
                    >
                      {isSubmitting ? (
                        <span>Envoi...</span>
                      ) : (
                        <>
                          <span>Envoyer</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Formulaire Contact - COMPACT */}
              {chatStep === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nom complet *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Téléphone"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Votre message *"
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />

                    <button
                      onClick={handleContactSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xs sm:text-sm"
                    >
                      {isSubmitting ? (
                        <span>Envoi...</span>
                      ) : (
                        <>
                          <span>Envoyer</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 flex-shrink-0">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                <a href="tel:+2290140935656" className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+229 01 40 93 56 56</span>
                </a>
                <a href="mailto:contact@gbexobtp.com" className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}