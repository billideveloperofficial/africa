import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check maintenance mode first
  try {
    // Fetch maintenance mode status from database
    const settingsResponse = await fetch(`${request.nextUrl.origin}/api/settings`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json()
      const isMaintenanceMode = settingsData.settings?.maintenance_mode

      if (isMaintenanceMode) {
        // Allow access to maintenance page, admin routes, and essential resources
        if (
          pathname === '/maintenance' ||
          pathname.startsWith('/admin') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.includes('.') ||
          pathname === '/api/settings'
        ) {
          return NextResponse.next()
        }

        // Redirect to maintenance page for all other routes
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
    // If we can't check maintenance mode, allow access to prevent blocking users
  }

  // Allow access to login page and public routes
  if (
    pathname === '/login' ||
    pathname === '/admin/login' ||
    pathname === '/' ||
    pathname === '/maintenance' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  console.log('Middleware - Path:', pathname, 'Token:', !!token, 'Role:', token?.role)

  // Protect admin routes - only allow ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('Admin access blocked: No token - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token.role !== 'ADMIN') {
      console.log('Admin access blocked: Not admin role - redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('Admin access granted')
    return NextResponse.next()
  }

  // Protect dashboard routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Dashboard access blocked: No token - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    console.log('Dashboard access granted')
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}