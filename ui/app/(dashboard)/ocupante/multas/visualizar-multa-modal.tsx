"use client";

import { FC, useCallback } from "react";
import { SimpleModal } from "@/components/modal/simple-modal";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MultaResponseType } from "@/services/ocupante/multa-service";

type VisualizarMultaPropsType = {
  multa: MultaResponseType;
  onClose: () => void;
}

const VisualizarMulta: FC<VisualizarMultaPropsType> = ({multa, onClose}) => {

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && onClose) onClose();
  }, []);

  const renderItem = (label: string, value: any) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <div>{value}</div>
    </div>
  );

  return (
      <SimpleModal
          open={true}
          onOpenChange={handleOpenChange}
          titulo="Detalhes da Multa">
            <Separator />
            <div className="grid grid-cols-3 grid-rows-2 gap-x-5 gap-y-3">
              {renderItem("Criado em", formatDateTime(multa?.createdAt))}
              {renderItem("Atualizado em", formatDateTime(multa?.updatedAt))}
              <div className="flex justify-center items-center">
                <Button className="gap-1" disabled={!multa?.arquivo} onClick={() => window.open(multa.arquivo.url)}>
                  <Icons.download />
                  Boleto
                </Button>
              </div>
              {renderItem("Vencimento", formatDate(multa?.vencimento, "complete"))}
              {renderItem("Valor", formatCurrency(multa?.valor))}
            </div>
            {renderItem("Motivo", multa?.motivo)}
      </SimpleModal>
  )
}

export default VisualizarMulta