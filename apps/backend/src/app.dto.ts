import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const HealthResponseSchema = extendApi(
  z.object({
    status: extendApi(z.string(), {
      description: 'Health status',
      example: 'ok',
    }),
  }),
  { description: 'Health check response' },
);

export class HealthResponseDto extends createZodDto(HealthResponseSchema) {}
