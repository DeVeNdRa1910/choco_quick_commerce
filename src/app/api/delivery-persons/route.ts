import { db } from "@/lib/db/db";
import { deliveriPersons } from "@/lib/db/models";
import { deliveryPersonSchema } from "@/lib/validators/deliveryPersonSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // create delivery-function
  const requestData = await request.json();
  // console.log(requestData);

  let validatedData;

  try {
    validatedData = deliveryPersonSchema.parse(requestData);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to validate delivery person data",
        error,
      },
      { status: 400 }
    );
  }

  console.log(validatedData);

  try {
    // Check if delivery person with same details already exists
    const existingPerson = await db
      .select()
      .from(deliveriPersons)
      .where(eq(deliveriPersons.phone, validatedData.phone))
      .limit(1);

    if (existingPerson) {
      return NextResponse.json(
        {
          message: "Delivery person already exists with these entries",
        },
        { status: 409 }
      );
    }

    // Insert new delivery person if not exists

    await db.insert(deliveriPersons).values(validatedData);
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
