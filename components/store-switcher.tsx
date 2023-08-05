"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
};

export default function StoreSwitcher({
  className,
  items = []
}: StoreSwitcherProps) {

  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();

  const stores = items.map((store) => ({
    name: store.name,
    id: store.id
  }));

  const currentStore = stores.find((store) => (store.id === params.storeId));

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: {name: string, id: string}) => {
    setOpen(false);
    router.push(`/${store.id}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select Store"
          className={cn("w-[200px] justify-between", className)}  
        >
          <StoreIcon className="mr-2 h-4 w-4"/>
            {currentStore?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4"/>
                  {store.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      store.id === currentStore?.id
                      ? "opacity-100"
                      : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 w-5 h-5"/>
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}