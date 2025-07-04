"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Link,
  Upload,
  Calculator,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Globe,
  Clock,
  Shield,
  Package,
} from 'lucide-react';

const supportedSites = [
  { name: 'AliExpress', logo: '🛒', popular: true },
  { name: 'Shein', logo: '👗', popular: true },
  { name: 'Amazon', logo: '📦', popular: true },
  { name: 'Alibaba', logo: '🏭', popular: false },
  { name: 'Wish', logo: '⭐', popular: false },
  { name: 'DHgate', logo: '🔧', popular: false },
];

const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard',
    duration: '15-25 jours',
    price: '5000 XOF',
    description: 'Livraison économique',
  },
  {
    id: 'express',
    name: 'Express',
    duration: '7-12 jours',
    price: '12000 XOF',
    description: 'Livraison rapide',
  },
  {
    id: 'premium',
    name: 'Premium',
    duration: '3-7 jours',
    price: '25000 XOF',
    description: 'Livraison ultra-rapide',
  },
];

export default function ShoppingPage() {
  const [step, setStep] = useState(1);
  const [productUrl, setProductUrl] = useState('');
  const [productDetails, setProductDetails] = useState({
    title: '',
    price: '',
    quantity: 1,
    options: '',
    description: '',
  });

  const handleUrlAnalysis = () => {
    // Simulate URL analysis
    setProductDetails({
      title: 'Smartphone Android - 128GB',
      price: '45000 XOF',
      quantity: 1,
      options: 'Couleur: Noir, Taille: 128GB',
      description: 'Smartphone haute qualité avec écran 6.5 pouces',
    });
    setStep(2);
  };

  const calculateTotal = () => {
    const productPrice = 45000;
    const serviceFee = productPrice * 0.05; // 5%
    const shippingPrice = 5000;
    return productPrice + serviceFee + shippingPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Commander un Produit
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Commandez depuis plus de 1000 sites e-commerce internationaux. 
            Collez simplement le lien du produit et nous nous occupons du reste.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= step
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i < step ? 'bg-yellow-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Étape {step} sur 4: {
              step === 1 ? 'Lien du produit' :
              step === 2 ? 'Détails du produit' :
              step === 3 ? 'Options de livraison' :
              'Paiement'
            }
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {step === 1 && <Link className="h-5 w-5" />}
                  {step === 2 && <Package className="h-5 w-5" />}
                  {step === 3 && <Truck className="h-5 w-5" />}
                  {step === 4 && <CreditCard className="h-5 w-5" />}
                  <span>
                    {step === 1 && 'Ajouter le lien du produit'}
                    {step === 2 && 'Vérifier les détails'}
                    {step === 3 && 'Choisir la livraison'}
                    {step === 4 && 'Finaliser le paiement'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Lien du produit
                        </label>
                        <Input
                          placeholder="https://www.aliexpress.com/item/..."
                          value={productUrl}
                          onChange={(e) => setProductUrl(e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Collez le lien direct vers le produit que vous souhaitez commander
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Ou téléchargez une image/capture
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">Cliquez pour télécharger</p>
                          <p className="text-sm text-gray-500">PNG, JPG jusqu'à 10MB</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description supplémentaire (optionnel)
                        </label>
                        <Textarea placeholder="Décrivez le produit, couleur, taille, quantité..." />
                      </div>
                    </div>

                    <Button 
                      onClick={handleUrlAnalysis}
                      className="w-full gradient-gold text-white"
                      disabled={!productUrl}
                    >
                      Analyser le produit
                      <Calculator className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Produit analysé avec succès</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Titre du produit</label>
                        <Input value={productDetails.title} readOnly />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Prix unitaire</label>
                          <Input value={productDetails.price} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Quantité</label>
                          <Input 
                            type="number" 
                            value={productDetails.quantity}
                            onChange={(e) => setProductDetails({
                              ...productDetails,
                              quantity: parseInt(e.target.value)
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Options</label>
                        <Input value={productDetails.options} />
                        <p className="text-sm text-gray-500 mt-1">
                          Modifiez si nécessaire (couleur, taille, etc.)
                        </p>
                      </div>
                    </div>

                    <Button onClick={() => setStep(3)} className="w-full gradient-gold text-white">
                      Continuer vers la livraison
                    </Button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-medium">Choisissez votre mode de livraison</h3>
                      
                      {shippingOptions.map((option) => (
                        <Card key={option.id} className="cursor-pointer hover:ring-2 hover:ring-yellow-400">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{option.name}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                                <p className="text-sm text-gray-500">{option.duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-yellow-600">{option.price}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button onClick={() => setStep(4)} className="w-full gradient-gold text-white">
                      Continuer vers le paiement
                    </Button>
                  </>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Prêt pour le paiement</span>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Votre commande sera traitée dans les 24h après confirmation du paiement.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Méthode de paiement</h3>
                      
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orange">Orange Money</SelectItem>
                          <SelectItem value="moov">Moov Money</SelectItem>
                          <SelectItem value="card">Carte bancaire</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full gradient-gold text-white">
                      Payer {calculateTotal().toLocaleString()} XOF
                      <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supported Sites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Sites supportés</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {supportedSites.map((site) => (
                    <div key={site.name} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <span className="text-lg">{site.logo}</span>
                      <span className="text-sm">{site.name}</span>
                      {site.popular && (
                        <Badge variant="secondary" className="text-xs">Pop</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {step > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Résumé</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix du produit</span>
                      <span>45,000 XOF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service (5%)</span>
                      <span>2,250 XOF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>5,000 XOF</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{calculateTotal().toLocaleString()} XOF</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Pourquoi nous choisir ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Traitement rapide</p>
                    <p className="text-xs text-gray-600">Commande traitée en 24h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Paiement sécurisé</p>
                    <p className="text-xs text-gray-600">Garantie 100% sécurisé</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Suivi complet</p>
                    <p className="text-xs text-gray-600">Traçage jusqu'à livraison</p>
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