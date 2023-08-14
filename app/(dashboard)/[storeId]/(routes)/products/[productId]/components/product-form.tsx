"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Category, Product } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Trash } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean()
});

type ProductFormValues = z.infer<typeof FormSchema>;

interface ProductFormProps {
  initialData: Product | null
  categories: Category[]
};

const ProductForm = ({
  initialData,
  categories,
}: ProductFormProps) => {

  const params = useParams();
  const router = useRouter();
  const api_origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update Product" : "Create Product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: '',
      isFeatured: false,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products/`, data);
      }
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast({
        title: toastMessage
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in saving your product."
      });
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      toast({
        title: "Product deleted."
      });
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong.",
        description: "Make sure you remove all variants using this product first."
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        entity="product"
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData &&
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        }
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[200px] space-y-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Product Name" {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block">Category</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        defaultValue={field.value}
                      >
                        {field.value
                          ? categories.find(
                            (category) => category.id === field.value
                          )?.name
                          : "Select category"}
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandInput placeholder="Search Category..." />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup heading="Categories">
                          {categories.map((category) => (
                            <CommandItem
                              value={category.name}
                              key={category.id}
                              onSelect={() => {
                                form.setValue("categoryId", category.id)
                              }}
                              className="text-sm"
                            >
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>

                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Featured</FormLabel>
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;