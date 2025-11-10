import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { api } = await import('../lib/api');
      await api.contact.send(formData);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+229 01 40 93 56 56',
      link: 'tel:+2290140935656'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@gbexobtp.com',
      link: 'mailto:contact@gbexobtp.com'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Jéricho, rue pavé à côté de la BIBE Jéricho Cotonou - Bénin',
      link: 'https://maps.google.com'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-black-solid relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-construction rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Contactez-<span className="text-sky-primary">nous</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Prêt à démarrer votre projet? Contactez-nous pour une facture pro forma gratuit et personnalisé
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.a
                key={index}
                href={info.link}
                className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d hover:shadow-3d-hover transition-all text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-sky-primary to-sky-dark rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </motion.div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-sky-primary transition-colors">
                  {info.value}
                </p>
              </motion.a>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white dark:bg-gray-construction rounded-2xl p-8 shadow-3d">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envoyez-nous un message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors"
                    placeholder="+228 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black-solid text-gray-900 dark:text-white focus:border-sky-primary focus:outline-none transition-colors resize-none"
                    placeholder="Décrivez votre projet..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-yellow-construction to-yellow-dark text-black-solid px-8 py-4 rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover transition-all flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-black-solid border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Envoyer le message
                      <Send className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg text-center"
                  >
                    Message envoyé avec succès! Nous vous contacterons bientôt.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-construction rounded-2xl overflow-hidden shadow-3d h-96">
              <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.570982849165!2d2.4043156!3d6.3702936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1022b3ef0c0a6f5f%3A0x8e77c2d1a8f9e1a0!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2s!4v1698790123456!5m2!1sfr!2s" 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-gradient-to-br from-sky-primary to-sky-dark rounded-2xl p-8 text-white shadow-3d">
              <h3 className="text-2xl font-bold mb-4">Heures d'ouverture</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">07:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">08:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-semibold text-yellow-construction">Fermé</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
