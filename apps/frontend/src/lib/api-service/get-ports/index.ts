import { apiFetch } from '@/lib/api-service/api-fetch';
import {
  Ports,
  PortsSchema,
} from '@/lib/api-service/get-ports/get-ports.schema';

export async function getPorts(): Promise<Ports> {
  try {
    const data = await apiFetch<Ports>('search/ports', {
      revalidate: 3600, // Cache for 1 hour
      tags: ['ports'],
    });
    return PortsSchema.parse(data);
  } catch (e) {
    console.error(`Failed to fetch ports ${e}`);
    throw e;
  }
}
