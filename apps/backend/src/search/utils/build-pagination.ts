import { SearchQueryDTO } from '../search.dto';

export function buildPagination(query: SearchQueryDTO) {
  return {
    skip: query.pageSize * (query.page - 1),
    take: query.pageSize,
    orderBy: { [query.sort]: query.order },
  };
}
