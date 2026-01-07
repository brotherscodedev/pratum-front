"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { SimpleModal } from "@/components/modal/simple-modal";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MultaResponseType } from "@/services/concessionaria/multa-service";
import concessionariaService, { OcupanteBasicResponseType } from "@/services/concessionaria/concessionaria-service";
import useAsync from "@/hooks/useAsync";

type VisualizarMultaPropsType = {
  multa: MultaResponseType;
  onClose: () => void;
}

const VisualizarMulta: FC<VisualizarMultaPropsType> = ({multa, onClose}) => {

  const [ocupantes, setOcupantes] = useState<OcupanteBasicResponseType[]>([]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && onClose) onClose();
  }, []);

  const { call: listOcupantes } = useAsync(async () => {
    try {
      const response = await concessionariaService.getOcupantes();
      setOcupantes(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    listOcupantes();
  }, [])

  const getOcupanteNameById = (empresaOcupanteId: number) => {
    const ocupanteFound = ocupantes.find((o) => o.id === empresaOcupanteId)
    return ocupanteFound ? ocupanteFound.descricao : undefined
  }

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
            <div className="flex flex-row gap-3 align-center justify-between">
              {renderItem("Criado em", formatDateTime(multa?.createdAt))}
              {renderItem("Atualizado em", formatDateTime(multa?.updatedAt))}
              <Button className="gap-1" disabled={!multa?.arquivo} onClick={() => window.open(multa.arquivo.url)}>
                <Icons.download />
                Boleto
              </Button>
            </div>
            {renderItem("Ocupante", getOcupanteNameById(multa?.empresaOcupanteId))}
            {renderItem("Vencimento", formatDate(multa?.vencimento, "complete"))}
            {renderItem("Valor", formatCurrency(multa?.valor))}
            {renderItem("Motivo", multa?.motivo)}
      </SimpleModal>
  )
}

export default VisualizarMulta