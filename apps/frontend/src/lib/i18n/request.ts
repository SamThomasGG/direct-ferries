import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './config';
import en from '@/assets/data/i18n/messages/en.json';
import es from '@/assets/data/i18n/messages/es.json';
import fr from '@/assets/data/i18n/messages/fr.json';
import de from '@/assets/data/i18n/messages/de.json';

const messages: Record<Locale, typeof en> = { en, es, fr, de };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as Locale],
  };
});
