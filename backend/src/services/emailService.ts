// services/emailService.ts
import { transporter, ADMIN_EMAIL, COMPANY_NAME, COMPANY_EMAIL } from '../config/email.js';
import {
  quoteAcknowledgmentTemplate,
  adminQuoteNotificationTemplate,
  contactAcknowledgmentTemplate,
  adminContactNotificationTemplate,
} from '../utils/emailTemplates.js';

interface QuoteData {
  id: number;
  name: string;
  email: string;
  company: string;
  project_type: string;
  description: string;
}

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export class EmailService {
  // Envoyer l'accusé de réception au client (Devis)
  static async sendQuoteAcknowledgment(data: QuoteData): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
        to: data.email,
        subject: `✅ Confirmation - Votre demande de  facture pro forma a été reçue`,
        html: quoteAcknowledgmentTemplate(data),
      });
      console.log(`✅ Accusé de réception envoyé à ${data.email}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'accusé de réception:', error);
      throw error;
    }
  }

  // Notifier l'admin d'un nouveau devis
  static async notifyAdminNewQuote(data: QuoteData): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"${COMPANY_NAME} - Notifications" <${COMPANY_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `🔔 Nouvelle demande de facture pro forma - ${data.name}`,
        html: adminQuoteNotificationTemplate(data),
      });
      console.log(`✅ Notification admin envoyée pour le devis #${data.id}`);
    } catch (error) {
      console.error('❌ Erreur lors de la notification admin:', error);
      throw error;
    }
  }

  // Envoyer l'accusé de réception au client (Contact)
  static async sendContactAcknowledgment(data: ContactData): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
        to: data.email,
        subject: `✅ Confirmation - Votre message a été reçu`,
        html: contactAcknowledgmentTemplate(data),
      });
      console.log(`✅ Accusé de réception contact envoyé à ${data.email}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'accusé contact:', error);
      throw error;
    }
  }

  // Notifier l'admin d'un nouveau contact
  static async notifyAdminNewContact(data: ContactData): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"${COMPANY_NAME} - Notifications" <${COMPANY_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `📧 Nouveau message de contact - ${data.name}`,
        html: adminContactNotificationTemplate(data),
      });
      console.log(`✅ Notification admin envoyée pour le contact de ${data.name}`);
    } catch (error) {
      console.error('❌ Erreur lors de la notification admin contact:', error);
      throw error;
    }
  }

  // Envoyer les deux emails en parallèle (optimisation)
  static async sendQuoteEmails(data: QuoteData): Promise<void> {
    try {
      await Promise.all([
        this.sendQuoteAcknowledgment(data),
        this.notifyAdminNewQuote(data),
      ]);
      console.log(`✅ Tous les emails pour le devis #${data.id} ont été envoyés`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des emails de Une facture pro forma:', error);
      // On ne throw pas l'erreur pour ne pas bloquer la création du devis
    }
  }

  // Envoyer les deux emails en parallèle (Contact)
  static async sendContactEmails(data: ContactData): Promise<void> {
    try {
      await Promise.all([
        this.sendContactAcknowledgment(data),
        this.notifyAdminNewContact(data),
      ]);
      console.log(`✅ Tous les emails de contact ont été envoyés`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des emails de contact:', error);
      // On ne throw pas l'erreur pour ne pas bloquer le contact
    }
  }
}