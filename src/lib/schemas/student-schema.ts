import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  studentId: z.string().optional(),
  phone: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export const editStudentSchema = z.object({
  name: z.string().min(1, 'Name is required e.g. "John Doe"'),
  studentId: z.string().optional(),
  phone: z.string().optional(),
});

export type EditStudentFormValues = z.infer<typeof editStudentSchema>;
