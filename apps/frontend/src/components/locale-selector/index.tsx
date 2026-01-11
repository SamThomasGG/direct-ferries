'use client';

import { getLocale, locales } from '@/assets/data/i18n/locales';
import { Avatar, AvatarImage } from '@/components/common/shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/shadcn/dropdown-menu';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export function LocaleSelector() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const current = getLocale(currentLocale);

  function handleLocaleChange(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="fixed top-4 right-4 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
          type="button"
          aria-label={`Change language. Current: ${current?.name}`}
        >
          <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage
              src={current?.flag.src}
              alt=""
              className="object-cover"
            />
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="cursor-pointer gap-3"
          >
            <Image
              src={locale.flag}
              alt={locale.name}
              width={24}
              height={18}
              className="rounded"
            />
            <span>{locale.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
