"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Wifi, Coffee, Utensils, ShowerHead as Shower, Bed, Tv, Car, Star, Check, Clock, MapPin } from 'lucide-react';

interface VipLoungeCardProps {
  onSelect: (lounge: any) => void;
}

const lounges = [
  {
    id: 'premium',
    name: 'Salon Premium',
    price: '25,000 XOF',
    duration: '3 heures',
    capacity: '50 personnes',
    amenities: [
      { icon: Wifi, label: 'WiFi gratuit' },
      { icon: Coffee, label: 'Boissons chaudes' },
      { icon: Utensils, label: 'Collations' },
      { icon: Tv, label: 'Divertissement' },
    ],
    features: [
      'Accès 3h avant le départ',
      'Boissons non-alcoolisées illimitées',
      'Collations légères',
      'WiFi haut débit',
      'Journaux et magazines',
      'Télévision',
    ],
    image: '🏢',
    popular: false,
  },
  {
    id: 'business',
    name: 'Salon Business',
    price: '45,000 XOF',
    duration: '5 heures',
    capacity: '30 personnes',
    amenities: [
      { icon: Wifi, label: 'WiFi premium' },
      { icon: Coffee, label: 'Bar complet' },
      { icon: Utensils, label: 'Buffet' },
      { icon: Shower, label: 'Douches' },
      { icon: Tv, label: 'Divertissement' },
    ],
    features: [
      'Accès 5h avant le départ',
      'Bar avec boissons alcoolisées',
      'Buffet chaud et froid',
      'Douches privées',
      'Espaces de travail',
      'Service de conciergerie',
    ],
    image: '💼',
    popular: true,
  },
  {
    id: 'first-class',
    name: 'Salon Première Classe',
    price: '75,000 XOF',
    duration: 'Illimité',
    capacity: '15 personnes',
    amenities: [
      { icon: Wifi, label: 'WiFi premium' },
      { icon: Coffee, label: 'Service à la carte' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Shower, label: 'Spa & douches' },
      { icon: Bed, label: 'Espaces repos' },
      { icon: Car, label: 'Transport VIP' },
    ],
    features: [
      'Accès illimité',
      'Service à la carte',
      'Restaurant gastronomique',
      'Spa et soins',
      'Suites privées',
      'Transport VIP inclus',
      'Majordome personnel',
    ],
    image: '👑',
    popular: false,
  },
];

export function VipLoungeCard({ onSelect }: VipLoungeCardProps) {
  const [selectedLounge, setSelectedLounge] = useState<string | null>(null);

  const handleSelect = (lounge: any) => {
    setSelectedLounge(lounge.id);
    onSelect(lounge);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <Crown className="h-6 w-6 text-yellow-600" />
          <span>Salons VIP</span>
        </h2>
        <p className="text-gray-600">
          Profitez d'un confort exceptionnel avant votre vol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lounges.map((lounge) => (
          <Card 
            key={lounge.id} 
            className={`relative transition-all duration-300 hover:shadow-lg ${
              selectedLounge === lounge.id 
                ? 'ring-2 ring-yellow-400 shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            {lounge.popular && (
              <Badge className="absolute -top-2 left-6 gradient-gold text-white">
                Populaire
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">{lounge.image}</div>
              <CardTitle className="text-xl">{lounge.name}</CardTitle>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-yellow-600">{lounge.price}</p>
                <p className="text-sm text-gray-500">par personne</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>{lounge.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span>{lounge.capacity}</span>
                </div>
              </div>

              {/* Amenities Icons */}
              <div className="flex justify-center space-x-3">
                {lounge.amenities.map((amenity, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                      <amenity.icon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <p className="text-xs text-gray-600">{amenity.label}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Features List */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Inclus:</h4>
                <ul className="space-y-1">
                  {lounge.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {lounge.features.length > 4 && (
                    <li className="text-xs text-gray-500">
                      +{lounge.features.length - 4} autres services
                    </li>
                  )}
                </ul>
              </div>

              {/* Select Button */}
              <Button
                onClick={() => handleSelect(lounge)}
                className={`w-full ${
                  selectedLounge === lounge.id
                    ? 'gradient-gold text-white'
                    : 'border border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                }`}
                variant={selectedLounge === lounge.id ? 'default' : 'outline'}
              >
                {selectedLounge === lounge.id ? (
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Sélectionné</span>
                  </div>
                ) : (
                  'Sélectionner'
                )}
              </Button>

              {/* Rating */}
              <div className="flex items-center justify-center space-x-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-500">(124 avis)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Crown className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">Avantages des salons VIP</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Évitez les foules et détendez-vous dans un environnement calme</li>
                <li>• Accès prioritaire à l'embarquement</li>
                <li>• Service client dédié pour vos besoins</li>
                <li>• Annulation gratuite jusqu'à 2h avant le vol</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLounge && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">
                  {lounges.find(l => l.id === selectedLounge)?.name} sélectionné
                </h4>
                <p className="text-sm text-green-700">
                  Votre accès au salon sera confirmé avec votre réservation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}