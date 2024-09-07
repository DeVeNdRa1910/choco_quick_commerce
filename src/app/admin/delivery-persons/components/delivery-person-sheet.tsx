import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import CreateDeliveryPersonForm from "./create-deliveryPerson-form";
import { FormValuse } from "./create-deliveryPerson-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeliveryPerson } from "@/http/api";
import { useNewDeliveryPerson } from "@/store/deliveryPerson/delivery-person-store";
import { useToast } from "@/hooks/use-toast";

function DeliveryPersonSheet() {
  const queryClient = useQueryClient();

  const { isOpen, onClose } = useNewDeliveryPerson();
  const { toast } = useToast();
  // if request is pending then isPending is true
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["create-delivery-persons"],
    mutationFn: (data: FormData) => createDeliveryPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-persons"] });
      toast({
        title: "Creating New Delivery Persons",
        description: "New Delivery Persons successfully",
        variant: "default",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: error?.message || "Something went wrong with Inputs",
        variant: "destructive",
      });
    },
  });

  const formSubmitHandler = (values: FormValuse) => {
    console.log("values", values);
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("warehouseId", String(values.warehouseId));

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
        <CreateDeliveryPersonForm
          onSubmit={formSubmitHandler}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}

export default DeliveryPersonSheet;
