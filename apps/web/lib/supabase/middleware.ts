import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/me/auth') &&
    !request.nextUrl.pathname.startsWith('/en/auth') &&
    (request.nextUrl.pathname.startsWith('/me/dashboard') ||
      request.nextUrl.pathname.startsWith('/en/dashboard') ||
      request.nextUrl.pathname.startsWith('/me/basket') ||
      request.nextUrl.pathname.startsWith('/en/basket') ||
      request.nextUrl.pathname.startsWith('/me/inquiries') ||
      request.nextUrl.pathname.startsWith('/en/inquiries'))
  ) {
    // No user, redirect to login
    const url = request.nextUrl.clone();
    const lang = request.nextUrl.pathname.split('/')[1] || 'me';
    url.pathname = `/${lang}/auth/sign-in`;
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
