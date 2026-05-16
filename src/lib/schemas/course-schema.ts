import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  code: z.string().min(2, "Course code must be at least 2 characters long"),
  description: z.string().optional(),
  credits: z.number().min(1, "Credits must be at least 1"),
  semesterId: z.string().optional(),
  sessionId: z.string().optional(),
  maxStudents: z.number().min(1, "Must be at least 1 student"),
  teacherId: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
