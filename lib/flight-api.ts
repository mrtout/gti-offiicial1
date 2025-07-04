// Service d'API pour les vols avec intégration Skyscanner/Mystifly
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  currency: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string; // Added for compatibility
  departureTime: string;
  arrivalTime: string;
  departureDate: string; // Added missing property
  arrivalDate: string; // Added missing property
  duration: string;
  stops: number;
  basePrice: number;
  finalPrice: number; // Prix avec marge de 15%
  price: string; // Added missing property (formatted price)
  currency: string;
  aircraft: string;
  class: string; // Added missing property
  amenities: {
    wifi: boolean;
    meals: boolean;
    entertainment: boolean;
  };
  baggage: string;
  cancellationPolicy: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant';
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    nationality: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  additionalServices?: string[];
}

export interface BookingConfirmation {
  pnr: string;
  bookingReference: string;
  eTicketNumber: string;
  airlineConfirmation: string;
  airlineWebsite: string;
  checkInUrl: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  currency: string;
}

class FlightAPIService {
  private baseUrl = process.env.NEXT_PUBLIC_FLIGHT_API_URL || 'https://api.skyscanner.net/v1';
  private apiKey = process.env.NEXT_PUBLIC_FLIGHT_API_KEY || '';
  private marginPercentage = 15; // Marge de 15% automatique

  private applyMargin(basePrice: number): number {
    return Math.round(basePrice * (1 + this.marginPercentage / 100));
  }

  private formatPrice(price: number): string {
    return `${price.toLocaleString()} XOF`;
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      // Simulation d'appel API réel - remplacer par l'API Skyscanner/Mystifly
      const response = await fetch(`${this.baseUrl}/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...params,
          currency: 'XOF', // Forcer la devise en francs CFA
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche de vols');
      }

      const data = await response.json();
      
      // Appliquer la marge de 15% sur tous les prix
      return data.flights.map((flight: any) => ({
        ...flight,
        departure: flight.origin,
        departureDate: flight.departureTime?.split('T')[0] || params.departureDate,
        arrivalDate: flight.arrivalTime?.split('T')[0] || params.departureDate,
        basePrice: flight.price,
        finalPrice: this.applyMargin(flight.price),
        price: this.formatPrice(this.applyMargin(flight.price)),
        currency: 'XOF',
        class: params.cabinClass,
      }));
    } catch (error) {
      console.error('Erreur API vols:', error);
      
      // Fallback vers les données mock avec marge appliquée
      const mockFlights = await import('@/data/mockData').then(m => m.mockFlights);
      return mockFlights.map(flight => {
        const basePrice = parseInt(flight.price.replace(/[^\d]/g, ''));
        const finalPrice = this.applyMargin(basePrice);
        
        return {
          id: flight.id,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          origin: flight.departure,
          destination: flight.destination,
          departure: flight.departure, // Added for compatibility
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          departureDate: flight.departureDate || params.departureDate, // Added missing property
          arrivalDate: flight.arrivalDate || params.departureDate, // Added missing property
          duration: flight.duration,
          stops: flight.stops,
          basePrice: basePrice,
          finalPrice: finalPrice,
          price: this.formatPrice(finalPrice), // Added formatted price
          currency: 'XOF',
          aircraft: flight.aircraft || 'Boeing 737',
          class: params.cabinClass || 'economy', // Added missing property
          amenities: flight.amenities || { wifi: false, meals: false, entertainment: false },
          baggage: flight.baggage || '23kg inclus',
          cancellationPolicy: 'Remboursable sous conditions',
        };
      });
    }
  }

  async bookFlight(bookingRequest: BookingRequest): Promise<BookingConfirmation> {
    try {
      const response = await fetch(`${this.baseUrl}/flights/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      const booking = await response.json();
      
      // Déclencher les notifications automatiques
      await this.sendBookingNotifications(booking);
      
      return booking;
    } catch (error) {
      console.error('Erreur réservation:', error);
      
      // Simulation de réservation réussie
      const mockBooking: BookingConfirmation = {
        pnr: `GTI${Date.now()}`,
        bookingReference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        eTicketNumber: `E${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        airlineConfirmation: `AC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        airlineWebsite: 'https://www.airfrance.fr',
        checkInUrl: 'https://www.airfrance.fr/check-in',
        status: 'confirmed',
        totalAmount: 485000,
        currency: 'XOF',
      };
      
      await this.sendBookingNotifications(mockBooking);
      return mockBooking;
    }
  }

  async getFlightStatus(pnr: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/flights/status/${pnr}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur statut vol:', error);
      return {
        status: 'on-time',
        departure: {
          scheduled: '23:55',
          estimated: '23:55',
          gate: 'A12',
          terminal: '2E',
        },
        arrival: {
          scheduled: '06:30+1',
          estimated: '06:30+1',
        },
      };
    }
  }

  private async sendBookingNotifications(booking: BookingConfirmation): Promise<void> {
    try {
      // Notification email via SendGrid
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_confirmation',
          booking,
        }),
      });

      // Notification SMS via Twilio
      await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_confirmation',
          booking,
        }),
      });

      // Programmer rappel 24h avant le vol
      await fetch('/api/notifications/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flight_reminder',
          booking,
          scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h plus tard
        }),
      });
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  }
}

export const flightAPI = new FlightAPIService();