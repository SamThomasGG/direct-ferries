'use client';

import { format, parse } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DateSelect } from '@/components/common/date-select';
import { LabeledSelect } from '@/components/common/select';
import { Button } from '@/components/common/shadcn/button';
import type { Ports } from '@/lib/api-service/get-ports/get-ports.schema';

interface SearchBarProps {
  ports: Ports;
}

export default function SearchBar({ ports }: SearchBarProps) {
  const t = useTranslations('searchBar');
  const router = useRouter();
  const searchParams = useSearchParams();
  const portList = ports.data;

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const dateParam = searchParams.get('date');

    if (fromParam && portList.includes(fromParam)) {
      setFrom(fromParam);
    }
    if (toParam && portList.includes(toParam)) {
      setTo(toParam);
    }
    if (dateParam) {
      const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
      if (!Number.isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  }, [searchParams, portList]);

  const handleSearch = () => {
    if (!from && !to && !date) {
      return;
    }

    const params = new URLSearchParams();

    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', format(date, 'yyyy-MM-dd'));

    router.push(`?${params.toString()}`);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <LabeledSelect
            label={t('from')}
            value={from}
            onChange={setFrom}
            options={portList}
            placeholder={t('selectDeparturePort')}
          />
        </div>

        <div className="flex-1">
          <LabeledSelect
            label={t('to')}
            value={to}
            onChange={setTo}
            options={portList}
            placeholder={t('selectArrivalPort')}
          />
        </div>

        <div className="flex-1">
          <DateSelect
            label={t('date')}
            value={date}
            onChange={setDate}
            placeholder={t('selectDate')}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={!from && !to && !date}
          className="h-9 w-full md:w-auto"
        >
          {t('search')}
        </Button>
      </div>
    </section>
  );
}
