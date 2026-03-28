import { SearchCommand } from '@/components/search-command';

interface ClientProvidersProps {
  lang: 'me' | 'en';
  children: React.ReactNode;
}

export function ClientProviders({ lang, children }: ClientProvidersProps) {
  return (
    <>
      <SearchCommand lang={lang} />
      {children}
    </>
  );
}
