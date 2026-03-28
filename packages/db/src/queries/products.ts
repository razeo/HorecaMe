import { supabase } from '../client';
import type { Tables, Inserts } from '../types';

export async function getProducts(options?: {
  categoryId?: string;
  companyId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  lang?: 'me' | 'en';
}) {
  const { categoryId, companyId, search, page = 1, pageSize = 24, lang = 'me' } = options ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select(`
      *,
      product_translations!inner(name, description),
      companies!inner(name, slug, logo_url, is_verified),
      categories(slug),
      product_variants(id, variant_name, price, moq, stock_status)
    `, { count: 'exact' })
    .eq('is_active', true)
    .eq('product_translations.lang', lang)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categoryId) query = query.eq('category_id', categoryId);
  if (companyId) query = query.eq('company_id', companyId);
  if (search) query = query.ilike('product_translations.name', `%${search}%`);

  return query;
}

export async function getProductBySlug(slug: string, lang: 'me' | 'en' = 'me') {
  return supabase
    .from('products')
    .select(`
      *,
      product_translations!inner(name, description),
      companies!inner(id, name, slug, logo_url, is_verified, description),
      categories(id, slug),
      product_variants(id, variant_name, price, moq, stock_status, attributes),
      tiered_pricing(min_quantity, max_quantity, price)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('product_translations.lang', lang)
    .single();
}

export async function getCategories(lang: 'me' | 'en' = 'me') {
  return supabase
    .from('categories')
    .select(`
      *,
      category_translations!inner(name, description)
    `)
    .eq('is_active', true)
    .eq('category_translations.lang', lang)
    .order('sort_order');
}

export async function getCompanyBySlug(slug: string) {
  return supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();
}

export async function searchProducts(query: string, lang: 'me' | 'en' = 'me', limit = 10) {
  return supabase
    .from('products')
    .select(`
      id, slug, base_price, currency, moq, unit, stock_status, images,
      product_translations!inner(name),
      companies!inner(name, slug)
    `)
    .eq('is_active', true)
    .eq('product_translations.lang', lang)
    .ilike('product_translations.name', `%${query}%`)
    .limit(limit);
}
