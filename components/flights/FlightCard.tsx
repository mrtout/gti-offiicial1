"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Plane,
  Clock,
  MapPin,
  Wifi,
  Utensils,
  Tv,
  Star,
  ArrowRight,
} from 'lucide-react';

interface FlightCardProps {
  flight: any;
  onSelect: () => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatDuration = (duration: string) => {
    return duration.replace('h', 'h ').replace('m', 'min');
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 escale';
    return `${stops} escales`;
  };

  const getAirlineIcon = (airline: string) => {
    // Retourne une icône ou emoji basé sur la compagnie
    const icons: { [key: string]: string } = {
      'Air France': '🇫🇷',
      'Emirates': '🇦🇪',
      'Royal Air Maroc': '🇲🇦',
      'Turkish Airlines': '🇹🇷',
      'Ethiopian Airlines': '🇪🇹',
      'Kenya Airways': '🇰🇪',
    };
    return icons[airline] || '✈️';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-yellow-400">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getAirlineIcon(flight.airline)}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
              <p className="text-sm text-gray-500">{flight.flightNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-600">{flight.price}</p>
            <p className="text-sm text-gray-500">par personne</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Departure */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{flight.departureTime}</p>
            <p className="text-sm text-gray-600">{flight.departure}</p>
            <p className="text-xs text-gray-500">{flight.departureDate}</p>
          </div>

          {/* Flight Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 relative">
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">{formatDuration(flight.duration)}</p>
            <p className="text-xs text-gray-500">{getStopsText(flight.stops)}</p>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
            <p className="text-sm text-gray-600">{flight.destination}</p>
            <p className="text-xs text-gray-500">{flight.arrivalDate}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {flight.amenities?.wifi && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Wifi className="h-3 w-3" />
              <span>WiFi</span>
            </div>
          )}
          {flight.amenities?.meals && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Utensils className="h-3 w-3" />
              <span>Repas</span>
            </div>
          )}
          {flight.amenities?.entertainment && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Tv className="h-3 w-3" />
              <span>Divertissement</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              {flight.class}
            </Badge>
            {flight.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">{flight.rating}</span>
              </div>
            )}
            {flight.popular && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                Populaire
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Détails
            </Button>
            <Button 
              onClick={onSelect}
              className="gradient-gold text-white"
              size="sm"
            >
              Sélectionner
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        {flight.baggage && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Bagages inclus: {flight.baggage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}