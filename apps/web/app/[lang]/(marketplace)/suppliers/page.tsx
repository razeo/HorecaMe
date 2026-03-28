import Link from 'next/link';
import { SupplierCard } from '@horecame/ui/marketplace';
import { createClient } from '@/lib/supabase/server';

interface SuppliersPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SuppliersPage({ params }: SuppliersPageProps) {
  const { lang } = await params;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from('companies')
    .select('*')
    .in('company_type', ['supplier', 'both'])
    .order('is_verified', { ascending: false })
    .order('name');

  // Get product counts per supplier
  const productCounts: Record<string, number> = {};
  if (suppliers) {
    for (const supplier of suppliers) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', supplier.id)
        .eq('is_active', true);
      productCounts[supplier.id] = count ?? 0;
    }
  }

  const title = l === 'me' ? 'Dobavljači' : 'Suppliers';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{title}</h1>

      {suppliers && suppliers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              lang={l}
              productCount={productCounts[supplier.id]}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 py-20">
          {l === 'me' ? 'Nema dobavljača' : 'No suppliers found'}
        </p>
      )}
    </div>
  );
}
