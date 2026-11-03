
import { z } from "zod";

// Validate property information submitted by an owner.
export const propertySchema = z.strictObject({
  address: z.string().trim().min(1, "Address is required"),
  price: z.number().nonnegative("Price cannot be negative"),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  square_feet: z.number().int().positive(),
});

// TypeScript type generated from the validation schema.
export type PropertyInput = z.infer<typeof propertySchema>;
