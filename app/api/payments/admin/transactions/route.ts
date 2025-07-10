// Tell Next.js this route must be dynamic
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Référence à la base de données en mémoire
declare global {
  var transactions: Map<string, any>;
}

if (!global.transactions) {
  global.transactions = new Map();
}

const transactions = global.transactions;

// Middleware simple d'authentification admin (en production, utiliser JWT)
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  // En production, vérifier un token JWT valide
  return authHeader === 'Bearer admin-token-123';
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let allTransactions = Array.from(transactions.values());

    // Filtres
    if (status) {
      allTransactions = allTransactions.filter(tx => tx.status === status);
    }

    if (paymentMethod) {
      allTransactions = allTransactions.filter(tx => tx.paymentMethod === paymentMethod);
    }

    // Tri par date de création (plus récent en premier)
    allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Statistiques
    const stats = {
      total: allTransactions.length,
      pending: allTransactions.filter(tx => tx.status === 'PENDING').length,
      processing: allTransactions.filter(tx => tx.status === 'PROCESSING').length,
      completed: allTransactions.filter(tx => tx.status === 'COMPLETED').length,
      cancelled: allTransactions.filter(tx => tx.status === 'CANCELLED').length,
      totalAmount: allTransactions
        .filter(tx => tx.status === 'COMPLETED')
        .reduce((sum, tx) => sum + tx.totalAmount, 0)
    };

    return NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: allTransactions.length,
        pages: Math.ceil(allTransactions.length / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Erreur récupération transactions admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}