"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Filter,
  Plane,
  Clock,
  DollarSign,
  RotateCcw,
} from 'lucide-react';

interface FilterSidebarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  flights: any[];
}

export function FilterSidebar({ filters, onFiltersChange, flights }: FilterSidebarProps) {
  const airlines = Array.from(new Set(flights.map(flight => flight.airline)));
  const maxPrice = Math.max(...flights.map(flight => parseInt(flight.price.replace(/[^\d]/g, ''))));

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [0, maxPrice],
      airlines: [],
      stops: 'all',
      departureTime: 'all',
      duration: 'all',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' XOF';
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-yellow-600 hover:text-yellow-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Prix</span>
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={maxPrice}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Airlines */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Plane className="h-4 w-4" />
            <span>Compagnies aériennes</span>
          </Label>
          <div className="space-y-2">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={airline}
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter('airlines', [...filters.airlines, airline]);
                    } else {
                      updateFilter('airlines', filters.airlines.filter((a: string) => a !== airline));
                    }
                  }}
                />
                <Label htmlFor={airline} className="text-sm font-normal">
                  {airline}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Stops */}
        <div className="space-y-3">
          <Label>Escales</Label>
          <RadioGroup
            value={filters.stops}
            onValueChange={(value) => updateFilter('stops', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-stops" />
              <Label htmlFor="all-stops" className="text-sm font-normal">
                Toutes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="text-sm font-normal">
                Vol direct
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-stop" id="1-stop" />
              <Label htmlFor="1-stop" className="text-sm font-normal">
                1 escale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2-plus" id="2-plus" />
              <Label htmlFor="2-plus" className="text-sm font-normal">
                2+ escales
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Departure Time */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Heure de départ</span>
          </Label>
          <RadioGroup
            value={filters.departureTime}
            onValueChange={(value) => updateFilter('departureTime', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-times" />
              <Label htmlFor="all-times" className="text-sm font-normal">
                Toute la journée
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning" className="text-sm font-normal">
                Matin (06:00 - 12:00)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="afternoon" />
              <Label htmlFor="afternoon" className="text-sm font-normal">
                Après-midi (12:00 - 18:00)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="evening" />
              <Label htmlFor="evening" className="text-sm font-normal">
                Soir (18:00 - 00:00)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Duration */}
        <div className="space-y-3">
          <Label>Durée du vol</Label>
          <RadioGroup
            value={filters.duration}
            onValueChange={(value) => updateFilter('duration', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-duration" />
              <Label htmlFor="all-duration" className="text-sm font-normal">
                Toutes durées
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short" className="text-sm font-normal">
                Moins de 5h
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-sm font-normal">
                5h - 10h
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="long" />
              <Label htmlFor="long" className="text-sm font-normal">
                Plus de 10h
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Active Filters */}
        {(filters.airlines.length > 0 || filters.stops !== 'all' || filters.departureTime !== 'all' || filters.duration !== 'all') && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label>Filtres actifs</Label>
              <div className="flex flex-wrap gap-1">
                {filters.airlines.map((airline: string) => (
                  <Badge key={airline} variant="secondary" className="text-xs">
                    {airline}
                  </Badge>
                ))}
                {filters.stops !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.stops === 'direct' ? 'Direct' : 
                     filters.stops === '1-stop' ? '1 escale' : '2+ escales'}
                  </Badge>
                )}
                {filters.departureTime !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.departureTime === 'morning' ? 'Matin' :
                     filters.departureTime === 'afternoon' ? 'Après-midi' : 'Soir'}
                  </Badge>
                )}
                {filters.duration !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.duration === 'short' ? '<5h' :
                     filters.duration === 'medium' ? '5-10h' : '>10h'}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}