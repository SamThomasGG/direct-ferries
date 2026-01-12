import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { getPorts } from './index';

const mockApiFetch = mock(() => Promise.resolve({ data: [] }));

mock.module('@/lib/api-service/api-fetch', () => ({
  apiFetch: mockApiFetch,
}));

describe('getPorts', () => {
  beforeEach(() => {
    mockApiFetch.mockClear();
  });

  test('calls apiFetch with correct endpoint and caching options', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: ['GBDOV', 'FRCAL'] });

    await getPorts();

    expect(mockApiFetch).toHaveBeenCalledWith('search/ports', {
      revalidate: 3600,
      tags: ['ports'],
    });
  });

  test('returns ports data on success', async () => {
    const mockPorts = { data: ['GBDOV', 'FRCAL', 'FRDUN'] };
    mockApiFetch.mockResolvedValueOnce(mockPorts);

    const result = await getPorts();

    expect(result).toEqual(mockPorts);
  });

  test('validates response with PortsSchema', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: ['GBDOV'] });

    const result = await getPorts();

    expect(result.data).toBeArray();
    expect(result.data[0]).toBeString();
  });

  test('throws error when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValueOnce(new Error('Network error'));

    expect(getPorts()).rejects.toThrow('Network error');
  });

  test('throws error when response does not match schema', async () => {
    mockApiFetch.mockResolvedValueOnce({ invalid: 'data' });

    expect(getPorts()).rejects.toThrow();
  });
});
