import { NextRequest, NextResponse } from "next/server";
import { inventoriesSchema } from "@/lib/validators/inventoriesSchema";
import { db } from "@/lib/db/db";
import { inventories, product, warehouses } from "@/lib/db/models";
import { desc, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const requestData = await request.json();

  console.log(requestData);
  

  let validatedData;
  try {
    validatedData = await inventoriesSchema.parse(requestData);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }

  try {
    await db.insert(inventories).values(validatedData);
    return NextResponse.json(
      {
        message: "New Inventory created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to store the inventory into the database",
        error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allInventories = await db
      .select({
        id: inventories.id,
        sku: inventories.sku,
        warehouse: warehouses.name,
        product: product.name
      })
      .from(inventories)
      .orderBy(desc(inventories.id))
      .leftJoin(warehouses, eq(inventories.warehouseId, warehouses.id))
      .leftJoin(product, eq(product.id , inventories.productId));
    return NextResponse.json({ allInventories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to Recieved all inventories",
        error,
      },
      { status: 500 }
    );
  }
}
