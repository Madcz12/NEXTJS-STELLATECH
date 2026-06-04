import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      const isPublicRoute = nextUrl.pathname === '/' || 
                           nextUrl.pathname.startsWith('/product/') || 
                           nextUrl.pathname.startsWith('/catalog');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/', nextUrl));
      } else if (!isLoggedIn && !isPublicRoute && !isOnAuth) {
        // Redirect unauthenticated users to login page for any other route (like /cart, /checkout)
        return false;
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
