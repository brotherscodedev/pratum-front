"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "react-day-picker";

type ModalPropsType = {
  open: boolean;
  titulo: string;
  descricao?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const ConfirmModal: FC<ModalPropsType> = ({
  open,
  titulo,
  descricao,
  onOpenChange,
  onConfirm,
  onCancel = () => {},
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button >Confirmar</Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
