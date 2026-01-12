import { Results } from '@/components/results/results';
import SearchBar from '@/components/search-bar';
import { getPorts } from '@/lib/api-service/get-ports';
import { locales } from '@/lib/i18n/config';
import { Suspense } from 'react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home() {
  const ports = await getPorts();

  return (
    <>
      <Suspense>
        <SearchBar ports={ports} />
      </Suspense>

      <Suspense>
        <Results />
      </Suspense>
    </>
  );
}
