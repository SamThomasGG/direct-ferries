import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/', '/(en|es|fr|de)/:path*'],
};
