import { db } from "@/lib/db/db";
import { product } from "@/lib/db/schema";
import { isServer, productSchema } from "@/lib/validators/productSchema";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
  const data = await request.formData();

  let validatedData;

  // validate incoming data from request
  try {
    validatedData = productSchema.parse({
      name: data.get('name'),
      description: data.get('description'),
      price: Number(data.get('price')),
      image: data.get('image')
    })
  } catch (error: any) {
    console.log("yaha tak sab thik hai");
    return NextResponse.json({message: error.message}, {status: 400})
  }


  //saving file locally
  const inputImage = isServer
        ? (validatedData.image as File)
        : (validatedData.image as FileList)[0];
  const filename = `${Date.now()}.${inputImage.name.split('.').slice(-1)}`; 

  try {
    const buffer = Buffer.from(await inputImage.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/assets', filename), buffer);
  } catch (error) {
    return NextResponse.json({message: "Failed to save the file to fs"}, {status: 500});
  }

  //upload image and create product in DB
  let craetedProduct;
  try {
    craetedProduct = await db.insert(product).values({...validatedData, image: filename})
    unlink(path.join(process.cwd(), "public/assets", filename))

  } catch (error) {
    unlink(path.join(process.cwd(), "public/assets", filename))
    return NextResponse.json({message: "Failed to delete image locally"}, {status: 500});
  }

  return NextResponse.json(
    {
      message: "Product created successfully", 
      craetedProduct
    }, 
    { status: 201 }
  );

}