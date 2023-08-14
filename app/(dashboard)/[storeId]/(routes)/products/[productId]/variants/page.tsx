import prismadb from "@/lib/prismadb";

import { VariantsForm } from "./components/variants-form";


const VariantsPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {

  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId
    }
  });

  const variants = await prismadb.variant.findMany({
    where: {
      productId: params.productId
    },
    include: {
      size: true,
      color: true,
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <VariantsForm 
            initialData={variants}
            product={product}
            sizes={sizes}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
}

export default VariantsPage;