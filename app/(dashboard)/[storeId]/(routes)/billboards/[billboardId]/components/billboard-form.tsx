"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

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
import { ImageUpload } from "@/components/image-upload";

const FormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof FormSchema>;

interface BillboardFormProps {
  initialData: Billboard | null
};

const BillboardForm = ({
  initialData
}: BillboardFormProps) => {

  const params = useParams();
  const router = useRouter();
  const api_origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Update Billboard" : "Create Billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    }
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if(initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards/`, data);
      }
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      toast({
        title: toastMessage
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in saving your billboard."
      });
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Billboard deleted."
      });
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong.",
        description: "Make sure you remove all categories using this billboard first."
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
        entity="billboard"
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    values={field.value ? [field.value] : []}
                    disabled={false}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => {field.onChange("")}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading} 
                      placeholder="Billboard label" {...field} 
                    />
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

export default BillboardForm;