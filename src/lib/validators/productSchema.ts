import z from "zod";

export const productSchema = z.object({
  name: z.string(),
  image: z.instanceof(File, {message: "Product image should be a file"}),
  description: z.string(),
  price: z.number()
})

export const userSchema = z.object({

})

export const orderSchema = z.object({
  
})

export const invantoriSchema = z.object({

})

export const warehousSechema = z.object({

})

export const deliveryPersonSchema = z.object({

})