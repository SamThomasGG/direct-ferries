import { z } from 'zod';

export const SailingSchema = z.object({
  id: z.string(),
  operator: z.string(),
  ship: z.string(),
  from: z.string(),
  to: z.string(),
  departure: z.coerce.date(),
  durationMins: z.number().optional(),
  price: z.number(),
});

export type Sailing = z.infer<typeof SailingSchema>;

export const SearchSchema = z.object({
  data: z.array(SailingSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type Search = z.infer<typeof SearchSchema>;
