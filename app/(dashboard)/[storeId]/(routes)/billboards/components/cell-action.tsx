"use client";

import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react"
import axios from "axios";
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BillboardColumn } from "./columns"
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: BillboardColumn;
};

export const CellAction = ({ 
  data 
} : { 
  data : BillboardColumn 
}) => {

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast({
      description: "Billboard ID copied."
    });
  }

  const OnEdit = () => {
    router.push(`/${params.storeId}/billboards/${data.id}`);
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.refresh();
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
            Copy Billboard ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={OnEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem  onClick={() => setOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};