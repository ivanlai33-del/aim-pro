import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

    const { pathname } = request.nextUrl;

    // Get session for authentication check
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes: /dashboard and its sub-routes
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = pathname === '/login';

    // Redirect logic
    if (isProtectedRoute && !session) {
        // User is not logged in, redirect to login
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && session) {
        // User is already logged in, redirect to dashboard
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
