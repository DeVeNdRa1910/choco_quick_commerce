"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./components/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/http/api";
import { Product } from "@/types";
import ProductSheet from "./components/product-sheet";
import { useNewProduct } from "@/store/product/product-store";
import { Loader2 } from "lucide-react";

function products() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { onOpen } = useNewProduct();

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Products</h3>
        <Button size={"sm"} onClick={onOpen}>
          Add Product
        </Button>
        <ProductSheet />
      </div>

      <div>
        {isError && <span className="text-red-500">{error.message}</span>}
      </div>

      {isLoading ? (
        <div className="w-full h-full">
          <Loader2 className="size-20 animate-spin mx-auto mt-[8rem]" />
        </div>
      ) : (
        <DataTable columns={columns} data={products || []} />
      )}
    </>
  );
}

export default products;
