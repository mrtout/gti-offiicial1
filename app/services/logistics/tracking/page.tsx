"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Ship,
  Plane,
  AlertCircle,
  Calendar,
  FileText,
  Phone,
  Mail,
  Download,
  Bell,
  RefreshCw,
} from 'lucide-react';

// Define interfaces for proper typing
interface TrackingHistoryItem {
  id: number;
  status: string;
  description: string;
  timestamp: string;
  location: string;
  icon: React.ComponentType;
  color: string;
}

interface TrackingResult {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  currentLocation: string;
  history: TrackingHistoryItem[];
}

const mockTrackingData: TrackingResult = {
  trackingNumber: 'GTI-SEA-001234',
  status: 'En transit',
  estimatedDelivery: '2025-02-05',
  currentLocation: 'Port de Tema, Ghana',
  history: [
    {
      id: 1,
      status: 'En transit',
      description: 'Cargaison arrivée au port de Tema, en attente de transbordement',
      timestamp: '2025-01-25 14:30',
      location: 'Port de Tema, Ghana',
      icon: Ship,
      color: 'text-blue-600',
    },
    {
      id: 2,
      status: 'En mer',
      description: 'Navire en route vers l\'Afrique de l\'Ouest',
      timestamp: '2025-01-20 09:15',
      location: 'Océan Atlantique',
      icon: Ship,
      color: 'text-blue-600',
    },
    {
      id: 3,
      status: 'Embarqué',
      description: 'Cargaison chargée à bord du navire MSC Seaside',
      timestamp: '2025-01-15 16:45',
      location: 'Port de Shenzhen, Chine',
      icon: Ship,
      color: 'text-blue-600',
    },
    {
      id: 4,
      status: 'Préparation',
      description: 'Cargaison préparée et emballée pour l\'expédition',
      timestamp: '2025-01-12 11:20',
      location: 'Entrepôt Guangzhou',
      icon: Package,
      color: 'text-gray-600',
    },
    {
      id: 5,
      status: 'Collecté',
      description: 'Cargaison collectée chez l\'expéditeur',
      timestamp: '2025-01-10 08:00',
      location: 'Guangzhou, Chine',
      icon: Truck,
      color: 'text-green-600',
    },
  ],
};

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setError('Veuillez saisir un numéro de suivi');
      return;
    }

    setLoading(true);
    setError('');

    // Simulation d'appel API
    setTimeout(() => {
      if (trackingNumber === 'GTI-SEA-001234') {
        setTrackingResult(mockTrackingData);
      } else {
        setError('Numéro de suivi non trouvé');
        setTrackingResult(null);
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En transit':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case 'Livré':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'En douane':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'Retardé':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En transit':
        return 'bg-blue-100 text-blue-800';
      case 'Livré':
        return 'bg-green-100 text-green-800';
      case 'En douane':
        return 'bg-orange-100 text-orange-800';
      case 'Retardé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Suivi de Colis
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez vos expéditions en temps réel avec notre système de tracking avancé
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-center">Rechercher votre colis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Entrez votre numéro de suivi (ex: GTI-SEA-001234)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>Formats acceptés : GTI-XXX-XXXXXX, REF-XXXXXX</p>
              <p className="mt-1">
                Besoin d&apos;aide ? <a href="/contact" className="text-blue-600 hover:underline">Contactez-nous</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Status */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <Ship className="h-6 w-6 text-blue-600" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {trackingResult.trackingNumber}
                        </h2>
                        <p className="text-gray-600">Maersk Line</p>
                      </div>
                    </div>
                    
                    <Badge className={`${getStatusColor(trackingResult.status)} mb-4`}>
                      {getStatusIcon(trackingResult.status)}
                      <span className="ml-2">{trackingResult.status}</span>
                    </Badge>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Position actuelle:</span>
                        <span className="font-medium ml-1">{trackingResult.currentLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Livraison estimée:</span>
                        <span className="font-medium ml-1">{trackingResult.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Progression du transport</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Guangzhou, Chine</span>
                          <span>Ouagadougou, Burkina Faso</span>
                        </div>
                        <Progress value={65} className="h-3" />
                        <div className="text-center text-sm text-gray-600 mt-2">
                          65% complété
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Poids:</span>
                          <span className="font-medium ml-1">2500 kg</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dimensions:</span>
                          <span className="font-medium ml-1">120x80x100 cm</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Valeur:</span>
                          <span className="font-medium ml-1">1,250,000 XOF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Historique de suivi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {trackingResult.history.map((event, index) => (
                        <div key={event.id} className="flex space-x-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <event.icon className={`h-5 w-5 ${
                                index === 0 ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                            </div>
                            {index < trackingResult.history.length - 1 && (
                              <div className="w-px h-12 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{event.status}</h4>
                              <div className="text-sm text-gray-500">
                                {event.timestamp}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">{event.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Bill of Lading', 'Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Insurance Certificate'].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">{doc}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact transporteur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">Service Client Maersk</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">+45 33 63 33 63</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">customer.service@maersk.com</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Contacter le transporteur
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Recevez des mises à jour par SMS ou email
                    </p>
                    <Button variant="outline" className="w-full">
                      Configurer les alertes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Demo Section */}
        {!trackingResult && !loading && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Essayez notre démo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Découvrez notre système de suivi avec ce numéro de démonstration
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                  <code className="text-blue-800 font-mono">GTI-SEA-001234</code>
                </div>
                <div>
                  <Button 
                    onClick={() => {
                      setTrackingNumber('GTI-SEA-001234');
                      handleSearch();
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tester la démo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}