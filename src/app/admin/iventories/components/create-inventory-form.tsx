"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { inventoriesSchema } from "@/lib/validators/inventoriesSchema";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product, Warehouse } from "@/types";
import { getAllProducts, getAllWarehouses } from "@/http/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FormValuse = z.input<typeof inventoriesSchema>;

function CreateInventoryForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (formValues: FormValuse) => void;
  disabled: boolean;
}) {
  const form = useForm<z.infer<typeof inventoriesSchema>>({
    resolver: zodResolver(inventoriesSchema),
    defaultValues: {
      sku: "",
    },
  });

  const { data: warehouses, isLoading: isWarehousesLoading } = useQuery<Warehouse[]>(
    {
      queryKey: ['warehouse'],
      queryFn: getAllWarehouses
    }
  )

  const { data: products, isLoading: isProductLoading } = useQuery<Product[]>(
    {
      queryKey: ['products'],
      queryFn: getAllProducts
    }
  )

  const handleFormSubmit = (values: FormValuse) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g. AB123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warehouseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>warehouseId</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Warehouse ID" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isWarehousesLoading ? (
                      <SelectItem value="Loading">Loading...</SelectItem>
                    ) : (
                      <>
                        {warehouses &&
                          warehouses.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id ? item.id?.toString() : ""}
                            >
                              {`${item.name}-${item.pincode}`}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>productId</FormLabel>
              <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product ID" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isProductLoading ? (
                      <SelectItem value="Loading">Loading...</SelectItem>
                    ) : (
                      <>
                        {products &&
                          products.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id ? item.id?.toString() : ""}
                            >
                              {`${item.id}-${item.name}`}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {disabled ? <Loader2 className="size-4 animate-spin" /> : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default CreateInventoryForm;
