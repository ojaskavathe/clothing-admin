import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ 
  params 
}: {
  params: { storeId: string }
}) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((items) => ({
    id: items.id,
    label: items.label,
    createdAt: format(items.createdAt, "MMM do, yyyy"),
    updatedAt: format(items.updatedAt, "MMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
  )
}

export default BillboardsPage;