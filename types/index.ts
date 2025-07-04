export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  stops: number;
  price: string;
  class: string;
  aircraft?: string;
  terminal?: string;
  gate?: string;
  baggage?: string;
  amenities?: {
    wifi: boolean;
    meals: boolean;
    entertainment: boolean;
  };
  rating?: number;
  popular?: boolean;
}

export interface Passenger {
  type: 'adult' | 'child' | 'infant';
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface BookingData {
  flight: Flight;
  passengers: Passenger[];
  contactInfo: ContactInfo;
  preferences: {
    seatPreference: string;
    mealPreference: string;
    specialRequests: string;
    newsletter: boolean;
    terms: boolean;
  };
  additionalServices: any[];
  vipLounge: any;
  bookingDate: string;
  bookingReference: string;
  pnr?: string;
  eTicketNumber?: string;
  airlineConfirmation?: string;
  airlineWebsite?: string;
  checkInUrl?: string;
}

export interface SearchParams {
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  departure: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelClass: string;
}