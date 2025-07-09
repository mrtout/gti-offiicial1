"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Truck,
  Plane,
  Ship,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
} from 'lucide-react';

const shipments = [
  {
    id: 'GTI-2024-001',
    status: 'En transit',
    origin: 'Guangzhou, Chine',
    destination: 'Dakar, Sénégal',
    type: 'Maritime',
    weight: '2.5 tonnes',
    value: '15,000 €',
    departure: '2024-01-15',
    arrival: '2024-02-20',
    progress: 65,
  },
  {
    id: 'GTI-2024-002',
    status: 'Livré',
    origin: 'Dubai, EAU',
    destination: 'Abidjan, Côte d\'Ivoire',
    type: 'Aérien',
    weight: '500 kg',
    value: '8,500 €',
    departure: '2024-01-20',
    arrival: '2024-01-22',
    progress: 100,
  },
  {
    id: 'GTI-2024-003',
    status: 'En préparation',
    origin: 'Istanbul, Turquie',
    destination: 'Casablanca, Maroc',
    type: 'Routier',
    weight: '1.2 tonnes',
    value: '6,200 €',
    departure: '2024-02-01',
    arrival: '2024-02-05',
    progress: 25,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800';
    case 'En transit':
      return 'bg-blue-100 text-blue-800';
    case 'En préparation':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'Maritime':
      return Ship;
    case 'Aérien':
      return Plane;
    case 'Routier':
      return Truck;
    default:
      return Package;
  }
};

export default function LogisticsDashboard() {
  const [activeTab, setActiveTab] = useState('shipments');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Logistique
          </h1>
          <p className="text-gray-600">
            Gérez et suivez toutes vos expéditions en temps réel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expéditions Actives
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En Transit
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                50% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Livrées ce mois
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valeur Totale
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€2.4M</div>
              <p className="text-xs text-muted-foreground">
                Marchandises en transit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="shipments">Expéditions</TabsTrigger>
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm" className="gradient-gold text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Expédition
              </Button>
            </div>
          </div>

          <TabsContent value="shipments" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une expédition..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Shipments List */}
            <div className="space-y-4">
              {shipments.map((shipment) => {
                const TransportIcon = getTransportIcon(shipment.type);
                return (
                  <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <TransportIcon className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {shipment.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {shipment.origin} → {shipment.destination}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Type
                          </p>
                          <p className="font-medium">{shipment.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Poids
                          </p>
                          <p className="font-medium">{shipment.weight}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Valeur
                          </p>
                          <p className="font-medium">{shipment.value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Arrivée prévue
                          </p>
                          <p className="font-medium">{shipment.arrival}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Départ: {shipment.departure}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques des Expéditions</CardTitle>
                <CardDescription>
                  Statistiques et tendances de vos expéditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Graphiques et statistiques à venir...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Gérez tous vos documents d'expédition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Gestionnaire de documents à venir...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}