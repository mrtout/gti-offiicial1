"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react';

interface Transaction {
  id: string;
  status: string;
  paymentMethod: string;
  amount: number;
  totalAmount: number;
  clientInfo: any;
  createdAt: string;
  proofData?: any;
}

export default function PaymentsAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    page: 1
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      params.append('page', filters.page.toString());

      const response = await fetch(`/api/payments/admin/transactions?${params}`, {
        headers: {
          'Authorization': 'Bearer admin-token-123' // En production, utiliser un vrai token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateTransaction = async (transactionId: string, adminNote: string) => {
    try {
      const response = await fetch(`/api/payments/admin/transactions/${transactionId}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token-123'
        },
        body: JSON.stringify({ adminNote })
      });

      if (response.ok) {
        fetchTransactions();
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Erreur validation:', error);
    }
  };

  const cancelTransaction = async (transactionId: string, reason: string) => {
    try {
      const response = await fetch(`/api/payments/admin/transactions/${transactionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token-123'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchTransactions();
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'FAILED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('MONEY')) return '📱';
    if (method === 'BANK_TRANSFER') return '🏦';
    if (method === 'BTC') return '₿';
    if (method === 'USDT_TRC20') return '💰';
    return '💳';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration des Paiements</h1>
            <p className="text-gray-600">Gérez et validez les transactions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchTransactions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold">{stats.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-xl font-bold">{stats.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">En traitement</p>
                  <p className="text-xl font-bold">{stats.processing || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Complétées</p>
                  <p className="text-xl font-bold">{stats.completed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat('fr-FR').format(stats.totalAmount || 0)} XOF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="PROCESSING">En traitement</SelectItem>
                  <SelectItem value="COMPLETED">Complétées</SelectItem>
                  <SelectItem value="CANCELLED">Annulées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.paymentMethod} onValueChange={(value) => setFilters({...filters, paymentMethod: value})}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="ORANGE_MONEY_BF">Orange Money</SelectItem>
                  <SelectItem value="MOOV_MONEY_BF">Moov Money</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Virement</SelectItem>
                  <SelectItem value="BTC">Bitcoin</SelectItem>
                  <SelectItem value="USDT_TRC20">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Chargement des transactions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{transaction.id}</h4>
                          <p className="text-sm text-gray-600">
                            {transaction.clientInfo.name} • {transaction.clientInfo.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">
                            {new Intl.NumberFormat('fr-FR').format(transaction.totalAmount)} XOF
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>

                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                              <TransactionDetails
                                transaction={selectedTransaction}
                                onValidate={validateTransaction}
                                onCancel={cancelTransaction}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune transaction trouvée
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TransactionDetails({ 
  transaction, 
  onValidate, 
  onCancel 
}: { 
  transaction: Transaction;
  onValidate: (id: string, note: string) => void;
  onCancel: (id: string, reason: string) => void;
}) {
  const [adminNote, setAdminNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  return (
    <div className="space-y-6">
      {/* Transaction Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">ID Transaction</label>
          <p className="font-mono">{transaction.id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Statut</label>
          <Badge className={`ml-2 ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </Badge>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Méthode</label>
          <p>{transaction.paymentMethod.replace('_', ' ')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Montant</label>
          <p className="font-bold">
            {new Intl.NumberFormat('fr-FR').format(transaction.totalAmount)} XOF
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div>
        <h4 className="font-semibold mb-2">Informations client</h4>
        <div className="bg-gray-50 p-3 rounded">
          <p><strong>Nom:</strong> {transaction.clientInfo.name}</p>
          <p><strong>Email:</strong> {transaction.clientInfo.email}</p>
          <p><strong>Téléphone:</strong> {transaction.clientInfo.phone}</p>
        </div>
      </div>

      {/* Proof Data */}
      {transaction.proofData && (
        <div>
          <h4 className="font-semibold mb-2">Preuve de paiement</h4>
          <div className="bg-blue-50 p-3 rounded">
            {transaction.proofData.type === 'crypto' && (
              <p><strong>Hash:</strong> <code>{transaction.proofData.transactionHash}</code></p>
            )}
            {transaction.proofData.type === 'mobile_money' && (
              <>
                <p><strong>Numéro payeur:</strong> {transaction.proofData.payerNumber}</p>
                {transaction.proofData.payerName && (
                  <p><strong>Nom payeur:</strong> {transaction.proofData.payerName}</p>
                )}
              </>
            )}
            {transaction.proofData.type === 'bank_transfer' && (
              <p><strong>Reçu:</strong> <a href={transaction.proofData.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le reçu</a></p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {transaction.status === 'PROCESSING' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Note admin (optionnel)</label>
            <Input
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Note de validation..."
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => onValidate(transaction.id, adminNote)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                const reason = prompt('Raison de l\'annulation:');
                if (reason) onCancel(transaction.id, reason);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'FAILED': 'bg-red-100 text-red-800',
    'EXPIRED': 'bg-gray-100 text-gray-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}