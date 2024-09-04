import { Product } from "@/types";
import { api } from "./client"

 export const getAllProducts = async () => {
  const resp = await api.get("/products");
  return resp.data as Product[];
}