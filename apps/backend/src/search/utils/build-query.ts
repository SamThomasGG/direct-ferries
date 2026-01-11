import { SearchQueryDTO } from '../search.dto';

export function buildQuery(query: SearchQueryDTO) {
  const search: {
    to?: string;
    from?: string;
    departure?: { gte: Date; lt: Date };
  } = {};

  if (query.from) {
    search.from = query.from;
  }

  if (query.to) {
    search.to = query.to;
  }

  if (query.date) {
    const day = query.date.split('T')[0];
    search.departure = {
      gte: new Date(`${day}T00:00:00Z`),
      lt: new Date(`${day}T23:59:59Z`),
    };
  }

  return search;
}
