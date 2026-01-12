'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { search } from '@/lib/api-service/search';
import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Pagination } from './pagination';
import { ResultCard } from './result-card';
import { SearchControls } from './search-controls';

export function Results() {
  const t = useTranslations('noResults');
  const searchParams = useSearchParams();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const sort = searchParams.get('sort') as
    | 'price'
    | 'durationMins'
    | 'departure'
    | null;
  const order = searchParams.get('order') as 'asc' | 'desc' | null;

  const hasParams = from || to || date;

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', { from, to, date, page, pageSize, sort, order }],
    queryFn: () =>
      search({
        from: from || undefined,
        to: to || undefined,
        date: date ? new Date(date) : undefined,
        page,
        pageSize,
        sort: sort || undefined,
        order: order || undefined,
      }),
    enabled: !!hasParams,
  });

  if (!hasParams) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!results || results.data.length === 0) {
    return (
      <output
        className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 flex flex-col items-center gap-4"
        aria-live="polite"
      >
        <SearchX className="h-12 w-12 text-gray-400" aria-hidden="true" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">{t('title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('description')}</p>
        </div>
      </output>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <SearchControls total={results.total} />

      {results.data.map((sailing) => (
        <ResultCard key={sailing.id} sailing={sailing} />
      ))}

      <Pagination
        total={results.total}
        page={results.page}
        pageSize={results.pageSize}
      />
    </div>
  );
}
