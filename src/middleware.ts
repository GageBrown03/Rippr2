import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/packs', '/collection'];
const PROTECTED_API_PATHS = ['/api/packs/open', '/api/collection', '/api/coins/daily'];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isProtectedPage = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isProtectedApi = PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedPage) {
    const sessionToken = request.cookies.get('session_token')?.value;
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedApi) {
    const sessionToken = request.cookies.get('session_token')?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/packs/:path*',
    '/collection/:path*',
    '/api/packs/open',
    '/api/collection/:path*',
    '/api/coins/daily',
  ],
};