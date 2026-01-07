import { FC, useCallback, useEffect, useState } from "react";

import { SimpleModal } from "@/components/modal/simple-modal";
import FormMulta from "./multa-form";

type CreateModalFormMultaPropsType = {
  onSave: () => void;
  onClose?: () => void;
}

const CreateModalFormMulta: FC<CreateModalFormMultaPropsType> = ({ onSave, onClose }) => {

  const handleSave = useCallback(() => {
    onSave();
    if (onClose) onClose();
  }, []);

  const handleCancel = useCallback(() => {
    if (onClose) onClose();
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && onClose) onClose();
  }, []);

  return (
    <div className="flex grow justify-end space-x-4">
      <SimpleModal
          open={true}
          onOpenChange={handleOpenChange}
          titulo="Nova multa"
          descricao="Informe os dados para cadastrar uma nova multa">

        <FormMulta
          onSalvar={handleSave}
          onCancelar={handleCancel} />

      </SimpleModal>
    </div>
)}

export default CreateModalFormMulta;