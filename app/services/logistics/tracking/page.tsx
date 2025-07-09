"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Search,
  MapPin,
  Clock,
  Truck,
  Plane,
  Ship,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

const trackingStatuses = [
  {
    id: 1,
    status: 'En préparation',
    description: 'Votre commande est en cours de préparation',
    timestamp: '2024-01-15 09:00',
    location: 'Entrepôt Casablanca',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    status: 'Expédié',
    description: 'Votre colis a été expédié',
    timestamp: '2024-01-15 14:30',
    location: 'Centre de tri Casablanca',
    icon: Truck,
    color: 'bg-yellow-500',
  },
  {
    id: 3,
    status: 'En transit',
    description: 'Votre colis est en transit international',
    timestamp: '2024-01-16 08:15',
    location: 'Aéroport Mohammed V',
    icon: Plane,
    color: 'bg-orange-500',
  },
  {
    id: 4,
    status: 'Arrivé à destination',
    description: 'Votre colis est arrivé dans le pays de destination',
    timestamp: '2024-01-17 12:00',
    location: 'Centre de tri Paris',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
];

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackPackage = async () => {
    if (!trackingNumber.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        trackingNumber: trackingNumber,
        status: 'En transit',
        estimatedDelivery: '2024-01-18',
        currentLocation: 'Centre de tri Paris',
        history: trackingStatuses,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Suivi de Colis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez vos expéditions en temps réel avec notre système de tracking avancé
          </p>
        </div>

        {/* Tracking Search */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Rechercher un Colis
            </CardTitle>
            <CardDescription>
              Entrez votre numéro de suivi pour connaître l'état de votre expédition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Numéro de suivi (ex: GTI123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleTrackPackage}
                disabled={isLoading || !trackingNumber.trim()}
                className="gradient-gold text-white"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Suivre
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="max-w-4xl mx-auto">
            {/* Package Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Colis #{trackingResult.trackingNumber}
                    </CardTitle>
                    <CardDescription>
                      Statut actuel: {trackingResult.status}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {trackingResult.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Position Actuelle</p>
                      <p className="text-gray-600">{trackingResult.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Livraison Estimée</p>
                      <p className="text-gray-600">{trackingResult.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Info className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Type d'Expédition</p>
                      <p className="text-gray-600">Express International</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historique de Suivi</CardTitle>
                <CardDescription>
                  Suivez le parcours détaillé de votre colis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.history.map((event, index) => {
                    const Icon = event.icon;
                    const isLast = index === trackingResult.history.length - 1;
                    
                    return (
                      <div key={event.id} className="relative">
                        {!isLast && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${event.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {event.status}
                              </h3>
                              <time className="text-sm text-gray-500">
                                {event.timestamp}
                              </time>
                            </div>
                            <p className="text-gray-600 mb-1">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Besoin d'Aide ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Problème avec votre suivi ?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Si vous rencontrez des difficultés pour suivre votre colis ou si les informations semblent incorrectes, notre équipe est là pour vous aider.
                  </p>
                  <Button variant="outline">
                    Contacter le Support
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Questions Fréquentes
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Combien de temps prend une livraison internationale ?</li>
                    <li>• Comment modifier l'adresse de livraison ?</li>
                    <li>• Que faire si mon colis est en retard ?</li>
                    <li>• Comment obtenir un accusé de réception ?</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}