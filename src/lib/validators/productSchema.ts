import { z } from "zod";

export const isServer = typeof window === "undefined";

export const productSchema = z.object({
  name: z.string({ message: "Product name should be a string" }).min(4),
  image: isServer ? z.string().url("Image must be a valid URL") :  z
  .custom<FileList>((file) => file instanceof FileList, {
    message: "Product image should be a file list",
  })
  .refine((file) => file.length === 1, {
    message: "You must upload exactly one image",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file[0]?.type),
    { message: "Image must be a valid image format (jpeg, jpg, or png)" }
  ),
  description: z.string({ message: "Product description should be a string" }).min(8),
  price: z.number({ message: "Product price should be a number" }),
});

// server side per server ko File aur file list ke bare me kuchh pata nahi hota, In the case of book we are using different streatgy express, we receive data from body and create newBook object provide link then work is done in this case we are validate the product Data by this schema thets why problem happened 
// is problem se bachne ke liye fontend and backend ke data ko validate karne ke liye isi method ka use karo -> export const isServer = typeof window === "undefined";