"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Smartphone,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Banknote,
} from 'lucide-react';

interface MobileMoneyPaymentProps {
  bookingData: any;
  flight: any;
  onPaymentComplete: () => void;
}

const paymentMethods = [
  {
    id: 'orange-money',
    name: 'Orange Money',
    icon: '🟠',
    fees: '1%',
    processingTime: 'Instantané',
    countries: ['BF', 'CI', 'ML', 'SN'],
  },
  {
    id: 'moov-money',
    name: 'Moov Money',
    icon: '🔵',
    fees: '1.5%',
    processingTime: 'Instantané',
    countries: ['BF', 'CI', 'TG', 'BJ'],
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: '💙',
    fees: '0%',
    processingTime: 'Instantané',
    countries: ['SN', 'CI', 'UG'],
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    icon: '💳',
    fees: '2.5%',
    processingTime: 'Instantané',
    countries: ['ALL'],
  },
  {
    id: 'bank-transfer',
    name: 'Virement bancaire',
    icon: '🏦',
    fees: '0%',
    processingTime: '1-3 jours',
    countries: ['ALL'],
  },
];

export function MobileMoneyPayment({ bookingData, flight, onPaymentComplete }: MobileMoneyPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    bankAccount: '',
    bankName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'confirmation'>('method');

  const basePrice = parseInt(flight?.price?.replace(/[^\d]/g, '') || '0');
  const servicesPrice = bookingData?.additionalServices?.reduce((total: number, service: any) => {
    return total + parseInt(service.price.replace(/[^\d]/g, ''));
  }, 0) || 0;
  const vipLoungePrice = bookingData?.vipLounge ? 25000 : 0;
  
  const subtotal = basePrice + servicesPrice + vipLoungePrice;
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const fees = selectedMethodData ? Math.round(subtotal * parseFloat(selectedMethodData.fees) / 100) : 0;
  const total = subtotal + fees;

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmation');
      
      // Attendre 2 secondes puis compléter
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 3000);
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choisissez votre méthode de paiement</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className="cursor-pointer hover:shadow-md transition-all duration-300 hover:border-yellow-400"
            onClick={() => handleMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{method.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Frais: {method.fees}</span>
                    <span>{method.processingTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {method.countries.includes('ALL') ? 'International' : 'Régional'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Détails de paiement</h3>
        <Button variant="outline" onClick={() => setStep('method')}>
          Changer de méthode
        </Button>
      </div>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedMethodData?.icon}</div>
            <div>
              <h4 className="font-semibold">{selectedMethodData?.name}</h4>
              <p className="text-sm text-gray-600">
                Frais: {selectedMethodData?.fees} • {selectedMethodData?.processingTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <div className="space-y-4">
        {(selectedMethod === 'orange-money' || selectedMethod === 'moov-money' || selectedMethod === 'wave') && (
          <div>
            <Label>Numéro de téléphone</Label>
            <Input
              type="tel"
              placeholder="+226 XX XX XX XX"
              value={paymentDetails.phoneNumber}
              onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Vous recevrez une notification pour confirmer le paiement
            </p>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <Label>Nom sur la carte</Label>
              <Input
                placeholder="Nom complet"
                value={paymentDetails.cardName}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label>Numéro de carte</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date d'expiration</Label>
                <Input
                  placeholder="MM/AA"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'bank-transfer' && (
          <div className="space-y-4">
            <div>
              <Label>Nom de la banque</Label>
              <Select
                value={paymentDetails.bankName}
                onValueChange={(value) => setPaymentDetails({...paymentDetails, bankName: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner votre banque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boa">Bank of Africa</SelectItem>
                  <SelectItem value="sgb">Société Générale</SelectItem>
                  <SelectItem value="bib">Banque Internationale du Burkina</SelectItem>
                  <SelectItem value="ecobank">Ecobank</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Numéro de compte</Label>
              <Input
                placeholder="Numéro de compte bancaire"
                value={paymentDetails.bankAccount}
                onChange={(e) => setPaymentDetails({...paymentDetails, bankAccount: e.target.value})}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Vos informations de paiement sont sécurisées par un cryptage SSL 256-bit. 
          Nous ne stockons aucune donnée bancaire.
        </AlertDescription>
      </Alert>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full gradient-gold text-white py-3"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Traitement en cours...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Payer {new Intl.NumberFormat('fr-FR').format(total)} XOF</span>
          </div>
        )}
      </Button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-green-800">Paiement en cours</h3>
        <p className="text-green-600 mt-2">
          Votre paiement est en cours de traitement. Vous allez être redirigé vers la confirmation.
        </p>
      </div>

      <div className="animate-pulse">
        <div className="w-full bg-green-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Résumé du paiement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Vol {flight?.flightNumber}</span>
              <span>{new Intl.NumberFormat('fr-FR').format(basePrice)} XOF</span>
            </div>
            
            {servicesPrice > 0 && (
              <div className="flex justify-between">
                <span>Services supplémentaires</span>
                <span>{new Intl.NumberFormat('fr-FR').format(servicesPrice)} XOF</span>
              </div>
            )}
            
            {vipLoungePrice > 0 && (
              <div className="flex justify-between">
                <span>Salon VIP</span>
                <span>{new Intl.NumberFormat('fr-FR').format(vipLoungePrice)} XOF</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{new Intl.NumberFormat('fr-FR').format(subtotal)} XOF</span>
            </div>
            
            {fees > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frais de traitement ({selectedMethodData?.fees})</span>
                <span>{new Intl.NumberFormat('fr-FR').format(fees)} XOF</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total à payer</span>
              <span className="text-yellow-600">
                {new Intl.NumberFormat('fr-FR').format(total)} XOF
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Process */}
      <Card>
        <CardContent className="p-6">
          {step === 'method' && renderMethodSelection()}
          {step === 'details' && renderPaymentDetails()}
          {step === 'confirmation' && renderConfirmation()}
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex items-center space-x-2 justify-center">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">Paiement sécurisé</span>
        </div>
        <div className="flex items-center space-x-2 justify-center">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">Traitement instantané</span>
        </div>
        <div className="flex items-center space-x-2 justify-center">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-gray-600">Confirmation immédiate</span>
        </div>
      </div>
    </div>
  );
}