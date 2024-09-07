"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { warehouseSchema } from "@/lib/validators/warehouseSchema"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export type FormValuse = z.input<typeof warehouseSchema>

function CreateProductForm({onSubmit, disabled}:{onSubmit: (formValues: FormValuse)=>void, disabled: boolean}) {

  const form = useForm<z.infer<typeof warehouseSchema>>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      pincode: "",
    }
  })

  const handleFormSubmit = (values: FormValuse) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Warehouse Bhopal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pinocde</FormLabel>
              <FormControl>
              <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled} >
          {disabled? <Loader2 className="size-4 animate-spin"/> : "Create"}
        </Button>
      </form>
    </Form>
  )
}

export default CreateProductForm
