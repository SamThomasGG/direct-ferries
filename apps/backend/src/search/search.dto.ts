import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const SearchQuerySchema = z.object({
  from: extendApi(z.string().optional(), {
    description: 'Departure port code',
    example: 'GBDOV',
  }),
  to: extendApi(z.string().optional(), {
    description: 'Arrival port code',
    example: 'FRCAL',
  }),
  date: extendApi(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in ISO format (YYYY-MM-DD)')
      .optional(),
    { description: 'Departure date (YYYY-MM-DD)', example: '2025-06-15' },
  ),
  sort: extendApi(
    z.enum(['price', 'durationMins', 'departure']).optional().default('price'),
    { description: 'Sort field', example: 'price' },
  ),
  order: extendApi(z.enum(['asc', 'desc']).optional().default('asc'), {
    description: 'Sort order',
    example: 'asc',
  }),
  page: extendApi(z.coerce.number().int().min(1).default(1), {
    description: 'Page number',
    example: 1,
  }),
  pageSize: extendApi(z.coerce.number().int().min(1).max(50).default(10), {
    description: 'Results per page (max 50)',
    example: 10,
  }),
});

export type SearchQueryDTO = z.infer<typeof SearchQuerySchema>;

export const FerrySchema = extendApi(
  z.object({
    id: extendApi(z.string(), { description: 'Ferry ID' }),
    operator: extendApi(z.string(), {
      description: 'Ferry operator name',
      example: 'BlueWave Ferries',
    }),
    ship: extendApi(z.string(), {
      description: 'Ship name',
      example: 'MV Horizon',
    }),
    from: extendApi(z.string(), {
      description: 'Departure port code',
      example: 'GBDOV',
    }),
    to: extendApi(z.string(), {
      description: 'Arrival port code',
      example: 'FRCAL',
    }),
    departure: extendApi(z.coerce.date(), {
      description: 'Departure date/time',
      example: '2025-06-15T10:30:00Z',
    }),
    durationMins: extendApi(z.number(), {
      description: 'Trip duration in minutes',
      example: 112,
    }),
    price: extendApi(z.number(), {
      description: 'Price in cents',
      example: 4999,
    }),
  }),
  { description: 'Ferry crossing details' },
);

export const SearchResponseSchema = extendApi(
  z.object({
    data: z.array(FerrySchema),
    total: extendApi(z.number(), {
      description: 'Total number of results',
      example: 4,
    }),
    page: extendApi(z.number(), {
      description: 'Current page number',
      example: 1,
    }),
    pageSize: extendApi(z.number(), {
      description: 'Results per page',
      example: 10,
    }),
  }),
  { description: 'Paginated search results' },
);

export const PortsResponseSchema = extendApi(
  z.object({
    data: extendApi(z.array(z.string()), {
      description: 'List of port codes',
      example: ['FRCAL', 'GBDOV'],
    }),
  }),
  { description: 'Available ports' },
);

export class SearchQueryDto extends createZodDto(SearchQuerySchema) {}
export class SearchResponseDto extends createZodDto(SearchResponseSchema) {}
export class PortsResponseDto extends createZodDto(PortsResponseSchema) {}
