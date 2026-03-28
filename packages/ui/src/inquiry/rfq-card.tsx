'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card';
import { Badge } from '../primitives/badge';
import { Button } from '../primitives/button';
import { Input } from '../primitives/input';
import { Separator } from '../primitives/separator';
import { cn } from '../lib/utils';
import { Clock, Check, X, Eye, Send } from 'lucide-react';

type RFQStatus = 'pending' | 'viewed' | 'quoted' | 'accepted' | 'rejected' | 'expired';

const statusConfig: Record<RFQStatus, { label: { me: string; en: string }; variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: { me: 'Na čekanju', en: 'Pending' }, variant: 'secondary', icon: Clock },
  viewed: { label: { me: 'Pregledano', en: 'Viewed' }, variant: 'default', icon: Eye },
  quoted: { label: { me: 'Ponuđeno', en: 'Quoted' }, variant: 'success', icon: Send },
  accepted: { label: { me: 'Prihvaćeno', en: 'Accepted' }, variant: 'success', icon: Check },
  rejected: { label: { me: 'Odbijeno', en: 'Rejected' }, variant: 'error', icon: X },
  expired: { label: { me: 'Isteklo', en: 'Expired' }, variant: 'secondary', icon: Clock },
};

interface RFQCardProps {
  rfq: {
    id: string;
    status: RFQStatus;
    total_amount: number | null;
    valid_until: string | null;
    responded_at: string | null;
    created_at: string;
    companies?: { name: string; slug: string };
    rfq_items: Array<{
      id: string;
      requested_qty: number;
      quoted_price: number | null;
      quoted_qty: number | null;
      lead_time_days: number | null;
      status: string;
      supplier_notes: string | null;
      products: { product_translations: { name: string }[] };
    }>;
  };
  lang: 'me' | 'en';
  isSupplier?: boolean;
  onRespond?: () => void;
  className?: string;
}

export function RFQCard({ rfq, lang, isSupplier = false, onRespond, className }: RFQCardProps) {
  const config = statusConfig[rfq.status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {isSupplier
              ? (lang === 'me' ? 'Zahtjev za ponudu' : 'Request for Quote')
              : (lang === 'me' ? 'Upit' : 'Inquiry')}
          </CardTitle>
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label[lang]}
          </Badge>
        </div>
        {rfq.companies && (
          <p className="text-sm text-slate-400">
            {isSupplier
              ? `${lang === 'me' ? 'Od' : 'From'}: ${rfq.companies.name}`
              : `${lang === 'me' ? 'Za' : 'To'}: ${rfq.companies.name}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {rfq.rfq_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="text-sm text-white">
                  {item.products.product_translations[0]?.name ?? 'Unknown'}
                </p>
                <p className="text-xs text-slate-500">
                  {lang === 'me' ? 'Traženo' : 'Requested'}: {item.requested_qty}
                  {item.quoted_price !== null && (
                    <> · {lang === 'me' ? 'Ponuđeno' : 'Quoted'}: {item.quoted_price?.toFixed(2)} EUR</>
                  )}
                </p>
              </div>
              <Badge variant={item.status === 'quoted' ? 'success' : item.status === 'rejected' ? 'error' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          {rfq.total_amount !== null && (
            <p className="text-lg font-semibold text-white">
              {rfq.total_amount.toFixed(2)} EUR
            </p>
          )}
          {isSupplier && rfq.status === 'pending' && onRespond && (
            <Button onClick={onRespond}>
              {lang === 'me' ? 'Odgovori' : 'Respond'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
