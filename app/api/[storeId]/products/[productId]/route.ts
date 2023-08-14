import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
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

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    if (!isFeatured) {
      return new NextResponse("isFeatured is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId
      },
      data: {
        name: name,
        categoryId: categoryId,
        isFeatured: isFeatured
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
        storeId: params.storeId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}