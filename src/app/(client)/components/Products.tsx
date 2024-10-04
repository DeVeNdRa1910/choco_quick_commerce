"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/http/api";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const skeletons = Array.from({ length: 4 });
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 10 * 1000,
  });

  console.log(products);
  
  return (
    <section className="px-5 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-5">
          <Separator className="h-0.5 w-20 bg-brown-900" />
          <h2 className="text-3xl font-bold tracking-tight text-brown-900">
            Products
          </h2>
          <Separator className="h-0.5 w-20 bg-brown-900" />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            <>
              {skeletons.map((_, i) => (
                <div key={i} className="flex h-full w-full flex-col gap-5">
                  <Skeleton className="aspect-square w-full rounded-md bg-amber-100" />
                  <Skeleton className="h-5 w-full rounded-md bg-amber-100" />
                  <Skeleton className="h-5 w-10 rounded-md bg-amber-100" />
                  <Skeleton className="h-8 w-full rounded-md bg-amber-100" />
                </div>
              ))}
            </>
          ) : (
            <>
              {products?.map((product: Product) => {
                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-5 shadow-md shadow-amber-600 rounded-md h-[70vh]"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={0}
                      height={0}
                      sizes="100"
                      style={{ width: "100%", height:"70%" }}
                      className="rounded-t-md object-cover object-top shadow-lg hover:cursor-pointer "
                    />

                    <div className="w-full h-[30%] px-4 pb-4">
                      
                      <div className="flex justify-between items-center mx-2" >
                        <p className="capitalize text-lg font-semibold">
                          {product.name}
                        </p>
                        <div className="mt-1 space-x-2">
                          <span className="font-bold">${product.price}</span>
                        </div>
                      </div>

                      <Link href={`/product/${product.id}`}>
                        <Button
                          size={"sm"}
                          className="mt-5 w-full bg-amber-900 hover:bg-amber-800 active:bg-amber-700 text-white text-lg"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
