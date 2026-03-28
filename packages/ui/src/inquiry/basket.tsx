'use client';

import * as React from 'react';
import { Button } from '../primitives/button';
import { Input } from '../primitives/input';
import { Badge } from '../primitives/badge';
import { Separator } from '../primitives/separator';
import { cn } from '../lib/utils';
import { Minus, Plus, Trash2, MessageSquare } from 'lucide-react';

interface BasketItemProps {
  item: {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number | null;
    notes: string | null;
    products: {
      slug: string;
      base_price: number | null;
      currency: string;
      moq: number;
      unit: string;
      images: unknown;
      product_translations: { name: string }[];
      companies: { name: string };
    };
    product_variants?: { variant_name: string; price: number } | null;
  };
  lang: 'me' | 'en';
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  className?: string;
}

export function BasketItem({ item, lang, onUpdateQuantity, onRemove, className }: BasketItemProps) {
  const productName = item.products.product_translations[0]?.name ?? 'Unknown';
  const supplierName = item.products.companies.name;
  const price = item.product_variants?.price ?? item.products.base_price ?? 0;
  const images = Array.isArray(item.products.images) ? item.products.images : [];
  const image = images.length > 0 ? (images[0] as string) : '/placeholder-product.png';

  return (
    <div className={cn('flex gap-4 rounded-lg border border-teal/10 bg-surface-raised p-4', className)}>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
        <img src={image} alt={productName} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium text-white line-clamp-1">{productName}</h4>
            <p className="text-xs text-slate-500">{supplierName}</p>
            {item.product_variants && (
              <Badge variant="outline" className="mt-1 text-xs">
                {item.product_variants.variant_name}
              </Badge>
            )}
          </div>
          <p className="shrink-0 text-sm font-semibold text-white">
            {(price * item.quantity).toFixed(2)} {item.products.currency}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity?.(item.id, Math.max(item.products.moq, item.quantity - 1))}
              disabled={item.quantity <= item.products.moq}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm text-white">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-slate-500">{item.products.unit}</span>
          </div>
          <div className="flex items-center gap-1">
            {item.notes && (
              <Badge variant="secondary" className="text-xs">
                <MessageSquare className="mr-1 h-3 w-3" />
                {lang === 'me' ? 'Napomena' : 'Note'}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-error"
              onClick={() => onRemove?.(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BasketSummaryProps {
  items: Array<{
    id: string;
    quantity: number;
    unit_price: number | null;
    products: { base_price: number | null; currency: string; moq: number };
    product_variants?: { price: number } | null;
  }>;
  lang: 'me' | 'en';
  onSubmit?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function BasketSummary({ items, lang, onSubmit, isSubmitting, className }: BasketSummaryProps) {
  const total = items.reduce((sum, item) => {
    const price = item.product_variants?.price ?? item.products.base_price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const currency = items[0]?.products.currency ?? 'EUR';
  const suppliers = new Set(
    items.map((item) => (item as any).products?.companies?.name).filter(Boolean)
  );

  return (
    <div className={cn('rounded-xl border border-teal/10 bg-surface-raised p-6', className)}>
      <h3 className="mb-4 text-lg font-semibold text-white">
        {lang === 'me' ? 'Pregled korpe' : 'Basket Summary'}
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>{lang === 'me' ? 'Stavki' : 'Items'}</span>
          <span>{items.length}</span>
        </div>
        {suppliers.size > 0 && (
          <div className="flex justify-between text-slate-400">
            <span>{lang === 'me' ? 'Dobavljača' : 'Suppliers'}</span>
            <span>{suppliers.size}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-semibold text-white">
          <span>{lang === 'me' ? 'Ukupno' : 'Total'}</span>
          <span>{total.toFixed(2)} {currency}</span>
        </div>
      </div>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={onSubmit}
        disabled={items.length === 0 || isSubmitting}
      >
        {isSubmitting
          ? (lang === 'me' ? 'Slanje...' : 'Submitting...')
          : (lang === 'me' ? 'Pošalji upit' : 'Submit Inquiry')}
      </Button>
      <p className="mt-2 text-center text-xs text-slate-500">
        {lang === 'me'
          ? 'Vaš upit će biti poslat svim dobavljačima'
          : 'Your inquiry will be sent to all suppliers'}
      </p>
    </div>
  );
}
