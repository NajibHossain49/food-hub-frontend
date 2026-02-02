import { z } from "zod";

export const createReviewSchema = z.object({
  mealId: z.string().uuid("Invalid meal ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment is too long"),
});
