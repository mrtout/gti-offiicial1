"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Plane,
  Calculator,
  Search,
  Mail,
  ArrowRight,
  Clock,
  Shield,
  CreditCard,
  Truck,
} from 'lucide-react';

const services = [
  {
    id: 'shopping',
    icon: ShoppingCart,
    title: 'Commandes Produits',
    description: 'Commandez depuis AliExpress, Shein, Amazon et plus de 1000 sites.',
    features: ['Devis automatique', 'Paiement XOF', 'Livraison rapide'],
    price: 'À partir de 3%',
    href: '/services/shopping',
    popular: true,
  },
  {
    id: 'flights',
    icon: Plane,
    title: 'Réservation Vols',
    description: 'Trouvez et réservez vos billets d\'avion aux meilleurs prix.',
    features: ['Prix compétitifs', 'E-tickets', 'Support 24/7'],
    price: 'Frais fixes',
    href: '/services/flights',
    popular: false,
  },
  {
    id: 'logistics',
    icon: Calculator,
    title: 'Cotation Logistique',
    description: 'Services professionnels d\'import/export avec cotation rapide.',
    features: ['Cotation 24h', 'Suivi temps réel', 'Dédouanement'],
    price: 'Sur devis',
    href: '/services/logistics',
    popular: false,
  },
  {
    id: 'sourcing',
    icon: Search,
    title: 'Sourcing Produits',
    description: 'Trouvez les meilleurs fournisseurs pour vos produits.',
    features: ['Recherche personnalisée', 'Négociation prix', 'Contrôle qualité'],
    price: 'À partir de 5%',
    href: '/services/sourcing',
    popular: false,
  },
  {
    id: 'postbox',
    icon: Mail,
    title: 'Boîte Postale Virtuelle',
    description: 'Adresse temporaire pour vos achats en ligne.',
    features: ['Adresse internationale', '7 jours gratuit', 'Réexpédition'],
    price: '2000 XOF/semaine',
    href: '/services/postbox',
    popular: false,
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Service Rapide',
    description: 'Traitement en moins de 24h',
  },
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Paiements et données protégés',
  },
  {
    icon: CreditCard,
    title: 'Paiement Flexible',
    description: 'XOF, cartes bancaires, mobile money',
  },
  {
    icon: Truck,
    title: 'Livraison Garantie',
    description: 'Suivi complet jusqu\'à destination',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Nos Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Une solution complète pour vos besoins
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            De la commande de produits à la logistique internationale, 
            nous vous accompagnons à chaque étape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="relative service-card border-0 shadow-lg">
              {service.popular && (
                <Badge className="absolute -top-2 left-6 gradient-gold text-white">
                  Populaire
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">À partir de</span>
                      <span className="font-bold text-yellow-600">{service.price}</span>
                    </div>
                    <Link href={service.href}>
                      <Button className="w-full gradient-gold text-white">
                        Commencer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Pourquoi choisir Groupe Tanou International ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}