'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '../primitives/button';
import { Input } from '../primitives/input';
import { Badge } from '../primitives/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/avatar';
import { Separator } from '../primitives/separator';
import { cn } from '../lib/utils';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Globe,
  User,
  LogIn,
  Package,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

interface HeaderProps {
  lang: 'me' | 'en';
  user?: {
    full_name: string;
    avatar_url: string | null;
    role: string;
    company?: { name: string; company_type: string };
  } | null;
  basketCount?: number;
  onSearch?: (query: string) => void;
  className?: string;
}

export function Header({ lang, user, basketCount = 0, onSearch, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const navLinks = [
    { href: `/${lang}/products`, label: { me: 'Proizvodi', en: 'Products' }, icon: Package },
    { href: `/${lang}/categories`, label: { me: 'Kategorije', en: 'Categories' }, icon: LayoutDashboard },
    { href: `/${lang}/suppliers`, label: { me: 'Dobavljači', en: 'Suppliers' }, icon: User },
    { href: `/${lang}/blog`, label: { me: 'Blog', en: 'Blog' }, icon: FileText },
  ];

  return (
    <header className={cn('sticky top-0 z-50 border-b border-teal/10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80', className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal font-bold text-white text-sm">
            HM
          </div>
          <span className="hidden font-semibold text-white sm:block">HorecaMe</span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder={lang === 'me' ? 'Pretraži proizvode, dobavljače...' : 'Search products, suppliers...'}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch?.(searchQuery);
              }}
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden rounded border border-teal/20 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-flex">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Nav links (desktop) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-surface-raised hover:text-white"
            >
              {link.label[lang]}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <Link href={`/${lang === 'me' ? 'en' : 'me'}`}>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Globe className="h-3.5 w-3.5" />
              {lang === 'me' ? 'EN' : 'ME'}
            </Button>
          </Link>

          {/* Basket */}
          <Link href={`/${lang}/basket`}>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {basketCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
                  {basketCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User menu */}
          {user ? (
            <Link href={`/${lang}/dashboard`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url ?? undefined} />
                <AvatarFallback>{user.full_name[0]}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href={`/${lang}/auth/sign-in`}>
              <Button variant="default" size="sm">
                <LogIn className="mr-1.5 h-4 w-4" />
                {lang === 'me' ? 'Prijava' : 'Sign In'}
              </Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-teal/10 bg-surface p-4 lg:hidden">
          {/* Mobile search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder={lang === 'me' ? 'Pretraži...' : 'Search...'}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Mobile nav */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-surface-raised hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label[lang]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
