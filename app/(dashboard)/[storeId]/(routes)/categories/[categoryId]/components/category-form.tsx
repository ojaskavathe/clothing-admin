"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Billboard, Category } from "@prisma/client";
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
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof FormSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
};

const CategoryForm = ({
  initialData,
  billboards
}: CategoryFormProps) => {

  const params = useParams();
  const router = useRouter();
  const api_origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if(initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/categories/`, data);
      }
      router.push(`/${params.storeId}/categories`);
      router.refresh();
      toast({
        title: toastMessage
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in saving your category."
      });
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.push(`/${params.storeId}/categories`);
      toast({
        title: "Category deleted."
      });
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong.",
        description: "Make sure you've removed all products using this category first."
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
        entity="category"
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        { initialData && 
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading} 
                      placeholder="Category Name" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          size="sm"
                          role="combobox"
                          aria-expanded={open}
                          aria-label="Select Billboard"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          defaultValue={field.value}
                        >
                          {field.value 
                            ? billboards.find(
                              (billboard) => billboard.id === field.value
                            )?.label
                            : "Select billboard"}
                          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search Billboard..." />
                          <CommandEmpty>No billboard found.</CommandEmpty>
                          <CommandGroup heading="Billboards">
                            {billboards.map((billboard) => (
                              <CommandItem
                                value={billboard.label}
                                key={billboard.id}
                                onSelect={() => {
                                  form.setValue("billboardId", billboard.id)
                                }}
                                className="text-sm"
                              >
                                {billboard.label}
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


          </div>
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

export default CategoryForm;