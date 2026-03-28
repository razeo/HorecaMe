'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/client';

interface SignInPageProps {
  params: Promise<{ lang: string }>;
}

export default function SignInPage({ params }: SignInPageProps) {
  const { lang } = React.use(params);
  const l = lang as 'me' | 'en';
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const dict = {
    me: {
      title: 'Prijava',
      description: 'Prijavite se u vaš HorecaMe nalog',
      email: 'Email',
      password: 'Lozinka',
      submit: 'Prijavite se',
      loading: 'Prijavljivanje...',
      noAccount: 'Nemate nalog?',
      signUp: 'Registrujte se',
      error: 'Neispravni podaci za prijavu',
    },
    en: {
      title: 'Sign In',
      description: 'Sign in to your HorecaMe account',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
      loading: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      error: 'Invalid login credentials',
    },
  };

  const t = dict[l];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t.error);
      setLoading(false);
      return;
    }

    router.push(`/${l}/dashboard`);
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.submit}
            </Button>
            <p className="text-center text-sm text-slate-400">
              {t.noAccount}{' '}
              <Link href={`/${l}/auth/sign-up`} className="text-sky hover:underline">
                {t.signUp}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
