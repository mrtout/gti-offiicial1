'use client';

import { Header } from '@/components/layout/header';

export default function TestPaymentPage() {
  const predefinedAmounts = [10000, 25000, 50000, 100000, 250000];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Test de Paiement</h1>
        <div className="flex flex-wrap gap-4">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              className="px-5 py-3 border rounded-md hover:bg-gray-100 transition"
              onClick={() => {
                console.log(`Montant sélectionné : ${amt} FCFA`);
              }}
            >
              {amt.toLocaleString('fr-FR')} FCFA
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}