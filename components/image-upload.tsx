"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void,
  onRemove: (value: string) => void,
  values: string[]
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  values
}: ImageUploadProps) => {
 
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  }

  if (!mounted) {
    return null;
  }
  
  return (
    <div>
      <div className="mb-4 flex items-center">
        {values.map((url => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => { onRemove(url) }}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              alt="Image"
              className="object-cover"
              src={url}
            />
          </div>
        )))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="vab5qkag">
        {({ open }) => {
          const onClick = () => {
            open();
          }

          return (
            <Button 
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}