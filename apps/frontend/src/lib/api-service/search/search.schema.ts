import { z } from 'zod';

export const FerrySchema = z.object({
  id: z.string(),
  operator: z.string(),
  ship: z.string(),
  from: z.string(),
  to: z.string(),
  departure: z.coerce.date(),
  durationMins: z.number().optional(),
  price: z.number(),
});

export type Ferry = z.infer<typeof FerrySchema>;

export const SearchSchema = z.object({
  data: z.array(FerrySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type Search = z.infer<typeof SearchSchema>;
