"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Luggage,
  Utensils,
  Armchair,
  Shield,
  Plane,
  Car,
  Wifi,
  Headphones,
  Plus,
  Check,
} from 'lucide-react';

interface AdditionalServicesSelectorProps {
  onServicesChange: (services: any[]) => void;
}

const services = [
  {
    id: 'extra-baggage',
    icon: Luggage,
    title: 'Bagage supplémentaire',
    description: 'Ajoutez 23kg de baggage en soute',
    price: '15,000 XOF',
    popular: true,
    category: 'baggage',
  },
  {
    id: 'seat-selection',
    icon: Armchair,
    title: 'Choix du siège',
    description: 'Sélectionnez votre siège préféré',
    price: '8,000 XOF',
    popular: true,
    category: 'comfort',
  },
  {
    id: 'premium-meal',
    icon: Utensils,
    title: 'Repas premium',
    description: 'Menu gastronomique à bord',
    price: '12,000 XOF',
    popular: false,
    category: 'meal',
  },
  {
    id: 'travel-insurance',
    icon: Shield,
    title: 'Assurance voyage',
    description: 'Protection complète pour votre voyage',
    price: '25,000 XOF',
    popular: true,
    category: 'insurance',
  },
  {
    id: 'priority-boarding',
    icon: Plane,
    title: 'Embarquement prioritaire',
    description: 'Montez à bord en premier',
    price: '5,000 XOF',
    popular: false,
    category: 'priority',
  },
  {
    id: 'airport-transfer',
    icon: Car,
    title: 'Transfert aéroport',
    description: 'Transport privé vers/depuis l\'aéroport',
    price: '20,000 XOF',
    popular: false,
    category: 'transport',
  },
  {
    id: 'wifi-access',
    icon: Wifi,
    title: 'WiFi à bord',
    description: 'Internet haut débit pendant le vol',
    price: '10,000 XOF',
    popular: true,
    category: 'connectivity',
  },
  {
    id: 'entertainment',
    icon: Headphones,
    title: 'Divertissement premium',
    description: 'Accès à tous les films et séries',
    price: '7,000 XOF',
    popular: false,
    category: 'entertainment',
  },
];

const categories = [
  { id: 'all', label: 'Tous les services' },
  { id: 'baggage', label: 'Bagages' },
  { id: 'comfort', label: 'Confort' },
  { id: 'meal', label: 'Restauration' },
  { id: 'insurance', label: 'Assurance' },
  { id: 'transport', label: 'Transport' },
];

export function AdditionalServicesSelector({ onServicesChange }: AdditionalServicesSelectorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const toggleService = (serviceId: string) => {
    const updated = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updated);
    
    const selectedServiceObjects = services.filter(service => 
      updated.includes(service.id)
    );
    onServicesChange(selectedServiceObjects);
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseInt(service.price.replace(/[^\d]/g, '')) : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <Plus className="h-6 w-6 text-yellow-600" />
          <span>Services supplémentaires</span>
        </h2>
        <p className="text-gray-600">
          Personnalisez votre voyage avec nos services optionnels
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={activeCategory === category.id ? 'gradient-gold text-white' : ''}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <Card 
              key={service.id}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected ? 'ring-2 ring-yellow-400 shadow-lg' : ''
              }`}
              onClick={() => toggleService(service.id)}
            >
              {service.popular && (
                <Badge className="absolute -top-2 left-4 gradient-gold text-white text-xs">
                  Populaire
                </Badge>
              )}

              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <service.icon className={`h-5 w-5 ${
                      isSelected ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleService(service.id)}
                        className="ml-2"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-yellow-600">{service.price}</span>
                      {isSelected && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm">Ajouté</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>Services sélectionnés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((serviceId) => {
                const service = services.find(s => s.id === serviceId);
                if (!service) return null;

                return (
                  <div key={serviceId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <service.icon className="h-4 w-4 text-green-600" />
                      <span className="text-green-800">{service.title}</span>
                    </div>
                    <span className="font-semibold text-green-800">{service.price}</span>
                  </div>
                );
              })}
              
              <Separator />
              
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="text-green-800">Total des services</span>
                <span className="text-green-600">
                  {new Intl.NumberFormat('fr-FR').format(getTotalPrice())} XOF
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Benefits */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">Avantages des services supplémentaires</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Modification gratuite jusqu'à 24h avant le départ</li>
                <li>• Remboursement intégral en cas d'annulation du vol</li>
                <li>• Support client prioritaire</li>
                <li>• Garantie de qualité de service</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}