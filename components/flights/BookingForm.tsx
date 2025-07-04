"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Plane,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface BookingFormProps {
  flight: any;
  onSubmit: (data: any) => void;
}

export function BookingForm({ flight, onSubmit }: BookingFormProps) {
  const { bookFlight, loading } = useFlightSearch();
  const [passengers, setPassengers] = useState([
    {
      type: 'adult',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const [preferences, setPreferences] = useState({
    seatPreference: '',
    mealPreference: '',
    specialRequests: '',
    newsletter: false,
    terms: false,
  });

  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const addPassenger = () => {
    setPassengers([...passengers, {
      type: 'adult',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
    }]);
  };

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preferences.terms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }

    setBookingStatus('processing');

    try {
      const bookingRequest = {
        flightId: flight.id,
        passengers: passengers.map(p => ({
          type: p.type as 'adult' | 'child' | 'infant',
          title: p.title,
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dateOfBirth,
          passportNumber: p.passportNumber,
          passportExpiry: p.passportExpiry,
          nationality: p.nationality,
        })),
        contactInfo: {
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.country}`,
        },
        paymentMethod: 'pending', // Sera défini à l'étape suivante
        additionalServices: [],
      };

      const confirmation = await bookFlight(bookingRequest);
      
      setBookingResult(confirmation);
      setBookingStatus('success');

      // Passer les données à l'étape suivante
      const bookingData = {
        flight,
        passengers,
        contactInfo,
        preferences,
        bookingDate: new Date().toISOString(),
        bookingReference: confirmation.bookingReference,
        pnr: confirmation.pnr,
        eTicketNumber: confirmation.eTicketNumber,
        airlineConfirmation: confirmation.airlineConfirmation,
        airlineWebsite: confirmation.airlineWebsite,
        checkInUrl: confirmation.checkInUrl,
      };

      onSubmit(bookingData);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setBookingStatus('error');
    }
  };

  if (bookingStatus === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Pré-réservation confirmée !
          </h3>
          <p className="text-green-700 mb-4">
            Votre vol a été pré-réservé avec succès. Procédez au paiement pour finaliser.
          </p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Numéro de pré-réservation</p>
            <p className="text-lg font-bold text-gray-900">{bookingResult?.pnr}</p>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cette pré-réservation est valable 24 heures. Finalisez votre paiement rapidement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Flight Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>Résumé du vol</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Départ</p>
              <p className="font-semibold">{flight?.departure}</p>
              <p className="text-sm">{flight?.departureTime} - {flight?.departureDate}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Compagnie</p>
              <p className="font-semibold">{flight?.airline}</p>
              <p className="text-sm">{flight?.flightNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Arrivée</p>
              <p className="font-semibold">{flight?.destination}</p>
              <p className="text-sm">{flight?.arrivalTime} - {flight?.arrivalDate}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <Badge variant="outline">{flight?.class}</Badge>
            <div className="text-right">
              <p className="text-sm text-gray-500">Prix avec marge incluse</p>
              <p className="text-xl font-bold text-yellow-600">{flight?.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations des passagers</span>
            </CardTitle>
            <Button type="button" variant="outline" onClick={addPassenger}>
              Ajouter un passager
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Passager {index + 1}</h4>
                <Badge variant="secondary">{passenger.type}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Civilité</Label>
                  <Select
                    value={passenger.title}
                    onValueChange={(value) => updatePassenger(index, 'title', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">M.</SelectItem>
                      <SelectItem value="mrs">Mme</SelectItem>
                      <SelectItem value="miss">Mlle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    placeholder="Prénom"
                    required
                  />
                </div>

                <div>
                  <Label>Nom</Label>
                  <Input
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                    placeholder="Nom de famille"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date de naissance</Label>
                  <Input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Nationalité</Label>
                  <Select
                    value={passenger.nationality}
                    onValueChange={(value) => updatePassenger(index, 'nationality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BF">Burkina Faso</SelectItem>
                      <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                      <SelectItem value="ML">Mali</SelectItem>
                      <SelectItem value="SN">Sénégal</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Numéro de passeport</Label>
                  <Input
                    value={passenger.passportNumber}
                    onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                    placeholder="Numéro de passeport"
                    required
                  />
                </div>

                <div>
                  <Label>Date d'expiration du passeport</Label>
                  <Input
                    type="date"
                    value={passenger.passportExpiry}
                    onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Informations de contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                placeholder="+226 XX XX XX XX"
                required
              />
            </div>
          </div>

          <div>
            <Label>Adresse</Label>
            <Input
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              placeholder="Adresse complète"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ville</Label>
              <Input
                value={contactInfo.city}
                onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                placeholder="Ville"
                required
              />
            </div>

            <div>
              <Label>Pays</Label>
              <Select
                value={contactInfo.country}
                onValueChange={(value) => setContactInfo({...contactInfo, country: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BF">Burkina Faso</SelectItem>
                  <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                  <SelectItem value="ML">Mali</SelectItem>
                  <SelectItem value="SN">Sénégal</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Préférence de siège</Label>
              <Select
                value={preferences.seatPreference}
                onValueChange={(value) => setPreferences({...preferences, seatPreference: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="window">Hublot</SelectItem>
                  <SelectItem value="aisle">Couloir</SelectItem>
                  <SelectItem value="middle">Milieu</SelectItem>
                  <SelectItem value="no-preference">Aucune préférence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Préférence de repas</Label>
              <Select
                value={preferences.mealPreference}
                onValueChange={(value) => setPreferences({...preferences, mealPreference: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vegetarian">Végétarien</SelectItem>
                  <SelectItem value="vegan">Végan</SelectItem>
                  <SelectItem value="halal">Halal</SelectItem>
                  <SelectItem value="kosher">Casher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Demandes spéciales</Label>
            <Textarea
              value={preferences.specialRequests}
              onChange={(e) => setPreferences({...preferences, specialRequests: e.target.value})}
              placeholder="Assistance mobilité, allergies, etc."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => setPreferences({...preferences, newsletter: checked as boolean})}
              />
              <Label htmlFor="newsletter" className="text-sm">
                Recevoir les offres et actualités par email
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={preferences.terms}
                onCheckedChange={(checked) => setPreferences({...preferences, terms: checked as boolean})}
                required
              />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les <a href="#" className="text-yellow-600 hover:underline">conditions générales</a> et la <a href="#" className="text-yellow-600 hover:underline">politique de confidentialité</a>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">Transparence des prix</h4>
              <p className="text-sm text-blue-700 mt-1">
                Nos prix incluent une marge de service pour vous garantir le meilleur support client et la sécurité de votre réservation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Sécurité et confidentialité</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Vos informations personnelles sont protégées par un cryptage SSL et ne seront utilisées que pour le traitement de votre réservation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Sauvegarder le brouillon
        </Button>
        <Button 
          type="submit" 
          className="gradient-gold text-white"
          disabled={loading || bookingStatus === 'processing'}
        >
          {loading || bookingStatus === 'processing' ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Traitement en cours...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Continuer vers le paiement</span>
            </div>
          )}
        </Button>
      </div>

      {bookingStatus === 'error' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Une erreur est survenue lors de la réservation. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}