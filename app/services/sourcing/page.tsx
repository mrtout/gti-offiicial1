"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Factory,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Globe,
  Users,
  Award,
  TrendingUp,
  Package,
  Truck,
} from 'lucide-react';

interface SourcingRequest {
  productName: string;
  productDescription: string;
  quantity: string;
  budget: string;
  targetPrice: string;
  clientType: 'individual' | 'professional';
  timeline: string;
  qualityRequirements: string;
  certifications: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

const services = [
  {
    icon: Search,
    title: 'Recherche de Fournisseurs',
    description: 'Identification des meilleurs fournisseurs selon vos critères',
    features: ['Base de données 50,000+ fournisseurs', 'Vérification qualité', 'Négociation prix'],
  },
  {
    icon: Shield,
    title: 'Vérification Qualité',
    description: 'Contrôle qualité et certification des produits',
    features: ['Inspection sur site', 'Tests de qualité', 'Certification ISO'],
  },
  {
    icon: DollarSign,
    title: 'Négociation Prix',
    description: 'Négociation des meilleurs tarifs pour vos commandes',
    features: ['Expertise locale', 'Volume discount', 'Conditions paiement'],
  },
  {
    icon: Truck,
    title: 'Logistique Intégrée',
    description: 'Gestion complète de la chaîne logistique',
    features: ['Transport international', 'Dédouanement', 'Livraison finale'],
  },
];

const successStories = [
  {
    client: 'Boutique Mode Ouaga',
    product: 'Vêtements femmes',
    savings: '40%',
    description: 'Réduction des coûts d\'approvisionnement de 40% grâce à notre réseau de fournisseurs textiles.',
  },
  {
    client: 'TechBF Solutions',
    product: 'Équipements IT',
    savings: '35%',
    description: 'Sourcing d\'équipements informatiques avec certification internationale.',
  },
  {
    client: 'Pharmacie Centrale',
    product: 'Matériel médical',
    savings: '50%',
    description: 'Approvisionnement en matériel médical certifié CE avec économies substantielles.',
  },
];

export default function SourcingPage() {
  const [step, setStep] = useState<'form' | 'processing' | 'results'>('form');
  const [formData, setFormData] = useState<SourcingRequest>({
    productName: '',
    productDescription: '',
    quantity: '',
    budget: '',
    targetPrice: '',
    clientType: 'individual',
    timeline: '',
    qualityRequirements: '',
    certifications: [],
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  const handleInputChange = (field: keyof SourcingRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactInfoChange = (field: keyof SourcingRequest['contactInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations Produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du produit *
            </label>
            <Input
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              placeholder="Ex: Smartphones Android, Vêtements femmes..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description détaillée *
            </label>
            <Textarea
              value={formData.productDescription}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              placeholder="Décrivez précisément le produit recherché, spécifications techniques, matériaux..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantité souhaitée *
              </label>
              <Input
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="Ex: 1000 pièces, 50 cartons..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Budget total (XOF)
              </label>
              <Input
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Ex: 5,000,000 XOF"
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prix cible unitaire (XOF)
              </label>
              <Input
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                placeholder="Ex: 50,000 XOF"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type de client *
              </label>
              <Select
                value={formData.clientType}
                onValueChange={(value: 'individual' | 'professional') => 
                  handleInputChange('clientType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Particulier</SelectItem>
                  <SelectItem value="professional">Professionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Délai souhaité *
            </label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleInputChange('timeline', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un délai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent (1-2 semaines)</SelectItem>
                <SelectItem value="normal">Normal (3-4 semaines)</SelectItem>
                <SelectItem value="flexible">Flexible (1-2 mois)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Exigences de qualité
            </label>
            <Textarea
              value={formData.qualityRequirements}
              onChange={(e) => handleInputChange('qualityRequirements', e.target.value)}
              placeholder="Standards de qualité, certifications requises, tests spécifiques..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations de Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom complet *
              </label>
              <Input
                value={formData.contactInfo.name}
                onChange={(e) => handleContactInfoChange('name', e.target.value)}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone *
              </label>
              <Input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                placeholder="+226 XX XX XX XX"
                required
              />
            </div>

            {formData.clientType === 'professional' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Entreprise
                </label>
                <Input
                  value={formData.contactInfo.company || ''}
                  onChange={(e) => handleContactInfoChange('company', e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full gradient-gold text-white py-3">
        Lancer la recherche de fournisseurs
        <Search className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );

  const renderProcessing = () => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Recherche en cours...
        </h3>
        <p className="text-gray-600 mb-6">
          Nous analysons notre base de données de plus de 50,000 fournisseurs pour trouver les meilleures options pour votre projet.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✓ Analyse des spécifications produit</p>
          <p>✓ Vérification des fournisseurs qualifiés</p>
          <p>✓ Négociation des prix préliminaires</p>
          <p>⏳ Préparation du rapport détaillé...</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-xl font-semibold text-green-800">
                Recherche terminée !
              </h3>
              <p className="text-green-700">
                Nous avons trouvé 12 fournisseurs correspondant à vos critères.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats de la recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">Fournisseur #{i}</h4>
                    <p className="text-sm text-gray-600">Guangzhou, Chine</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.{8 - i}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Prix unitaire</p>
                    <p className="font-semibold">{45000 - i * 5000} XOF</p>
                  </div>
                  <div>
                    <p className="text-gray-500">MOQ</p>
                    <p className="font-semibold">{100 * i} pièces</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Délai</p>
                    <p className="font-semibold">{15 + i * 5} jours</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Certifications</p>
                    <p className="font-semibold">CE, ISO</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Un rapport détaillé avec tous les fournisseurs et leurs devis sera envoyé à votre email.
        </p>
        <Button 
          onClick={() => setStep('form')}
          variant="outline"
        >
          Nouvelle recherche
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Sourcing de Produits
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Trouvez les meilleurs fournisseurs pour vos produits avec notre réseau de plus de 50,000 partenaires vérifiés.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Factory className="h-4 w-4" />
              <span>50,000+ Fournisseurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Qualité Vérifiée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Réponse 24h</span>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {service.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form/Results */}
          <div className="lg:col-span-2">
            {step === 'form' && renderForm()}
            {step === 'processing' && renderProcessing()}
            {step === 'results' && renderResults()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Succès Clients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successStories.map((story, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{story.client}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          -{story.savings}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{story.product}</p>
                      <p className="text-xs text-gray-500">{story.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card>
              <CardHeader>
                <CardTitle>Notre Processus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Analyse', desc: 'Étude de vos besoins' },
                    { step: 2, title: 'Recherche', desc: 'Identification fournisseurs' },
                    { step: 3, title: 'Vérification', desc: 'Contrôle qualité' },
                    { step: 4, title: 'Négociation', desc: 'Meilleurs prix' },
                    { step: 5, title: 'Rapport', desc: 'Présentation options' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-yellow-600">{item.step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Besoin d'aide ?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Nos experts sont disponibles pour vous accompagner dans votre recherche.
                    </p>
                    <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                      Contacter un expert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}