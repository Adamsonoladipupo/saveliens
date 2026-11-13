import { z } from "zod";

const emailSchema = z
  .email("Enter a valid email address.")
  .trim()
  .toLowerCase();

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must not exceed 128 characters."),
    confirmPassword: z.string(),
    occupation: z.string().min(1, "Please select an occupation."),
    agreed: z.literal(true, {
      error: "You must confirm your age to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});