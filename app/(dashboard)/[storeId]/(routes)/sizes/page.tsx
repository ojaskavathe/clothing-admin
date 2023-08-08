import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ 
  params 
}: {
  params: { storeId: string }
}) => {

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map((items) => ({
    id: items.id,
    name: items.name,
    value: items.value,
    createdAt: format(items.createdAt, "MMM do, yyyy"),
    updatedAt: format(items.updatedAt, "MMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes}/>
      </div>
    </div>
  )
}

export default SizesPage;