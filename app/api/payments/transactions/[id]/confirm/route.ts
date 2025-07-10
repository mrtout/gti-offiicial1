import { NextRequest, NextResponse } from 'next/server';

// Référence à la base de données en mémoire
declare global {
  var transactions: Map<string, any>;
}

if (!global.transactions) {
  global.transactions = new Map();
}

const transactions = global.transactions;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id;
    const transaction = transactions.get(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette transaction ne peut plus être confirmée' },
        { status: 400 }
      );
    }

    // Vérifier si la transaction n'a pas expiré
    if (new Date() > new Date(transaction.expiresAt)) {
      transaction.status = 'EXPIRED';
      transaction.updatedAt = new Date().toISOString();
      transactions.set(transactionId, transaction);
      
      return NextResponse.json(
        { error: 'Transaction expirée' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const paymentMethod = transaction.paymentMethod;

    let proofData: any = {};

    // Traitement selon la méthode de paiement
    if (paymentMethod === 'BTC' || paymentMethod === 'USDT_TRC20') {
      const transactionHash = formData.get('transactionHash') as string;
      
      if (!transactionHash) {
        return NextResponse.json(
          { error: 'Hash de transaction requis pour les crypto-monnaies' },
          { status: 400 }
        );
      }

      proofData = {
        type: 'crypto',
        transactionHash,
        submittedAt: new Date().toISOString()
      };

      // Vérification automatique de la blockchain (optionnel)
      const isValid = await verifyCryptoTransaction(transactionHash, paymentMethod, transaction);
      
      if (isValid) {
        transaction.status = 'COMPLETED';
        proofData.autoVerified = true;
      } else {
        transaction.status = 'PROCESSING';
        proofData.autoVerified = false;
      }

    } else if (paymentMethod.includes('MONEY')) {
      const payerNumber = formData.get('payerNumber') as string;
      const payerName = formData.get('payerName') as string;
      
      if (!payerNumber) {
        return NextResponse.json(
          { error: 'Numéro du payeur requis pour Mobile Money' },
          { status: 400 }
        );
      }

      proofData = {
        type: 'mobile_money',
        payerNumber,
        payerName,
        submittedAt: new Date().toISOString()
      };

      transaction.status = 'PROCESSING'; // Validation manuelle requise

    } else if (paymentMethod === 'BANK_TRANSFER') {
      const receiptFile = formData.get('receiptFile') as File;
      
      if (!receiptFile) {
        return NextResponse.json(
          { error: 'Reçu bancaire requis' },
          { status: 400 }
        );
      }

      // Sauvegarder le fichier (en production, utiliser un service de stockage)
      const receiptUrl = await saveReceiptFile(receiptFile, transactionId);

      proofData = {
        type: 'bank_transfer',
        receiptUrl,
        fileName: receiptFile.name,
        fileSize: receiptFile.size,
        submittedAt: new Date().toISOString()
      };

      transaction.status = 'PROCESSING'; // Validation manuelle requise
    }

    // Mettre à jour la transaction
    transaction.proofData = proofData;
    transaction.updatedAt = new Date().toISOString();
    transactions.set(transactionId, transaction);

    // Envoyer une notification à l'équipe admin
    await sendProofSubmissionNotification(transaction);

    return NextResponse.json({
      transactionId: transaction.id,
      status: transaction.status,
      message: getConfirmationMessage(transaction.status),
      proofSubmitted: true
    });

  } catch (error) {
    console.error('Erreur confirmation transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function verifyCryptoTransaction(
  hash: string, 
  paymentMethod: string, 
  transaction: any
): Promise<boolean> {
  try {
    // Ici vous pouvez intégrer avec des APIs de blockchain
    // Pour BTC: blockchain.info API
    // Pour USDT TRC20: TronGrid API
    
    if (paymentMethod === 'BTC') {
      // Exemple d'appel à blockchain.info
      const response = await fetch(`https://blockchain.info/rawtx/${hash}`);
      if (response.ok) {
        const txData = await response.json();
        // Vérifier l'adresse de destination et le montant
        // return verifyBTCTransaction(txData, transaction);
      }
    } else if (paymentMethod === 'USDT_TRC20') {
      // Exemple d'appel à TronGrid
      const response = await fetch(`https://api.trongrid.io/v1/transactions/${hash}`);
      if (response.ok) {
        const txData = await response.json();
        // Vérifier l'adresse de destination et le montant
        // return verifyUSDTTransaction(txData, transaction);
      }
    }

    // Pour la démo, retourner false pour forcer la validation manuelle
    return false;
  } catch (error) {
    console.error('Erreur vérification crypto:', error);
    return false;
  }
}

async function saveReceiptFile(file: File, transactionId: string): Promise<string> {
  // En production, sauvegarder sur un service de stockage (AWS S3, Cloudinary, etc.)
  // Pour la démo, retourner une URL fictive
  return `/uploads/receipts/${transactionId}-${file.name}`;
}

async function sendProofSubmissionNotification(transaction: any) {
  try {
    // Notification à l'équipe admin
    console.log('Nouvelle preuve de paiement soumise:', {
      transactionId: transaction.id,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.totalAmount,
      client: transaction.clientInfo.name,
      proofType: transaction.proofData.type
    });

    // Ici vous pouvez envoyer un email, SMS, ou notification Slack/Telegram
  } catch (error) {
    console.error('Erreur notification preuve:', error);
  }
}

function getConfirmationMessage(status: string): string {
  const messages: { [key: string]: string } = {
    'PROCESSING': 'Votre preuve de paiement a été reçue et est en cours de vérification. Vous recevrez une confirmation sous 24h.',
    'COMPLETED': 'Votre paiement a été automatiquement vérifié et confirmé. Merci !',
    'FAILED': 'La vérification de votre paiement a échoué. Veuillez contacter le support.'
  };
  return messages[status] || 'Statut de confirmation inconnu';
}