import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const guestSessionSchema = z.object({
  sessionToken: z.string().uuid("Invalid session token"),
});

export type GuestSessionInput = z.infer<typeof guestSessionSchema>;
