import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if(pathname.startsWith('/plans') || pathname.startsWith('/products') || pathname.startsWith('/stock')){
    // simplistic check: rely on supabase cookie
    const hasSession = request.cookies.get('sb-access-token');
    if(!hasSession){
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
