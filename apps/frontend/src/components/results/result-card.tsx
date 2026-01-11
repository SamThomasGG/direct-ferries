'use client';

import type { Ferry } from '@/lib/api-service/search/search.schema';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface ResultCardProps {
  ferry: Ferry;
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

export function ResultCard({ ferry }: ResultCardProps) {
  const t = useTranslations('resultCard');

  return (
    <article
      className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
      aria-label={`Ferry from ${ferry.from} to ${ferry.to} departing at ${format(ferry.departure, 'HH:mm')} on ${format(ferry.departure, 'MMMM d, yyyy')} for ${formatPrice(ferry.price)}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{ferry.from}</span>
          <span aria-hidden="true">→</span>
          <span>{ferry.to}</span>
        </div>
        <time
          dateTime={ferry.departure.toISOString()}
          className="text-lg font-semibold"
        >
          {format(ferry.departure, 'HH:mm')}
        </time>
        <div className="text-sm text-gray-500">
          {format(ferry.departure, 'EEE, dd MMM yyyy')}
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-500">{t('ship')}</div>
        <div className="font-medium">{ferry.ship}</div>
      </div>

      {ferry.durationMins !== undefined && (
        <div className="text-center">
          <div className="text-sm text-gray-500" id={`duration-label-${ferry.id}`}>
            {t('duration')}
          </div>
          <div className="font-medium" aria-labelledby={`duration-label-${ferry.id}`}>
            {formatDuration(ferry.durationMins)}
          </div>
        </div>
      )}

      <div className="text-right">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(ferry.price)}
        </div>
      </div>
    </article>
  );
}
