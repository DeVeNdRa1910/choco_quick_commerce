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
import { useMutation } from "@tanstack/react-query";


function ProductSheet() {


  const onSubmit = (values: FormValuse) => {
    console.log('values', values);
    const formData = new FormData();
    formData.append("name", values.name)
    formData.append("price", String(values.price))
    formData.append("description", values.description)
    formData.append("image", (values.image as FileList)[0])
  }

  return (
    <Sheet open={true}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent className="space-y-2">
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>Add new Product in the store.</SheetDescription>
        </SheetHeader>
        <CreateProductForm onSubmit={onSubmit}/>
      </SheetContent>
    </Sheet>
  );
}

export default ProductSheet;
