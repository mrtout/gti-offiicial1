import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Configuration des méthodes de paiement
const PAYMENT_CONFIG = {
  ORANGE_MONEY_BF: { 
    numbers: ["+22666117163", "+22664823638"], 
    feesPercent: 0,
    holderName: "Tanou Fadel Rayan Joudi"
  },
  MOOV_MONEY_BF: { 
    numbers: ["+22670931297"], 
    feesPercent: 0,
    holderName: "Tanou Fadel Rayan Joudi"
  },
  BANK_TRANSFER: { 
    feesPercent: 3,
    bankDetails: {
      bankName: "Bank of Africa",
      accountNumber: "BF1234567890",
      accountHolder: "Groupe Tanou International",
      swiftCode: "BOAFBFBF"
    }
  },
  BTC: { 
    address: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT", 
    feesPercent: 3 
  },
  USDT_TRC20: { 
    address: "TDz6YJY1xQKZ3u2x9F7LmR8hKt6y3B7R4W", 
    feesPercent: 3 
  }
};

// Simuler une base de données en mémoire (en production, utiliser une vraie DB)
const transactions = new Map();

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, clientInfo, productInfo } = await request.json();

    // Validation des données
    if (!amount || !paymentMethod || !clientInfo) {
      return NextResponse.json(
        { error: "Données manquantes: amount, paymentMethod et clientInfo sont requis" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Le montant doit être supérieur à 0" },
        { status: 400 }
      );
    }

    const config = PAYMENT_CONFIG[paymentMethod as keyof typeof PAYMENT_CONFIG];
    if (!config) {
      return NextResponse.json(
        { error: "Méthode de paiement non valide" },
        { status: 400 }
      );
    }

    // Calcul des frais et du montant total
    const fees = Math.round(amount * (config.feesPercent / 100));
    const totalAmount = amount + fees;
    
    // Génération de l'ID de transaction
    const transactionId = `TXN-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expiration dans 15 minutes

    // Préparation des détails de paiement selon la méthode
    let paymentDetails: any = {};
    
    if (paymentMethod === 'BTC' || paymentMethod === 'USDT_TRC20') {
      // Type assertion to safely access address property for crypto payments
      const cryptoConfig = config as { address: string; feesPercent: number };
      
      paymentDetails = {
        address: cryptoConfig.address,
        qrCodeUrl: `/api/payments/qr/${transactionId}`,
        network: paymentMethod === 'USDT_TRC20' ? 'TRC20' : 'Bitcoin'
      };
    } else if (paymentMethod.includes('MONEY')) {
      // Type assertion for mobile money payments
      const mobileConfig = config as { numbers: string[]; holderName: string; feesPercent: number };
      
      paymentDetails = {
        numbers: mobileConfig.numbers,
        holderName: mobileConfig.holderName,
        instructions: `Envoyez ${totalAmount.toLocaleString()} XOF au numéro ci-dessus`
      };
    } else if (paymentMethod === 'BANK_TRANSFER') {
      // Type assertion for bank transfer payments
      const bankConfig = config as { bankDetails: any; feesPercent: number };
      
      paymentDetails = {
        ...bankConfig.bankDetails,
        amount: totalAmount,
        reference: transactionId,
        instructions: `Effectuez un virement de ${totalAmount.toLocaleString()} XOF avec la référence ${transactionId}`
      };
    }

    // Création de la transaction
    const transaction = {
      id: transactionId,
      status: 'PENDING',
      paymentMethod,
      amount,
      fees,
      totalAmount,
      clientInfo,
      productInfo,
      paymentDetails,
      proofData: null,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sauvegarder la transaction
    transactions.set(transactionId, transaction);

    // Programmer l'expiration automatique
    setTimeout(() => {
      const tx = transactions.get(transactionId);
      if (tx && tx.status === 'PENDING') {
        tx.status = 'EXPIRED';
        tx.updatedAt = new Date().toISOString();
        transactions.set(transactionId, tx);
      }
    }, 15 * 60 * 1000);

    // Envoyer une notification à l'équipe (optionnel)
    await sendTransactionNotification(transaction, 'CREATED');

    return NextResponse.json({
      transactionId,
      status: 'PENDING',
      paymentMethod,
      amount,
      fees,
      totalAmount,
      paymentDetails,
      expiresAt: expiresAt.toISOString(),
      message: 'Transaction créée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    let filteredTransactions = Array.from(transactions.values());

    if (clientId) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.clientInfo.id === clientId
      );
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.status === status
      );
    }

    return NextResponse.json({
      transactions: filteredTransactions.map(tx => ({
        id: tx.id,
        status: tx.status,
        paymentMethod: tx.paymentMethod,
        amount: tx.amount,
        totalAmount: tx.totalAmount,
        createdAt: tx.createdAt,
        expiresAt: tx.expiresAt
      }))
    });

  } catch (error) {
    console.error('Erreur récupération transactions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function sendTransactionNotification(transaction: any, event: string) {
  try {
    // Ici vous pouvez intégrer avec votre service de notification
    // (Email, SMS, Slack, Telegram, etc.)
    console.log(`Notification ${event}:`, {
      transactionId: transaction.id,
      amount: transaction.totalAmount,
      paymentMethod: transaction.paymentMethod,
      client: transaction.clientInfo.name
    });
  } catch (error) {
    console.error('Erreur notification:', error);
  }
}