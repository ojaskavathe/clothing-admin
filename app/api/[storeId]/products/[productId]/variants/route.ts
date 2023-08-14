import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { name, categoryId, isFeatured } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
 
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        storeId: params.storeId,
        name: name,
        categoryId: categoryId,
        isFeatured: isFeatured
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log("[PRODUCTS_POST]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(products);

  } catch (error) {
    console.log("[PRODUCTS_GET]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}