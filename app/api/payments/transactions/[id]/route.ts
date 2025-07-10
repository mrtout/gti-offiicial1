import { NextRequest, NextResponse } from 'next/server';

// Simuler une base de données en mémoire (même référence que dans route.ts)
declare global {
  var transactions: Map<string, any>;
}

if (!global.transactions) {
  global.transactions = new Map();
}

const transactions = global.transactions;

export async function GET(
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

    return NextResponse.json({
      transactionId: transaction.id,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      fees: transaction.fees,
      totalAmount: transaction.totalAmount,
      paymentDetails: transaction.paymentDetails,
      expiresAt: transaction.expiresAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      message: getStatusMessage(transaction.status)
    });

  } catch (error) {
    console.error('Erreur récupération transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { status, adminNote } = await request.json();

    // Validation des statuts autorisés
    const allowedStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour la transaction
    transaction.status = status;
    transaction.updatedAt = new Date().toISOString();
    if (adminNote) {
      transaction.adminNote = adminNote;
    }

    transactions.set(transactionId, transaction);

    // Envoyer une notification de changement de statut
    await sendStatusChangeNotification(transaction, status);

    return NextResponse.json({
      transactionId: transaction.id,
      status: transaction.status,
      message: getStatusMessage(status),
      updatedAt: transaction.updatedAt
    });

  } catch (error) {
    console.error('Erreur mise à jour transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  const messages = {
    'PENDING': 'En attente de paiement',
    'AWAITING_PROOF': 'En attente de preuve de paiement',
    'PROCESSING': 'Paiement en cours de vérification',
    'COMPLETED': 'Paiement confirmé et validé',
    'CANCELLED': 'Transaction annulée',
    'FAILED': 'Échec du paiement',
    'EXPIRED': 'Transaction expirée'
  };
  return messages[status] || 'Statut inconnu';
}

async function sendStatusChangeNotification(transaction: any, newStatus: string) {
  try {
    // Notification au client
    if (transaction.clientInfo.email) {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_status_change',
          transaction,
          newStatus
        })
      });
    }

    // Notification à l'équipe admin
    console.log(`Statut changé pour ${transaction.id}: ${newStatus}`);
  } catch (error) {
    console.error('Erreur notification changement statut:', error);
  }
}