import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tipo = request.cookies.get('usuario_tipo')?.value;
  const { pathname } = request.nextUrl;

  // 🔐 Protege as rotas privadas
  if (pathname.startsWith('/dashboard') && !tipo) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🚫 Evita acesso à página de login se já estiver logado
  if (pathname === '/login' && tipo) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
  
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
  };