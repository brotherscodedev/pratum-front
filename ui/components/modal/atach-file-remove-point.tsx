import { FC, useState } from "react";
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
import { ExcluirPontos } from "@/types";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { OurFileRouter } from "@/app/api/uploadthing/core";



type PropsType = {
  isOpen : boolean;
  onClose?: () => void;
  onArquivoAdded: (arquivo: any) => void;
  onArquivoRemoved: (arquivo: any) => void;
  removePoint: ExcluirPontos | undefined;
};

const ModalArquivosExcluirPonto: FC<PropsType> = ({
  isOpen,
  onClose,
  onArquivoAdded,
  onArquivoRemoved,
  removePoint,
}) => {
  const [file, setFile] = useState<FileUploaded>();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-greenTertiary text-white" > 
        <DialogDescription className="pt-6 space-x-2 flex items-left justify-left w-full bg-greenTertiary text-white text-xl" > 
            Selecione os arquivos que deseja anexar
        </DialogDescription>
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
            {(removePoint as any)?.arquivos?.length ? (
              (removePoint as any)?.arquivos.map((arquivo: any) => (
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
        </DialogContent>
        </Dialog>
    </>
  );
};

export default ModalArquivosExcluirPonto;
