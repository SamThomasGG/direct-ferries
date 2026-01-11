import { z } from 'zod';

export const PortsSchema = z.object({ data: z.array(z.string()) });

export type Ports = z.infer<typeof PortsSchema>;
