import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";

const Navbar = async () => {

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId: userId
    }
  })

  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center h-16 pr-4">
          <StoreSwitcher items={stores} className="order-2 md:order-1"/>
          <MainNav className="order-1 md:order-2" />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar;