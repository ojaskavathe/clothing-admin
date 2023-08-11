import prismadb from "@/lib/prismadb";

import ProductForm from "./components/product-form";
import { VariantsForm } from "./components/variants-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {

  const product = await prismadb.product.findUnique({
    where:{
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
      image: true
    }
  })

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
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
          <ProductForm 
            initialData={product} 
            categories={categories}
          />
          <VariantsForm 
            initialData={variants}
            sizes={sizes}
            colors={colors}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductPage;