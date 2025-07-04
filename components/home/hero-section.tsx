"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Plane,
  Calculator,
  Search,
  Mail,
  ArrowRight,
  Star,
  Users,
  Package,
  Globe,
} from 'lucide-react';

const stats = [
  { icon: Users, value: '5000+', label: 'Clients Satisfaits' },
  { icon: Package, value: '15000+', label: 'Commandes Livrées' },
  { icon: Globe, value: '25+', label: 'Pays Desservis' },
  { icon: Star, value: '4.8/5', label: 'Note Moyenne' },
];

const services = [
  {
    icon: ShoppingCart,
    title: 'Commandes Produits',
    description: 'AliExpress, Shein, Amazon et plus',
    color: 'bg-blue-500',
  },
  {
    icon: Plane,
    title: 'Réservation Vols',
    description: 'Billets au meilleur prix',
    color: 'bg-green-500',
  },
  {
    icon: Calculator,
    title: 'Logistique',
    description: 'Import/Export professionnel',
    color: 'bg-purple-500',
  },
  {
    icon: Search,
    title: 'Sourcing',
    description: 'Trouvez vos fournisseurs',
    color: 'bg-orange-500',
  },
  {
    icon: Mail,
    title: 'Boîte Postale',
    description: 'Adresse virtuelle',
    color: 'bg-red-500',
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-yellow-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-full animate-float delay-1000" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/20 rounded-full animate-float delay-2000" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-purple-400/20 rounded-full animate-float delay-3000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Plateforme N°1 Import/Export Afrique-Asie
          </Badge>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold hero-text leading-tight">
              Groupe Tanou
              <span className="block gradient-gold bg-clip-text text-transparent">
                International
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Votre passerelle vers le commerce international. 
              Commandes en ligne, vols, logistique et bien plus.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gradient-gold text-white px-8 py-4 text-lg rounded-full">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full">
              Découvrir nos services
            </Button>
          </div>

          {/* Services Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="service-card p-6 text-center h-full">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="flex justify-center">
                  <stat.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}