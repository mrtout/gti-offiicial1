"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Aminata Traoré',
    role: 'Entrepreneure',
    location: 'Ouagadougou, BF',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Excellent service ! J\'ai pu commander mes produits depuis AliExpress sans problème. Livraison rapide et prix transparent.',
    service: 'Commandes Produits',
  },
  {
    id: 2,
    name: 'Ibrahim Sankara',
    role: 'Importateur',
    location: 'Bobo-Dioulasso, BF',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'La cotation logistique est très professionnelle. Ils m\'ont aidé à importer ma marchandise avec toutes les formalités.',
    service: 'Logistique',
  },
  {
    id: 3,
    name: 'Fatima Ouédraogo',
    role: 'Commerçante',
    location: 'Koudougou, BF',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Grâce au service de sourcing, j\'ai trouvé les meilleurs fournisseurs pour ma boutique. Prix imbattables !',
    service: 'Sourcing',
  },
  {
    id: 4,
    name: 'Moussa Kaboré',
    role: 'Voyageur d\'affaires',
    location: 'Ouahigouya, BF',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Réservation de billets très simple. J\'ai économisé plus de 200€ sur mon vol pour Canton.',
    service: 'Vols',
  },
  {
    id: 5,
    name: 'Salimata Sawadogo',
    role: 'Étudiante',
    location: 'Fada N\'Gourma, BF',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'La boîte postale virtuelle m\'a permis d\'acheter sur des sites qui ne livrent pas au Burkina. Génial !',
    service: 'Boîte Postale',
  },
  {
    id: 6,
    name: 'Abdoulaye Compaoré',
    role: 'Grossiste',
    location: 'Banfora, BF',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Service client exceptionnel. Ils répondent rapidement et règlent tous les problèmes efficacement.',
    service: 'Support',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plus de 5000 clients nous font confiance pour leurs achats 
            et leurs projets import/export.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="service-card border-0 shadow-lg relative">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-yellow-400 mb-4 opacity-60" />
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.service}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-50 px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((testimonial) => (
                <Avatar key={testimonial.id} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              Rejoignez plus de 5000 clients satisfaits
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}