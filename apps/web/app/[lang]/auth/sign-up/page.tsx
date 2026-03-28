'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@horecame/ui/primitives';
import { createClient } from '@/lib/supabase/client';

interface SignUpPageProps {
  params: Promise<{ lang: string }>;
}

export default function SignUpPage({ params }: SignUpPageProps) {
  const { lang } = React.use(params);
  const l = lang as 'me' | 'en';
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [companyType, setCompanyType] = React.useState<'buyer' | 'supplier' | 'both'>('buyer');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const dict = {
    me: {
      title: 'Registracija',
      description: 'Kreirajte vaš HorecaMe nalog',
      fullName: 'Puno ime',
      email: 'Email',
      password: 'Lozinka',
      companyName: 'Naziv kompanije',
      companyType: 'Tip kompanije',
      buyer: 'Kupac',
      supplier: 'Dobavljač',
      both: 'Kupac i Dobavljač',
      submit: 'Registrujte se',
      loading: 'Registracija...',
      hasAccount: 'Već imate nalog?',
      signIn: 'Prijavite se',
      success: 'Provjerite vaš email za potvrdu naloga.',
      error: 'Greška pri registraciji',
    },
    en: {
      title: 'Sign Up',
      description: 'Create your HorecaMe account',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      companyName: 'Company Name',
      companyType: 'Company Type',
      buyer: 'Buyer',
      supplier: 'Supplier',
      both: 'Buyer & Supplier',
      submit: 'Sign Up',
      loading: 'Signing up...',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In',
      success: 'Check your email to confirm your account.',
      error: 'Error during registration',
    },
  };

  const t = dict[l];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          company_type: companyType,
        },
      },
    });

    if (signUpError) {
      setError(t.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success text-2xl">
              ✓
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">{t.success}</h2>
            <Link href={`/${l}/auth/sign-in`}>
              <Button className="mt-4">{t.signIn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
              <Label htmlFor="fullName">{t.fullName}</Label>
              <Input
                id="fullName"
                placeholder={l === 'me' ? 'Marko Marković' : 'John Doe'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">{t.companyName}</Label>
              <Input
                id="companyName"
                placeholder={l === 'me' ? 'Vaša kompanija d.o.o.' : 'Your Company Ltd.'}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyType">{t.companyType}</Label>
              <div className="flex gap-2">
                {(['buyer', 'supplier', 'both'] as const).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={companyType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCompanyType(type)}
                    className="flex-1"
                  >
                    {t[type]}
                  </Button>
                ))}
              </div>
            </div>
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
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.submit}
            </Button>
            <p className="text-center text-sm text-slate-400">
              {t.hasAccount}{' '}
              <Link href={`/${l}/auth/sign-in`} className="text-sky hover:underline">
                {t.signIn}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
