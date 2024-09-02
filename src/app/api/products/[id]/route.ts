import { db } from "@/lib/db/db";
import { product } from "@/lib/db/models";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  /*   const url = request.nextUrl
  console.log("Next URL:",url.searchParams);
  console.log("Next URL:",url.pathname);
  console.log("Next URL:",url.origin); */

  try {
    const getedProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, Number(id)))
      .limit(1);

    if (!getedProduct.length) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Product fetched successfully",
        product: getedProduct[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch a Product" },
      { status: 500 }
    );
  }
}
