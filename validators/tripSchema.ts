import { z } from 'zod';

export const tripSchema = z.object({
    id: z.number(),
    startTime: z.string(),
    endTime: z.string(),
    distance: z.number(),
    type: z.string(),
    amount: z.number(),
    duration: z.string(),
    amountType: z.string(),
    driverId: z.number(),
    vehicleId: z.number()
});

