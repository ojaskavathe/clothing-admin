"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  loading: boolean,
  entity: string
};

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  entity
}: AlertModalProps) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      title={`Delete ${entity}?`}
      description={`This will permanently delete this ${entity} and all data associated with it.`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        className="pt-6 space-x-2 flex items-center justify-end w-full"
      >
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  )
}