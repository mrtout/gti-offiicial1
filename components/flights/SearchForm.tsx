"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarIcon,
  MapPin,
  Users,
  ArrowRightLeft,
  Search,
  Plane,
  Plus,
  Minus,
} from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: any) => void;
  loading?: boolean;
}

const popularDestinations = [
  { code: 'CDG', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'CMN', city: 'Casablanca', country: 'Maroc', flag: '🇲🇦' },
  { code: 'ABJ', city: 'Abidjan', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'ACC', city: 'Accra', country: 'Ghana', flag: '🇬🇭' },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
];

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState('economy');
  const [showPassengers, setShowPassengers] = useState(false);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSwapCities = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  const updatePassengers = (type: keyof typeof passengers, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departure || !destination || !departureDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const searchParams = {
      tripType,
      departure,
      destination,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      passengers,
      travelClass,
    };

    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type */}
      <Tabs value={tripType} onValueChange={(value) => setTripType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="round-trip">Aller-retour</TabsTrigger>
          <TabsTrigger value="one-way">Aller simple</TabsTrigger>
          <TabsTrigger value="multi-city">Multi-destinations</TabsTrigger>
        </TabsList>

        <TabsContent value={tripType} className="space-y-6 mt-6">
          {/* Departure and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label htmlFor="departure">Départ</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="departure"
                  placeholder="Ville ou aéroport de départ"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="Ville ou aéroport de destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwapCities}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 bg-white border-2 border-gray-200 hover:border-yellow-400"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-2">
            <Label>Destinations populaires</Label>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest) => (
                <Badge
                  key={dest.code}
                  variant="outline"
                  className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-400"
                  onClick={() => setDestination(`${dest.city} (${dest.code})`)}
                >
                  <span className="mr-1">{dest.flag}</span>
                  {dest.city}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de départ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? (
                      format(departureDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {tripType === 'round-trip' && (
              <div className="space-y-2">
                <Label>Date de retour</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? (
                        format(returnDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => date < (departureDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Passagers</Label>
              <Popover open={showPassengers} onOpenChange={setShowPassengers}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {totalPassengers} passager{totalPassengers > 1 ? 's' : ''}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Adultes</p>
                        <p className="text-sm text-gray-500">12 ans et plus</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('adults', false)}
                          disabled={passengers.adults <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{passengers.adults}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('adults', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enfants</p>
                        <p className="text-sm text-gray-500">2-11 ans</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('children', false)}
                          disabled={passengers.children <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{passengers.children}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('children', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bébés</p>
                        <p className="text-sm text-gray-500">Moins de 2 ans</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('infants', false)}
                          disabled={passengers.infants <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{passengers.infants}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('infants', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Économique</SelectItem>
                  <SelectItem value="premium">Premium Économique</SelectItem>
                  <SelectItem value="business">Affaires</SelectItem>
                  <SelectItem value="first">Première</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full gradient-gold text-white py-3 text-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Recherche en cours...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Rechercher des vols</span>
              </div>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </form>
  );
}