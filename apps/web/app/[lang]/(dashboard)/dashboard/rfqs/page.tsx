'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RFQCard } from '@horecame/ui/inquiry';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Separator } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/client';
import { Send, Check, X } from 'lucide-react';

interface SupplierRFQsPageProps {
  params: Promise<{ lang: string }>;
}

export default function SupplierRFQsPage({ params }: SupplierRFQsPageProps) {
  const { lang } = React.use(params);
  const l = lang as 'me' | 'en';
  const router = useRouter();
  const [rfqs, setRfqs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRfq, setSelectedRfq] = React.useState<any>(null);
  const [responses, setResponses] = React.useState<Record<string, { price: string; qty: string; leadTime: string; status: string; notes: string }>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    loadRFQs();
  }, []);

  async function loadRFQs() {
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
      .from('supplier_rfqs')
      .select(`
        *,
        inquiry_baskets(id, notes, created_at),
        companies!supplier_rfqs_buyer_id_fkey(id, name, slug),
        rfq_items(
          *,
          products(id, slug, base_price, currency, unit,
            product_translations!inner(name)
          ),
          product_variants(id, variant_name, price)
        )
      `)
      .eq('supplier_id', profile.company_id)
      .order('created_at', { ascending: false });

    setRfqs(data ?? []);
    setLoading(false);
  }

  function openResponse(rfq: any) {
    setSelectedRfq(rfq);
    const initial: Record<string, any> = {};
    for (const item of rfq.rfq_items) {
      initial[item.id] = {
        price: item.products.base_price?.toString() ?? '',
        qty: item.requested_qty.toString(),
        leadTime: '3',
        status: 'quoted',
        notes: '',
      };
    }
    setResponses(initial);
  }

  async function submitResponse() {
    if (!selectedRfq) return;
    setSubmitting(true);

    const supabase = createClient();
    const items = Object.entries(responses).map(([id, r]) => ({
      rfq_item_id: id,
      quoted_price: parseFloat(r.price),
      quoted_qty: parseFloat(r.qty),
      lead_time_days: parseInt(r.leadTime),
      status: r.status as 'quoted' | 'rejected' | 'partial',
      supplier_notes: r.notes || undefined,
    }));

    // Update items
    for (const item of items) {
      await supabase
        .from('rfq_items')
        .update({
          quoted_price: item.quoted_price,
          quoted_qty: item.quoted_qty,
          lead_time_days: item.lead_time_days,
          status: item.status,
          supplier_notes: item.supplier_notes,
        })
        .eq('id', item.rfq_item_id);
    }

    // Update RFQ
    await supabase
      .from('supplier_rfqs')
      .update({
        status: 'quoted',
        responded_at: new Date().toISOString(),
        total_amount: items.filter(i => i.status === 'quoted').reduce((sum, i) => sum + i.quoted_price * i.quoted_qty, 0),
      })
      .eq('id', selectedRfq.id);

    setSubmitting(false);
    setSelectedRfq(null);
    await loadRFQs();
  }

  const dict = {
    me: { title: 'Zahtjevi za ponudu', empty: 'Nema novih zahtjeva', respond: 'Odgovori', submit: 'Pošalji ponudu', cancel: 'Otkaži' },
    en: { title: 'RFQs', empty: 'No new requests', respond: 'Respond', submit: 'Submit Quote', cancel: 'Cancel' },
  };
  const t = dict[l];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-slate-400">{l === 'me' ? 'Učitavanje...' : 'Loading...'}</p>
      </div>
    );
  }

  const pendingRfqs = rfqs.filter(r => r.status === 'pending');
  const respondedRfqs = rfqs.filter(r => r.status !== 'pending');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{t.title}</h1>

      {/* Response Dialog */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {l === 'me' ? 'Odgovor na zahtjev' : 'Respond to RFQ'}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {selectedRfq.companies?.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRfq.rfq_items?.map((item: any) => (
                <div key={item.id} className="rounded-lg border border-teal/10 bg-surface p-4">
                  <p className="mb-2 font-medium text-white">
                    {item.products.product_translations[0]?.name}
                  </p>
                  <p className="mb-3 text-xs text-slate-500">
                    {l === 'me' ? 'Tražena količina' : 'Requested qty'}: {item.requested_qty}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">
                        {l === 'me' ? 'Cijena (EUR)' : 'Price (EUR)'}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={responses[item.id]?.price ?? ''}
                        onChange={(e) => setResponses(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], price: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">
                        {l === 'me' ? 'Količina' : 'Quantity'}
                      </label>
                      <Input
                        type="number"
                        value={responses[item.id]?.qty ?? ''}
                        onChange={(e) => setResponses(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], qty: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">
                        {l === 'me' ? 'Rok (dana)' : 'Lead (days)'}
                      </label>
                      <Input
                        type="number"
                        value={responses[item.id]?.leadTime ?? ''}
                        onChange={(e) => setResponses(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], leadTime: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant={responses[item.id]?.status === 'quoted' ? 'default' : 'outline'}
                      onClick={() => setResponses(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], status: 'quoted' }
                      }))}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      {l === 'me' ? 'Ponudi' : 'Quote'}
                    </Button>
                    <Button
                      size="sm"
                      variant={responses[item.id]?.status === 'rejected' ? 'destructive' : 'outline'}
                      onClick={() => setResponses(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], status: 'rejected' }
                      }))}
                    >
                      <X className="mr-1 h-3 w-3" />
                      {l === 'me' ? 'Odbij' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedRfq(null)}>
                  {t.cancel}
                </Button>
                <Button onClick={submitResponse} disabled={submitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? (l === 'me' ? 'Slanje...' : 'Sending...') : t.submit}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending RFQs */}
      {pendingRfqs.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {l === 'me' ? 'Na čekanju' : 'Pending'}
            <Badge variant="warning" className="ml-2">{pendingRfqs.length}</Badge>
          </h2>
          <div className="space-y-4">
            {pendingRfqs.map((rfq) => (
              <RFQCard
                key={rfq.id}
                rfq={rfq}
                lang={l}
                isSupplier={true}
                onRespond={() => openResponse(rfq)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Responded RFQs */}
      {respondedRfqs.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {l === 'me' ? 'Odgovoreno' : 'Responded'}
          </h2>
          <div className="space-y-4">
            {respondedRfqs.map((rfq) => (
              <RFQCard
                key={rfq.id}
                rfq={rfq}
                lang={l}
                isSupplier={true}
              />
            ))}
          </div>
        </div>
      )}

      {rfqs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400">{t.empty}</p>
        </div>
      )}
    </div>
  );
}
