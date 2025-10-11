import { date, z } from 'zod';

export const tripSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
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

