import Link from 'next/link';
import { Button, Card, CardContent } from '@horecame/ui/primitives';
import { CategoryCard } from '@horecame/ui/marketplace';
import { createClient } from '@/lib/supabase/server';
import { Package, Truck, BarChart3, ArrowRight } from 'lucide-react';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*, category_translations!inner(name, description)')
    .eq('is_active', true)
    .eq('category_translations.lang', l)
    .is('parent_id', null)
    .order('sort_order')
    .limit(6);

  const dict = {
    me: {
      hero: {
        title: 'B2B platforma za HORECA sektor',
        subtitle: 'Centralizovana nabavka, upravljanje dobavljačima i industrijski sadržaj za Crnu Goru i region.',
        cta: 'Istražite proizvode',
        ctaSecondary: 'Registrujte kompaniju',
      },
      features: {
        title: 'Zašto HorecaMe?',
        procurement: {
          title: 'Digitalna nabavka',
          desc: 'Korpa za upite koja automatski grupiše stavke po dobavljačima i šalje RFQ za svakog.',
        },
        suppliers: {
          title: 'Provjereni dobavljači',
          desc: 'Pristup širokoj mreži provjerenih dobavljača hrane, pića, opreme i potrošnog materijala.',
        },
        analytics: {
          title: 'Industrijski sadržaj',
          desc: 'Blog i trendovi koji pomažu vašem poslovanju da raste.',
        },
      },
      categories: 'Popularne kategorije',
      viewAll: 'Pogledaj sve',
    },
    en: {
      hero: {
        title: 'B2B marketplace for HORECA',
        subtitle: 'Centralized procurement, supplier management, and industry content for Montenegro and the Adriatic.',
        cta: 'Explore Products',
        ctaSecondary: 'Register Company',
      },
      features: {
        title: 'Why HorecaMe?',
        procurement: {
          title: 'Digital Procurement',
          desc: 'Inquiry basket that automatically groups items by supplier and sends RFQs to each one.',
        },
        suppliers: {
          title: 'Verified Suppliers',
          desc: 'Access a wide network of verified food, beverage, equipment, and disposables suppliers.',
        },
        analytics: {
          title: 'Industry Content',
          desc: 'Blogs and trends that help your business grow.',
        },
      },
      categories: 'Popular Categories',
      viewAll: 'View All',
    },
  };

  const t = dict[l];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900/20 to-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mb-8 text-lg text-slate-400 sm:text-xl">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${l}/products`}>
                <Button size="lg" className="gap-2">
                  {t.hero.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${l}/auth/sign-up`}>
                <Button variant="outline" size="lg">
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-sky/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
          {t.features.title}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Package, ...t.features.procurement },
            { icon: Truck, ...t.features.suppliers },
            { icon: BarChart3, ...t.features.analytics },
          ].map((feature, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{t.categories}</h2>
            <Link href={`/${l}/categories`}>
              <Button variant="ghost" className="gap-1 text-sky">
                {t.viewAll}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={{
                  ...cat,
                  translations: cat.category_translations[0] as { name: string; description: string | null },
                }}
                lang={l}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
