"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./components/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryPersons } from "@/http/api";
import DeliveryPersonSheet from "./components/delivery-person-sheet";
import { useNewDeliveryPerson } from "@/store/deliveryPerson/delivery-person-store";
import { Loader2 } from "lucide-react";
import { DeliveryPerson as deliveryPersons } from "@/types";

function DeliveryPerson() {
  const {
    data: DeliveryPerson,
    isLoading,
    isError,
    error,
  } = useQuery<deliveryPersons[]>({
    queryKey: ["deliveryPersons"],
    queryFn: getAllDeliveryPersons,
  });

  const { onOpen } = useNewDeliveryPerson();

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Delivery Persons</h3>
        <Button size={"sm"} onClick={onOpen}>
          Add Delivery boy
        </Button>
        <DeliveryPersonSheet />
      </div>

      <div>
        {isError && error && (
          <span className="text-red-500">{error.message}</span>
        )}
      </div>

      {isLoading ? (
        <div className="w-full h-full">
          <Loader2 className="size-20 animate-spin mx-auto mt-[8rem]" />
        </div>
      ) : (
        <DataTable columns={columns} data={DeliveryPerson || []} />
      )}
    </>
  );
}

export default DeliveryPerson;
