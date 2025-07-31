import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/api/auth']
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(path + '/') ||
    (path.endsWith('*') && pathname.startsWith(path.slice(0, -1)))
  )

  // If it's a public path, continue
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If there's no token and it's not a public path, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For API routes, verify the token
  if (pathname.startsWith('/api')) {
    try {
      // Verify the token with your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Invalid token')
      }

      // Token is valid, continue with the request
      return NextResponse.next()
    } catch (error) {
      // If token verification fails, clear the token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
