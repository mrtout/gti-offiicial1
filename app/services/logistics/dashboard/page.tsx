"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Ship,
  Plane,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  Star,
  BarChart3,
  Upload,
  Users,
} from 'lucide-react';

// Types simplifiés
interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'customs' | 'delivered' | 'delayed';
  mode: 'sea' | 'air' | 'road';
  provider: string;
  departureDate: string;
  estimatedArrival: string;
  value: number;
  weight: number;
  progress: number;
}

interface Quote {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  mode: string;
  status: 'draft' | 'sent' | 'accepted' | 'expired';
  price: number;
  validUntil: string;
  provider: string;
}

// Données mock simplifiées
const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'GTI-SEA-001234',
    origin: 'Guangzhou, Chine',
    destination: 'Ouagadougou, BF',
    status: 'in-transit',
    mode: 'sea',
    provider: 'Maersk Line',
    departureDate: '2025-01-10',
    estimatedArrival: '2025-02-05',
    value: 1250000,
    weight: 2500,
    progress: 65,
  },
  {
    id: '2',
    trackingNumber: 'GTI-AIR-005678',
    origin: 'Shanghai, Chine',
    destination: 'Abidjan, CI',
    status: 'customs',
    mode: 'air',
    provider: 'DHL Global',
    departureDate: '2025-01-20',
    estimatedArrival: '2025-01-25',
    value: 850000,
    weight: 150,
    progress: 85,
  },
  {
    id: '3',
    trackingNumber: 'GTI-ROAD-009876',
    origin: 'Casablanca, Maroc',
    destination: 'Bamako, Mali',
    status: 'delivered',
    mode: 'road',
    provider: 'GEFCO',
    departureDate: '2025-01-15',
    estimatedArrival: '2025-01-22',
    value: 650000,
    weight: 800,
    progress: 100,
  },
];

const mockQuotes: Quote[] = [
  {
    id: '1',
    reference: 'QUO-2025-001',
    origin: 'Ouagadougou, BF',
    destination: 'Guangzhou, CN',
    mode: 'Maritime',
    status: 'sent',
    price: 1450000,
    validUntil: '2025-02-15',
    provider: 'CMA CGM',
  },
  {
    id: '2',
    reference: 'QUO-2025-002',
    origin: 'Bobo-Dioulasso, BF',
    destination: 'Dubai, AE',
    mode: 'Aérien',
    status: 'accepted',
    price: 2850000,
    validUntil: '2025-02-10',
    provider: 'Emirates SkyCargo',
  },
];

const stats = [
  {
    title: 'Expéditions actives',
    value: '24',
    change: '+12%',
    icon: Package,
  },
  {
    title: 'Devis en cours',
    value: '8',
    change: '+5%',
    icon: FileText,
  },
  {
    title: 'Économies ce mois',
    value: '2.4M XOF',
    change: '+18%',
    icon: DollarSign,
  },
  {
    title: 'Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    icon: Star,
  },
];

export default function LogisticsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-transit':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'customs':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delayed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'customs':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'sea':
        return <Ship className="h-4 w-4 text-blue-600" />;
      case 'air':
        return <Plane className="h-4 w-4 text-orange-600" />;
      case 'road':
        return <Truck className="h-4 w-4 text-green-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesMode = modeFilter === 'all' || shipment.mode === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Logistique
          </h1>
          <p className="text-gray-600">
            Gérez vos expéditions et suivez vos devis en temps réel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="shipments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shipments">Expéditions</TabsTrigger>
            <TabsTrigger value="quotes">Devis</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par numéro de suivi, origine, destination..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in-transit">En transit</SelectItem>
                      <SelectItem value="customs">En douane</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                      <SelectItem value="delayed">Retardé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={modeFilter} onValueChange={setModeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les modes</SelectItem>
                      <SelectItem value="sea">Maritime</SelectItem>
                      <SelectItem value="air">Aérien</SelectItem>
                      <SelectItem value="road">Routier</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Plus de filtres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipments List */}
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Tracking & Mode */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-2">
                          {getModeIcon(shipment.mode)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {shipment.trackingNumber}
                            </h3>
                            <p className="text-sm text-gray-600">{shipment.provider}</p>
                          </div>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{shipment.origin}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-600">{shipment.destination}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progression</span>
                            <span>{shipment.progress}%</span>
                          </div>
                          <Progress value={shipment.progress} className="h-2" />
                        </div>
                      </div>

                      {/* Status & Dates */}
                      <div className="lg:col-span-1">
                        <Badge className={`${getStatusColor(shipment.status)} mb-2`}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1 capitalize">{shipment.status}</span>
                        </Badge>
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            ETA: {shipment.estimatedArrival}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Valeur:</span>
                          <span className="font-medium ml-1">
                            {shipment.value.toLocaleString()} XOF
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Poids:</span>
                          <span className="font-medium ml-1">{shipment.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Départ:</span>
                          <span className="font-medium ml-1">{shipment.departureDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Arrivée prévue:</span>
                          <span className="font-medium ml-1">{shipment.estimatedArrival}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredShipments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune expédition trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Aucune expédition ne correspond à vos critères de recherche.
                  </p>
                  <Button>
                    Nouvelle expédition
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mes Devis</h2>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Nouveau devis
              </Button>
            </div>

            <div className="space-y-4">
              {mockQuotes.map((quote) => (
                <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{quote.reference}</h3>
                        <p className="text-sm text-gray-600">{quote.provider}</p>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{quote.origin}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-600">{quote.destination}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{quote.mode}</p>
                      </div>

                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {quote.price.toLocaleString()} XOF
                        </p>
                        <p className="text-sm text-gray-500">
                          Valide jusqu'au {quote.validUntil}
                        </p>
                      </div>

                      <div>
                        <Badge className={
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {quote.status === 'accepted' ? 'Accepté' :
                           quote.status === 'sent' ? 'Envoyé' :
                           quote.status === 'expired' ? 'Expiré' : 'Brouillon'}
                        </Badge>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gestion des documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Téléversez et gérez tous vos documents d'expédition en un seul endroit.
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Téléverser un document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Évolution des expéditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique des expéditions par mois
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Économies réalisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique des économies par trimestre
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance par mode de transport</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { mode: 'Maritime', count: 45, percentage: 60, avgCost: '1.2M XOF' },
                    { mode: 'Aérien', count: 20, percentage: 27, avgCost: '2.8M XOF' },
                    { mode: 'Routier', count: 10, percentage: 13, avgCost: '1.8M XOF' },
                  ].map((item) => (
                    <div key={item.mode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{item.mode}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>{item.count} expéditions</span>
                        <span>{item.percentage}%</span>
                        <span className="font-medium">{item.avgCost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}