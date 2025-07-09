"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calculator,
  Package,
  TrendingUp,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

const logisticsNavItems = [
  {
    href: '/services/logistics',
    icon: Calculator,
    title: 'Cotation',
    description: 'Demander un devis',
  },
  {
    href: '/services/logistics/dashboard',
    icon: BarChart3,
    title: 'Dashboard',
    description: 'Gérez vos expéditions',
  },
  {
    href: '/services/logistics/tracking',
    icon: Package,
    title: 'Suivi',
    description: 'Suivez vos colis',
  },
];

export function LogisticsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg shadow-lg border-b">
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
                <p className="text-xs text-gray-600 -mt-1">Logistique</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {logisticsNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 font-medium transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}