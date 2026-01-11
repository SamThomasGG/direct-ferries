import { describe, expect, test } from 'bun:test';
import { buildPagination } from './build-pagination';
import { SearchQueryDTO } from '../search.dto';

const defaultQuery: SearchQueryDTO = {
  sort: 'price',
  order: 'asc',
  page: 1,
  pageSize: 10,
};

describe('buildPagination', () => {
  test('calculates skip=0 for page 1', () => {
    const result = buildPagination(defaultQuery);
    expect(result.skip).toBe(0);
  });

  test('calculates correct skip for page 2', () => {
    const result = buildPagination({ ...defaultQuery, page: 2 });
    expect(result.skip).toBe(10);
  });

  test('calculates correct skip for page 3 with pageSize 20', () => {
    const result = buildPagination({ ...defaultQuery, page: 3, pageSize: 20 });
    expect(result.skip).toBe(40);
  });

  test('sets take to pageSize', () => {
    const result = buildPagination({ ...defaultQuery, pageSize: 25 });
    expect(result.take).toBe(25);
  });

  test('builds orderBy with price asc', () => {
    const result = buildPagination(defaultQuery);
    expect(result.orderBy).toEqual({ price: 'asc' });
  });

  test('builds orderBy with durationMins desc', () => {
    const result = buildPagination({ ...defaultQuery, sort: 'durationMins', order: 'desc' });
    expect(result.orderBy).toEqual({ durationMins: 'desc' });
  });

  test('builds orderBy with departure asc', () => {
    const result = buildPagination({ ...defaultQuery, sort: 'departure', order: 'asc' });
    expect(result.orderBy).toEqual({ departure: 'asc' });
  });
});
