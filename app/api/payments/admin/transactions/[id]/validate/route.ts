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

    if (transaction.status !== 'PROCESSING') {
      return NextResponse.json(
        { error: 'Cette transaction ne peut pas être validée' },
        { status: 400 }
      );
    }

    const { adminNote, validatedAmount } = await request.json();

    // Valider la transaction
    transaction.status = 'COMPLETED';
    transaction.validatedAt = new Date().toISOString();
    transaction.validatedBy = 'admin'; // En production, utiliser l'ID de l'admin
    transaction.adminNote = adminNote;
    transaction.updatedAt = new Date().toISOString();

    if (validatedAmount && validatedAmount !== transaction.totalAmount) {
      transaction.validatedAmount = validatedAmount;
      transaction.amountDifference = validatedAmount - transaction.totalAmount;
    }

    transactions.set(transactionId, transaction);

    // Générer une facture/reçu
    const invoice = await generateInvoice(transaction);

    // Envoyer une notification de validation au client
    await sendValidationNotification(transaction, invoice);

    // Déclencher les actions post-validation (déblocage de service, etc.)
    await triggerPostValidationActions(transaction);

    return NextResponse.json({
      transactionId: transaction.id,
      status: 'COMPLETED',
      message: 'Transaction validée avec succès',
      validatedAt: transaction.validatedAt,
      invoiceUrl: invoice.url
    });

  } catch (error) {
    console.error('Erreur validation transaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function generateInvoice(transaction: any) {
  // En production, générer un PDF avec une bibliothèque comme jsPDF ou Puppeteer
  const invoice = {
    id: `INV-${transaction.id}`,
    url: `/invoices/${transaction.id}.pdf`,
    generatedAt: new Date().toISOString()
  };

  transaction.invoice = invoice;
  return invoice;
}

async function sendValidationNotification(transaction: any, invoice: any) {
  try {
    // Email de confirmation au client
    if (transaction.clientInfo.email) {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_validated',
          transaction,
          invoice
        })
      });
    }

    // SMS de confirmation (optionnel)
    if (transaction.clientInfo.phone) {
      await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_validated',
          transaction
        })
      });
    }
  } catch (error) {
    console.error('Erreur notification validation:', error);
  }
}

async function triggerPostValidationActions(transaction: any) {
  try {
    // Webhook vers le site principal pour débloquer le service
    if (transaction.productInfo?.webhookUrl) {
      await fetch(transaction.productInfo.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment_validated',
          transactionId: transaction.id,
          clientInfo: transaction.clientInfo,
          productInfo: transaction.productInfo
        })
      });
    }

    // Autres actions automatiques (mise à jour de base de données, etc.)
    console.log(`Actions post-validation déclenchées pour ${transaction.id}`);
  } catch (error) {
    console.error('Erreur actions post-validation:', error);
  }
}