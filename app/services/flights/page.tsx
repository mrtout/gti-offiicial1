"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchForm } from '@/components/flights/SearchForm';
import { FilterSidebar } from '@/components/flights/FilterSidebar';
import { FlightCard } from '@/components/flights/FlightCard';
import { BookingForm } from '@/components/flights/BookingForm';
import { BookingConfirmation } from '@/components/flights/BookingConfirmation';
import { VipLoungeCard } from '@/components/flights/VipLoungeCard';
import { AdditionalServicesSelector } from '@/components/flights/AdditionalServicesSelector';
import { MobileMoneyPayment } from '@/components/flights/MobileMoneyPayment';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { mockFlights, mockAirports } from '@/data/mockData';
import { SearchParams, Flight, BookingData, ContactInfo } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plane,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Shield,
  CreditCard,
  Headphones,
} from 'lucide-react';

type BookingStep = 'search' | 'results' | 'booking' | 'payment' | 'confirmation';

interface Filters {
  priceRange: [number, number];
  airlines: string[];
  stops: string;
  departureTime: string;
  duration: string;
}

const features = [
  {
    icon: Search,
    title: 'Recherche Intelligente',
    description: 'Trouvez les meilleurs vols avec notre moteur de recherche avancé',
  },
  {
    icon: Shield,
    title: 'Réservation Sécurisée',
    description: 'Vos données et paiements sont protégés par un cryptage SSL',
  },
  {
    icon: CreditCard,
    title: 'Paiement Flexible',
    description: 'Payez avec Mobile Money, carte bancaire ou virement',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous aider à tout moment',
  },
];

const createInitialBookingData = (): BookingData => ({
  flight: {} as Flight,
  passengers: [],
  contactInfo: {} as ContactInfo,
  preferences: {
    seatPreference: '',
    mealPreference: '',
    specialRequests: '',
    newsletter: false,
    terms: false,
  },
  additionalServices: [],
  vipLounge: null,
  bookingDate: '',
  bookingReference: '',
});

export default function FlightsPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>(createInitialBookingData());
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 2000000],
    airlines: [],
    stops: 'all',
    departureTime: 'all',
    duration: 'all',
  });

  const { searchFlights, loading, error } = useFlightSearch();

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const results = await searchFlights(searchParams);
      setSearchResults(results || mockFlights);
      setCurrentStep('results');
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setSearchResults(mockFlights);
      setCurrentStep('results');
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    updateBookingData({ flight });
    setCurrentStep('booking');
  };

  const handleBookingSubmit = (data: BookingData) => {
    setBookingData(data);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('confirmation');
  };

  const filteredFlights = searchResults.filter(flight => {
    // Appliquer les filtres
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    if (filters.stops !== 'all') {
      if (filters.stops === 'direct' && flight.stops > 0) return false;
      if (filters.stops === '1-stop' && flight.stops !== 1) return false;
      if (filters.stops === '2-plus' && flight.stops < 2) return false;
    }

    const price = parseInt(flight.price.replace(/[^\d]/g, ''));
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  const renderSearchStep = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Plane className="h-8 w-8 text-yellow-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Réservation de Vols
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Trouvez et réservez vos billets d'avion aux meilleurs prix. 
          Comparez des centaines de compagnies aériennes en quelques clics.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>500+ Destinations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Note 4.8/5</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Paiement Sécurisé</span>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Rechercher un vol</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Popular Destinations */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Destinations Populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Paris', country: 'France', price: '450,000 XOF', image: '🇫🇷' },
              { city: 'Dubai', country: 'UAE', price: '380,000 XOF', image: '🇦🇪' },
              { city: 'Casablanca', country: 'Maroc', price: '280,000 XOF', image: '🇲🇦' },
              { city: 'Abidjan', country: 'Côte d\'Ivoire', price: '120,000 XOF', image: '🇨🇮' },
            ].map((dest, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{dest.image}</div>
                <h4 className="font-semibold">{dest.city}</h4>
                <p className="text-sm text-gray-600">{dest.country}</p>
                <p className="text-yellow-600 font-bold text-sm">À partir de {dest.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
          <p className="text-gray-600">{filteredFlights.length} vols trouvés</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentStep('search')}
          className="flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Nouvelle recherche</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            flights={searchResults}
          />
        </div>

        {/* Flight Results */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Recherche en cours...</p>
            </div>
          ) : filteredFlights.length > 0 ? (
            filteredFlights.map((flight, index) => (
              <FlightCard
                key={index}
                flight={flight}
                onSelect={() => handleFlightSelect(flight)}
              />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun vol trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche ou vos filtres.
                </p>
                <Button onClick={() => setCurrentStep('search')}>
                  Nouvelle recherche
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookingStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('results')}
        >
          ← Retour aux résultats
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Réservation</h2>
          <p className="text-gray-600">Complétez vos informations de voyage</p>
        </div>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="booking">Informations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="vip">VIP Lounge</TabsTrigger>
        </TabsList>

        <TabsContent value="booking">
          <BookingForm
            flight={selectedFlight}
            onSubmit={handleBookingSubmit}
          />
        </TabsContent>

        <TabsContent value="services">
          <AdditionalServicesSelector
            onServicesChange={(services) => {
              updateBookingData({ additionalServices: services });
            }}
          />
        </TabsContent>

        <TabsContent value="vip">
          <VipLoungeCard
            onSelect={(lounge) => {
              updateBookingData({ vipLounge: lounge });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Paiement</h2>
        <p className="text-gray-600">Finalisez votre réservation</p>
      </div>

      <MobileMoneyPayment
        bookingData={bookingData}
        flight={selectedFlight}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="max-w-2xl mx-auto">
      <BookingConfirmation
        bookingData={bookingData}
        flight={selectedFlight}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'search' && renderSearchStep()}
        {currentStep === 'results' && renderResultsStep()}
        {currentStep === 'booking' && renderBookingStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'confirmation' && renderConfirmationStep()}
      </main>

      <Footer />
    </div>
  );
}