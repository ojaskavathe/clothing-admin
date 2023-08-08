"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Color } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Trash } from "lucide-react";

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

const FormSchema = z.object({
  name: z.string().min(1),
  value: z.string()
          .regex(/^([0-9A-F]{3}){1,2}$/i, {
            message: "Color value should be in Hex. Eg. FFF, A3B4F8"
          })
});

type ColorFormValues = z.infer<typeof FormSchema>;

interface ColorFormProps {
  initialData: Color | null
};

const ColorForm = ({
  initialData
}: ColorFormProps) => {

  const params = useParams();
  const router = useRouter();
  const api_origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update Color" : "Create Color";
  const description = initialData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    }
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if(initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors/`, data);
      }
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast({
        title: toastMessage
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in saving your color."
      });
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.sizeId}`);
      router.push(`/${params.storeId}/colors`);
      toast({
        title: "Color deleted."
      });
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong.",
        description: "Make sure you remove all products using this color first."
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
        entity="size"
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
          <div className="sm:grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading} 
                      placeholder="Color name" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2 items-center">
                        <div className="flex items-center space-x-2 rounded-md border border-input">
                          <Hash color="#9c9c9c" className="w-5 h-5 ml-2"/>
                          <Input 
                            disabled={loading} 
                            placeholder="color value (hex)" {...field} 
                          />
                        </div>
                        <div
                          className="border-2 border-black border-opacity-[10%] p-4 rounded-full"
                          style={{backgroundColor: `#` + field.value}}
                        />
                      </div>
                    </FormControl>
                  <FormMessage />
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

export default ColorForm;