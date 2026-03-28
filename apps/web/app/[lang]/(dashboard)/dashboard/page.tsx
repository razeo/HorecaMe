import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Package, ShoppingCart, FileText, BarChart3, Settings, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${l}/auth/sign-in`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect(`/${l}/auth/sign-in`);
  }

  const isSupplier = profile.companies?.company_type === 'supplier' || profile.companies?.company_type === 'both';
  const isBuyer = profile.companies?.company_type === 'buyer' || profile.companies?.company_type === 'both';

  // Fetch stats
  const [basketRes, inquiriesRes, productsRes, rfqsRes] = await Promise.all([
    isBuyer ? supabase.from('inquiry_baskets').select('*', { count: 'exact', head: true }).eq('buyer_id', profile.company_id).eq('status', 'draft') : { count: 0 },
    isBuyer ? supabase.from('inquiry_baskets').select('*', { count: 'exact', head: true }).eq('buyer_id', profile.company_id).neq('status', 'draft') : { count: 0 },
    isSupplier ? supabase.from('products').select('*', { count: 'exact', head: true }).eq('company_id', profile.company_id).eq('is_active', true) : { count: 0 },
    isSupplier ? supabase.from('supplier_rfqs').select('*', { count: 'exact', head: true }).eq('supplier_id', profile.company_id).eq('status', 'pending') : { count: 0 },
  ]);

  const dict = {
    me: {
      title: 'Kontrolna tabla',
      welcome: 'Dobrodošli',
      basket: 'Korpa',
      basketDesc: 'Stavke u korpi',
      inquiries: 'Upiti',
      inquiriesDesc: 'Poslati upiti',
      products: 'Proizvodi',
      productsDesc: 'Vaši proizvodi',
      rfqs: 'Novi RFQ',
      rfqsDesc: 'Čekaju odgovor',
      view: 'Pogledaj',
      quickActions: 'Brze akcije',
      browseProducts: 'Pregledaj proizvode',
      manageProducts: 'Upravljaj proizvodima',
      viewInquiries: 'Pregledaj upite',
      viewRFQs: 'Pregledaj RFQ',
    },
    en: {
      title: 'Dashboard',
      welcome: 'Welcome',
      basket: 'Basket',
      basketDesc: 'Items in basket',
      inquiries: 'Inquiries',
      inquiriesDesc: 'Sent inquiries',
      products: 'Products',
      productsDesc: 'Your products',
      rfqs: 'New RFQs',
      rfqsDesc: 'Awaiting response',
      view: 'View',
      quickActions: 'Quick Actions',
      browseProducts: 'Browse Products',
      manageProducts: 'Manage Products',
      viewInquiries: 'View Inquiries',
      viewRFQs: 'View RFQs',
    },
  };
  const t = dict[l];

  const stats = [
    ...(isBuyer ? [
      { icon: ShoppingCart, label: t.basket, value: basketRes.count ?? 0, desc: t.basketDesc, href: `/${l}/basket` },
      { icon: FileText, label: t.inquiries, value: inquiriesRes.count ?? 0, desc: t.inquiriesDesc, href: `/${l}/inquiries` },
    ] : []),
    ...(isSupplier ? [
      { icon: Package, label: t.products, value: productsRes.count ?? 0, desc: t.productsDesc, href: `/${l}/dashboard/products` },
      { icon: BarChart3, label: t.rfqs, value: rfqsRes.count ?? 0, desc: t.rfqsDesc, href: `/${l}/dashboard/rfqs` },
    ] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <p className="mt-1 text-slate-400">
          {t.welcome}, {profile.full_name}
          {profile.companies && (
            <span className="text-slate-500"> · {profile.companies.name}</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-all hover:border-teal/30">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="mb-4 text-xl font-semibold text-white">{t.quickActions}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/${l}/products`}>
          <Button variant="outline" className="w-full justify-between">
            {t.browseProducts}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        {isSupplier && (
          <Link href={`/${l}/dashboard/products`}>
            <Button variant="outline" className="w-full justify-between">
              {t.manageProducts}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {isBuyer && (
          <Link href={`/${l}/inquiries`}>
            <Button variant="outline" className="w-full justify-between">
              {t.viewInquiries}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {isSupplier && (
          <Link href={`/${l}/dashboard/rfqs`}>
            <Button variant="outline" className="w-full justify-between">
              {t.viewRFQs}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
