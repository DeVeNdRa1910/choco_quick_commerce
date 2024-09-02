import { z } from "zod";

export const inventoriesSchema = z.object({
  sku: z.string({message: "SKU should be a string "}).length(8, "SKU must have 8 chars"),
  warehouseId: z.number({message: "warehouse Id should be a number"}),
  productId: z.number({message: "Product Id should be a number"})
})