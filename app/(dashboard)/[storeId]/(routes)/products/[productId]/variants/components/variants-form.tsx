"use client";

import { useState } from "react";
import { Color, Product, Size, Variant } from "@prisma/client";

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
import axios from "axios";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VariantsFormsProps {
  initialData: (Variant & {
    size: Size,
    color: Color,
  })[],
  product: Product | null,
  sizes: Size[],
  colors: Color[],
};

interface VariantInfo {
  sizeId: string;
  colorId: string;
  imageUrl: string;
  in_stock: number;
}

export const VariantsForm = ({
  initialData,
  product,
  sizes,
  colors
}: VariantsFormsProps) => {

  const [vColors, set_vColors] = useState<Color[]>(
    initialData
      ? initialData.map((v) => v.color)
      : []
  );
  const [colorString, setColorString] = useState("");

  const [vSizes, set_vSizes] = useState<Size[]>(
    initialData
      ? initialData.map((v) => v.size)
      : []
  );
  const [sizeString, setSizeString] = useState("");

  const [activeTab, setActiveTab] = useState("");

  const [variantInfo, setVariantInfo] = useState<VariantInfo[]>(
    initialData
      ? initialData.map((v) => {
        return {
          sizeId: v.sizeId,
          colorId: v.colorId,
          imageUrl: v.imageUrl,
          in_stock: v.in_stock
        }
      })
      : []
  );

  const params = useParams();

  const onSubmit = async () => {
    console.log(variantInfo);
    console.log("lol");

    // if (initialData) {
    //   // await axios.patch(`/api/${params.storeId}/products/${params.productId}`, variantInfo);
    // } else {
    //   await axios.post(`/api/${params.storeId}/products/${params.productId}/variants`, variantInfo);
    // }

  }

  return (
    <div>
      <Heading
        title={`${product?.name} - Variants`}
        description={`The different SKUs for ${product?.name}`}
      />
      <Separator className="mt-2" />

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
        <div className="mt-4 mb-6 space-y-4">
          <div className="flex items-center space-x-2 pt-4">

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
                const c = colors.filter(x => x.id === colorString)[0]
                if (!vColors.includes(c)) {
                  set_vColors(cl => cl.concat(c))
                  setActiveTab(c.id)
                }
              }}
            >
              Add Color
            </Button>
          </div>

          <div className={cn(
            "flex items-center space-x-2",
            (vColors.length < 1) && "display: hidden",
          )}>
            <Select value={colorString} onValueChange={setSizeString}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  !vSizes.includes(size) &&
                  <SelectItem
                    key={size.id}
                    value={size.id}
                  >
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => {
                const s = sizes.filter(x => x.id === sizeString)[0]
                if (!vSizes.includes(s)) {
                  set_vSizes(sz => sz.concat(s))

                  // Add image url to every new variant created on this size
                  if (!variantInfo.some(v => v.sizeId === s.id)) {
                    setVariantInfo(varInfo => {
                      let distinct: {
                        colorID: string,
                        imageUrl: string,
                        in_stock: number
                      }[] = []
                      varInfo.forEach(v => {
                        if (!distinct.some(d => d.colorID === v.colorId)) {
                          distinct = [...distinct, { 
                            colorID: v.colorId, 
                            imageUrl: v.imageUrl,
                            in_stock: v.in_stock
                          }]
                        }
                      })
                      return varInfo.concat(distinct.map(d => {
                        return {
                          sizeId: s.id,
                          colorId: d.colorID,
                          imageUrl: d.imageUrl,
                          in_stock: d.in_stock
                        }
                      }))
                    })
                  }
                }
              }}
            >
              Add Size
            </Button>
          </div>

          <div className="flex space-x-2">
            <Input className="w-[200px]"/>
            <Button>
              Set Base Price
            </Button>
          </div>
        </div>


        <Tabs
          defaultValue={vColors[0]?.id}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          orientation="vertical"
          className={cn(
            (vColors.length < 1) && "hidden",
            (vColors.length > 0) && "max-w-full w-[400px] flex",
            "h-full"
          )}>

          <Command className="w-[200px]">
            <CommandInput placeholder="Colors" />
            <CommandList>
              <ScrollArea className="h-auto">
                <CommandEmpty>No colors found.</CommandEmpty>
                <CommandGroup>
                  <TabsList className="flex w-full">
                    {vColors.map((c) => (
                      <CommandItem key={c.id} value={c.id} className="w-full">
                        <TabsTrigger value={c.id} className="text-left">
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
              key={c.id}
              value={c.id}
              className="w-full"
            >
              <Card className="h-auto">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center space-x-2">
                      <span>{c.name}</span>
                      <div
                        className="border-2 border-black border-opacity-[10%] p-2 rounded-md"
                        style={{ backgroundColor: `#` + c.value }}
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>lmao</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  
                  <div className={cn(
                    (vSizes.length < 1) && "display: hidden",
                  )}>
                    <Alert className={cn(
                      (variantInfo.filter(v => v.colorId === c.id).length > 0) && 
                      (vSizes.length > 0) && "display: hidden",
                      "my-4"
                    )}>
                      <AlertTitle>Image Required</AlertTitle>
                      <AlertDescription>Add an image to this color.</AlertDescription>
                    </Alert>
                    <ImageUpload
                      values={
                        variantInfo.find(v => c.id === v.colorId)?.imageUrl
                        ? [variantInfo.find(v => c.id === v.colorId)!.imageUrl]
                        : []
                      }
                      disabled={false}
                      onChange={( url ) => {
                        setVariantInfo(varInfo => {
                    
                          const ind = (varInfo
                            .findIndex(v => v.colorId === c.id && v.imageUrl === url));
                          if (ind > -1) {
                            return varInfo.map((v, i) => {
                              if(i === ind) {
                                return {
                                  sizeId: v.sizeId,
                                  colorId: v.colorId,
                                  imageUrl: url,
                                  in_stock: v.in_stock
                                }
                              } else {
                                return v
                              }
                    
                            })
                          }
                          return varInfo.concat(vSizes.map(s => {
                            return {
                              sizeId: s.id,
                              colorId: c.id,
                              imageUrl: url,
                              in_stock: 0
                            }
                          }))
                        })
                      }}
                      onRemove={( url ) => {
                        setVariantInfo(varInfo =>
                          varInfo.filter(v => v.imageUrl !== url)
                        )
                      }}
                    />
                  </div>

                  <Alert className={cn(
                    (vSizes.length > 0) && "display: hidden",
                    "my-4"
                  )}>
                    <AlertTitle>Sizes Required</AlertTitle>
                    <AlertDescription>Add some sizes to this product.</AlertDescription>
                  </Alert>
                  
                  <div className={cn(
                    (vSizes.length < 1) && "display: hidden",
                    (variantInfo.filter(v => v.colorId === c.id ).length < 1) && "display: hidden",
                    "border rounded-sm p-2 space-y-2 "
                  )}>
                    {vSizes.map((s) => (
                      <div className="flex items-center justify-between" key={s.id}>
                        <Label>{s.name}</Label>
                        <div className="flex items-center">
                          <Label className="text-xs text-muted-foreground">
                            In Stock:
                          </Label>
                          <Input 
                            className="ml-2 w-14 h-6" 
                            defaultValue={
                              variantInfo.find(v => 
                                v.sizeId === s.id && 
                                v.colorId === c.id
                              )?.in_stock || 0} 
                            onChange={(e) => {
                              setVariantInfo(varInfo => {
                                return varInfo.map(v => 
                                  v.sizeId === s.id && v.colorId === c.id
                                  ? {...v, in_stock: Number(e.target.value)}
                                  : v
                                )
                              })
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Button
          type="button"
          onClick={onSubmit}
        >
          Save
        </Button>
      </div>

    </div>
  )
}