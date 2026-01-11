import backgroundImage from '@/assets/images/vecteezy_papercut-style-sea-wave-pattern-design-background_7535043-1.jpg';
import { locales } from '@/lib/i18n/config';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import '../../assets/styles/globals.css';
import { LocaleSelector } from '@/components/locale-selector';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Direct Ferries',
  description: 'Book your ferry crossing today',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Image
          src={backgroundImage}
          alt="background image"
          fill
          priority
          className="object-cover pointer-events-none"
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LocaleSelector />
          <main className="flex min-h-screen flex-col items-center justify-center p-8 relative z-10 space-y-4">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
