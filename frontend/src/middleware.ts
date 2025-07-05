import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

// Public routes
const publicRoutes = [
    '/', '/about', '/contact', '/terms', '/privacy',
    '/seller/forgot-password', '/buyer/forgot-password'
];

// Role-based route configuration
const roles = [
    {
        role: 'admin',
        tokenName: 'AdminToken',
        idKey: 'userId',
        dashboard: '/admin/',
        loginPages: ['/admin/signin', '/admin/signup'],
        protectedPrefixes: ['/admin', '/admin/users', '/admin/products', '/admin/orders','/admin/chats']
    },
    {
        role: 'seller',
        tokenName: 'SellerToken',
        idKey: 'sellerId',
        dashboard: '/seller/dashboard',
        loginPages: ['/seller/signin', '/seller/signup'],
        protectedPrefixes: ['/seller']
    },
    {
        role: 'buyer',
        tokenName: 'BuyerToken',
        idKey: 'buyerId',
        dashboard: '/buyer/dashboard',
        loginPages: ['/buyer/signin', '/buyer/signup'],
        protectedPrefixes: ['/buyer']
    }
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow all public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Role-based route handling
    for (const { role, tokenName, idKey, dashboard, loginPages, protectedPrefixes } of roles) {
        const token = req.cookies.get(tokenName)?.value;

        const isLoginPage = loginPages.includes(pathname);
        const isProtectedRoute = protectedPrefixes.some(prefix =>
            pathname.startsWith(prefix) && !loginPages.includes(pathname) // exclude login/signup
        );

        const isValid = token && await isValidToken(token, idKey);

        // Block login/signup if already logged in
        if (isLoginPage && isValid) {
            return NextResponse.redirect(new URL(dashboard, req.url));
        }

        // If route is protected but not logged in ---> redirect to login
        if (isProtectedRoute && !isValid) {
            const loginUrl = new URL(loginPages[0], req.url);
            loginUrl.searchParams.set('redirect', 'dashboard');
            return NextResponse.redirect(loginUrl);
        }

        // If protected and logged in → allow
        if (isProtectedRoute && isValid) {
            return NextResponse.next();
        }
    }

    // Default allow
    return NextResponse.next();
}

// JWT validation for Edge Runtime
async function isValidToken(token: string, expectedIdKey: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload && expectedIdKey in payload;
    } catch {
        return false;
    }
}

export const config = {
    matcher: [
        // '/((?!_next|favicon.ico|sw\\.js).*)'
        '/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'
    ]
};
