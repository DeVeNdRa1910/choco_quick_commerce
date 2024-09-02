import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/models";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const requestData = await request.json();

  let validatedData;

  try {
    validatedData = await warehouseSchema.parse(requestData);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  try {
    const resp = await db.insert(warehouses).values(validatedData);
    return NextResponse.json(
      {
        message: "warehouse created successfully",
        resp,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Making of warehouse is failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const allWarehouse = await db.select().from(warehouses);
    return NextResponse.json({ allWarehouse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "All warehouse fetching failed" },
      { status: 500 }
    );
  }
}
