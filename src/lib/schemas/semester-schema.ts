import { z } from 'zod';

export const semesterSchema = z.object({
  ordinal: z.string().min(1, 'Ordinal is required'),
});

export type SemesterFormValues = z.infer<typeof semesterSchema>;
