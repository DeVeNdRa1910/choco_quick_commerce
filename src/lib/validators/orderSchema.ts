import { z } from "zod";

export const orderSchema = z.object({
  productId: z.number({message: "Product ID is should be a number"}),
  pincode: z.string({message: "Pincode is should be a number"}).length(6, "Pincode should be 6 digit long"),
  qty: z.number({message: "Quantity ahould be number"}),
  address: z.string({message: "Add should be a string"})
})