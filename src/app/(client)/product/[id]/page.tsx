"use client";
import { getSingleProduct, placeOrder } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import { Loader2, Star } from "lucide-react";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { orderSchema } from "@/lib/validators/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";


type CustomError = {
  message: string;
};

function SingleProduct() {
  // check is user Loggedin
  const { data: session } = useSession();
  // console.log(session);
  const pathName = usePathname();
  const { toast } = useToast()
  const params = useParams();
  // console.log(params);

  const { id } = params;

  // user can order single item and more then on quantity
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      address: "",
      pincode: "",
      qty: 1,
      productId: Number(id),
    },
  });

  const {
    data: product,
    isLoading,
    isPending,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id as string),
  });

  const { mutate } = useMutation({
    mutationKey: ['create-invoce'],
    mutationFn: (data: FormValues) => placeOrder({...data, productId: Number(id)}),
    onSuccess: (data: any) => {
      window.location.href = data.paymentUrl;
    },
    onError: (err: any) => {
      if (err.response?.data) {
          const customErr = err.response.data as CustomError;
          console.error(customErr.message);
          toast({
              title: customErr.message,
              color: 'red',
          });
      } else {
          console.error(err);
          toast({ title: 'Unknown error' });
      }
  },
  })
  type FormValues = z.infer<typeof orderSchema>;
  const handleFormSubmit = (values: FormValues) => {
    //submit form on Backend
    mutate(values)
  };

  const qty = form.watch("qty");

  const price = useMemo(() => {
    if (product?.price) {
      return product.price * qty;
    }
  }, [qty, product]);

  return (
    <>
      <Header />
      <section className="h-full ">
        <div className="w-[90vw] h-full mx-auto grid grid-cols-1 md:grid-cols-2">
          <div className="min-h-[80vh] ">
            {isLoading ? (
              <Skeleton className="aspect-square w- [28rem] bg-amber-200" />
            ) : (
              <Image
                src={product?.image || ""}
                alt={product?.name || ""}
                width={0}
                height={0}
                sizes="100vw"
                className="aspect-square w-[28rem] h-[75vh] rounded-md object-cover shadow-2xl mx-auto mt-8"
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="flex flex-1 flex-col gap-y-2">
                <Skeleton className="h-4 w-16 bg-amber-100" />
                <Skeleton className="h-10 w-2/3 bg-amber-100" />
                <div className="flex items-center gap-x-3">
                  <div className="flex items-center gap-x-0.5">
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" />
                  </div>
                  <span className="text-sm">144 Reviews</span>
                </div>
                <Skeleton className="mt-2 h-28 w-full bg-amber-100" />
                <Separator className="my-6 bg-amber-900" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-28 bg-amber-100" />
                  <Skeleton className="h-10 w-60 bg-amber-100" />
                </div>
              </div>
            ) : (
              <div className="min-h-[80vh] pl-10 mt-8 flex flex-1 flex-col gap-y-2">
                <h2 className="text-sm font-semibold text-amber-700">
                  BRAND NAME
                </h2>
                <h2 className="text-4xl font-semibold text-amber-900">
                  {product?.name}
                </h2>
                <div className="flex items-center gap-x-3">
                  <div className="flex items-center gap-x-0.5">
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" />
                  </div>
                  <span className="text-sm">144 Review</span>
                </div>

                <p className="mt-1">{product?.description}</p>

                {/* user details by Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-x-2 mt-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({field}) => {
                          return (
                            <FormItem className="w-3/6">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="border-amber-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-0"
                                  placeholder="e.g. Open street, 55"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({field}) => {
                          return (
                            <FormItem className="w-2/6">
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-9 border-brown-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brown-400 focus-visible:ring-offset-0"
                                  placeholder="e.g. 123456"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="qty"
                        render={({field}) => {
                          return (
                            <FormItem className="w-1/6">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-9 border-brown-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 focus-visible:ring-offset-0"
                                  placeholder="e.g. 3"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <Separator className="my-6 bg-amber-900 " />
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-semibold">₹{price}</span>
                      {session ? (
                        <Button type="submit" disabled={isPending}>
                          {isPending && (
                            <>
                              <Loader2 className="mr-2 size-5 animate-spin" />
                            </>
                          )}
                          <span>Buy Now</span>
                        </Button>
                      ) : (
                        <Link href={`/qpi/auth/signin?callbackUrl=${pathName}`}>
                          <Button>Buy Now </Button>
                        </Link>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SingleProduct;
