// config/email.ts
import nodemailer from 'nodemailer';

// Configuration du transporteur email
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: true, // true pour 465, false pour autres ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Email de l'administrateur
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gbtp.com';
export const COMPANY_NAME = process.env.COMPANY_NAME || 'GBTP';
export const COMPANY_EMAIL = process.env.MAIL_FROM || 'noreply@gbtp.com';

// Vérifier la connexion au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration email:', error);
  } else {
    console.log('✅ Serveur email prêt à envoyer des messages');
  }
});