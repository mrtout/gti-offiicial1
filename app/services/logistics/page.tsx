"use client";

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Package,
  Truck,
  Globe,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const logisticsServices = [
  {
    icon: Calculator,
    title: 'Cotation Express',
    description: 'Obtenez un devis instantané pour vos expéditions',
    features: ['Calcul automatique', 'Prix transparents', 'Devis PDF'],
  },
  {
    icon: Package,
    title: 'Gestion des Stocks',
    description: 'Entreposage et gestion de vos marchandises',
    features: ['Stockage sécurisé', 'Inventaire temps réel', 'Préparation commandes'],
  },
  {
    icon: Truck,
    title: 'Transport Multimodal',
    description: 'Solutions de transport adaptées à vos besoins',
    features: ['Maritime', 'Aérien', 'Routier'],
  },
  {
    icon: Globe,
    title: 'Import/Export',
    description: 'Accompagnement complet pour vos opérations internationales',
    features: ['Dédouanement', 'Documentation', 'Conformité réglementaire'],
  },
];

const advantages = [
  {
    icon: Clock,
    title: 'Rapidité',
    description: 'Traitement express de vos demandes',
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'Assurance complète de vos marchandises',
  },
  {
    icon: CheckCircle,
    title: 'Fiabilité',
    description: 'Suivi en temps réel de vos expéditions',
  },
];

export default function LogisticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <Calculator className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Solutions Logistiques
            <span className="block text-yellow-600">Professionnelles</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Optimisez vos opérations d'import/export avec nos solutions logistiques complètes. 
            De la cotation au transport, nous gérons chaque étape de votre chaîne d'approvisionnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-gold text-white">
              Demander un Devis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Voir nos Tarifs
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {logisticsServices.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4 group-hover:bg-yellow-200 transition-colors">
                  <service.icon className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advantages Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Nos Services ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre expertise et notre réseau international nous permettent de vous offrir 
              des solutions logistiques optimales.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <advantage.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Optimiser Votre Logistique ?
          </h2>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Contactez nos experts pour une consultation personnalisée et découvrez 
            comment nous pouvons améliorer votre chaîne d'approvisionnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100">
              Consultation Gratuite
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
              Nos Références
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}