import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    // Handle CORS preflight request by returning a response with the appropriate headers
    const response = new NextResponse(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*', // You can change '*' to a specific origin like 'https://www.kickrealm.com'
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    return response;
  }

  // Continue with the normal request processing
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}