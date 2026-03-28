'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BasketItem, BasketSummary } from '@horecame/ui/inquiry';
import { Button, Card, CardContent } from '@horecame/ui/primitives';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface BasketPageProps {
  params: Promise<{ lang: string }>;
}

export default function BasketPage({ params }: BasketPageProps) {
  const { lang } = React.use(params);
  const l = lang as 'me' | 'en';
  const router = useRouter();
  const [basket, setBasket] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    loadBasket();
  }, []);

  async function loadBasket() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/${l}/auth/sign-in`);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('inquiry_baskets')
      .select(`
        *,
        inquiry_items(
          *,
          products(id, slug, base_price, currency, moq, unit, images,
            product_translations!inner(name),
            companies(id, name, slug)
          ),
          product_variants(id, variant_name, price)
        )
      `)
      .eq('buyer_id', profile.company_id)
      .eq('status', 'draft')
      .single();

    setBasket(data);
    setLoading(false);
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    const supabase = createClient();
    await supabase.from('inquiry_items').update({ quantity }).eq('id', itemId);
    await loadBasket();
  }

  async function handleRemoveItem(itemId: string) {
    const supabase = createClient();
    await supabase.from('inquiry_items').delete().eq('id', itemId);
    await loadBasket();
  }

  async function handleSubmit() {
    if (!basket) return;
    setSubmitting(true);

    const supabase = createClient();

    // Group items by supplier
    const itemsBySupplier: Record<string, any[]> = {};
    for (const item of basket.inquiry_items) {
      const supplierId = item.supplier_id;
      if (!itemsBySupplier[supplierId]) itemsBySupplier[supplierId] = [];
      itemsBySupplier[supplierId].push(item);
    }

    // Create RFQs per supplier
    for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
      const { data: rfq } = await supabase
        .from('supplier_rfqs')
        .insert({
          basket_id: basket.id,
          supplier_id: supplierId,
          buyer_id: basket.buyer_id,
          status: 'pending',
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (rfq) {
        await supabase.from('rfq_items').insert(
          items.map((item) => ({
            rfq_id: rfq.id,
            inquiry_item_id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            requested_qty: item.quantity,
            status: 'pending',
          }))
        );
      }
    }

    // Update basket status
    await supabase
      .from('inquiry_baskets')
      .update({ status: 'submitted' })
      .eq('id', basket.id);

    setSubmitting(false);
    router.push(`/${l}/inquiries`);
    router.refresh();
  }

  const dict = {
    me: { title: 'Korpa', empty: 'Vaša korpa je prazna', browse: 'Pregledaj proizvode' },
    en: { title: 'Basket', empty: 'Your basket is empty', browse: 'Browse Products' },
  };
  const t = dict[l];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-slate-400">{l === 'me' ? 'Učitavanje...' : 'Loading...'}</p>
      </div>
    );
  }

  const items = basket?.inquiry_items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-600" />
        <h1 className="mb-2 text-2xl font-bold text-white">{t.title}</h1>
        <p className="mb-6 text-slate-400">{t.empty}</p>
        <Link href={`/${l}/products`}>
          <Button>{t.browse}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${l}/products`}>
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {l === 'me' ? 'Nastavi kupovinu' : 'Continue Shopping'}
        </Button>
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-white">{t.title}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => (
            <BasketItem
              key={item.id}
              item={item}
              lang={l}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
        <div>
          <BasketSummary
            items={items}
            lang={l}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
