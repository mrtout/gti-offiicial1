"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin, Plane, User, CreditCard, Share2, Printer as Print } from 'lucide-react';

interface BookingConfirmationProps {
  bookingData: any;
  flight: any;
}

export function BookingConfirmation({ bookingData, flight }: BookingConfirmationProps) {
  const handleDownloadTicket = () => {
    // Logique pour télécharger le billet
    console.log('Téléchargement du billet...');
  };

  const handleSendEmail = () => {
    // Logique pour envoyer par email
    console.log('Envoi par email...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-green-700 mb-4">
            Votre vol a été réservé avec succès. Vous recevrez un email de confirmation sous peu.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleDownloadTicket} className="gradient-gold text-white">
              <Download className="mr-2 h-4 w-4" />
              Télécharger le billet
            </Button>
            <Button variant="outline" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Print className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Référence de réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Numéro de réservation</p>
            <p className="text-3xl font-bold text-gray-900 tracking-wider">
              {bookingData?.bookingReference}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Conservez ce numéro pour vos démarches
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Flight Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>Détails du vol</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Départ</p>
              <p className="font-semibold text-lg">{flight?.departure}</p>
              <p className="text-sm">{flight?.departureTime}</p>
              <p className="text-sm text-gray-600">{flight?.departureDate}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Vol</p>
              <p className="font-semibold">{flight?.airline}</p>
              <p className="text-sm">{flight?.flightNumber}</p>
              <Badge variant="outline" className="mt-1">{flight?.class}</Badge>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Arrivée</p>
              <p className="font-semibold text-lg">{flight?.destination}</p>
              <p className="text-sm">{flight?.arrivalTime}</p>
              <p className="text-sm text-gray-600">{flight?.arrivalDate}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Durée</p>
              <p className="font-medium">{flight?.duration}</p>
            </div>
            <div>
              <p className="text-gray-500">Escales</p>
              <p className="font-medium">
                {flight?.stops === 0 ? 'Direct' : `${flight?.stops} escale(s)`}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Terminal</p>
              <p className="font-medium">{flight?.terminal || 'À confirmer'}</p>
            </div>
            <div>
              <p className="text-gray-500">Porte</p>
              <p className="font-medium">{flight?.gate || 'À confirmer'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Passagers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingData?.passengers?.map((passenger: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">Passager {index + 1}</p>
                    <p className="text-sm text-gray-500">
                      Passeport: {passenger.passportNumber}
                    </p>
                  </div>
                  <Badge variant="secondary">{passenger.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{bookingData?.contactInfo?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{bookingData?.contactInfo?.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Résumé du paiement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Prix du billet</span>
              <span>{flight?.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes et frais</span>
              <span>Inclus</span>
            </div>
            {bookingData?.additionalServices && (
              <div className="flex justify-between">
                <span>Services supplémentaires</span>
                <span>25,000 XOF</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total payé</span>
              <span className="text-green-600">{flight?.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p className="text-sm">
            • Présentez-vous à l'aéroport au moins 2 heures avant le départ pour les vols internationaux
          </p>
          <p className="text-sm">
            • Vérifiez la validité de votre passeport (minimum 6 mois)
          </p>
          <p className="text-sm">
            • Consultez les exigences de visa pour votre destination
          </p>
          <p className="text-sm">
            • En cas de modification ou d'annulation, contactez notre service client
          </p>
        </CardContent>
      </Card>

      {/* Support Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Service client</h4>
              <p className="text-sm text-gray-600 mb-1">Téléphone: +226 66 11 71 63</p>
              <p className="text-sm text-gray-600 mb-1">Email: contact@groupetanouinternational.com</p>
              <p className="text-sm text-gray-600">Disponible 24h/24, 7j/7</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Urgence voyage</h4>
              <p className="text-sm text-gray-600 mb-1">Hotline: +226 70 00 00 00</p>
              <p className="text-sm text-gray-600">Pour les urgences pendant votre voyage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
        <Button className="gradient-gold text-white">
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>
    </div>
  );
}