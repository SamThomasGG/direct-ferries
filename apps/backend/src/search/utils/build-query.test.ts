import { describe, expect, test } from 'bun:test';
import { buildQuery } from './build-query';
import { SearchQueryDTO } from '../search.dto';

const defaultQuery: SearchQueryDTO = {
  sort: 'price',
  order: 'asc',
  page: 1,
  pageSize: 10,
};

describe('buildQuery', () => {
  test('returns empty object when no filters provided', () => {
    const result = buildQuery(defaultQuery);
    expect(result).toEqual({});
  });

  test('includes from when provided', () => {
    const result = buildQuery({ ...defaultQuery, from: 'GBDOV' });
    expect(result).toEqual({ from: 'GBDOV' });
  });

  test('includes to when provided', () => {
    const result = buildQuery({ ...defaultQuery, to: 'FRCAL' });
    expect(result).toEqual({ to: 'FRCAL' });
  });

  test('includes both from and to when provided', () => {
    const result = buildQuery({ ...defaultQuery, from: 'GBDOV', to: 'FRCAL' });
    expect(result).toEqual({ from: 'GBDOV', to: 'FRCAL' });
  });

  test('converts date to departure range', () => {
    const result = buildQuery({ ...defaultQuery, date: '2025-06-15' });
    expect(result.departure).toEqual({
      gte: new Date('2025-06-15T00:00:00Z'),
      lt: new Date('2025-06-15T23:59:59Z'),
    });
  });

  test('handles all filters together', () => {
    const result = buildQuery({
      ...defaultQuery,
      from: 'GBDOV',
      to: 'FRCAL',
      date: '2025-06-15',
    });
    expect(result).toEqual({
      from: 'GBDOV',
      to: 'FRCAL',
      departure: {
        gte: new Date('2025-06-15T00:00:00Z'),
        lt: new Date('2025-06-15T23:59:59Z'),
      },
    });
  });
});
