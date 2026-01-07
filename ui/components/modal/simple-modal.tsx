"use client";

import { FC, ReactNode} from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";

type SimpleModalPropsType = {
  open: boolean;
  titulo: string;
  descricao?: string;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export const SimpleModal: FC<SimpleModalPropsType> = ({
  open,
  titulo,
  descricao,
  children,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};