"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Calculator,
  Package,
  Truck,
  Ship,
  Plane,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
} from 'lucide-react';

const transportModes = [
  { value: 'air', label: 'Transport Aérien', icon: Plane, description: 'Rapide et sécurisé' },
  { value: 'sea', label: 'Transport Maritime', icon: Ship, description: 'Économique pour gros volumes' },
  { value: 'road', label: 'Transport Routier', icon: Truck, description: 'Flexible et direct' },
];

const services = [
  {
    icon: Calculator,
    title: 'Cotation Instantanée',
    description: 'Obtenez un devis précis en quelques clics',
  },
  {
    icon: Package,
    title: 'Suivi en Temps Réel',
    description: 'Suivez vos expéditions à chaque étape',
  },
  {
    icon: FileText,
    title: 'Documentation Complète',
    description: 'Gestion de tous vos documents douaniers',
  },
  {
    icon: CheckCircle,
    title: 'Assurance Cargo',
    description: 'Protection complète de vos marchandises',
  },
];

export default function LogisticsPage() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    dimensions: '',
    transportMode: '',
    cargoType: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-600 rounded-full mb-6">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cotation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-600">Logistique</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solutions d'import/export professionnelles avec cotation instantanée et suivi en temps réel
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-full mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demande de Cotation
            </h2>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous pour recevoir votre devis personnalisé
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations d'Expédition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origine</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="origin"
                        placeholder="Ville ou pays d'origine"
                        className="pl-10"
                        value={formData.origin}
                        onChange={(e) => handleInputChange('origin', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="Ville ou pays de destination"
                        className="pl-10"
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Poids total en kg"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (L x l x H cm)</Label>
                    <Input
                      id="dimensions"
                      placeholder="ex: 100 x 50 x 30"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mode de Transport</Label>
                  <Select value={formData.transportMode} onValueChange={(value) => handleInputChange('transportMode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un mode de transport" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          <div className="flex items-center gap-2">
                            <mode.icon className="w-4 h-4" />
                            <span>{mode.label}</span>
                            <span className="text-sm text-gray-500">- {mode.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoType">Type de Marchandise</Label>
                  <Select value={formData.cargoType} onValueChange={(value) => handleInputChange('cargoType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de marchandise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Marchandise Générale</SelectItem>
                      <SelectItem value="fragile">Fragile</SelectItem>
                      <SelectItem value="dangerous">Matières Dangereuses</SelectItem>
                      <SelectItem value="perishable">Périssable</SelectItem>
                      <SelectItem value="valuable">Objets de Valeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description Détaillée</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre marchandise et vos besoins spécifiques..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full gradient-gold text-white py-3">
                  <Calculator className="w-4 h-4 mr-2" />
                  Obtenir ma Cotation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transport Modes Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Solutions de Transport
            </h2>
            <p className="text-gray-600">
              Choisissez le mode de transport adapté à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {transportModes.map((mode, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-full mx-auto mb-4">
                    <mode.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>{mode.label}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    {mode.value === 'air' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Délai: 1-3 jours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Coût: Élevé</span>
                        </div>
                      </>
                    )}
                    {mode.value === 'sea' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Délai: 15-45 jours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Coût: Économique</span>
                        </div>
                      </>
                    )}
                    {mode.value === 'road' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Délai: 3-10 jours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Coût: Modéré</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}