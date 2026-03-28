import Image from 'next/image';
import Link from 'next/link';
import { Button, Badge, Card, CardContent, Separator } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/server';
import { ShoppingCart, Check, MapPin, ArrowLeft } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lang, slug } = await params;
  const l = lang as 'me' | 'en';
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      product_translations!inner(name, description),
      companies!inner(id, name, slug, logo_url, is_verified, description, city, country),
      categories(id, slug),
      product_variants(id, variant_name, price, moq, stock_status, attributes),
      tiered_pricing(min_quantity, max_quantity, price)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('product_translations.lang', l)
    .single();

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <Link href={`/${l}/products`}>
          <Button variant="ghost" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            {l === 'me' ? 'Nazad na proizvode' : 'Back to products'}
          </Button>
        </Link>
      </div>
    );
  }

  const translation = product.product_translations[0] as { name: string; description: string | null };
  const company = product.companies as { id: string; name: string; slug: string; logo_url: string | null; is_verified: boolean; description: string | null; city: string | null; country: string };
  const images = Array.isArray(product.images) ? product.images as string[] : [];
  const variants = product.product_variants as Array<{ id: string; variant_name: string; price: number; moq: number; stock_status: string; attributes: Record<string, unknown> }>;
  const tiers = product.tiered_pricing as Array<{ min_quantity: number; max_quantity: number | null; price: number }>;

  const stockStatusLabels = {
    in_stock: { me: 'Na stanju', en: 'In Stock' },
    low_stock: { me: 'Malo na stanju', en: 'Low Stock' },
    out_of_stock: { me: 'Nema na stanju', en: 'Out of Stock' },
    on_order: { me: 'Po narudžbi', en: 'On Order' },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${l}/products`}>
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {l === 'me' ? 'Nazad' : 'Back'}
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-raised">
            {images[0] ? (
              <Image src={images[0]} alt={translation.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <div key={i} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-raised">
                  <Image src={img} alt={`${translation.name} ${i + 1}`} width={80} height={80} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <Badge variant={product.stock_status === 'in_stock' ? 'success' : product.stock_status === 'low_stock' ? 'warning' : 'error'}>
              {stockStatusLabels[product.stock_status as keyof typeof stockStatusLabels]?.[l]}
            </Badge>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">{translation.name}</h1>

          {/* Supplier */}
          <Link href={`/${l}/suppliers/${company.slug}`} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-sky">
            <span>{company.name}</span>
            {company.is_verified && <Check className="h-4 w-4 text-sky" />}
            {company.city && (
              <span className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {company.city}
              </span>
            )}
          </Link>

          {/* Price */}
          {product.base_price !== null && (
            <div className="mb-6">
              <p className="text-3xl font-bold text-white">
                {product.base_price.toFixed(2)} {product.currency}
              </p>
              <p className="text-sm text-slate-500">
                {l === 'me' ? 'Min. narudžba' : 'Min. order'}: {product.moq} {product.unit}
              </p>
            </div>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-white">
                {l === 'me' ? 'Varijante' : 'Variants'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Card key={v.id} className="cursor-pointer p-3 transition-all hover:border-teal/30">
                    <p className="text-sm font-medium text-white">{v.variant_name}</p>
                    <p className="text-xs text-slate-500">{v.price.toFixed(2)} EUR · Min. {v.moq}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tiered pricing */}
          {tiers.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-white">
                {l === 'me' ? 'Količinski popusti' : 'Volume Discounts'}
              </h3>
              <div className="space-y-2">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
                    <span className="text-sm text-slate-400">
                      {tier.min_quantity}{tier.max_quantity ? ` - ${tier.max_quantity}` : '+'} {product.unit}
                    </span>
                    <span className="font-semibold text-white">{tier.price.toFixed(2)} {product.currency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Description */}
          {translation.description && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                {l === 'me' ? 'Opis' : 'Description'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{translation.description}</p>
            </div>
          )}

          {/* CTA */}
          <Button size="lg" className="w-full gap-2" disabled={product.stock_status === 'out_of_stock'}>
            <ShoppingCart className="h-5 w-5" />
            {l === 'me' ? 'Dodaj u korpu' : 'Add to Basket'}
          </Button>
        </div>
      </div>
    </div>
  );
}
