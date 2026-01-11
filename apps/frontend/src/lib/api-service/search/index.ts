import { apiFetch } from '@/lib/api-service/api-fetch';
import { Search, SearchSchema } from '@/lib/api-service/search/search.schema';

type SearchQuery = {
  page?: number;
  pageSize?: number;
  to?: string;
  from?: string;
  date?: Date;
  sort?: 'price' | 'durationMins' | 'departure';
  order?: 'asc' | 'desc';
};

export async function search(query: SearchQuery): Promise<Search> {
  try {
    const params = new URLSearchParams();

    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));
    if (query.to) params.set('to', query.to);
    if (query.from) params.set('from', query.from);
    if (query.date) params.set('date', query.date.toISOString().split('T')[0]);
    if (query.sort) params.set('sort', query.sort);
    if (query.order) params.set('order', query.order);

    const data = await apiFetch<Search>(`search?${params}`);
    return SearchSchema.parse(data);
  } catch (e) {
    console.error(`Failed to search ${e}`);
    throw e;
  }
}
