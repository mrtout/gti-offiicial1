"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  ShoppingCart,
  User,
  Globe,
  Package,
  Plane,
  Calculator,
  Search,
  Mail,
  Bell,
  LogIn,
  UserPlus,
} from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const services = [
  {
    href: '/services/shopping',
    icon: ShoppingCart,
    title: 'Commandes Produits',
    description: 'AliExpress, Shein, Amazon...',
  },
  {
    href: '/services/flights',
    icon: Plane,
    title: 'Réservation Vols',
    description: 'Billets d\'avion au meilleur prix',
  },
  {
    href: '/services/logistics',
    icon: Calculator,
    title: 'Cotation Logistique',
    description: 'Import/Export professionnel',
  },
  {
    href: '/services/logistics/dashboard',
    icon: Calculator,
    title: 'Dashboard Logistique',
    description: 'Gérez vos expéditions',
  },
  {
    href: '/services/sourcing',
    icon: Search,
    title: 'Sourcing Produits',
    description: 'Trouvez vos fournisseurs',
  },
  {
    href: '/services/postbox',
    icon: Mail,
    title: 'Boîte Postale',
    description: 'Adresse virtuelle temporaire',
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/Groupe Tanou International Logo Blanc.jpg"
                  alt="Groupe Tanou International"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Groupe Tanou
                </h1>
                <p className="text-xs text-gray-600 -mt-1">International</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Accueil
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                <span>Services</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid gap-3">
                  {services.map((service) => (
                    <Link key={service.href} href={service.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <service.icon className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {service.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
            >
              À Propos
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    {languages.find((l) => l.code === currentLang)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                2
              </Badge>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              <Button size="sm" className="gradient-gold text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                S'inscrire
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link
                    href="/"
                    className="text-lg font-medium text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    Accueil
                  </Link>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Services</h3>
                    {services.map((service) => (
                      <Link key={service.href} href={service.href}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <service.icon className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {service.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button className="w-full gradient-gold text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                    <Button variant="outline" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      S'inscrire
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}