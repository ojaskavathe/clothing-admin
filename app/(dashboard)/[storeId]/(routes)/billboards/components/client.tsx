"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { BillboardColumn, columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
};

export const BillboardClient = ({
  data
}: BillboardClientProps) => {

  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline sm: ml-2">Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="label"/>
      
      <Heading
        title="API"
        description="API calls for billboards"
      />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId"/>
    </>
  )
}