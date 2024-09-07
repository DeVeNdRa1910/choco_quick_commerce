import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import CreateProductForm from "./create-warehouse-form";
import { FormValuse } from "./create-warehouse-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWarehouse } from "@/http/api";
import { useNewProduct } from "@/store/product/product-store";
import { useToast } from "@/hooks/use-toast";

function WarehouseSheet() {
  const queryClient = useQueryClient();

  const { isOpen, onClose } = useNewProduct();
  const { toast } = useToast();
  // if request is pending then isPending is true
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-warehouse"],
    mutationFn: (data: FormData) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      toast({
        title: "Creating New Warehouse",
        description: "New Warehouse created successfully",
        variant: "default",
      });
      onClose();
    },
  });

  const formSubmitHandler = (values: FormValuse) => {
    console.log("values", values);
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("pincode", String(values.pincode));

    mutate(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent className="space-y-2">
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>Add new Product in the store.</SheetDescription>
        </SheetHeader>
        <CreateProductForm onSubmit={formSubmitHandler} disabled={isPending} />
      </SheetContent>
    </Sheet>
  );
}

export default WarehouseSheet;
