'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RFQCard } from '@horecame/ui/inquiry';
import { Button, Card, CardContent, Badge } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/client';
import { FileText, Clock, Check, X } from 'lucide-react';

interface InquiriesPageProps {
  params: Promise<{ lang: string }>;
}

export default function InquiriesPage({ params }: InquiriesPageProps) {
  const { lang } = React.use(params);
  const l = lang as 'me' | 'en';
  const router = useRouter();
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
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
        supplier_rfqs(
          *,
          companies!supplier_rfqs_supplier_id_fkey(id, name, slug),
          rfq_items(
            *,
            products(id, slug,
              product_translations!inner(name)
            )
          )
        )
      `)
      .eq('buyer_id', profile.company_id)
      .neq('status', 'draft')
      .order('created_at', { ascending: false });

    setInquiries(data ?? []);
    setLoading(false);
  }

  const dict = {
    me: { title: 'Upiti', empty: 'Nemate poslatih upita', browse: 'Pregledaj proizvode' },
    en: { title: 'Inquiries', empty: 'No inquiries yet', browse: 'Browse Products' },
  };
  const t = dict[l];

  const statusLabels: Record<string, { me: string; en: string }> = {
    submitted: { me: 'Poslato', en: 'Submitted' },
    partially_responded: { me: 'Djelimično odgovoreno', en: 'Partially Responded' },
    completed: { me: 'Završeno', en: 'Completed' },
    cancelled: { me: 'Otkazano', en: 'Cancelled' },
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-slate-400">{l === 'me' ? 'Učitavanje...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{t.title}</h1>

      {inquiries.length === 0 ? (
        <div className="py-20 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <p className="mb-4 text-slate-400">{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {new Date(inquiry.created_at).toLocaleDateString(l === 'me' ? 'sr-ME' : 'en-GB')}
                    </p>
                    <Badge variant={inquiry.status === 'completed' ? 'success' : inquiry.status === 'cancelled' ? 'error' : 'secondary'}>
                      {statusLabels[inquiry.status]?.[l] ?? inquiry.status}
                    </Badge>
                  </div>
                </div>

                {/* Supplier RFQs */}
                <div className="space-y-3">
                  {inquiry.supplier_rfqs?.map((rfq: any) => (
                    <RFQCard
                      key={rfq.id}
                      rfq={rfq}
                      lang={l}
                      isSupplier={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
