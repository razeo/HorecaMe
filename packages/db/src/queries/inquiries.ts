import { supabase } from '../client';
import type { Tables, Inserts } from '../types';

export async function getBasket(buyerId: string) {
  return supabase
    .from('inquiry_baskets')
    .select(`
      *,
      inquiry_items(
        *,
        products(id, slug, base_price, currency, moq, unit, images,
          product_translations(name),
          companies(id, name, slug)
        ),
        product_variants(id, variant_name, price)
      )
    `)
    .eq('buyer_id', buyerId)
    .eq('status', 'draft')
    .single();
}

export async function addToBasket(basketId: string, item: Inserts<'inquiry_items'>) {
  return supabase.from('inquiry_items').insert({ ...item, basket_id: basketId });
}

export async function updateBasketItem(itemId: string, updates: Partial<Tables<'inquiry_items'>>) {
  return supabase.from('inquiry_items').update(updates).eq('id', itemId);
}

export async function removeFromBasket(itemId: string) {
  return supabase.from('inquiry_items').delete().eq('id', itemId);
}

export async function submitBasket(basketId: string) {
  return supabase.rpc('submit_inquiry_basket', { basket_id: basketId });
}

export async function getSupplierRFQs(supplierId: string, status?: string) {
  let query = supabase
    .from('supplier_rfqs')
    .select(`
      *,
      inquiry_baskets(id, notes, created_at),
      companies!supplier_rfqs_buyer_id_fkey(id, name, slug),
      rfq_items(
        *,
        products(id, slug,
          product_translations(name)
        ),
        product_variants(id, variant_name)
      )
    `)
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  return query;
}

export async function getBuyerInquiries(buyerId: string) {
  return supabase
    .from('inquiry_baskets')
    .select(`
      *,
      inquiry_items(
        *,
        products(id, slug,
          product_translations(name),
          companies(name)
        )
      ),
      supplier_rfqs(
        *,
        companies!supplier_rfqs_supplier_id_fkey(id, name, slug),
        rfq_items(*)
      )
    `)
    .eq('buyer_id', buyerId)
    .neq('status', 'draft')
    .order('created_at', { ascending: false });
}

export async function respondToRFQ(rfqId: string, items: Array<{
  rfq_item_id: string;
  quoted_price: number;
  quoted_qty: number;
  lead_time_days?: number;
  status: 'quoted' | 'rejected' | 'partial';
  supplier_notes?: string;
}>) {
  const updates = items.map((item) =>
    supabase
      .from('rfq_items')
      .update({
        quoted_price: item.quoted_price,
        quoted_qty: item.quoted_qty,
        lead_time_days: item.lead_time_days,
        status: item.status,
        supplier_notes: item.supplier_notes,
      })
      .eq('id', item.rfq_item_id)
  );

  await Promise.all(updates);

  return supabase
    .from('supplier_rfqs')
    .update({
      status: 'quoted',
      responded_at: new Date().toISOString(),
      total_amount: items.reduce((sum, i) => sum + i.quoted_price * i.quoted_qty, 0),
    })
    .eq('id', rfqId);
}
