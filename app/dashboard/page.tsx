"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Bell,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';

interface Booking {
  id: string;
  pnr: string;
  bookingReference: string;
  eTicketNumber: string;
  airlineConfirmation: string;
  airlineWebsite: string;
  checkInUrl: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  flight: {
    airline: string;
    flightNumber: string;
    departure: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    departureDate: string;
    arrivalDate: string;
    duration: string;
    aircraft: string;
    terminal: string;
    gate: string;
  };
  passengers: Array<{
    name: string;
    type: string;
    seatNumber?: string;
  }>;
  totalAmount: number;
  currency: string;
  bookingDate: string;
  additionalServices: string[];
  flightStatus?: {
    status: 'on-time' | 'delayed' | 'cancelled' | 'boarding' | 'departed';
    delay?: number;
    gate?: string;
    terminal?: string;
  };
}

// Données mock pour la démonstration
const mockBookings: Booking[] = [
  {
    id: '1',
    pnr: 'GTI1234567890',
    bookingReference: 'REF123ABC',
    eTicketNumber: 'E1234567890AB',
    airlineConfirmation: 'AC12345678',
    airlineWebsite: 'https://www.airfrance.fr',
    checkInUrl: 'https://www.airfrance.fr/check-in',
    status: 'confirmed',
    flight: {
      airline: 'Air France',
      flightNumber: 'AF 718',
      departure: 'Ouagadougou (OUA)',
      destination: 'Paris (CDG)',
      departureTime: '23:55',
      arrivalTime: '06:30+1',
      departureDate: '2025-02-15',
      arrivalDate: '2025-02-16',
      duration: '6h 35m',
      aircraft: 'Boeing 737-800',
      terminal: 'Terminal 2E',
      gate: 'A12',
    },
    passengers: [
      { name: 'Amadou Traoré', type: 'Adulte', seatNumber: '12A' },
    ],
    totalAmount: 485000,
    currency: 'XOF',
    bookingDate: '2025-01-15',
    additionalServices: ['Bagage supplémentaire', 'Choix du siège'],
    flightStatus: {
      status: 'on-time',
      gate: 'A12',
      terminal: 'Terminal 2E',
    },
  },
  {
    id: '2',
    pnr: 'GTI0987654321',
    bookingReference: 'REF456DEF',
    eTicketNumber: 'E0987654321CD',
    airlineConfirmation: 'AC87654321',
    airlineWebsite: 'https://www.royalairmaroc.com',
    checkInUrl: 'https://www.royalairmaroc.com/check-in',
    status: 'completed',
    flight: {
      airline: 'Royal Air Maroc',
      flightNumber: 'AT 566',
      departure: 'Ouagadougou (OUA)',
      destination: 'Casablanca (CMN)',
      departureTime: '14:20',
      arrivalTime: '18:45',
      departureDate: '2025-01-10',
      arrivalDate: '2025-01-10',
      duration: '4h 25m',
      aircraft: 'Boeing 737-800',
      terminal: 'Terminal 1',
      gate: 'B8',
    },
    passengers: [
      { name: 'Fatima Ouédraogo', type: 'Adulte', seatNumber: '15C' },
    ],
    totalAmount: 285000,
    currency: 'XOF',
    bookingDate: '2024-12-20',
    additionalServices: ['Repas premium'],
    flightStatus: {
      status: 'departed',
    },
  },
];

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFlightStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'boarding':
        return 'bg-blue-100 text-blue-800';
      case 'departed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshFlightStatus = async (pnr: string) => {
    setRefreshing(true);
    try {
      // Simulation d'appel API pour récupérer le statut du vol
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le statut du vol
      setBookings(prev => prev.map(booking => 
        booking.pnr === pnr 
          ? { 
              ...booking, 
              flightStatus: { 
                ...booking.flightStatus!, 
                status: 'on-time',
                gate: 'A12',
                terminal: 'Terminal 2E'
              } 
            }
          : booking
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        // Simulation d'appel API pour annuler la réservation
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ));
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon Espace Personnel
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations et suivez vos vols en temps réel
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Mes Réservations</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total vols</p>
                      <p className="text-xl font-bold">{bookings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Confirmés</p>
                      <p className="text-xl font-bold">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">En attente</p>
                      <p className="text-xl font-bold">
                        {bookings.filter(b => b.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total dépensé</p>
                      <p className="text-xl font-bold">
                        {bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()} XOF
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des réservations */}
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.flight.airline} {booking.flight.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            PNR: {booking.pnr}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        
                        {booking.flightStatus && (
                          <Badge className={getFlightStatusColor(booking.flightStatus.status)}>
                            {booking.flightStatus.status === 'on-time' ? 'À l\'heure' :
                             booking.flightStatus.status === 'delayed' ? 'Retardé' :
                             booking.flightStatus.status === 'cancelled' ? 'Annulé' :
                             booking.flightStatus.status === 'boarding' ? 'Embarquement' :
                             booking.flightStatus.status === 'departed' ? 'Parti' : booking.flightStatus.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {booking.flight.departureTime}
                        </p>
                        <p className="text-sm text-gray-600">{booking.flight.departure}</p>
                        <p className="text-xs text-gray-500">{booking.flight.departureDate}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <div className="flex-1 h-px bg-gray-300 relative">
                            <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{booking.flight.duration}</p>
                        <p className="text-xs text-gray-500">{booking.flight.aircraft}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {booking.flight.arrivalTime}
                        </p>
                        <p className="text-sm text-gray-600">{booking.flight.destination}</p>
                        <p className="text-xs text-gray-500">{booking.flight.arrivalDate}</p>
                      </div>
                    </div>

                    {booking.flightStatus && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            {booking.flightStatus.terminal && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>Terminal {booking.flightStatus.terminal}</span>
                              </div>
                            )}
                            {booking.flightStatus.gate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>Porte {booking.flightStatus.gate}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshFlightStatus(booking.pnr)}
                            disabled={refreshing}
                          >
                            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                            Actualiser
                          </Button>
                        </div>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <p className="text-gray-600">Passagers</p>
                          <p className="font-medium">
                            {booking.passengers.map(p => p.name).join(', ')}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Total</p>
                          <p className="font-bold text-blue-600">
                            {booking.totalAmount.toLocaleString()} {booking.currency}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.checkInUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Enregistrement
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.airlineWebsite, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Compagnie
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Billet
                        </Button>

                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>

                    {booking.additionalServices.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">Services supplémentaires:</p>
                        <div className="flex flex-wrap gap-1">
                          {booking.additionalServices.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {bookings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de réservation de vol.
                  </p>
                  <Button className="gradient-gold text-white">
                    Réserver un vol
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fonctionnalité de profil utilisateur à implémenter.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Paramètres de notification à implémenter.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}