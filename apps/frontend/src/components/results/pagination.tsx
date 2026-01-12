'use client';

import { Button } from '@/components/common/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/shadcn/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
}

export function Pagination({ total, page, pageSize }: PaginationProps) {
  const t = useTranslations('pagination');
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParam('page', String(newPage));
    }
  };

  const changePageSize = (newSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', newSize);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <nav
      className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4"
      aria-label={t('navigation')}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="page-size-select" className="text-sm text-gray-600">
          {t('show')}
        </label>
        <Select value={String(pageSize)} onValueChange={changePageSize}>
          <SelectTrigger id="page-size-select" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">{t('perPage')}</span>
      </div>

      <div
        className="text-sm text-gray-600 text-center order-first sm:order-none"
        aria-live="polite"
      >
        {t('rangeOf', { start: startItem, end: endItem, total })}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          aria-label={t('previousPage')}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        <span className="text-sm text-gray-600 px-2" aria-current="page">
          {t('pageOf', { page, total: totalPages })}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          aria-label={t('nextPage')}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
