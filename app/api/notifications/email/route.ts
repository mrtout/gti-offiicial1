import { NextRequest, NextResponse } from 'next/server';

// Configuration SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@groupetanouinternational.com';

export async function POST(request: NextRequest) {
  try {
    const { type, booking } = await request.json();

    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured');
      return NextResponse.json({ success: false, error: 'Email service not configured' });
    }

    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'booking_confirmation':
        subject = `Confirmation de réservation - ${booking.pnr}`;
        htmlContent = generateBookingConfirmationEmail(booking);
        break;
      case 'flight_reminder':
        subject = `Rappel de vol - Départ dans 24h - ${booking.pnr}`;
        htmlContent = generateFlightReminderEmail(booking);
        break;
      case 'flight_update':
        subject = `Mise à jour de vol - ${booking.pnr}`;
        htmlContent = generateFlightUpdateEmail(booking);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Type de notification invalide' });
    }

    // Simulation d'envoi email (remplacer par l'API SendGrid réelle)
    const emailData = {
      personalizations: [{
        to: [{ email: booking.contactEmail }],
        subject: subject,
      }],
      from: { email: FROM_EMAIL, name: 'Groupe Tanou International' },
      content: [{
        type: 'text/html',
        value: htmlContent,
      }],
    };

    console.log('Email envoyé:', { to: booking.contactEmail, subject });
    
    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'envoi de l\'email' });
  }
}

function generateBookingConfirmationEmail(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ Réservation Confirmée</h1>
          <p>Groupe Tanou International</p>
        </div>
        
        <div class="content">
          <h2>Bonjour,</h2>
          <p>Votre réservation de vol a été confirmée avec succès !</p>
          
          <div class="booking-details">
            <h3>Détails de votre réservation</h3>
            <p><strong>Numéro de réservation (PNR):</strong> ${booking.pnr}</p>
            <p><strong>Référence:</strong> ${booking.bookingReference}</p>
            <p><strong>Billet électronique:</strong> ${booking.eTicketNumber}</p>
            <p><strong>Confirmation compagnie:</strong> ${booking.airlineConfirmation}</p>
            <p><strong>Montant total:</strong> ${booking.totalAmount.toLocaleString()} ${booking.currency}</p>
          </div>
          
          <div class="booking-details">
            <h3>Liens utiles</h3>
            <a href="${booking.airlineWebsite}" class="button">Site de la compagnie</a>
            <a href="${booking.checkInUrl}" class="button">Enregistrement en ligne</a>
          </div>
          
          <div class="booking-details">
            <h3>Informations importantes</h3>
            <ul>
              <li>Présentez-vous à l'aéroport 2h avant le départ</li>
              <li>Vérifiez la validité de votre passeport</li>
              <li>Consultez les exigences de visa si nécessaire</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Groupe Tanou International</p>
          <p>+226 66 11 71 63 | contact@groupetanouinternational.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateFlightReminderEmail(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rappel de vol</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Rappel de vol</h1>
          <p>Départ dans 24 heures</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <h3>🛫 Votre vol décolle demain !</h3>
            <p>N'oubliez pas de vous présenter à l'aéroport 2 heures avant le départ.</p>
          </div>
          
          <p><strong>PNR:</strong> ${booking.pnr}</p>
          <p><strong>Référence:</strong> ${booking.bookingReference}</p>
          
          <a href="${booking.checkInUrl}" class="button">Enregistrement en ligne</a>
          <a href="${booking.airlineWebsite}" class="button">Vérifier le statut du vol</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateFlightUpdateEmail(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Mise à jour de vol</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert { background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Mise à jour de vol</h1>
          <p>Changement d'horaire</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <h3>⚠️ Modification de votre vol</h3>
            <p>Votre vol a été modifié. Veuillez consulter les nouveaux horaires.</p>
          </div>
          
          <p><strong>PNR:</strong> ${booking.pnr}</p>
          <p>Consultez le site de la compagnie pour plus de détails.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}