'use client';

import type { Sailing } from '@/lib/api-service/search/search.schema';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface ResultCardProps {
  sailing: Sailing;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents);
}

export function ResultCard({ sailing }: ResultCardProps) {
  const t = useTranslations('resultCard');

  return (
    <article
      className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
      aria-label={`Sailing from ${sailing.from} to ${sailing.to} departing at ${format(sailing.departure, 'HH:mm')} on ${format(sailing.departure, 'MMMM d, yyyy')} for ${formatPrice(sailing.price)}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{sailing.from}</span>
          <span aria-hidden="true">→</span>
          <span>{sailing.to}</span>
        </div>
        <time
          dateTime={sailing.departure.toISOString()}
          className="text-lg font-semibold"
        >
          {format(sailing.departure, 'HH:mm')}
        </time>
        <div className="text-sm text-gray-500">
          {format(sailing.departure, 'EEE, dd MMM yyyy')}
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-500">{t('ship')}</div>
        <div className="font-medium">{sailing.ship}</div>
      </div>

      {sailing.durationMins !== undefined && (
        <div className="text-center">
          <div
            className="text-sm text-gray-500"
            id={`duration-label-${sailing.id}`}
          >
            {t('duration')}
          </div>
          <div
            className="font-medium"
            aria-labelledby={`duration-label-${sailing.id}`}
          >
            {formatDuration(sailing.durationMins)}
          </div>
        </div>
      )}

      <div className="text-right">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(sailing.price)}
        </div>
      </div>
    </article>
  );
}
