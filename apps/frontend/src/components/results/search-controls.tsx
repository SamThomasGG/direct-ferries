'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/shadcn/select';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchControlsProps {
  total: number;
}

export function SearchControls({ total }: SearchControlsProps) {
  const t = useTranslations('searchControls');
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || 'asc';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-md p-4">
      <div className="text-sm text-gray-600">
        {t('resultsFound', { count: total })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {t('sortBy')}
          </span>
          <Select
            value={sort}
            onValueChange={(value) => updateParam('sort', value)}
          >
            <SelectTrigger className="w-full sm:w-32" aria-label={t('sortBy')}>
              <SelectValue placeholder={t('default')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">{t('price')}</SelectItem>
              <SelectItem value="departure">{t('departure')}</SelectItem>
              <SelectItem value="durationMins">{t('duration')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {t('order')}
          </span>
          <Select
            value={order}
            onValueChange={(value) => updateParam('order', value)}
          >
            <SelectTrigger className="w-full sm:w-32" aria-label={t('order')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">{t('ascending')}</SelectItem>
              <SelectItem value="desc">{t('descending')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
