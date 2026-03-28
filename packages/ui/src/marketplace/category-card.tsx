'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../primitives/card';
import { cn } from '../lib/utils';
import { UtensilsCrossed, Wine, Refrigerator, Package, Armchair, SprayCan, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Wine,
  Refrigerator,
  Package,
  Armchair,
  SprayCan,
};

interface CategoryCardProps {
  category: {
    id: string;
    slug: string;
    icon: string | null;
    image_url: string | null;
    translations: { name: string; description?: string | null };
  };
  lang: 'me' | 'en';
  className?: string;
}

export function CategoryCard({ category, lang, className }: CategoryCardProps) {
  const Icon = category.icon ? iconMap[category.icon] ?? Package : Package;

  return (
    <Link href={`/${lang}/categories/${category.slug}`}>
      <Card className={cn(
        'group flex items-center gap-4 p-4 transition-all hover:border-teal/30 hover:bg-teal/5',
        className
      )}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal group-hover:bg-teal/20">
          <Icon className="h-6 w-6" />
        </div>
        <CardContent className="p-0">
          <h3 className="font-medium text-white group-hover:text-sky">
            {category.translations.name}
          </h3>
          {category.translations.description && (
            <p className="text-sm text-slate-500 line-clamp-1">
              {category.translations.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
