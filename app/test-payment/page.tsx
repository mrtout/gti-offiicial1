"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ShoppingCart } from 'lucide-react';

export default function TestPaymentPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState(50000);
  const [productInfo] = useState({
    name: 'Test Product',
    description: 'Produit de test pour le système de paiement',
    webhookUrl: 'https://example.com/webhook'
  });
  const [clientInfo] = useState({
    name: 'Client Test',
    email: 'client@example.com',
    phone: '+22666117163'
  });

  const predefinedAmounts = [10000, 25000, 50000, 100000, 250000];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Test du Système de Paiement
              </h1>
            </div>
            <p className="text-gray-600">
              Interface de test pour valider le fonctionnement du système de paiement intégré
            </p>
          </div>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Simuler un paiement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount">Montant à payer (XOF)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  placeholder="Entrez le montant"
                />
              </div>

              <div>
                <Label>Montants prédéfinis</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {predefinedAmounts.map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(presetAmount)}
                      className={amount === presetAmount ? 'border-yellow-400 bg-yellow-50' : ''}
                    >
                      {new Intl.NumberFormat('fr-FR').format(presetAmount)} XOF
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Informations de test</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p><strong>Client:</strong> {clientInfo.name}</p>
                  <p><strong>Email:</strong> {clientInfo.email}</p>
                  <p><strong>Téléphone:</strong> {clientInfo.phone}</p>
                  <p><strong>Produit:</strong> {productInfo.name}</p>
                </div>
              </div>

              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full gradient-gold text-white py-3"
                disabled={amount <= 0}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Lancer le paiement de {new Intl.NumberFormat('fr-FR').format(amount)} XOF
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Instructions de test</CardTitle>
            </CardHeader>
            <CardContent className="text-green-700 space-y-2">
              <p className="text-sm">
                <strong>1.</strong> Choisissez un montant et cliquez sur "Lancer le paiement"
              </p>
              <p className="text-sm">
                <strong>2.</strong> Sélectionnez une méthode de paiement dans le modal
              </p>
              <p className="text-sm">
                <strong>3.</strong> Suivez les instructions de paiement affichées
              </p>
              <p className="text-sm">
                <strong>4.</strong> Soumettez une preuve de paiement (fictive pour les tests)
              </p>
              <p className="text-sm">
                <strong>5.</strong> Vérifiez le statut dans l'interface admin: <a href="/admin/payments" className="underline font-medium">Admin Paiements</a>
              </p>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoints API disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="text-green-600">POST</span>
                  <span>/api/payments/transactions</span>
                  <span className="text-gray-600">Créer une transaction</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="text-blue-600">GET</span>
                  <span>/api/payments/transactions/[id]</span>
                  <span className="text-gray-600">Statut transaction</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="text-yellow-600">POST</span>
                  <span>/api/payments/transactions/[id]/confirm</span>
                  <span className="text-gray-600">Confirmer paiement</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="text-blue-600">GET</span>
                  <span>/api/payments/admin/transactions</span>
                  <span className="text-gray-600">Liste admin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={amount}
        productInfo={productInfo}
        clientInfo={clientInfo}
      />
    </div>
  );
}