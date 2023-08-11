"use client";

import { useState } from "react";
import { Color, Image, Size, Variant } from "@prisma/client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs-vertical";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/image-upload";

interface VariantsFormsProps {
  initialData: (Variant & {
    size: Size,
    color: Color,
    image: Image | null
  })[],
  sizes: Size[],
  colors: Color[],
};

export const VariantsForm = ({
  initialData,
  sizes,
  colors
} : VariantsFormsProps) => {
  
  const [vColors, set_vColors] = useState<Color[]>(
    initialData
    ? initialData.map((v) => v.color)
    : []
  );
  const [colorString, setColorString] = useState("");

  return (
    <div>
      <Heading
        title="Variants"
        description="The different SKU's of this product"
      />
      <Separator className="mt-2"/>
      
      <Alert className={cn(
        (sizes.length > 0) && "display: hidden",
        "my-4"
      )}>
        <AlertTitle>Sizes Required</AlertTitle>
        <AlertDescription>Add some sizes to your store first!</AlertDescription>
      </Alert>
      <Alert className={cn(
        (vColors.length > 0) && "display: hidden",
        "my-4"
      )}>
        <AlertTitle>Colors Required ({vColors.length})</AlertTitle>
        <AlertDescription>Add some colors!</AlertDescription>
      </Alert>

      <div className={cn(
          (sizes.length < 1) && "display: hidden",
          "mt-4 mb-12"
        )}>
        <div className="mt-4 mb-6">
          <div className="pt-4 flex items-center space-x-2">
            <Select value={colorString} onValueChange={setColorString}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  !vColors.includes(color) &&
                  <SelectItem
                    key={color.id}
                    value={color.id}
                  >
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => {
                const s = colors.filter(x => x.id === colorString)[0]
                set_vColors(cl => cl.concat(s))
                console.log(vColors)
              }}
            >
              Add Color
            </Button>
          </div>
        </div>
        
        
        <Tabs 
          defaultValue={vColors[0]?.name}
          orientation="vertical"
          className={cn(
            (vColors.length < 1) && "hidden",
            (vColors.length > 0) && "max-w-full w-[400px] flex"
        )}>
          
          <Command className="w-[200px]">
            <CommandInput placeholder="Colors" />
            <CommandList>
              <ScrollArea className="h-auto">
                <CommandEmpty>No colors found.</CommandEmpty>
                <CommandGroup>
                  <TabsList className="flex w-full">
                    {vColors.map((c) => (
                      <CommandItem value={c.name} className="w-full">
                        <TabsTrigger value={c.name} className="text-left">
                          {c.name}
                        </TabsTrigger>
                      </CommandItem>
                    ))}
                  </TabsList>
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
          
          {vColors.map((c) => (
            <TabsContent 
              value={c.name}
              className="w-full"
            >
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center space-x-2">
                      <span>{c.name}</span>
                      <div
                        className="border-2 border-black border-opacity-[10%] p-2 rounded-md"
                        style={{backgroundColor: `#` + c.value}}
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>lmao</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">

                  <ImageUpload 
                    values={[]}
                    disabled={false}
                    onChange={() => {}}
                    onRemove={() => {}}
                  />

                  {sizes.map((s) => (
                    <div className="flex items-center space-x-2">
                      <span>{s.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

    </div>
  )
}