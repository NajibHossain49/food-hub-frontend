import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
  image: z.string().url("Invalid URL").optional(),
});

export const createProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
});
