"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import IconGfontsBig from "../icon-gfonts/inconbig";

type ConfirmRemovePostePropsType = {
  description: string;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  openMap ?: () => void;
  openModalSubmitFile ?: () => void;
  navigateByMap ?: () => void;
  onNo ?: () => void;
  onYes ?: () => void;
  ableAutorization : () => void
}

export const ConfirmRemovePoste: FC<ConfirmRemovePostePropsType> = ({
  description,
  isOpen,
  onClose,
  loading,
  openMap,
  onNo,
  onYes,
  ableAutorization
//   openModalSubmitFile,
//   navigateByMap
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (

    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-greenTertiary text-white" >
        <DialogHeader className="bg-greenTertiary text-white" >
          <DialogTitle className="pt-6 space-x-2 flex items-center justify-center w-full bg-greenTertiary text-white" > <IconGfontsBig addClass={60} id="warning" /> </DialogTitle>
          <DialogDescription className="pt-6 space-x-2 flex items-center justify-center w-full text-white bg-greenTertiary text-white" >{description}</DialogDescription>
        </DialogHeader>
        <div className="pt-6 space-x-1 flex items-center justify-around w-full">
          <Button className="bg-white text-greenTertiary" disabled={loading} variant="outline" onClick={ableAutorization}>
            Sim
          </Button>
          <Button className="bg-white text-greenTertiary" disabled={loading} variant="outline" onClick={onNo}>
            Não
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
