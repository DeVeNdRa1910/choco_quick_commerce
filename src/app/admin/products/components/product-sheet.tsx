import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import CreateProductForm from "./create-product-form";
import { FormValuse } from "./create-product-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/http/api";
import { useNewProduct } from "@/store/product/product-store";
import { useToast } from "@/hooks/use-toast";

function ProductSheet() {
  const queryClient = useQueryClient();

  const { isOpen, onClose } = useNewProduct();
  const { toast } = useToast();
  // if request is pending then isPending is true
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Creating New Product",
        description: "New product created successfully",
        variant: "default",
      });
      onClose();
    },
  });

  const formSubmitHandler = (values: FormValuse) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", String(values.price));
    formData.append("description", values.description);
    formData.append("image", (values.image as FileList)[0]);

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

export default ProductSheet;
