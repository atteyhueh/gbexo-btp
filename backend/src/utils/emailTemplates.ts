// utils/emailTemplates.ts

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
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
      .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .info-row { margin: 10px 0; }
      .label { font-weight: bold; color: #0369A1; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; background: #FBBF24; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🏗️ GBTP - Accusé de Réception</h1>
      </div>
      
      <div class="content">
        <h2>Bonjour ${data.name},</h2>
        
        <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>
        
        <p>Notre équipe va étudier attentivement votre projet et vous reviendra dans les <strong>plus brefs délais</strong> avec une proposition personnalisée.</p>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #0369A1;">📋 Récapitulatif de votre demande</h3>
          
          <div class="info-row">
            <span class="label">Client :</span> ${data.company === 'Particulier' ? 'Particulier' : data.company}
          </div>
          
          <div class="info-row">
            <span class="label">Type de projet :</span> ${projectTypeLabels[data.project_type] || data.project_type}
          </div>
          
          <div class="info-row">
            <span class="label">Description :</span><br>
            ${data.description}
          </div>
        </div>
        
        <p><strong>Délai de réponse estimé :</strong> 24 à 48 heures ouvrées</p>
        
        <p>En attendant, n'hésitez pas à consulter nos réalisations sur notre site web.</p>
        
        <center>
          <a href="https://gbtp.com/projects" class="button">Voir Nos Projets</a>
        </center>
        
        <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe GBTP</strong></p>
      </div>
      
      <div class="footer">
        <p><strong>GBTP - Construction & Travaux Publics</strong></p>
        <p>📞 Tél : +229 XX XX XX XX | 📧 Email : contact@gbtp.com</p>
        <p>📍 Cotonou, Bénin</p>
        <p style="margin-top: 15px; font-size: 11px;">
          Ceci est un message automatique, merci de ne pas y répondre.<br>
          Pour toute question, contactez-nous à contact@gbtp.com
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
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .alert { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
      .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
      .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .info-row { margin: 12px 0; padding: 10px; background: white; border-radius: 5px; }
      .label { font-weight: bold; color: #DC2626; display: inline-block; min-width: 150px; }
      .value { color: #374151; }
      .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1> Nouvelle Demande de Devis</h1>
      </div>
      
      <div class="content">
        <div class="alert">
          <strong>⚠️ Action requise :</strong> Une nouvelle demande de devis vient d'être soumise et nécessite votre attention.
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #DC2626;">👤 Informations Client</h3>
          
          <div class="info-row">
            <span class="label">Nom :</span>
            <span class="value">${data.name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Email :</span>
            <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
          </div>
          
          <div class="info-row">
            <span class="label">Client :</span>
            <span class="value">${data.company === 'Particulier' ? '🏠 Particulier' : '🏢 ' + data.company}</span>
          </div>
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #DC2626;">📋 Détails du Projet</h3>
          
          <div class="info-row">
            <span class="label">Type de projet :</span>
            <span class="value">${projectTypeLabels[data.project_type] || data.project_type}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Description :</span><br>
            <div style="margin-top: 10px; padding: 15px; background: white; border-left: 3px solid #0EA5E9; white-space: pre-wrap;">${data.description}</div>
          </div>
        </div>
        
        <center>
          <a href="https://gbtp.com/admin/quotes" class="button">Voir dans le Dashboard</a>
        </center>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          <strong>ID de la demande :</strong> #${data.id}<br>
          <strong>Date de réception :</strong> ${new Date().toLocaleString('fr-FR')}
        </p>
      </div>
      
      <div class="footer">
        <p>Ce message a été envoyé automatiquement par le système GBTP</p>
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
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
      .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✉️ GBTP - Message Bien Reçu</h1>
      </div>
      
      <div class="content">
        <h2>Bonjour ${data.name},</h2>
        
        <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
        
        <p>Notre équipe va traiter votre demande et vous répondra dans les <strong>plus brefs délais</strong>.</p>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #0369A1;">📩 Votre Message</h3>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px;">${data.message}</p>
        </div>
        
        <p><strong>Délai de réponse estimé :</strong> 24 à 48 heures ouvrées</p>
        
        <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe GBTP</strong></p>
      </div>
      
      <div class="footer">
        <p><strong>GBTP - Construction & Travaux Publics</strong></p>
        <p>📞 Tél : +229 XX XX XX XX | 📧 Email : contact@gbtp.com</p>
        <p style="margin-top: 15px; font-size: 11px;">
          Ceci est un message automatique, merci de ne pas y répondre.
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
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
      .alert { background: #EDE9FE; border-left: 4px solid #8B5CF6; padding: 15px; margin: 20px 0; border-radius: 5px; }
      .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .info-row { margin: 12px 0; padding: 10px; background: white; border-radius: 5px; }
      .label { font-weight: bold; color: #7C3AED; }
      .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1> Nouveau Message de Contact</h1>
      </div>
      
      <div class="content">
        <div class="alert">
          <strong>💬 Nouveau message :</strong> Un visiteur vous a contacté via le formulaire.
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #7C3AED;">👤 Expéditeur</h3>
          
          <div class="info-row">
            <span class="label">Nom :</span> ${data.name}
          </div>
          
          <div class="info-row">
            <span class="label">Email :</span> <a href="mailto:${data.email}">${data.email}</a>
          </div>
          
          ${data.phone ? `
          <div class="info-row">
            <span class="label">Téléphone :</span> <a href="tel:${data.phone}">${data.phone}</a>
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">Sujet :</span> ${data.subject}
          </div>
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #7C3AED;">💬 Message</h3>
          <div style="background: white; padding: 15px; border-left: 3px solid #8B5CF6; white-space: pre-wrap;">${data.message}</div>
        </div>
        
        <center>
          <a href="mailto:${data.email}" class="button">Répondre par Email</a>
        </center>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          <strong>Date de réception :</strong> ${new Date().toLocaleString('fr-FR')}
        </p>
      </div>
      
      <div class="footer">
        <p>Ce message a été envoyé automatiquement par le système GBTP</p>
      </div>
    </div>
  </body>
  </html>
    `;
  };