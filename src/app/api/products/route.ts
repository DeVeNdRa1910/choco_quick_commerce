import { db } from "@/lib/db/db";
import { product } from "@/lib/db/models";
import { isServer, productSchema } from "@/lib/validators/productSchema";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse, NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import cloudinary from "@/lib/config/cloudinary";

export async function POST(request: NextRequest) {
  //TODO: check user acces bcz admin user can only create project

  const data = await request.formData();
  
  let validatedData;
  const productImage = data.get("image");
  // Check if the image exists and is a File
  if (!productImage || !(productImage instanceof File)) {
    return NextResponse.json({ message: "Product image is required and must be a file" }, { status: 400 });
  }

  // Get file details
  const productImageType = productImage.name.split('.').pop(); // Get the file extension
  const productImageName = productImage.name;

  // Convert the File to a buffer
  const buffer = Buffer.from(await productImage.arrayBuffer());
  let productImageUploadResult ;
  try {
    productImageUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          timeout: 60000,
          filename_override: productImageName,
          folder: 'choco',
          format: productImageType,
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return reject(new Error("Failed to upload to Cloudinary"));
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer); // Write buffer to the stream
    });
  } catch (error: any) {
    console.log("Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  

  // validate incoming data from request
  console.log(productImageUploadResult);
  
  try {
    validatedData = productSchema.parse({
      name: data.get("name"),
      description: data.get("description"),
      price: Number(data.get("price")),
      image: (productImageUploadResult as any).secure_url, // Save Cloudinary URL in DB
    });
  } catch (error : any) {
    console.log("Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  //saving file locally
  const filename = `${productImage.name}`;

  try {
    const buffer = Buffer.from(await productImage.arrayBuffer());
    await writeFile(
      path.join(process.cwd(), "public/assets", filename),
      buffer
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save the file to fs" },
      { status: 500 }
    );
  }

  //upload image and create product in DB
  let craetedProduct;
  try {
    craetedProduct = await db
      .insert(product)
      .values({ ...validatedData, image: (productImageUploadResult as any).secure_url });
    unlink(path.join(process.cwd(), "public/assets", filename));
  } catch (error) {
    unlink(path.join(process.cwd(), "public/assets", filename));
    return NextResponse.json(
      { message: "Failed to delete image locally" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Product created successfully",
      craetedProduct,
    },
    { status: 201 }
  );
}

export async function GET(request: NextRequest) {
  //this is public route
  try {
    const allProducts = await db
      .select()
      .from(product)
      .orderBy(desc(product.id));
    return NextResponse.json({ allProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch all Products" },
      { status: 500 }
    );
  }
}
