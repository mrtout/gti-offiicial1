"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Zap,
  Heart,
} from 'lucide-react';

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Chat en direct',
    description: 'Réponse immédiate',
    action: 'Chatter maintenant',
    color: 'bg-green-500',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    description: '+226 66 11 71 63',
    action: 'Appeler',
    color: 'bg-blue-500',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'contact@groupetanouinternational.com',
    action: 'Envoyer un email',
    color: 'bg-purple-500',
  },
];

const features = [
  {
    icon: Zap,
    text: 'Traitement rapide en 24h',
  },
  {
    icon: Shield,
    text: 'Paiements 100% sécurisés',
  },
  {
    icon: Heart,
    text: 'Support client dédié',
  },
];

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Rejoignez des milliers d'entrepreneurs qui nous font confiance 
            pour leurs achats et projets internationaux.
          </p>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex space-x-2">
              <Input
                placeholder="Votre adresse email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="gradient-gold text-white px-6">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Devis gratuit • Sans engagement • Réponse rapide
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                <feature.icon className="h-4 w-4 text-yellow-400" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  {method.description}
                </p>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <MapPin className="h-6 w-6 text-yellow-400 mx-auto" />
              <h4 className="font-semibold">Localisations</h4>
              <div className="text-sm text-gray-300">
                <p>Ouagadougou, Burkina Faso</p>
                <p>Kaifeng, Henan, Chine</p>
              </div>
            </div>
            <div className="space-y-2">
              <Clock className="h-6 w-6 text-yellow-400 mx-auto" />
              <h4 className="font-semibold">Horaires</h4>
              <p className="text-sm text-gray-300">24h sur 24h</p>
            </div>
            <div className="space-y-2">
              <Mail className="h-6 w-6 text-yellow-400 mx-auto" />
              <h4 className="font-semibold">Email</h4>
              <p className="text-sm text-gray-300">contact@groupetanouinternational.com</p>
            </div>
            <div className="space-y-2">
              <Phone className="h-6 w-6 text-yellow-400 mx-auto" />
              <h4 className="font-semibold">Téléphone</h4>
              <p className="text-sm text-gray-300">+226 66 11 71 63</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}