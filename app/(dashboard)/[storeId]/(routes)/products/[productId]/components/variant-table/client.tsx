"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { CategoryColumn, columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
};

export const CategoryClient = ({
  data
}: CategoryClientProps) => {

  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline sm: ml-2">Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="name"/>
      
      <Heading
        title="API"
        description="API calls for categories"
      />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
  )
}