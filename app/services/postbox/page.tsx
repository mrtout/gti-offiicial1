"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Mail,
  MapPin,
  Clock,
  Shield,
  CreditCard,
  Copy,
  CheckCircle,
  AlertCircle,
  Package,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Gift,
  Truck,
  Calendar,
  User,
  IdCard,
  Home,
} from 'lucide-react';

interface DurationOption {
  id: string;
  duration: string;
  price: number;
  description: string;
  popular?: boolean;
  benefits?: string[];
}

interface CustomerData {
  fullName: string;
  phone: string;
  email: string;
  cnibNumber: string;
  quartier: string;
  homeDelivery: boolean;
  address?: string;
}

interface VirtualBox {
  number: string;
  fullAddress: string;
  agency: string;
  validFrom: string;
  validUntil: string;
  customerName: string;
}

const durationOptions: DurationOption[] = [
  {
    id: '2days',
    duration: '2 jours',
    price: 1500,
    description: 'Idéal pour un colis urgent',
  },
  {
    id: '1week',
    duration: '1 semaine',
    price: 3000,
    description: 'Pour vos commandes ponctuelles',
    popular: true,
  },
  {
    id: '1month',
    duration: '1 mois',
    price: 8000,
    description: 'Plusieurs livraisons prévues',
  },
  {
    id: '12months',
    duration: '12 mois',
    price: 60000,
    description: 'Abonnement annuel avec avantages',
    benefits: [
      'Traitement prioritaire des colis',
      'Livraison à domicile gratuite/mois',
      'Support client dédié',
      'Renouvellement automatique',
    ],
  },
];

const quartiers = {
  ouagadougou: [
    { name: 'Zone 1', agency: 'Bureau de Poste Central Ouagadougou' },
    { name: 'Patte d\'Oie', agency: 'Bureau de Poste Patte d\'Oie' },
    { name: 'ZAD', agency: 'Bureau de Poste ZAD' },
    { name: 'Ouaga 2000', agency: 'Bureau de Poste Ouaga 2000' },
    { name: 'Gounghin', agency: 'Bureau de Poste Gounghin' },
    { name: 'Kologh-Naba', agency: 'Bureau de Poste Kologh-Naba' },
    { name: 'Pissy', agency: 'Bureau de Poste Pissy' },
    { name: 'Tanghin', agency: 'Bureau de Poste Tanghin' },
  ],
  bobo: [
    { name: 'Accart Ville', agency: 'Bureau de Poste Central Bobo-Dioulasso' },
    { name: 'Kua', agency: 'Bureau de Poste Kua' },
    { name: 'Secteur 1', agency: 'Bureau de Poste Secteur 1' },
    { name: 'Secteur 7', agency: 'Bureau de Poste Secteur 7' },
    { name: 'Dioulassoba', agency: 'Bureau de Poste Dioulassoba' },
  ],
};

const faqItems = [
  {
    question: 'Comment fonctionne une boîte postale virtuelle ?',
    answer: 'Votre boîte virtuelle vous donne une adresse postale temporaire. Tous les colis envoyés à cette adresse sont réceptionnés par La Poste et vous êtes notifié pour venir les récupérer.',
  },
  {
    question: 'Quels documents faut-il pour retirer un colis ?',
    answer: 'Vous devez présenter votre CNIB (Carte Nationale d\'Identité Burkinabè) et le numéro de votre boîte virtuelle.',
  },
  {
    question: 'Y a-t-il une limite de poids ?',
    answer: 'Oui, la limite est de 30 kg par colis. Au-delà, des frais supplémentaires s\'appliquent.',
  },
  {
    question: 'Que se passe-t-il si je ne récupère pas mon colis ?',
    answer: 'Après 7 jours, des frais de stockage de 295 FCFA par jour s\'appliquent. Après 30 jours, le colis peut être retourné à l\'expéditeur.',
  },
];

export default function PostboxPage() {
  const [step, setStep] = useState<'selection' | 'form' | 'payment' | 'confirmation'>('selection');
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    phone: '',
    email: '',
    cnibNumber: '',
    quartier: '',
    homeDelivery: false,
    address: '',
  });
  const [virtualBox, setVirtualBox] = useState<VirtualBox | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateVirtualBoxNumber = (): string => {
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BV-${timestamp}${random}`;
  };

  const getClosestAgency = (quartier: string): string => {
    const allQuartiers = [...quartiers.ouagadougou, ...quartiers.bobo];
    const found = allQuartiers.find(q => q.name === quartier);
    return found?.agency || 'Bureau de Poste Central Ouagadougou';
  };

  const calculateTotalPrice = (): number => {
    if (!selectedDuration) return 0;
    let total = selectedDuration.price;
    if (customerData.homeDelivery && selectedDuration.id !== '12months') {
      total += 2000; // Frais de livraison à domicile
    }
    return total;
  };

  const generateFullAddress = (customerName: string, boxNumber: string, agency: string): string => {
    return `${customerName}\nBoîte Virtuelle ${boxNumber}\n${agency}\nBurkina Faso`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^(\+226|0)?[567]\d{7}$/.test(customerData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone burkinabè invalide';
    }

    if (!customerData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!customerData.cnibNumber.trim()) {
      newErrors.cnibNumber = 'Le numéro CNIB est requis';
    } else if (!/^[A-Z]\d{8}$/.test(customerData.cnibNumber.toUpperCase())) {
      newErrors.cnibNumber = 'Format CNIB invalide (ex: B12345678)';
    }

    if (!customerData.quartier) {
      newErrors.quartier = 'Veuillez sélectionner un quartier';
    }

    if (customerData.homeDelivery && !customerData.address?.trim()) {
      newErrors.address = 'L\'adresse est requise pour la livraison à domicile';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async (): Promise<boolean> => {
    setIsProcessing(true);
    
    // Simulation du paiement
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Génération de la boîte virtuelle
    const boxNumber = generateVirtualBoxNumber();
    const agency = getClosestAgency(customerData.quartier);
    const fullAddress = generateFullAddress(customerData.fullName, boxNumber, agency);
    
    const now = new Date();
    const validUntil = new Date(now);
    
    switch (selectedDuration?.id) {
      case '2days':
        validUntil.setDate(now.getDate() + 2);
        break;
      case '1week':
        validUntil.setDate(now.getDate() + 7);
        break;
      case '1month':
        validUntil.setMonth(now.getMonth() + 1);
        break;
      case '12months':
        validUntil.setFullYear(now.getFullYear() + 1);
        break;
    }

    setVirtualBox({
      number: boxNumber,
      fullAddress,
      agency,
      validFrom: now.toLocaleDateString('fr-FR'),
      validUntil: validUntil.toLocaleDateString('fr-FR'),
      customerName: customerData.fullName,
    });

    setIsProcessing(false);
    return true;
  };

  const handleDurationSelect = (duration: DurationOption) => {
    setSelectedDuration(duration);
    setStep('form');
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handlePayment = async () => {
    const success = await processPayment();
    if (success) {
      setStep('confirmation');
    }
  };

  const copyAddress = () => {
    if (virtualBox) {
      navigator.clipboard.writeText(virtualBox.fullAddress);
    }
  };

  const renderDurationSelection = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Boîte Postale Virtuelle
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Obtenez une adresse postale temporaire en 1 clic avec La Poste du Burkina Faso
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Service officiel La Poste</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>Activation instantanée</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-green-600" />
            <span>Jusqu'à 30kg</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {durationOptions.map((option) => (
          <Card
            key={option.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              option.popular ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleDurationSelect(option)}
          >
            {option.popular && (
              <Badge className="absolute -top-2 left-6 bg-blue-600 text-white">
                Populaire
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Intl.NumberFormat('fr-FR').format(option.price)} FCFA
              </div>
              <CardTitle className="text-xl">{option.duration}</CardTitle>
              <p className="text-sm text-gray-600">{option.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Adresse postale officielle</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Notifications SMS/Email</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Retrait en agence</span>
                </div>
                {option.id === '12months' && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Gift className="h-4 w-4 text-yellow-500" />
                    <span>Livraison gratuite/mois</span>
                  </div>
                )}
              </div>

              {option.benefits && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-blue-600 mb-2">Avantages Premium:</p>
                  {option.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Choisir cette option
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations importantes */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>À savoir :</strong> Frais de douane possibles selon le contenu. 
          Limite 30kg par colis. Frais de stockage 295 FCFA/jour après 7 jours. 
          CNIB obligatoire pour le retrait.
        </AlertDescription>
      </Alert>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  const renderForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
        <p className="text-gray-600">
          Durée sélectionnée: <span className="font-semibold text-blue-600">{selectedDuration?.duration}</span>
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                <User className="inline h-4 w-4 mr-1" />
                Nom complet *
              </Label>
              <Input
                id="fullName"
                value={customerData.fullName}
                onChange={(e) => setCustomerData({...customerData, fullName: e.target.value})}
                placeholder="Prénom et nom"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Téléphone *
              </Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                placeholder="+226 XX XX XX XX"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline h-4 w-4 mr-1" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
              placeholder="votre@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnib">
              <IdCard className="inline h-4 w-4 mr-1" />
              Numéro CNIB *
            </Label>
            <Input
              id="cnib"
              value={customerData.cnibNumber}
              onChange={(e) => setCustomerData({...customerData, cnibNumber: e.target.value.toUpperCase()})}
              placeholder="B12345678"
              className={errors.cnibNumber ? 'border-red-500' : ''}
            />
            {errors.cnibNumber && (
              <p className="text-sm text-red-500">{errors.cnibNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              <MapPin className="inline h-4 w-4 mr-1" />
              Quartier *
            </Label>
            <Select
              value={customerData.quartier}
              onValueChange={(value) => setCustomerData({...customerData, quartier: value})}
            >
              <SelectTrigger className={errors.quartier ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez votre quartier" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 font-semibold text-blue-600">Ouagadougou</div>
                {quartiers.ouagadougou.map((q) => (
                  <SelectItem key={q.name} value={q.name}>
                    {q.name}
                  </SelectItem>
                ))}
                <Separator className="my-2" />
                <div className="p-2 font-semibold text-blue-600">Bobo-Dioulasso</div>
                {quartiers.bobo.map((q) => (
                  <SelectItem key={q.name} value={q.name}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.quartier && (
              <p className="text-sm text-red-500">{errors.quartier}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="homeDelivery"
                checked={customerData.homeDelivery}
                onCheckedChange={(checked) => 
                  setCustomerData({...customerData, homeDelivery: checked as boolean})
                }
              />
              <Label htmlFor="homeDelivery" className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Livraison à domicile (+2000 FCFA)</span>
              </Label>
            </div>

            {customerData.homeDelivery && (
              <div className="space-y-2">
                <Label htmlFor="address">
                  <Home className="inline h-4 w-4 mr-1" />
                  Adresse complète *
                </Label>
                <Input
                  id="address"
                  value={customerData.address || ''}
                  onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                  placeholder="Adresse complète pour la livraison"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Récapitulatif</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Durée: {selectedDuration?.duration}</span>
                <span>{new Intl.NumberFormat('fr-FR').format(selectedDuration?.price || 0)} FCFA</span>
              </div>
              {customerData.homeDelivery && selectedDuration?.id !== '12months' && (
                <div className="flex justify-between">
                  <span>Livraison à domicile</span>
                  <span>2,000 FCFA</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-blue-800">
                <span>Total</span>
                <span>{new Intl.NumberFormat('fr-FR').format(calculateTotalPrice())} FCFA</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setStep('selection')}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              onClick={handleFormSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continuer vers le paiement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Paiement sécurisé</h2>
        <p className="text-gray-600">
          Montant à payer: <span className="font-bold text-blue-600">
            {new Intl.NumberFormat('fr-FR').format(calculateTotalPrice())} FCFA
          </span>
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Choisissez votre méthode de paiement</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="h-16 justify-start space-x-3 hover:border-orange-400"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Orange Money</div>
                  <div className="text-sm text-gray-500">Paiement instantané</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-16 justify-start space-x-3 hover:border-blue-400"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Moov Money</div>
                  <div className="text-sm text-gray-500">Paiement instantané</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-16 justify-start space-x-3 hover:border-purple-400"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                <CreditCard className="w-8 h-8 text-purple-500" />
                <div className="text-left">
                  <div className="font-semibold">Carte bancaire</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard</div>
                </div>
              </Button>
            </div>
          </div>

          {isProcessing && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-blue-600">Traitement du paiement en cours...</p>
              <p className="text-sm text-gray-500">Génération de votre boîte virtuelle...</p>
            </div>
          )}

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Paiement 100% sécurisé. Votre boîte virtuelle sera activée immédiatement après confirmation.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            onClick={() => setStep('form')}
            className="w-full"
            disabled={isProcessing}
          >
            Retour aux informations
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Boîte virtuelle activée !</h2>
        <p className="text-gray-600">
          Votre paiement a été confirmé et votre boîte postale virtuelle est maintenant active.
        </p>
      </div>

      {virtualBox && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Votre Boîte Virtuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Numéro de boîte:</span>
                <Badge className="bg-blue-600 text-white text-lg px-3 py-1">
                  {virtualBox.number}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Valide du:</span>
                  <span className="font-medium">{virtualBox.validFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valide jusqu'au:</span>
                  <span className="font-medium">{virtualBox.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agence de retrait:</span>
                  <span className="font-medium">{virtualBox.agency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adresse complète pour vos envois:</Label>
              <div className="bg-white p-3 rounded border font-mono text-sm whitespace-pre-line">
                {virtualBox.fullAddress}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier l'adresse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instructions importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">Utilisez cette adresse pour vos commandes</p>
                <p className="text-sm text-gray-600">Copiez-collez l'adresse exactement comme indiquée</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Vous serez notifié à réception</p>
                <p className="text-sm text-gray-600">SMS et email dès l'arrivée de votre colis</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">Présentez-vous avec votre CNIB</p>
                <p className="text-sm text-gray-600">CNIB + numéro de boîte virtuelle obligatoires</p>
              </div>
            </div>
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Rappel :</strong> Récupérez vos colis dans les 7 jours pour éviter les frais de stockage (295 FCFA/jour).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setStep('selection');
            setSelectedDuration(null);
            setCustomerData({
              fullName: '',
              phone: '',
              email: '',
              cnibNumber: '',
              quartier: '',
              homeDelivery: false,
              address: '',
            });
            setVirtualBox(null);
          }}
          className="flex-1"
        >
          Nouvelle boîte virtuelle
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => window.open('https://wa.me/22666117163', '_blank')}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Support WhatsApp
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {step === 'selection' && renderDurationSelection()}
        {step === 'form' && renderForm()}
        {step === 'payment' && renderPayment()}
        {step === 'confirmation' && renderConfirmation()}
      </main>

      <Footer />
    </div>
  );
}