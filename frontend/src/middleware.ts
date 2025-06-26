import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Define route patterns
const publicRoutes = [
    '/', '/seller-signin', '/buyer-signin', '/admin-signin',
    '/signup', '/about', '/contact', '/privacy-policy', '/terms-of-service'
];

// Will improve this later to use a more dynamic approach
const roleConfigs = [
    {
        role: 'admin',
        routes: ['/admin', '/admin/dashboard'],
        tokenName: 'AdminToken',
        idKey: 'userId',
        loginPath: '/admin-signin'
    },
    {
        role: 'seller',
        routes: ['/seller', '/seller/dashboard', '/seller/listings'],
        tokenName: 'SellerToken',
        idKey: 'sellerId',
        loginPath: '/seller-signin'
    },
    {
        role: 'buyer',
        routes: ['/buyer', '/buyer/dashboard', '/buyer/orders'],
        tokenName: 'BuyerToken',
        idKey: 'buyerId',
        loginPath: '/buyer-signin'
    }
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log('Middleware triggered for:', pathname);

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Role-based protection
    for (const { routes, tokenName, idKey, loginPath } of roleConfigs) {
        if (routes.some(route => pathname.startsWith(route))) {
            const token = req.cookies.get(tokenName)?.value;

            if (!token || !verifyToken(token, idKey)) {
                console.warn(`Unauthorized access to ${pathname}, redirecting to ${loginPath}`);
                return NextResponse.redirect(new URL(loginPath, req.url));
            }

            return NextResponse.next();
        }
    }

    // Default allow
    return NextResponse.next();
}

// Helper: Verify token and check for required ID field
function verifyToken(token: string, expectedIdKey: string): boolean {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return !!decoded[expectedIdKey];
    } catch (err: any) {
        console.error('JWT verification failed:', err.message);
        return false;
    }
}

export const config = {
    matcher: [
        '/',
        '/seller/:path*',
        '/buyer/:path*',
        '/admin/:path*',
        '/signup',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service'
    ]
};
