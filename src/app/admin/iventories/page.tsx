"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./components/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllInventories } from "@/http/api";
import { Inventory } from "@/types";
import InventorySheet from "./components/Inventory-sheet";
import { useNewInventory } from "@/store/inventory/inventory-store"; 
import { Loader2 } from "lucide-react";

function Inventories() {
  const {
    data: inventories,
    isLoading,
    isError,
    error,
  } = useQuery<Inventory[]>({
    queryKey: ["inventories"],
    queryFn: getAllInventories,
  });

  const { onOpen } = useNewInventory();

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight">Inventories</h3>
        <Button size={"sm"} onClick={onOpen}>
          Add Inventory
        </Button>
        <InventorySheet />
      </div>

      <div>
        {isError && <span className="text-red-500">{error.message}</span>}
      </div>

      {isLoading ? (
        <div className="w-full h-full">
          <Loader2 className="size-20 animate-spin mx-auto mt-[8rem]" />
        </div>
      ) : (
        <DataTable columns={columns} data={inventories || []} />
      )}
    </>
  );
}

export default Inventories;
