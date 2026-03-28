import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const lang = searchParams.get('lang') || 'me';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], suppliers: [], categories: [] });
  }

  const supabase = await createClient();

  const [productsRes, suppliersRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id, slug, base_price, currency, moq, unit, stock_status, images,
        product_translations!inner(name),
        companies!inner(name, slug)
      `)
      .eq('is_active', true)
      .eq('product_translations.lang', lang)
      .ilike('product_translations.name', `%${q}%`)
      .limit(limit),
    supabase
      .from('companies')
      .select('id, name, slug, logo_url, city, is_verified')
      .in('company_type', ['supplier', 'both'])
      .ilike('name', `%${q}%`)
      .limit(5),
    supabase
      .from('categories')
      .select(`
        id, slug, icon,
        category_translations!inner(name)
      `)
      .eq('is_active', true)
      .eq('category_translations.lang', lang)
      .ilike('category_translations.name', `%${q}%`)
      .limit(5),
  ]);

  return NextResponse.json({
    products: productsRes.data ?? [],
    suppliers: suppliersRes.data ?? [],
    categories: categoriesRes.data ?? [],
  });
}
