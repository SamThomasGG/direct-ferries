import { Results } from '@/components/results/results';
import SearchBar from '@/components/search-bar';
import { getPorts } from '@/lib/api-service/get-ports';
import { Suspense } from 'react';

export default async function Home() {
  const ports = await getPorts();

  return (
    <>
      <SearchBar ports={ports} />

      <Suspense>
        <Results />
      </Suspense>
    </>
  );
}
