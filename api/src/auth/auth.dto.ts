import { z } from "zod";

// POST /api/auth/login
export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
  }),
});

export type LoginBody = z.infer<typeof loginSchema>["body"];
