"use client";

import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react"
import axios from "axios";
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ProductColumn } from "./columns"
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn;
};

export const CellAction = ({ 
  data 
} : CellActionProps) => {

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(data.id);
    toast({
      description: "Product ID copied."
    });
  }

  const OnEdit = () => {
    router.push(`/${params.storeId}/products/${data.id}`);
  }

  const OnEditVariants = () => {
    router.push(`/${params.storeId}/products/${data.id}/variants`);
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      router.refresh();
      toast({
        title: "Product deleted."
      });
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong.",
        description: "Make sure you remove all variants of this product first."
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onCopy}>
            Copy Product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={OnEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem  onClick={OnEditVariants}>Variants</DropdownMenuItem>
          <DropdownMenuItem  onClick={() => setOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};