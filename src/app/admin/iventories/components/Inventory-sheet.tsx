import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import CreateInventoryForm from "./create-inventory-form";
import { FormValuse } from "./create-inventory-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventory } from "@/http/api";
import { useNewInventory } from "@/store/inventory/inventory-store";
import { useToast } from "@/hooks/use-toast";

function InventorySheet() {
  const queryClient = useQueryClient();

  const { isOpen, onClose } = useNewInventory();
  const { toast } = useToast();
  // if request is pending then isPending is true
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-inventory"],
    mutationFn: (data: FormData) => createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Inventory",
        description: "New product created successfully",
        variant: "default",
      });
      onClose();
    },
  });

  const formSubmitHandler = (values: FormValuse) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("sku", values.sku);
    formData.append("warehouseId", String(values.warehouseId));
    formData.append("productId", String(values.productId));

    mutate(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent className="space-y-2">
        <SheetHeader>
          <SheetTitle>Create Inventory</SheetTitle>
          <SheetDescription>Add new Inventory in the store.</SheetDescription>
        </SheetHeader>
        <CreateInventoryForm
          onSubmit={formSubmitHandler}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}

export default InventorySheet;
