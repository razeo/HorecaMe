import { notFound } from 'next/navigation';
import { Header, Footer } from '@horecame/ui/layout';
import { createClient } from '@/lib/supabase/server';
import { ClientProviders } from '@/components/client-providers';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  if (lang !== 'me' && lang !== 'en') {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*, companies(name, company_type)')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <ClientProviders lang={lang as 'me' | 'en'}>
      <div className="flex min-h-screen flex-col">
        <Header
          lang={lang as 'me' | 'en'}
          user={profile ? {
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
            company: profile.companies as { name: string; company_type: string } | undefined,
          } : null}
        />
        <main className="flex-1">{children}</main>
        <Footer lang={lang as 'me' | 'en'} />
      </div>
    </ClientProviders>
  );
}
