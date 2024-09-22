import { db } from "@/lib/db/db";
import { deliveryPersons, warehouses } from "@/lib/db/models";
import { deliveryPersonSchema } from "@/lib/validators/deliveryPersonSchema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // create delivery-function
  const requestData = await request.json();
  //console.log("requested Data: " ,requestData);
  //console.log(typeof requestData.warehouseId);

  let validatedData = deliveryPersonSchema.safeParse(requestData);

  if (!validatedData.success) {
    console.log("Validation Error: ", validatedData.error);
    return NextResponse.json(
      {
        message: "Failed to validate delivery person data",
        error: validatedData.error.errors, // detailed error list from Zod
      },
      { status: 400 }
    );
  }

  //console.log("Data after Zod varification ", validatedData);

  const tempData = validatedData.data;

  try {
    // Check if delivery person with same details already exists
    const existingPerson = await db
      .select()
      .from(deliveryPersons)
      .where(eq(deliveryPersons.phone, tempData?.phone))
      .limit(1);

    if (existingPerson.length > 0) {
      console.log(existingPerson);

      return NextResponse.json(
        {
          message: "Delivery person already exists with these entries",
        },
        { status: 409 }
      );
    }

    // Insert new delivery person if not exists

    await db.insert(deliveryPersons).values(tempData);
    return NextResponse.json(
      {
        message: "Delivery Person created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to craete new delivery person",
        error,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // here we joine delivery_Persons table with warehouses table
    /*     const fetchedDeliveryPersons = await db
      .select()
      .from(deliveriPersons)
      .leftJoin(warehouses, eq(deliveriPersons.warehouseId, warehouses.id))
      .orderBy(desc(deliveriPersons.id)); 
      
      itene se ware house ki puri table deliveryPersons me add ho jaygi but hame naam akela chahiye 

      ham select ke andar likhenge ki hame kya kya chaihiye
*/
    const fetchedDeliveryPersons = await db
      .select({
        id: deliveryPersons.id,
        name: deliveryPersons.name,
        phone: deliveryPersons.phone,
        warehouse: warehouses.name,
        pincode: warehouses.pincode,
      })
      .from(deliveryPersons)
      .leftJoin(warehouses, eq(deliveryPersons.warehouseId, warehouses.id))
      .orderBy(desc(deliveryPersons.id));
    return NextResponse.json(
      {
        message: "Fetched delivery persons successfully",
        fetchedDeliveryPersons,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      message: "Failed to fetched delivery persons",
      error,
    });
  }
}
