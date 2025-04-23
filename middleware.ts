import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  console.log('Running middleware for Supabase session update...')
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!.*\\.).*)'], // matches everything except static files
}