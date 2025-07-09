"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  Truck,
  Ship,
  Plane,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Plus,
} from 'lucide-react';

const shipments = [
  {
    id: 'GTI-2024-001',
    origin: 'Shanghai, Chine',
    destination: 'Dakar, Sénégal',
    status: 'En Transit',
    transport: 'Maritime',
    weight: '2,500 kg',
    value: '15,000 €',
    eta: '2024-02-15',
    progress: 65,
  },
  {
    id: 'GTI-2024-002',
    origin: 'Dubai, EAU',
    destination: 'Abidjan, Côte d\'Ivoire',
    status: 'Livré',
    transport: 'Aérien',
    weight: '150 kg',
    value: '8,500 €',
    eta: '2024-01-28',
    progress: 100,
  },
  {
    id: 'GTI-2024-003',
    origin: 'Istanbul, Turquie',
    destination: 'Casablanca, Maroc',
    status: 'En Préparation',
    transport: 'Routier',
    weight: '1,200 kg',
    value: '6,200 €',
    eta: '2024-02-20',
    progress: 25,
  },
];

const monthlyData = [
  { month: 'Jan', expeditions: 45, revenus: 125000 },
  { month: 'Fév', expeditions: 52, revenus: 145000 },
  { month: 'Mar', expeditions: 48, revenus: 135000 },
  { month: 'Avr', expeditions: 61, revenus: 165000 },
  { month: 'Mai', expeditions: 55, revenus: 155000 },
  { month: 'Jun', expeditions: 67, revenus: 185000 },
];

const transportData = [
  { name: 'Maritime', value: 45, color: '#3B82F6' },
  { name: 'Aérien', value: 30, color: '#EF4444' },
  { name: 'Routier', value: 25, color: '#10B981' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800';
    case 'En Transit':
      return 'bg-blue-100 text-blue-800';
    case 'En Préparation':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTransportIcon = (transport: string) => {
  switch (transport) {
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
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Logistique
            </h1>
            <p className="text-gray-600">
              Gérez et suivez toutes vos expéditions en temps réel
            </p>
          </div>
          <Button className="gradient-gold text-white mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Expédition
          </Button>
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
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenus du Mois
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">185,000 €</div>
              <p className="text-xs text-muted-foreground">
                +19% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de Livraison
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Délai Moyen
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.3j</div>
              <p className="text-xs text-muted-foreground">
                -1.2j par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="shipments">Expéditions</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Shipments */}
              <Card>
                <CardHeader>
                  <CardTitle>Expéditions Récentes</CardTitle>
                  <CardDescription>
                    Vos dernières expéditions et leur statut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shipments.slice(0, 3).map((shipment) => {
                      const TransportIcon = getTransportIcon(shipment.transport);
                      return (
                        <div key={shipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <TransportIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{shipment.id}</p>
                              <p className="text-sm text-gray-600">
                                {shipment.origin} → {shipment.destination}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Transport Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Transport</CardTitle>
                  <CardDescription>
                    Distribution des modes de transport utilisés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transportData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {transportData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {transportData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Expéditions</CardTitle>
                <CardDescription>
                  Liste complète de vos expéditions avec détails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Expédition</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Transport</TableHead>
                      <TableHead>Poids</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => {
                      const TransportIcon = getTransportIcon(shipment.transport);
                      return (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">
                            {shipment.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {shipment.origin} → {shipment.destination}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <TransportIcon className="w-4 h-4 text-blue-600" />
                              <span>{shipment.transport}</span>
                            </div>
                          </TableCell>
                          <TableCell>{shipment.weight}</TableCell>
                          <TableCell>{shipment.value}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(shipment.status)}>
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{shipment.eta}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Mensuelle</CardTitle>
                  <CardDescription>
                    Nombre d'expéditions et revenus par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="expeditions" fill="#3B82F6" name="Expéditions" />
                        <Bar yAxisId="right" dataKey="revenus" fill="#EF4444" name="Revenus (€)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Gérez tous vos documents d'expédition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun document disponible
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vos documents d'expédition apparaîtront ici
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}