// config/email.ts
import nodemailer from 'nodemailer';

// Configuration du transporteur email
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.MAIL_PORT || '465'),
  secure: true, // true pour le port 465 (SSL/TLS direct)
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  // Timeouts adaptés pour Hostinger
  connectionTimeout: 20000, // 20 secondes pour Hostinger
  greetingTimeout: 20000,
  socketTimeout: 20000,
  // Permet le débogage en cas de problème
  logger: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  // Options TLS optimisées pour Hostinger
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
  },
  // Options supplémentaires pour Hostinger
  pool: true, // Utiliser un pool de connexions
  maxConnections: 5,
  maxMessages: 100,
});

// Email de l'administrateur
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gbtp.com';
export const COMPANY_NAME = process.env.COMPANY_NAME || 'GBTP';
export const COMPANY_EMAIL = process.env.MAIL_FROM || 'noreply@gbtp.com';

// Vérifier la connexion au démarrage (de manière asynchrone)
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('✅ Serveur email prêt à envoyer des messages');
    return true;
  } catch (error) {
    console.error('❌ Erreur de configuration email:', error);
    console.error('Vérifiez vos variables d\'environnement:');
    console.error('- MAIL_HOST:', process.env.MAIL_HOST);
    console.error('- MAIL_PORT:', process.env.MAIL_PORT);
    console.error('- MAIL_USERNAME:', process.env.MAIL_USERNAME ? '✓ défini' : '✗ manquant');
    console.error('- MAIL_PASSWORD:', process.env.MAIL_PASSWORD ? '✓ défini' : '✗ manquant');
    return false;
  }
};

// Appeler la vérification au démarrage
verifyEmailConnection();