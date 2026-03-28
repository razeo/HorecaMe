import Link from 'next/link';
import { ProductCard } from '@horecame/ui/marketplace';
import { Button, Input, Badge } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/server';
import { Search, SlidersHorizontal } from 'lucide-react';

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  const page = Number(sp.page) || 1;
  const categoryId = sp.category as string | undefined;
  const search = sp.q as string | undefined;
  const pageSize = 24;

  let query = supabase
    .from('products')
    .select(`
      *,
      product_translations!inner(name, description),
      companies!inner(name, slug, logo_url, is_verified),
      categories(slug),
      product_variants(id)
    `, { count: 'exact' })
    .eq('is_active', true)
    .eq('product_translations.lang', l)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (search) {
    query = query.ilike('product_translations.name', `%${search}%`);
  }

  const { data: products, count } = await query;

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*, category_translations!inner(name)')
    .eq('is_active', true)
    .eq('category_translations.lang', l)
    .is('parent_id', null)
    .order('sort_order');

  const totalPages = Math.ceil((count ?? 0) / pageSize);

  const dict = {
    me: { title: 'Proizvodi', search: 'Pretraži proizvode...', all: 'Sve', noResults: 'Nema proizvoda' },
    en: { title: 'Products', search: 'Search products...', all: 'All', noResults: 'No products found' },
  };
  const t = dict[l];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">{t.title}</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href={`/${l}/products`}>
            <Badge variant={!categoryId ? 'default' : 'outline'} className="cursor-pointer">
              {t.all}
            </Badge>
          </Link>
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/${l}/products?category=${cat.id}`}>
              <Badge variant={categoryId === cat.id ? 'default' : 'outline'} className="cursor-pointer">
                {cat.category_translations[0]?.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {products && products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                translations: product.product_translations[0] as { name: string; description: string | null },
                companies: product.companies as { name: string; slug: string; logo_url: string | null; is_verified: boolean },
                images: product.images as string[],
              }}
              lang={l}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-slate-400">{t.noResults}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/${l}/products?page=${p}${categoryId ? `&category=${categoryId}` : ''}${search ? `&q=${search}` : ''}`}
            >
              <Button variant={p === page ? 'default' : 'outline'} size="sm">
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
