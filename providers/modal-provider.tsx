"use client";

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  // This stops the server from rendering the Modal until the client has rendered it, preventing hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  )
}