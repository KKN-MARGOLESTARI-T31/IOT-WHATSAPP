import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/messages',
    '/contacts',
    '/auto-reply',
    '/broadcast',
    '/data-source',
];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session token from cookie
    const sessionToken = request.cookies.get('session_token')?.value;

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Verify session by calling API
    let isAuthenticated = false;
    if (sessionToken) {
        try {
            const response = await fetch(new URL('/api/auth/me', request.url), {
                headers: {
                    Cookie: `session_token=${sessionToken}`
                }
            });
            const data = await response.json();
            isAuthenticated = data.success && data.user;
        } catch (error) {
            console.error('Auth check failed:', error);
            isAuthenticated = false;
        }
    }

    // Redirect to login if trying to access protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/messages/:path*',
        '/contacts/:path*',
        '/auto-reply/:path*',
        '/broadcast/:path*',
        '/data-source/:path*',
        '/login',
    ]
};
