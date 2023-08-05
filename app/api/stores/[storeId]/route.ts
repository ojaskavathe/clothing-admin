import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!name) { 
      return new NextResponse("Name is required", { status: 400 })
    }

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        userId: userId
      },
      data: {
        name: name
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.delete({
      where: {
        id: params.storeId,
        userId: userId
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE ]:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}