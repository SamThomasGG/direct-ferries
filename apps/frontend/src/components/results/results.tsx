'use client';

import { search } from '@/lib/api-service/search';
import type { Search } from '@/lib/api-service/search/search.schema';
import { SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Pagination } from './pagination';
import { ResultCard } from './result-card';
import { SearchControls } from './search-controls';

function LoadingSpinner() {
  return (
    <output
      className="flex justify-center items-center py-12"
      aria-label="Loading search results"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="sr-only">Loading...</span>
    </output>
  );
}

export function Results() {
  const t = useTranslations('noResults');
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Search | null>(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const hasParams = from || to || date;

  useEffect(() => {
    if (!hasParams) {
      setResults(null);
      return;
    }

    async function fetchResults() {
      setIsLoading(true);

      try {
        const data = await search({
          from: from || undefined,
          to: to || undefined,
          date: date ? new Date(date) : undefined,
          page: Number(searchParams.get('page')) || 1,
          pageSize: Number(searchParams.get('pageSize')) || 10,
          sort:
            (searchParams.get('sort') as
              | 'price'
              | 'durationMins'
              | 'departure') || undefined,
          order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
        });

        setResults(data);
      } catch (e) {
        console.error('Failed to fetch results', e);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchResults();
  }, [from, to, date, searchParams, hasParams]);

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

      {results.data.map((ferry) => (
        <ResultCard key={ferry.id} ferry={ferry} />
      ))}

      <Pagination
        total={results.total}
        page={results.page}
        pageSize={results.pageSize}
      />
    </div>
  );
}
