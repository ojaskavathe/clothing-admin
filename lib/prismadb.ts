import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
};

// prevents hot reload from making a new prisma client on every reload
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prismadb;
}

export default prismadb;