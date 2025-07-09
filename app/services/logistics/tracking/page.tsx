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

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
  icon: React.ElementType;
}

interface TrackingInfo {
  trackingNumber: string;
  status: 'in-transit' | 'delivered' | 'customs' | 'delayed';
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'road';
  provider: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  progress: number;
  currentLocation: string;
  weight: number;
  dimensions: string;
  value: number;
  events: TrackingEvent[];
  documents: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

const mockTrackingData: TrackingInfo = {
  trackingNumber: 'GTI-SEA-001234',
  status: 'in-transit',
  origin: 'Guangzhou, Chine',
  destination: 'Ouagadougou, Burkina Faso',
  mode: 'sea',
  provider: 'Maersk Line',
  estimatedDelivery: '2025-02-05',
  progress: 65,
  currentLocation: 'Port de Tema, Ghana',
  weight: 2500,
  dimensions: '120x80x100 cm',
  value: 1250000,
  events: [
    {
      date: '2025-01-25',
      time: '14:30',
      location: 'Port de Tema, Ghana',
      status: 'En transit',
      description: 'Cargaison arrivée au port de Tema, en attente de transbordement',
      icon: Ship,
    },
    {
      date: '2025-01-20',
      time: '09:15',
      location: 'Océan Atlantique',
      status: 'En mer',
      description: 'Navire en route vers l\'Afrique de l\'Ouest',
      icon: Ship,
    },
    {
      date: '2025-01-15',
      time: '16:45',
      location: 'Port de Shenzhen, Chine',
      status: 'Embarqué',
      description: 'Cargaison chargée à bord du navire MSC Seaside',
      icon: Ship,
    },
    {
      date: '2025-01-12',
      time: '11:20',
      location: 'Entrepôt Guangzhou',
      status: 'Préparation',
      description: 'Cargaison préparée et emballée pour l\'expédition',
      icon: Package,
    },
    {
      date: '2025-01-10',
      time: '08:00',
      location: 'Guangzhou, Chine',
      status: 'Collecté',
      description: 'Cargaison collectée chez l\'expéditeur',
      icon: Truck,
    },
  ],
  documents: [
    'Bill of Lading',
    'Commercial Invoice',
    'Packing List',
    'Certificate of Origin',
    'Insurance Certificate',
  ],
  contact: {
    name: 'Service Client Maersk',
    phone: '+45 33 63 33 63',
    email: 'customer.service@maersk.com',
  },
};

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);
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
        setTrackingData(mockTrackingData);
      } else {
        setError('Numéro de suivi non trouvé');
        setTrackingData(null);
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'customs':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'customs':
        return 'bg-orange-100 text-orange-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'sea':
        return <Ship className="h-6 w-6 text-blue-600" />;
      case 'air':
        return <Plane className="h-6 w-6 text-orange-600" />;
      case 'road':
        return <Truck className="h-6 w-6 text-green-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
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
        {trackingData && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Status */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      {getModeIcon(trackingData.mode)}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {trackingData.trackingNumber}
                        </h2>
                        <p className="text-gray-600">{trackingData.provider}</p>
                      </div>
                    </div>
                    
                    <Badge className={`${getStatusColor(trackingData.status)} mb-4`}>
                      {getStatusIcon(trackingData.status)}
                      <span className="ml-2">
                        {trackingData.status === 'in-transit' ? 'En transit' :
                         trackingData.status === 'delivered' ? 'Livré' :
                         trackingData.status === 'customs' ? 'En douane' :
                         trackingData.status === 'delayed' ? 'Retardé' : 'Statut inconnu'}
                      </span>
                    </Badge>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Position actuelle:</span>
                        <span className="font-medium ml-1">{trackingData.currentLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Livraison estimée:</span>
                        <span className="font-medium ml-1">{trackingData.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Progression du transport</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{trackingData.origin}</span>
                          <span>{trackingData.destination}</span>
                        </div>
                        <Progress value={trackingData.progress} className="h-3" />
                        <div className="text-center text-sm text-gray-600 mt-2">
                          {trackingData.progress}% complété
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Poids:</span>
                          <span className="font-medium ml-1">{trackingData.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dimensions:</span>
                          <span className="font-medium ml-1">{trackingData.dimensions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Valeur:</span>
                          <span className="font-medium ml-1">
                            {trackingData.value.toLocaleString()} XOF
                          </span>
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
                      {trackingData.events.map((event, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <event.icon className={`h-5 w-5 ${
                                index === 0 ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                            </div>
                            {index < trackingData.events.length - 1 && (
                              <div className="w-px h-12 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{event.status}</h4>
                              <div className="text-sm text-gray-500">
                                {event.date} à {event.time}
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
                      {trackingData.documents.map((doc, index) => (
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
                      <p className="font-medium">{trackingData.contact.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{trackingData.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{trackingData.contact.email}</span>
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
        {!trackingData && !loading && (
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