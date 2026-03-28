'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card';
import { Badge } from '../primitives/badge';
import { Separator } from '../primitives/separator';
import { cn } from '../lib/utils';
import { Package, MapPin, Phone, Mail, Check } from 'lucide-react';

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    city: string | null;
    country: string;
    phone: string | null;
    email: string | null;
    is_verified: boolean;
    company_type: string;
  };
  lang: 'me' | 'en';
  productCount?: number;
  className?: string;
}

export function SupplierCard({ supplier, lang, productCount, className }: SupplierCardProps) {
  return (
    <Card className={cn('transition-all hover:border-teal/30', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 text-lg font-bold text-teal">
              {supplier.logo_url ? (
                <img src={supplier.logo_url} alt={supplier.name} className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                supplier.name[0]?.toUpperCase()
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-1.5 text-base">
                {supplier.name}
                {supplier.is_verified && (
                  <Check className="h-4 w-4 text-sky" />
                )}
              </CardTitle>
              <Badge variant={supplier.company_type === 'both' ? 'default' : 'secondary'} className="mt-1">
                {supplier.company_type === 'supplier' ? (lang === 'me' ? 'Dobavljač' : 'Supplier') :
                 supplier.company_type === 'buyer' ? (lang === 'me' ? 'Kupac' : 'Buyer') :
                 (lang === 'me' ? 'Dobavljač i Kupac' : 'Supplier & Buyer')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {supplier.description && (
          <p className="mb-3 text-sm text-slate-400 line-clamp-2">{supplier.description}</p>
        )}
        <Separator className="mb-3" />
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {supplier.city && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {supplier.city}, {supplier.country}
            </span>
          )}
          {productCount !== undefined && (
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {productCount} {lang === 'me' ? 'proizvoda' : 'products'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
