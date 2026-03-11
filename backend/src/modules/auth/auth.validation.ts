import z from "zod";

const passwordSchema = z.string().min(8).max(72);

export const registerSchema = z
  .strictObject({
    email: z.string().trim().email().max(254),
    username: z.string().min(3).max(30).optional(),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.strictObject({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});
