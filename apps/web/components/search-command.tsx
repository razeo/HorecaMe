'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@horecame/ui/primitives';
import { Package, Building2, LayoutGrid } from 'lucide-react';

interface SearchCommandProps {
  lang: 'me' | 'en';
}

export function SearchCommand({ lang }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<{
    products: Array<{ id: string; slug: string; base_price: number | null; currency: string; product_translations: { name: string }[]; companies: { name: string } }>;
    suppliers: Array<{ id: string; name: string; slug: string; city: string | null }>;
    categories: Array<{ id: string; slug: string; icon: string | null; category_translations: { name: string }[] }>;
  }>({ products: [], suppliers: [], categories: [] });
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (query.length < 2) {
      setResults({ products: [], suppliers: [], categories: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${lang}`);
      const data = await res.json();
      setResults(data);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, lang]);

  function navigate(path: string) {
    setOpen(false);
    setQuery('');
    router.push(path);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={lang === 'me' ? 'Pretraži proizvode, dobavljače...' : 'Search products, suppliers...'}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {lang === 'me' ? 'Nema rezultata' : 'No results found'}
        </CommandEmpty>

        {results.products.length > 0 && (
          <CommandGroup heading={lang === 'me' ? 'Proizvodi' : 'Products'}>
            {results.products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => navigate(`/${lang}/products/${product.slug}`)}
              >
                <Package className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <span>{product.product_translations[0]?.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{product.companies.name}</span>
                </div>
                {product.base_price !== null && (
                  <span className="text-sm text-slate-400">
                    {product.base_price.toFixed(2)} {product.currency}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.suppliers.length > 0 && (
          <CommandGroup heading={lang === 'me' ? 'Dobavljači' : 'Suppliers'}>
            {results.suppliers.map((supplier) => (
              <CommandItem
                key={supplier.id}
                onSelect={() => navigate(`/${lang}/suppliers/${supplier.slug}`)}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>{supplier.name}</span>
                {supplier.city && (
                  <span className="ml-2 text-xs text-slate-500">{supplier.city}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.categories.length > 0 && (
          <CommandGroup heading={lang === 'me' ? 'Kategorije' : 'Categories'}>
            {results.categories.map((cat) => (
              <CommandItem
                key={cat.id}
                onSelect={() => navigate(`/${lang}/categories/${cat.slug}`)}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>{cat.category_translations[0]?.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
