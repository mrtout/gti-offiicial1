"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calculator,
  Ship,
  Plane,
  Truck,
  MapPin,
  Package,
  Calendar as CalendarIcon,
  Shield,
  Clock,
  Star,
  Download,
  FileText,
  Users,
  Globe,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Info,
  Upload,
  Zap,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';

// Types
interface QuotationForm {
  origin: {
    country: string;
    city: string;
    port: string;
  };
  destination: {
    country: string;
    city: string;
    port: string;
  };
  cargo: {
    type: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    packages: number;
    value: number;
    description: string;
  };
  transport: {
    mode: 'sea' | 'air' | 'road' | 'multimodal';
    incoterm: string;
    shipmentDate: Date | null;
    insurance: boolean;
    urgency: 'standard' | 'express' | 'urgent';
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
    clientType: 'individual' | 'sme' | 'enterprise';
  };
}

interface QuotationResult {
  id: string;
  provider: string;
  mode: string;
  price: number;
  currency: string;
  transitTime: string;
  rating: number;
  services: string[];
  breakdown: {
    transport: number;
    customs: number;
    handling: number;
    insurance: number;
    documentation: number;
  };
}

// Mock data
const countries = [
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪' },
];

const cargoTypes = [
  { value: 'general', label: 'Marchandise générale' },
  { value: 'electronics', label: 'Électronique' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'food', label: 'Produits alimentaires' },
  { value: 'machinery', label: 'Machines et équipements' },
  { value: 'chemicals', label: 'Produits chimiques' },
  { value: 'dangerous', label: 'Marchandises dangereuses' },
  { value: 'fragile', label: 'Produits fragiles' },
];

const incoterms = [
  { value: 'EXW', label: 'EXW - Ex Works', description: 'Vendeur met à disposition dans ses locaux' },
  { value: 'FOB', label: 'FOB - Free On Board', description: 'Vendeur livre à bord du navire' },
  { value: 'CIF', label: 'CIF - Cost Insurance Freight', description: 'Vendeur paie transport et assurance' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid', description: 'Vendeur livre dédouané chez acheteur' },
];

const mockQuotations: QuotationResult[] = [
  {
    id: '1',
    provider: 'Maersk Line',
    mode: 'Maritime',
    price: 1250000,
    currency: 'XOF',
    transitTime: '25-30 jours',
    rating: 4.8,
    services: ['Suivi GPS', 'Assurance incluse', 'Dédouanement'],
    breakdown: {
      transport: 850000,
      customs: 200000,
      handling: 100000,
      insurance: 50000,
      documentation: 50000,
    },
  },
  {
    id: '2',
    provider: 'DHL Global',
    mode: 'Aérien',
    price: 2850000,
    currency: 'XOF',
    transitTime: '3-5 jours',
    rating: 4.9,
    services: ['Express', 'Suivi temps réel', 'Livraison porte-à-porte'],
    breakdown: {
      transport: 2200000,
      customs: 300000,
      handling: 200000,
      insurance: 75000,
      documentation: 75000,
    },
  },
  {
    id: '3',
    provider: 'GEFCO',
    mode: 'Routier',
    price: 1850000,
    currency: 'XOF',
    transitTime: '12-15 jours',
    rating: 4.6,
    services: ['Groupage', 'Livraison flexible', 'Suivi étapes'],
    breakdown: {
      transport: 1350000,
      customs: 250000,
      handling: 150000,
      insurance: 50000,
      documentation: 50000,
    },
  },
];

const stats = [
  { icon: Calculator, value: '50,000+', label: 'Devis générés' },
  { icon: Globe, value: '45+', label: 'Pays desservis' },
  { icon: Users, value: '200+', label: 'Partenaires logistiques' },
  { icon: Star, value: '4.9/5', label: 'Satisfaction client' },
];

const testimonials = [
  {
    name: 'Amadou Sankara',
    company: 'Import BF',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Service exceptionnel ! J\'ai économisé 30% sur mes frais de transport grâce à leur comparateur.',
  },
  {
    name: 'Fatima Traoré',
    company: 'Textile Plus',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    comment: 'Interface très intuitive. J\'obtiens mes devis en quelques minutes au lieu de plusieurs jours.',
  },
];

export default function LogisticsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuotationForm>({
    origin: { country: '', city: '', port: '' },
    destination: { country: '', city: '', port: '' },
    cargo: {
      type: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      packages: 1,
      value: 0,
      description: '',
    },
    transport: {
      mode: 'sea',
      incoterm: '',
      shipmentDate: null,
      insurance: false,
      urgency: 'standard',
    },
    contact: {
      name: '',
      email: '',
      phone: '',
      company: '',
      clientType: 'individual',
    },
  });
  const [quotations, setQuotations] = useState<QuotationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Calculateur CBM
  const calculateCBM = () => {
    const { length, width, height } = formData.cargo.dimensions;
    return (length * width * height) / 1000000; // m³
  };

  const calculateVolumetricWeight = () => {
    const cbm = calculateCBM();
    return formData.transport.mode === 'air' ? cbm * 167 : cbm * 1000; // kg
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setQuotations(mockQuotations);
      setShowResults(true);
      setLoading(false);
    }, 2000);
  };

  const updateFormData = (section: keyof QuotationForm, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const renderHeroSection = () => (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400/20 rounded-full animate-float delay-1000" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/5 rounded-full animate-float delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2 bg-white/10 text-white border-white/20">
            <Zap className="w-4 h-4 mr-2" />
            Cotation instantanée
          </Badge>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Obtenez votre devis logistique
              <span className="block text-orange-400">en 3 clics</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Comparez instantanément les meilleures offres de transport international. 
              Maritime, aérien, routier - trouvez la solution optimale pour vos expéditions.
            </p>
          </div>

          {/* Transport modes with animations */}
          <div className="flex justify-center space-x-8 my-12">
            {[
              { icon: Ship, label: 'Maritime', color: 'text-blue-300' },
              { icon: Plane, label: 'Aérien', color: 'text-orange-300' },
              { icon: Truck, label: 'Routier', color: 'text-green-300' },
            ].map((mode, index) => (
              <div key={mode.label} className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <mode.icon className={`w-8 h-8 ${mode.color}`} />
                </div>
                <p className="text-sm font-medium">{mode.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full"
              onClick={() => setCurrentStep(1)}
            >
              Demander un devis gratuit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full"
            >
              Voir nos tarifs
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <stat.icon className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderQuotationForm = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Formulaire de cotation intelligent
            </h2>
            <p className="text-gray-600">
              Remplissez les informations étape par étape pour obtenir votre devis personnalisé
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Étape {currentStep} sur {totalSteps}</CardTitle>
                <Badge variant="outline">{Math.round(progress)}% complété</Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>

            <CardContent className="p-8">
              {currentStep === 1 && renderOriginDestinationStep()}
              {currentStep === 2 && renderCargoDetailsStep()}
              {currentStep === 3 && renderTransportOptionsStep()}
              {currentStep === 4 && renderContactStep()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Calcul en cours...</span>
                      </div>
                    ) : (
                      <>
                        Obtenir mes devis
                        <Calculator className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const renderOriginDestinationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Origine & Destination</h3>
        <p className="text-gray-600">D'où à où souhaitez-vous expédier ?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Origin */}
        <div className="space-y-4">
          <h4 className="font-semibold text-green-600 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Origine
          </h4>
          
          <div>
            <Label>Pays d'origine</Label>
            <Select
              value={formData.origin.country}
              onValueChange={(value) => updateFormData('origin', { country: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ville/Port d'origine</Label>
            <Input
              placeholder="Ex: Ouagadougou, Port de Tema..."
              value={formData.origin.city}
              onChange={(e) => updateFormData('origin', { city: e.target.value })}
            />
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-4">
          <h4 className="font-semibold text-red-600 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Destination
          </h4>
          
          <div>
            <Label>Pays de destination</Label>
            <Select
              value={formData.destination.country}
              onValueChange={(value) => updateFormData('destination', { country: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ville/Port de destination</Label>
            <Input
              placeholder="Ex: Guangzhou, Port de Shanghai..."
              value={formData.destination.city}
              onChange={(e) => updateFormData('destination', { city: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Astuce : Plus vous êtes précis sur les lieux, plus vos devis seront exacts.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderCargoDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Détails de la marchandise</h3>
        <p className="text-gray-600">Décrivez votre cargaison pour un calcul précis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Type de marchandise</Label>
          <Select
            value={formData.cargo.type}
            onValueChange={(value) => updateFormData('cargo', { type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {cargoTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Poids total (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 1000"
            value={formData.cargo.weight || ''}
            onChange={(e) => updateFormData('cargo', { weight: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Dimensions (cm)</Label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-500">Longueur</Label>
            <Input
              type="number"
              placeholder="L"
              value={formData.cargo.dimensions.length || ''}
              onChange={(e) => updateFormData('cargo', { 
                dimensions: { ...formData.cargo.dimensions, length: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Largeur</Label>
            <Input
              type="number"
              placeholder="l"
              value={formData.cargo.dimensions.width || ''}
              onChange={(e) => updateFormData('cargo', { 
                dimensions: { ...formData.cargo.dimensions, width: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Hauteur</Label>
            <Input
              type="number"
              placeholder="h"
              value={formData.cargo.dimensions.height || ''}
              onChange={(e) => updateFormData('cargo', { 
                dimensions: { ...formData.cargo.dimensions, height: Number(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>

      {/* Calculateur CBM */}
      {formData.cargo.dimensions.length > 0 && formData.cargo.dimensions.width > 0 && formData.cargo.dimensions.height > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Calculs automatiques</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Volume (CBM):</span>
                <span className="font-bold ml-2">{calculateCBM().toFixed(3)} m³</span>
              </div>
              <div>
                <span className="text-gray-600">Poids volumétrique:</span>
                <span className="font-bold ml-2">{calculateVolumetricWeight().toFixed(0)} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Nombre de colis/palettes</Label>
          <Input
            type="number"
            placeholder="Ex: 5"
            value={formData.cargo.packages || ''}
            onChange={(e) => updateFormData('cargo', { packages: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label>Valeur de la marchandise (XOF)</Label>
          <Input
            type="number"
            placeholder="Ex: 5000000"
            value={formData.cargo.value || ''}
            onChange={(e) => updateFormData('cargo', { value: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>Description détaillée</Label>
        <Input
          placeholder="Décrivez brièvement votre marchandise..."
          value={formData.cargo.description}
          onChange={(e) => updateFormData('cargo', { description: e.target.value })}
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Cliquez pour ajouter des photos (optionnel)</p>
        <p className="text-sm text-gray-500">PNG, JPG jusqu'à 10MB</p>
      </div>
    </div>
  );

  const renderTransportOptionsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Options de transport</h3>
        <p className="text-gray-600">Choisissez votre mode de transport et vos préférences</p>
      </div>

      <div>
        <Label className="text-base font-semibold mb-4 block">Mode de transport</Label>
        <RadioGroup
          value={formData.transport.mode}
          onValueChange={(value: any) => updateFormData('transport', { mode: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { value: 'sea', icon: Ship, label: 'Maritime', desc: 'Économique, 20-35 jours', color: 'blue' },
            { value: 'air', icon: Plane, label: 'Aérien', desc: 'Rapide, 3-7 jours', color: 'orange' },
            { value: 'road', icon: Truck, label: 'Routier', desc: 'Flexible, 10-20 jours', color: 'green' },
          ].map((mode) => (
            <div key={mode.value} className="relative">
              <RadioGroupItem value={mode.value} id={mode.value} className="sr-only" />
              <Label
                htmlFor={mode.value}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.transport.mode === mode.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <mode.icon className={`w-8 h-8 mx-auto mb-2 ${
                    formData.transport.mode === mode.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <h4 className="font-semibold">{mode.label}</h4>
                  <p className="text-sm text-gray-600">{mode.desc}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>Incoterm</Label>
        <TooltipProvider>
          <Select
            value={formData.transport.incoterm}
            onValueChange={(value) => updateFormData('transport', { incoterm: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un incoterm" />
            </SelectTrigger>
            <SelectContent>
              {incoterms.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  <div className="flex items-center">
                    <span>{term.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{term.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TooltipProvider>
      </div>

      <div>
        <Label>Date d'expédition souhaitée</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.transport.shipmentDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.transport.shipmentDate ? (
                format(formData.transport.shipmentDate, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.transport.shipmentDate || undefined}
              onSelect={(date) => updateFormData('transport', { shipmentDate: date })}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="insurance"
            checked={formData.transport.insurance}
            onCheckedChange={(checked) => updateFormData('transport', { insurance: checked })}
          />
          <Label htmlFor="insurance" className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-600" />
            Assurance transport (recommandée)
          </Label>
        </div>

        <div>
          <Label>Urgence</Label>
          <RadioGroup
            value={formData.transport.urgency}
            onValueChange={(value) => updateFormData('transport', { urgency: value })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express">Express (+20%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent">Urgent (+50%)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Informations de contact</h3>
        <p className="text-gray-600">Dernière étape pour recevoir vos devis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Nom complet *</Label>
          <Input
            placeholder="Votre nom complet"
            value={formData.contact.name}
            onChange={(e) => updateFormData('contact', { name: e.target.value })}
          />
        </div>

        <div>
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="votre@email.com"
            value={formData.contact.email}
            onChange={(e) => updateFormData('contact', { email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Téléphone *</Label>
          <Input
            type="tel"
            placeholder="+226 XX XX XX XX"
            value={formData.contact.phone}
            onChange={(e) => updateFormData('contact', { phone: e.target.value })}
          />
        </div>

        <div>
          <Label>Entreprise</Label>
          <Input
            placeholder="Nom de votre entreprise (optionnel)"
            value={formData.contact.company}
            onChange={(e) => updateFormData('contact', { company: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Type de client</Label>
        <RadioGroup
          value={formData.contact.clientType}
          onValueChange={(value: any) => updateFormData('contact', { clientType: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { value: 'individual', label: 'Particulier', desc: 'Envois occasionnels' },
            { value: 'sme', label: 'PME', desc: 'Petite/moyenne entreprise' },
            { value: 'enterprise', label: 'Grande entreprise', desc: 'Volumes importants' },
          ].map((type) => (
            <div key={type.value} className="relative">
              <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
              <Label
                htmlFor={type.value}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.contact.clientType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Vos informations sont sécurisées et ne seront utilisées que pour vous envoyer vos devis personnalisés.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderQuotationResults = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vos devis sont prêts !
            </h2>
            <p className="text-gray-600">
              Nous avons trouvé {quotations.length} offres correspondant à vos critères
            </p>
          </div>

          <div className="space-y-6">
            {quotations.map((quote, index) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Provider Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{quote.provider}</h3>
                          <p className="text-sm text-gray-600">{quote.mode}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(quote.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{quote.rating}</span>
                      </div>
                    </div>

                    {/* Price & Transit */}
                    <div className="lg:col-span-1 text-center lg:text-left">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {quote.price.toLocaleString()} {quote.currency}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{quote.transitTime}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold mb-2">Services inclus</h4>
                      <div className="space-y-1">
                        {quote.services.map((service, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 flex flex-col space-y-2">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Sélectionner cette offre
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transport:</span>
                      <span className="font-medium ml-1">{quote.breakdown.transport.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Douane:</span>
                      <span className="font-medium ml-1">{quote.breakdown.customs.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Manutention:</span>
                      <span className="font-medium ml-1">{quote.breakdown.handling.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Assurance:</span>
                      <span className="font-medium ml-1">{quote.breakdown.insurance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Documentation:</span>
                      <span className="font-medium ml-1">{quote.breakdown.documentation.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Nouvelle cotation
            </Button>
            <Button
              onClick={() => window.location.href = '/services/logistics/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accéder au Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plus de 5000 entreprises nous font confiance pour leurs expéditions internationales
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/services/logistics/dashboard'}
              className="mr-4"
            >
              Dashboard Logistique
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/services/logistics/tracking'}
            >
              Suivi de Colis
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {renderQuotationResults()}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderHeroSection()}
      {renderQuotationForm()}
      {renderTestimonials()}
      <Footer />
    </div>
  );
}