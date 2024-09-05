"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/http/api";
import { Product } from "@/types";
import ProductSheet from "./product-sheet";
import { useNewProduct } from "@/store/product/product-store";


function products() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const {onOpen} = useNewProduct()

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Products</h3>
        <Button size={"sm"} onClick={onOpen}>Add Product</Button>
        <ProductSheet />
      </div>
      <DataTable columns={columns} data={products || []} />
    </>
  );
}

export default products;
