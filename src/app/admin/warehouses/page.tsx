'use client'

import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./components/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/http/api";
import { Warehouse } from "@/types";
import WarehouseSheet from "./components/warehouse-sheet";
import { useNewWarehouse } from "@/store/warehouse/warehouse-store"; 
import { Loader2 } from "lucide-react";

function Warehouses() {

  const {
    data: warehouses,
    isLoading,
    isError,
    error,
  } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: getAllWarehouses,
  });

  const { onOpen } = useNewWarehouse();

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Our Warehouses</h3>
        <Button size={"sm"} onClick={onOpen}>
          Add Warehouse
        </Button>
        <WarehouseSheet />
      </div>

      <div>
        {isError && <span className="text-red-500">{error.message}</span>}
      </div>

      {isLoading ? (
        <div className="w-full h-full">
          <Loader2 className="size-20 animate-spin mx-auto mt-[8rem]" />
        </div>
      ) : (
        <DataTable columns={columns} data={warehouses || []} />
      )}
    </>
  )
}

export default Warehouses
