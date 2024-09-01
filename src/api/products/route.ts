import { productSchema } from "@/lib/validators/productSchema";

export async function POST(request: Request){
  const data = await request.formData();

  let validateData;

  try {
    validateData = productSchema.parse({
      name: data.get('name'),
      description: data.get('description'),
      price: data.get('price'),
      image: data.get('image')
    })
  } catch (error: any) {
    return Response.json({message: error.message}, {status: 400})
  }

  const filename = `${Date.now()}.${validateData.image.name.split('.').at(-1)}`
  try {
    const buffer = Buffer
  } catch (error) {
    
  }

}