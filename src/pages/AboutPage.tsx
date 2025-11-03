import { motion } from 'framer-motion';
import { useTeam } from '../hooks/useTeam';
import { Award, Users, Target, Shield, Quote } from 'lucide-react';

const timeline = [
  { year: '2014', title: 'Fondation', description: 'Création de GBEXO BTP à Cotonou par Cyriaque KINZO' },
  { year: '2016', title: 'Premier grand projet', description: 'Réalisation du Centre Commercial ModernPlaza' },
  { year: '2018', title: 'Expansion régionale', description: 'Extension des activités dans toute la région maritime' },
  { year: '2020', title: 'Certification ISO', description: 'Obtention de la certification ISO 9001:2015' },
  { year: '2022', title: '100+ projets', description: 'Dépassement du cap des 100 projets réalisés' },
  { year: '2024', title: 'Leader au Bénin', description: 'Reconnaissance comme leader du BTP au Bénin' },
];

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

        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mot du Directeur Général
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-3d">
                <img
                  src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Cyriaque KINZO"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-yellow-construction rounded-2xl p-6 shadow-3d">
                <h3 className="text-xl font-bold text-black-solid">Cyriaque KINZO</h3>
                <p className="text-black-solid/80 font-semibold">Directeur Général</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Quote className="w-16 h-16 text-yellow-construction/30 mb-4" />
              <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Depuis la création de GBEXO BTP en 2014, notre vision a toujours été claire : devenir le partenaire privilégié des entreprises et institutions au Bénin pour leurs projets de construction et travaux publics.
                </p>
                <p>
                  Fort de plus de 20 ans d'expérience dans le secteur du BTP, j'ai fondé GBEXO BTP avec la conviction que l'excellence, l'innovation et le respect des engagements sont les piliers d'une entreprise durable.
                </p>
                <p>
                  Aujourd'hui, avec plus de 200 projets réalisés et une équipe de 50+ professionnels qualifiés, nous continuons à repousser les limites de l'excellence pour construire l'avenir du Bénin.
                </p>
                <p className="italic font-semibold text-sky-primary">
                  "Notre engagement : Transformer vos ambitions en réalité, un projet à la fois."
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Notre Parcours
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-sky-primary via-yellow-construction to-sky-dark" />

            <div className="space-y-12">
              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      className="bg-white dark:bg-gray-construction rounded-2xl p-6 shadow-3d inline-block"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-yellow-construction text-2xl font-bold mb-2">{event.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    className="relative z-10 w-6 h-6 bg-yellow-construction rounded-full border-4 border-white dark:border-black-solid shadow-3d"
                    whileHover={{ scale: 1.5 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(252, 211, 77, 0.7)',
                        '0 0 0 15px rgba(252, 211, 77, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

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
