import { FC, useCallback, useState } from "react";

import { SimpleModal } from "@/components/modal/simple-modal";
import { ProjetoType } from "@/services/projeto-service/types";
import UploadInput from "@/components/upload-input";
import { FileUploaded } from "@/components/crud/upload";
import { Separator } from "@radix-ui/react-separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type PropsType = {
  onClose?: () => void;
  onArquivoAdded: (arquivo: any) => void;
  onArquivoRemoved: (arquivo: any) => void;
  projeto: ProjetoType | undefined;
};

const ModalArquivos: FC<PropsType> = ({
  onClose,
  onArquivoAdded,
  onArquivoRemoved,
  projeto,
}) => {
  const [file, setFile] = useState<FileUploaded>();

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
        titulo="Arquivos do projeto"
        descricao="Adicione arquivos ao projeto"
      >
        <UploadInput
          file={file}
          onUpload={onArquivoAdded}
          onClear={() => setFile(undefined)}
        />
        <Separator />
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead key={"nome"}>NOME</TableHead>
              <TableHead key={"acoes"}>AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projeto?.arquivos?.length ? (
              projeto?.arquivos.map((arquivo) => (
                <TableRow key={arquivo.id}>
                  <TableCell><Link href={arquivo.url} target="_blank">{arquivo.nome}</Link></TableCell>
                  <TableCell>
                    <button
                      className="text-red-500"
                      onClick={() => onArquivoRemoved(arquivo.id)}
                    >
                      Remover
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhum arquivo adicionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SimpleModal>
    </div>
  );
};

export default ModalArquivos;
