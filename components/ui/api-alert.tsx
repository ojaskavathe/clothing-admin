"use client";

import { useState } from "react";
import { Check, Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiAlertProps {
  title: string,
  description: string,
  variant: "public" | "admin"
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin"
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive"
};

export const ApiAlert = ({
  title,
  description,
  variant = "public"
}: ApiAlertProps) => {

  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(description);
    setTimeout(() => {
      setCopied(false)
    }, 1000);
  }

  return (
    <Alert>
      <Server className="h-4 w-4"/>
      <AlertTitle className="flex items-center gap-x-2 font-semibold">
        {title}
        <Badge variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="ml-[-1.6rem] mt-4 flex items-center justify-between">
        <code className="w-full break-all flex items-center justify-between rounded bg-muted px-4 py-1 font-mono font-semibold text-sm ">
          {description}
          <Button variant="ghost" size="icon" onClick={onCopy} className="h-6 w-6 pl-2">
            {!copied
              ? <Copy className="h-4 w-4"/>
              : <Check className="h-4 w-4"/>
            }
          </Button>
        </code>
      </AlertDescription>
    </Alert>
  )
}