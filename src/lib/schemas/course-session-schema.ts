import { z } from 'zod';

export const courseSessionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
});

export type CourseSessionFormValues = z.infer<typeof courseSessionSchema>;
