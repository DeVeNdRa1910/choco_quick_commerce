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
import { deliveryPersonSchema } from "@/lib/validators/deliveryPersonSchema";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllWarehouses } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "@/types";

export type FormValuse = z.input<typeof deliveryPersonSchema>;

function CreateDeliveryPersonForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (formValues: FormValuse) => void;
  disabled: boolean;
}) {
  const form = useForm<z.infer<typeof deliveryPersonSchema>>({
    resolver: zodResolver(deliveryPersonSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const {
    data: warehouses,
    isLoading,
    isError,
  } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses(),
  });

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tony Stark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +910000000000" {...field} />
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
              <FormLabel>Warehouse ID</FormLabel>
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
                    {isLoading ? (
                      <SelectItem value="Loading">Loading...</SelectItem>
                    ) : (
                      <>
                        {warehouses &&
                          warehouses.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id ? item.id?.toString() : ""}
                            >
                              {`${item.name}     ${item.pincode}`}
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

export default CreateDeliveryPersonForm;
