'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '../primitives/card';
import { Badge } from '../primitives/badge';
import { Button } from '../primitives/button';
import { cn } from '../lib/utils';
import { ShoppingCart, Check, AlertTriangle, Clock, Package } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    base_price: number | null;
    currency: string;
    moq: number;
    unit: string;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';
    images: string[];
    translations: { name: string; description?: string | null };
    companies: { name: string; slug: string; logo_url?: string | null; is_verified: boolean };
    categories?: { slug: string } | null;
  };
  lang: 'me' | 'en';
  onAddToBasket?: (productId: string) => void;
  className?: string;
}

const stockStatusConfig = {
  in_stock: { label: { me: 'Na stanju', en: 'In Stock' }, variant: 'success' as const, icon: Check },
  low_stock: { label: { me: 'Malo na stanju', en: 'Low Stock' }, variant: 'warning' as const, icon: AlertTriangle },
  out_of_stock: { label: { me: 'Nema na stanju', en: 'Out of Stock' }, variant: 'error' as const, icon: Package },
  on_order: { label: { me: 'Po narudžbi', en: 'On Order' }, variant: 'secondary' as const, icon: Clock },
};

export function ProductCard({ product, lang, onAddToBasket, className }: ProductCardProps) {
  const image = Array.isArray(product.images) && product.images.length > 0
    ? (product.images[0] as string)
    : '/placeholder-product.png';

  const stockConfig = stockStatusConfig[product.stock_status];
  const StockIcon = stockConfig.icon;

  return (
    <Card className={cn('group overflow-hidden transition-all hover:border-teal/30 hover:shadow-teal/10', className)}>
      <Link href={`/${lang}/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-surface">
          <Image
            src={image}
            alt={product.translations.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute left-2 top-2">
            <Badge variant={stockConfig.variant} className="gap-1">
              <StockIcon className="h-3 w-3" />
              {stockConfig.label[lang]}
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-1 flex items-center gap-1">
          <span className="text-xs text-slate-500">{product.companies.name}</span>
          {product.companies.is_verified && (
            <Check className="h-3 w-3 text-sky" />
          )}
        </div>
        <Link href={`/${lang}/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-white group-hover:text-sky">
            {product.translations.name}
          </h3>
        </Link>
        <div className="flex items-end justify-between">
          <div>
            {product.base_price !== null && (
              <p className="text-lg font-semibold text-white">
                {product.base_price.toFixed(2)} {product.currency}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Min. {product.moq} {product.unit}
            </p>
          </div>
          {onAddToBasket && product.stock_status !== 'out_of_stock' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={(e) => {
                e.preventDefault();
                onAddToBasket(product.id);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
