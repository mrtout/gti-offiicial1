"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Smartphone,
  CreditCard,
  Bitcoin,
  Copy,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  QrCode,
  RefreshCw,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productInfo?: any;
  clientInfo?: any;
}

const paymentMethods = [
  {
    id: 'ORANGE_MONEY_BF',
    name: 'Orange Money',
    icon: Smartphone,
    color: 'bg-orange-500',
    description: 'Paiement instantané via Orange Money',
    fees: 0,
  },
  {
    id: 'MOOV_MONEY_BF',
    name: 'Moov Money',
    icon: Smartphone,
    color: 'bg-blue-500',
    description: 'Paiement instantané via Moov Money',
    fees: 0,
  },
  {
    id: 'BANK_TRANSFER',
    name: 'Virement Bancaire',
    icon: CreditCard,
    color: 'bg-green-500',
    description: 'Virement bancaire classique',
    fees: 3,
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    icon: Bitcoin,
    color: 'bg-yellow-500',
    description: 'Paiement en Bitcoin',
    fees: 3,
  },
  {
    id: 'USDT_TRC20',
    name: 'USDT (TRC20)',
    icon: Bitcoin,
    color: 'bg-green-600',
    description: 'Paiement en USDT sur réseau Tron',
    fees: 3,
  },
];

export function PaymentModal({ isOpen, onClose, amount, productInfo, clientInfo }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [transaction, setTransaction] = useState<any>(null);
  const [step, setStep] = useState<'method' | 'payment' | 'proof' | 'confirmation'>('method');
  const [loading, setLoading] = useState(false);
  const [proofData, setProofData] = useState<any>({});
  const [error, setError] = useState('');

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const fees = selectedPaymentMethod ? Math.round(amount * (selectedPaymentMethod.fees / 100)) : 0;
  const totalAmount = amount + fees;

  const handleMethodSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod: methodId,
          clientInfo: clientInfo || {
            name: 'Client Test',
            email: 'client@example.com',
            phone: '+22666117163'
          },
          productInfo
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la transaction');
      }

      const data = await response.json();
      setTransaction(data);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleProofSubmit = async () => {
    if (!transaction) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      if (selectedMethod === 'BTC' || selectedMethod === 'USDT_TRC20') {
        formData.append('transactionHash', proofData.transactionHash || '');
      } else if (selectedMethod?.includes('MONEY')) {
        formData.append('payerNumber', proofData.payerNumber || '');
        formData.append('payerName', proofData.payerName || '');
      } else if (selectedMethod === 'BANK_TRANSFER') {
        if (proofData.receiptFile) {
          formData.append('receiptFile', proofData.receiptFile);
        }
      }

      const response = await fetch(`/api/payments/transactions/${transaction.transactionId}/confirm`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la preuve');
      }

      const data = await response.json();
      setTransaction({ ...transaction, ...data });
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choisissez votre méthode de paiement</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className="cursor-pointer hover:shadow-md transition-all duration-300 hover:border-yellow-400"
            onClick={() => handleMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
                    <method.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Frais: {method.fees}%
                  </p>
                  <p className="font-bold text-yellow-600">
                    {new Intl.NumberFormat('fr-FR').format(
                      amount + Math.round(amount * (method.fees / 100))
                    )} XOF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Récapitulatif</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Montant:</span>
            <span>{new Intl.NumberFormat('fr-FR').format(amount)} XOF</span>
          </div>
          <div className="flex justify-between">
            <span>Frais:</span>
            <span>{new Intl.NumberFormat('fr-FR').format(fees)} XOF</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-blue-800">
            <span>Total:</span>
            <span>{new Intl.NumberFormat('fr-FR').format(totalAmount)} XOF</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentDetails = () => {
    if (!transaction) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Effectuez votre paiement</h3>
          <Badge className="bg-yellow-100 text-yellow-800">
            Transaction: {transaction.transactionId}
          </Badge>
        </div>

        {selectedMethod?.includes('MONEY') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Instructions {selectedPaymentMethod?.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Numéros de paiement:</Label>
                {transaction.paymentDetails.numbers.map((number: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mt-1">
                    <Input value={number} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(number)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <Label>Nom du bénéficiaire:</Label>
                <Input value={transaction.paymentDetails.holderName} readOnly />
              </div>
              <div>
                <Label>Montant à envoyer:</Label>
                <Input 
                  value={`${new Intl.NumberFormat('fr-FR').format(transaction.totalAmount)} XOF`} 
                  readOnly 
                  className="font-bold text-green-600"
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {transaction.paymentDetails.instructions}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {selectedMethod === 'BANK_TRANSFER' && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Virement Bancaire</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Banque:</Label>
                  <Input value={transaction.paymentDetails.bankName} readOnly />
                </div>
                <div>
                  <Label>Numéro de compte:</Label>
                  <Input value={transaction.paymentDetails.accountNumber} readOnly />
                </div>
                <div>
                  <Label>Titulaire:</Label>
                  <Input value={transaction.paymentDetails.accountHolder} readOnly />
                </div>
                <div>
                  <Label>Code SWIFT:</Label>
                  <Input value={transaction.paymentDetails.swiftCode} readOnly />
                </div>
              </div>
              <div>
                <Label>Référence (obligatoire):</Label>
                <div className="flex items-center space-x-2">
                  <Input value={transaction.paymentDetails.reference} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.paymentDetails.reference)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {transaction.paymentDetails.instructions}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {(selectedMethod === 'BTC' || selectedMethod === 'USDT_TRC20') && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bitcoin className="h-5 w-5" />
                <span>{selectedPaymentMethod?.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Adresse de paiement:</Label>
                <div className="flex items-center space-x-2">
                  <Input value={transaction.paymentDetails.address} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.paymentDetails.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <Label>QR Code:</Label>
                <div className="mt-2">
                  <img 
                    src={transaction.paymentDetails.qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto border rounded"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              <div>
                <Label>Réseau:</Label>
                <Input value={transaction.paymentDetails.network} readOnly />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Envoyez exactement {new Intl.NumberFormat('fr-FR').format(transaction.totalAmount)} XOF 
                  à l'adresse ci-dessus. Conservez le hash de transaction pour la confirmation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setStep('proof')} className="flex-1">
            J'ai effectué le paiement
          </Button>
          <Button variant="outline" onClick={() => setStep('method')}>
            Changer de méthode
          </Button>
        </div>
      </div>
    );
  };

  const renderProofSubmission = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Confirmez votre paiement</h3>
        <p className="text-gray-600">
          Soumettez la preuve de votre paiement pour finaliser la transaction
        </p>
      </div>

      {selectedMethod?.includes('MONEY') && (
        <div className="space-y-4">
          <div>
            <Label>Votre numéro de téléphone *</Label>
            <Input
              placeholder="+226 XX XX XX XX"
              value={proofData.payerNumber || ''}
              onChange={(e) => setProofData({...proofData, payerNumber: e.target.value})}
            />
          </div>
          <div>
            <Label>Votre nom (optionnel)</Label>
            <Input
              placeholder="Nom du payeur"
              value={proofData.payerName || ''}
              onChange={(e) => setProofData({...proofData, payerName: e.target.value})}
            />
          </div>
        </div>
      )}

      {selectedMethod === 'BANK_TRANSFER' && (
        <div className="space-y-4">
          <div>
            <Label>Reçu bancaire *</Label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProofData({...proofData, receiptFile: file});
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              Téléchargez une photo ou un scan de votre reçu bancaire
            </p>
          </div>
        </div>
      )}

      {(selectedMethod === 'BTC' || selectedMethod === 'USDT_TRC20') && (
        <div className="space-y-4">
          <div>
            <Label>Hash de transaction *</Label>
            <Input
              placeholder="Collez le hash de votre transaction"
              value={proofData.transactionHash || ''}
              onChange={(e) => setProofData({...proofData, transactionHash: e.target.value})}
            />
            <p className="text-sm text-gray-500 mt-1">
              Vous pouvez trouver ce hash dans votre wallet après l'envoi
            </p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => setStep('payment')}>
          Retour
        </Button>
        <Button 
          onClick={handleProofSubmit} 
          disabled={loading}
          className="flex-1 gradient-gold text-white"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Traitement...</span>
            </div>
          ) : (
            'Confirmer le paiement'
          )}
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Paiement en cours de vérification
        </h3>
        <p className="text-gray-600">
          {transaction?.message || 'Votre paiement a été reçu et est en cours de vérification.'}
        </p>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono">{transaction?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Statut:</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {transaction?.status === 'COMPLETED' ? 'Confirmé' : 'En vérification'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Montant:</span>
              <span>{new Intl.NumberFormat('fr-FR').format(totalAmount)} XOF</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Vous recevrez une confirmation par email dès que votre paiement sera validé (généralement sous 24h).
        </AlertDescription>
      </Alert>

      <Button onClick={onClose} className="w-full">
        Fermer
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Paiement - {new Intl.NumberFormat('fr-FR').format(amount)} XOF
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {loading && step === 'method' && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-600" />
            <p>Initialisation du paiement...</p>
          </div>
        )}

        {!loading && step === 'method' && renderMethodSelection()}
        {step === 'payment' && renderPaymentDetails()}
        {step === 'proof' && renderProofSubmission()}
        {step === 'confirmation' && renderConfirmation()}
      </DialogContent>
    </Dialog>
  );
}