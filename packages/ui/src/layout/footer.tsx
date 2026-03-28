import * as React from 'react';
import Link from 'next/link';
import { Separator } from '../primitives/separator';
import { cn } from '../lib/utils';

interface FooterProps {
  lang: 'me' | 'en';
  className?: string;
}

export function Footer({ lang, className }: FooterProps) {
  const footerLinks = {
    marketplace: [
      { href: `/${lang}/products`, label: { me: 'Proizvodi', en: 'Products' } },
      { href: `/${lang}/categories`, label: { me: 'Kategorije', en: 'Categories' } },
      { href: `/${lang}/suppliers`, label: { me: 'Dobavljači', en: 'Suppliers' } },
    ],
    content: [
      { href: `/${lang}/blog`, label: { me: 'Blog', en: 'Blog' } },
    ],
    company: [
      { href: `/${lang}/about`, label: { me: 'O nama', en: 'About' } },
      { href: `/${lang}/contact`, label: { me: 'Kontakt', en: 'Contact' } },
      { href: `/${lang}/terms`, label: { me: 'Uslovi korišćenja', en: 'Terms' } },
      { href: `/${lang}/privacy`, label: { me: 'Privatnost', en: 'Privacy' } },
    ],
  };

  return (
    <footer className={cn('border-t border-teal/10 bg-surface', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal font-bold text-white text-sm">
                HM
              </div>
              <span className="font-semibold text-white">HorecaMe</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {lang === 'me'
                ? 'B2B platforma za HORECA sektor u Crnoj Gori i regionu.'
                : 'B2B marketplace for the HORECA sector in Montenegro and the Adriatic.'}
            </p>
          </div>

          {/* Marketplace links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">
              {lang === 'me' ? 'Marketplace' : 'Marketplace'}
            </h4>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-sky">
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">
              {lang === 'me' ? 'Sadržaj' : 'Content'}
            </h4>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-sky">
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">
              {lang === 'me' ? 'Kompanija' : 'Company'}
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-sky">
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-600">
            © 2026 HorecaMe. {lang === 'me' ? 'Sva prava zadržana.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-4">
            <Link href={`/${lang}/terms`} className="text-xs text-slate-600 hover:text-slate-400">
              {lang === 'me' ? 'Uslovi' : 'Terms'}
            </Link>
            <Link href={`/${lang}/privacy`} className="text-xs text-slate-600 hover:text-slate-400">
              {lang === 'me' ? 'Privatnost' : 'Privacy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
