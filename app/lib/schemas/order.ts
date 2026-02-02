import { z } from "zod";

export const createOrderSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Delivery address must be at least 10 characters"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  items: z
    .array(
      z.object({
        mealId: z.string().uuid("Invalid meal ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required"),
});
