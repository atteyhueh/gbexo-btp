import { motion } from 'framer-motion';
import { useTeam } from '../hooks/useTeam';
import { Award, Users, Target, Shield } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'Nous visons l\'excellence dans chaque projet.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Nous travaillons en étroite collaboration avec nos clients.'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'Nous adoptons les dernières technologies et méthodes.'
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'La sécurité est notre priorité absolue.'
  }
];

export default function AboutPage() {
  const { members, isLoading } = useTeam();

  return (
    <div className="min-h-screen bg-white dark:bg-black-solid pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            À Propos de <span className="text-sky-primary">GBEXO BTP</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Votre partenaire de confiance pour tous vos projets de construction et travaux publics au Bénin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Notre Histoire
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Fondée il y a plus de 10 ans, GBEXO BTP s'est imposée comme une référence incontournable dans le secteur de la construction et des travaux publics au Bénin.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Notre expertise couvre l'ensemble des domaines du BTP, de la conception à la réalisation, en passant par les études techniques et le suivi de chantier.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Avec une équipe de professionnels qualifiés et un parc matériel moderne, nous sommes en mesure de répondre aux projets les plus ambitieux.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="rounded-2xl overflow-hidden shadow-3d"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="GBEXO BTP"
                className="w-full h-96 object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-sky-primary to-sky-dark rounded-2xl p-8 md:p-12 text-white shadow-3d mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold mb-4">Notre Mission</h3>
          <p className="text-xl mb-8">
            Construire un avenir durable en offrant des solutions de construction innovantes, fiables et respectueuses de l'environnement, tout en dépassant les attentes de nos clients.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-yellow-construction mb-2">10+</div>
              <div className="text-white/80">Ans d'Expérience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-construction mb-2">200+</div>
              <div className="text-white/80">Projets Réalisés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-construction mb-2">100%</div>
              <div className="text-white/80">Clients Satisfaits</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nos Valeurs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-sky-primary/10 to-sky-dark/10 dark:from-sky-primary/20 dark:to-sky-dark/20 rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-primary to-sky-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Notre Équipe
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-yellow-construction border-t-transparent rounded-full" />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-white dark:bg-gray-construction rounded-2xl overflow-hidden shadow-3d hover:shadow-3d-hover transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-solid/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sky-primary font-semibold mb-2">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
