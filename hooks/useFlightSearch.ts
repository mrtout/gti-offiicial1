import { useState } from 'react';
import { flightAPI } from '@/lib/flight-api';
import type { FlightSearchParams, FlightOffer } from '@/lib/flight-api';

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (searchParams: any): Promise<FlightOffer[]> => {
    setLoading(true);
    setError(null);

    try {
      // Convertir les paramètres de recherche au format API
      const apiParams: FlightSearchParams = {
        origin: searchParams.departure,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate?.toISOString().split('T')[0] || '',
        returnDate: searchParams.returnDate?.toISOString().split('T')[0],
        adults: searchParams.passengers?.adults || 1,
        children: searchParams.passengers?.children || 0,
        infants: searchParams.passengers?.infants || 0,
        cabinClass: searchParams.travelClass || 'economy',
        currency: 'XOF',
      };

      const results = await flightAPI.searchFlights(apiParams);
      setLoading(false);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche des vols';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const bookFlight = async (bookingRequest: any) => {
    setLoading(true);
    setError(null);

    try {
      const confirmation = await flightAPI.bookFlight(bookingRequest);
      setLoading(false);
      return confirmation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réservation';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const getFlightStatus = async (pnr: string) => {
    try {
      return await flightAPI.getFlightStatus(pnr);
    } catch (err) {
      console.error('Erreur statut vol:', err);
      return null;
    }
  };

  return {
    searchFlights,
    bookFlight,
    getFlightStatus,
    loading,
    error,
  };
}