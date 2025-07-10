import { NextRequest, NextResponse } from 'next/server';

// Référence à la base de données en mémoire
declare global {
  var transactions: Map<string, any>;
}

if (!global.transactions) {
  global.transactions = new Map();
}

const transactions = global.transactions;

function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer admin-token-123';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const transactionId = params.id;
    const transaction = transactions.get(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    if (transaction.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Une transaction complétée ne peut pas être annulée' },
        { status: 400 }
      );
    }

    const { reason, refundRequired } = await request.json();

    // Annuler la transaction
    transaction.status = 'CANCELLED';
    transaction.cancelledAt = new Date().toISOString();
    transaction.cancelledBy = 'admin';
    transaction.cancellationReason = reason;
    transaction.refundRequired = refundRequired || false;
    transaction.updatedAt = new Date().toISOString();

    transactions.set(transactionId, transaction);

    // Envoyer une notification d'annulation au client
    await sendCancellationNotification(transaction);

    return NextResponse.json({
      transactionId: transaction.id,
      status: 'CANCELLED',
      message: 'Transaction annulée avec succès',
      cancelledAt: transaction.cancelledAt,
      reason
    });

  } catch (error) {
    console.error('Erreur annulation transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function sendCancellationNotification(transaction: any) {
  try {
    // Email d'annulation au client
    if (transaction.clientInfo.email) {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_cancelled',
          transaction
        })
      });
    }

    console.log(`Notification d'annulation envoyée pour ${transaction.id}`);
  } catch (error) {
    console.error('Erreur notification annulation:', error);
  }
}