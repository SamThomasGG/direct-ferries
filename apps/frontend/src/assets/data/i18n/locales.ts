import gbFlag from '@/assets/images/flags/gb.svg';
import esFlag from '@/assets/images/flags/es.svg';
import frFlag from '@/assets/images/flags/fr.svg';
import deFlag from '@/assets/images/flags/de.svg';
import type { StaticImageData } from 'next/image';

export const locales = [
  { code: 'en', name: 'English', flag: gbFlag as StaticImageData },
  { code: 'es', name: 'Español', flag: esFlag as StaticImageData },
  { code: 'fr', name: 'Français', flag: frFlag as StaticImageData },
  { code: 'de', name: 'Deutsch', flag: deFlag as StaticImageData },
];

export function getLocale(code: string) {
  return locales.find((l) => l.code === code) ?? locales[0];
}
