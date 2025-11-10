// utils/emailTemplates.ts

// Couleurs professionnelles BTP
const COLORS = {
  primary: '#0EA5E9',      // sky-primary (bleu ciel)
  dark: '#0369A1',         // sky-dark
  yellow: '#FBBF24',       // yellow-construction
  black: '#0A0A0A',        // black-solid
  gray: '#1F2937',         // gray-construction
  success: '#10B981',
  danger: '#EF4444',
};

// Template pour l'accusé de réception au client (Devis)
export const quoteAcknowledgmentTemplate = (data: {
  name: string;
  company: string;
  project_type: string;
  description: string;
}) => {
  const projectTypeLabels: Record<string, string> = {
    'building': 'Construction & Génie Civil',
    'roads': 'Travaux Publics & Routes',
    'renovation': 'Rénovation & Maintenance',
    'studies': 'Études Techniques',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F3F4F6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.dark} 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content { 
      padding: 40px 30px;
      background: #ffffff;
    }
    .content h2 {
      color: ${COLORS.dark};
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .info-box { 
      background: #F9FAFB;
      border-left: 4px solid ${COLORS.primary};
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: ${COLORS.dark};
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-row { 
      margin: 12px 0;
      line-height: 1.8;
    }
    .label { 
      font-weight: 600;
      color: ${COLORS.dark};
    }
    .highlight-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid ${COLORS.yellow};
      padding: 16px 20px;
      border-radius: 8px;
      margin: 25px 0;
      font-weight: 500;
    }
    .button { 
      display: inline-block;
      background: ${COLORS.yellow};
      color: ${COLORS.black};
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      margin: 25px 0;
      text-align: center;
    }
    .footer { 
      background: ${COLORS.gray};
      color: #9CA3AF;
      padding: 30px;
      text-align: center;
      font-size: 13px;
    }
    .footer strong {
      color: #E5E7EB;
    }
    .footer a {
      color: ${COLORS.primary};
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 25px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>️ GBEXO BTP</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95;">Construction & Travaux Publics</p>
    </div>
    
    <div class="content">
      <h2>Bonjour ${data.name},</h2>
      
      <p style="font-size: 15px; line-height: 1.7;">
        Nous avons bien reçu votre <strong>demande de facture pro forma</strong> et nous vous en remercions.
      </p>
      
      <p style="font-size: 15px; line-height: 1.7;">
        Notre équipe technique va étudier attentivement votre projet et vous reviendra avec une proposition détaillée et personnalisée.
      </p>
      
      <div class="info-box">
        <h3> Récapitulatif de votre demande</h3>
        
        <div class="info-row">
          <span class="label">Client :</span> ${data.company === 'Particulier' ? 'Particulier' : data.company}
        </div>
        
        <div class="info-row">
          <span class="label">Type de projet :</span> ${projectTypeLabels[data.project_type] || data.project_type}
        </div>
        
        <div class="divider"></div>
        
        <div class="info-row">
          <span class="label">Description :</span><br>
          <div style="margin-top: 10px; padding: 12px; background: white; border-radius: 6px; white-space: pre-wrap;">${data.description}</div>
        </div>
      </div>
      
      <div class="highlight-box">
        <strong>⏱ Délai de réponse estimé :</strong> 24 à 48 heures ouvrées
      </div>
      
      <p style="font-size: 15px; line-height: 1.7;">
        En attendant, n'hésitez pas à consulter nos réalisations récentes.
      </p>
      
      <center>
        <a href="https://gbexobtp.com/projects" class="button">Voir Nos Réalisations</a>
      </center>
      
      <div class="divider"></div>
      
      <p style="margin-top: 30px; font-size: 15px;">
        Cordialement,<br>
        <strong style="color: ${COLORS.dark};">L'équipe GBEXO BTP</strong>
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 15px 0;"><strong>GBEXO BTP - Construction & Travaux Publics</strong></p>
      <p style="margin: 8px 0;">📞 Tél : <a href="tel:+22901409356">+229 01 40 93 56 56</a></p>
      <p style="margin: 8px 0;">📧 Email : <a href="mailto:contact@gbexobtp.com">contact@gbexobtp.com</a></p>
      <p style="margin: 8px 0;">📍 Cotonou, Bénin</p>
      <div style="height: 1px; background: #374151; margin: 20px 0;"></div>
      <p style="font-size: 11px; color: #6B7280; line-height: 1.6;">
        Ceci est un message automatique, merci de ne pas y répondre.<br>
        Pour toute question, contactez-nous à <a href="mailto:contact@gbexobtp.com">contact@gbexobtp.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Template pour notifier l'admin (Nouveau Devis)
export const adminQuoteNotificationTemplate = (data: {
  name: string;
  email: string;
  company: string;
  project_type: string;
  description: string;
  id: number;
}) => {
  const projectTypeLabels: Record<string, string> = {
    'building': 'Construction & Génie Civil',
    'roads': 'Travaux Publics & Routes',
    'renovation': 'Rénovation & Maintenance',
    'studies': 'Études Techniques',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F3F4F6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      background: linear-gradient(135deg, ${COLORS.danger} 0%, #DC2626 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .alert { 
      background: #FEE2E2;
      border-left: 4px solid ${COLORS.danger};
      padding: 18px 20px;
      margin: 25px 0;
      border-radius: 8px;
      font-weight: 500;
    }
    .content { 
      padding: 40px 30px;
      background: #ffffff;
    }
    .info-box { 
      background: #F9FAFB;
      border: 2px solid #E5E7EB;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: ${COLORS.danger};
      font-size: 16px;
      font-weight: 700;
    }
    .info-row { 
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid ${COLORS.primary};
    }
    .label { 
      font-weight: 700;
      color: ${COLORS.dark};
      display: block;
      margin-bottom: 5px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value { 
      color: #374151;
      font-size: 15px;
    }
    .button { 
      display: inline-block;
      background: ${COLORS.danger};
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      margin: 25px 0;
    }
    .footer { 
      background: ${COLORS.gray};
      color: #9CA3AF;
      padding: 25px;
      text-align: center;
      font-size: 13px;
    }
    .meta-info {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      padding: 15px;
      border-radius: 8px;
      margin-top: 25px;
      font-size: 13px;
      color: #92400E;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1> Nouvelle Demande de Facture Pro Forma</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95;">Système GBEXO BTP</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong>⚠ Action requise :</strong> Une nouvelle demande de facture pro forma vient d'être soumise et nécessite votre attention immédiate.
      </div>
      
      <div class="info-box">
        <h3> Informations Client</h3>
        
        <div class="info-row">
          <span class="label">Nom complet</span>
          <span class="value">${data.name}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Adresse email</span>
          <span class="value"><a href="mailto:${data.email}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 600;">${data.email}</a></span>
        </div>
        
        <div class="info-row">
          <span class="label">Type de client</span>
          <span class="value">${data.company === 'Particulier' ? ' Particulier' : '' + data.company}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3> Détails du Projet</h3>
        
        <div class="info-row">
          <span class="label">Catégorie de projet</span>
          <span class="value">${projectTypeLabels[data.project_type] || data.project_type}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Description détaillée</span>
          <div style="margin-top: 10px; padding: 15px; background: #F3F4F6; border-left: 3px solid ${COLORS.primary}; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.7;">${data.description}</div>
        </div>
      </div>
      
      <center>
        <a href="https://gbexobtp.com/admin/quotes" class="button">Accéder au Dashboard Admin</a>
      </center>
      
      <div class="meta-info">
        <strong> Référence :</strong> Demande #${data.id}<br>
        <strong> Date et heure :</strong> ${new Date().toLocaleString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">Message automatique du système de gestion GBEXO BTP</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Template pour l'accusé de réception au client (Contact)
export const contactAcknowledgmentTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F3F4F6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.dark} 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content { 
      padding: 40px 30px;
      background: #ffffff;
    }
    .content h2 {
      color: ${COLORS.dark};
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .info-box { 
      background: #F9FAFB;
      border-left: 4px solid ${COLORS.primary};
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: ${COLORS.dark};
      font-size: 16px;
    }
    .message-content {
      background: white;
      padding: 18px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.7;
      margin-top: 12px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid ${COLORS.yellow};
      padding: 16px 20px;
      border-radius: 8px;
      margin: 25px 0;
      font-weight: 500;
    }
    .footer { 
      background: ${COLORS.gray};
      color: #9CA3AF;
      padding: 30px;
      text-align: center;
      font-size: 13px;
    }
    .footer strong {
      color: #E5E7EB;
    }
    .footer a {
      color: ${COLORS.primary};
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 25px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Message Bien Reçu</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95;">GBEXO BTP</p>
    </div>
    
    <div class="content">
      <h2>Bonjour ${data.name},</h2>
      
      <p style="font-size: 15px; line-height: 1.7;">
        Nous avons bien reçu votre <strong>message</strong> et nous vous en remercions pour votre confiance.
      </p>
      
      <p style="font-size: 15px; line-height: 1.7;">
        Notre équipe va traiter votre demande avec attention et vous répondra dans les plus brefs délais.
      </p>
      
      <div class="info-box">
        <h3> Récapitulatif de votre message</h3>
        <p style="margin: 8px 0;"><strong style="color: ${COLORS.dark};">Sujet :</strong> ${data.subject}</p>
        <div class="message-content">${data.message}</div>
      </div>
      
      <div class="highlight-box">
        <strong>⏱ Délai de réponse estimé :</strong> 24 à 48 heures ouvrées
      </div>
      
      <div class="divider"></div>
      
      <p style="margin-top: 30px; font-size: 15px;">
        Cordialement,<br>
        <strong style="color: ${COLORS.dark};">L'équipe GBEXO BTP</strong>
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 15px 0;"><strong>GBEXO BTP - Construction & Travaux Publics</strong></p>
      <p style="margin: 8px 0;">📞 Tél : <a href="tel:+22901409356">+229 01 40 93 56 56</a></p>
      <p style="margin: 8px 0;">📧 Email : <a href="mailto:contact@gbexobtp.com">contact@gbexobtp.com</a></p>
      <p style="margin: 8px 0;">📍 Cotonou, Bénin</p>
      <div style="height: 1px; background: #374151; margin: 20px 0;"></div>
      <p style="font-size: 11px; color: #6B7280; line-height: 1.6;">
        Ceci est un message automatique, merci de ne pas y répondre.<br>
        Pour toute question, contactez-nous à <a href="mailto:contact@gbexobtp.com">contact@gbexobtp.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Template pour notifier l'admin (Nouveau Contact)
export const adminContactNotificationTemplate = (data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F3F4F6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.dark} 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .alert { 
      background: #DBEAFE;
      border-left: 4px solid ${COLORS.primary};
      padding: 18px 20px;
      margin: 25px 0;
      border-radius: 8px;
      font-weight: 500;
    }
    .content { 
      padding: 40px 30px;
      background: #ffffff;
    }
    .info-box { 
      background: #F9FAFB;
      border: 2px solid #E5E7EB;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }
    .info-box h3 {
      margin-top: 0;
      color: ${COLORS.dark};
      font-size: 16px;
      font-weight: 700;
    }
    .info-row { 
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid ${COLORS.primary};
    }
    .label { 
      font-weight: 700;
      color: ${COLORS.dark};
      display: block;
      margin-bottom: 5px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      color: #374151;
      font-size: 15px;
    }
    .message-content {
      background: #F3F4F6;
      padding: 18px;
      border-left: 3px solid ${COLORS.primary};
      border-radius: 6px;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.7;
      margin-top: 12px;
    }
    .button { 
      display: inline-block;
      background: ${COLORS.primary};
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      margin: 25px 0;
    }
    .footer { 
      background: ${COLORS.gray};
      color: #9CA3AF;
      padding: 25px;
      text-align: center;
      font-size: 13px;
    }
    .meta-info {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      padding: 15px;
      border-radius: 8px;
      margin-top: 25px;
      font-size: 13px;
      color: #92400E;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1> Nouveau Message de Contact</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95;">Système GBEXO BTP</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong> Nouvelle demande :</strong> Un visiteur vous a contacté via le formulaire du site web.
      </div>
      
      <div class="info-box">
        <h3> Informations de l'Expéditeur</h3>
        
        <div class="info-row">
          <span class="label">Nom complet</span>
          <span class="value">${data.name}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Adresse email</span>
          <span class="value"><a href="mailto:${data.email}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 600;">${data.email}</a></span>
        </div>
        
        ${data.phone ? `
        <div class="info-row">
          <span class="label">Numéro de téléphone</span>
          <span class="value"><a href="tel:${data.phone}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 600;">${data.phone}</a></span>
        </div>
        ` : ''}
        
        <div class="info-row">
          <span class="label">Sujet du message</span>
          <span class="value">${data.subject}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3>Contenu du Message</h3>
        <div class="message-content">${data.message}</div>
      </div>
      
      <center>
        <a href="mailto:${data.email}" class="button">Répondre par Email</a>
      </center>
      
      <div class="meta-info">
        <strong> Date et heure de réception :</strong> ${new Date().toLocaleString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">Message automatique du système de gestion GBEXO BTP</p>
    </div>
  </div>
</body>
</html>
  `;
};