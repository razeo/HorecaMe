import Link from 'next/link';
import { CategoryCard } from '@horecame/ui/marketplace';
import { createClient } from '@/lib/supabase/server';

interface CategoriesPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = await params;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*, category_translations!inner(name, description)')
    .eq('is_active', true)
    .eq('category_translations.lang', l)
    .is('parent_id', null)
    .order('sort_order');

  const title = l === 'me' ? 'Kategorije' : 'Categories';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{title}</h1>

      {categories && categories.length > 0 ? (
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
      ) : (
        <p className="text-center text-slate-400 py-20">
          {l === 'me' ? 'Nema kategorija' : 'No categories found'}
        </p>
      )}
    </div>
  );
}
