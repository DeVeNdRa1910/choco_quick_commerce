import { Product } from "@/types";
import { api } from "./client"

// api is instance of axios

export const getAllProducts = async () => {
  const response = await api.get('/products');
  const {allProducts}: any = response.data
  console.log(allProducts); 
  return allProducts as Product[];
};