import { Product } from "@/types";
import { api } from "./client"

// api is instance of axios

export const getAllProducts = async () => {
  const response = await api.get('/products');
  const {allProducts}: any = response.data
  console.log(allProducts); 
  return await allProducts as Product[];
};

export const createProduct = async (data: FormData) => {
  const resp = await api.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return resp.data;
}