import { describe, expect, mock, test, beforeEach } from 'bun:test';
import { search } from './index';

const mockApiFetch = mock(() => Promise.resolve({ data: [], total: 0, page: 1, pageSize: 10 }));

mock.module('@/lib/api-service/api-fetch', () => ({
  apiFetch: mockApiFetch,
}));

const mockSearchResponse = {
  data: [
    {
      id: 'DF001',
      from: 'GBDOV',
      to: 'FRCAL',
      departure: '2025-06-01T07:20:00Z',
      durationMins: 100,
      price: 4250,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
};

describe('search', () => {
  beforeEach(() => {
    mockApiFetch.mockClear();
  });

  test('calls apiFetch with empty params when no query provided', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    await search({});

    expect(mockApiFetch).toHaveBeenCalledWith('search?');
  });

  test('builds query params for from and to', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    await search({ from: 'GBDOV', to: 'FRCAL' });

    expect(mockApiFetch).toHaveBeenCalledWith('search?to=FRCAL&from=GBDOV');
  });

  test('builds query params for date in YYYY-MM-DD format', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);
    const date = new Date('2025-06-15T00:00:00Z');

    await search({ date });

    expect(mockApiFetch).toHaveBeenCalledWith('search?date=2025-06-15');
  });

  test('builds query params for pagination', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    await search({ page: 2, pageSize: 20 });

    expect(mockApiFetch).toHaveBeenCalledWith('search?page=2&pageSize=20');
  });

  test('builds query params for sort and order', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    await search({ sort: 'price', order: 'desc' });

    expect(mockApiFetch).toHaveBeenCalledWith('search?sort=price&order=desc');
  });

  test('builds query params with all options', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);
    const date = new Date('2025-06-15T00:00:00Z');

    await search({
      from: 'GBDOV',
      to: 'FRCAL',
      date,
      page: 1,
      pageSize: 10,
      sort: 'durationMins',
      order: 'asc',
    });

    const call = mockApiFetch.mock.calls[0][0] as string;
    expect(call).toContain('from=GBDOV');
    expect(call).toContain('to=FRCAL');
    expect(call).toContain('date=2025-06-15');
    expect(call).toContain('page=1');
    expect(call).toContain('pageSize=10');
    expect(call).toContain('sort=durationMins');
    expect(call).toContain('order=asc');
  });

  test('returns search results on success', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    const result = await search({});

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  test('parses departure date in response', async () => {
    mockApiFetch.mockResolvedValueOnce(mockSearchResponse);

    const result = await search({});

    expect(result.data[0].departure).toBeInstanceOf(Date);
  });

  test('throws error when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValueOnce(new Error('Network error'));

    expect(search({})).rejects.toThrow('Network error');
  });

  test('throws error when response does not match schema', async () => {
    mockApiFetch.mockResolvedValueOnce({ invalid: 'data' });

    expect(search({})).rejects.toThrow();
  });
});
