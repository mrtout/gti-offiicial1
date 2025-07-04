import { NextRequest, NextResponse } from 'next/server';

// Configuration Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: NextRequest) {
  try {
    const { type, booking } = await request.json();

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      console.warn('Twilio credentials not configured');
      return NextResponse.json({ success: false, error: 'SMS service not configured' });
    }

    let message = '';

    switch (type) {
      case 'booking_confirmation':
        message = `✈️ Réservation confirmée ! PNR: ${booking.pnr}. Détails par email. Groupe Tanou International`;
        break;
      case 'flight_reminder':
        message = `⏰ Rappel: Votre vol décolle dans 24h. PNR: ${booking.pnr}. Présentez-vous 2h avant. Bon voyage !`;
        break;
      case 'flight_update':
        message = `📢 Votre vol ${booking.pnr} a été modifié. Consultez votre email ou le site de la compagnie.`;
        break;
      default:
        return NextResponse.json({ success: false, error: 'Type de notification invalide' });
    }

    // Simulation d'envoi SMS (remplacer par l'API Twilio réelle)
    const smsData = {
      to: booking.contactPhone,
      from: TWILIO_PHONE_NUMBER,
      body: message,
    };

    console.log('SMS envoyé:', { to: booking.contactPhone, message });
    
    return NextResponse.json({ success: true, message: 'SMS envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'envoi du SMS' });
  }
}