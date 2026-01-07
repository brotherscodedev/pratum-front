import { FC, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { Arquivo } from "@/services/concessionaria/excluir-ponto/types";

type PropsType = {
  isOpen: boolean;
  files: Arquivo[];
  onClose?: () => void;
};

const ModalArquivosAnexos: FC<PropsType> = ({ isOpen, files, onClose }) => {
  const dowloadFile = (fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl; // Define a URL do arquivo
    link.download = fileUrl.split("/").pop() || "download"; // Define o nome do arquivo
    link.target = "_blank"; // Abre em uma nova aba (opcional)
    document.body.appendChild(link); // Adiciona o link ao DOM
    link.click(); // Dispara o clique para iniciar o download
    document.body.removeChild(link); // Remove o link do DOM
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
      >
        <DialogContent className="bg-greenTertiary text-white">
          <DialogTitle className="text-white mt-2">
            Documentos Anexados
          </DialogTitle>
          <DialogDescription className="hidden"> </DialogDescription>
          <Separator />
          <Table className="relative">
            <TableHeader>
              <TableRow>
                <TableHead key={"nome"}>Arquivo</TableHead>
                <TableHead key={"acoes"}>AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files?.length > 0 ? (
                files?.map((arquivo, count) => (
                  <TableRow key={count}>
                    <TableCell> {arquivo.nome} </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-500"
                        onClick={() => dowloadFile(arquivo.url)}
                      >
                        Baixar
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Nenhum arquivo Anexado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* <div>
          <button
            className="text-blue-500 bg-white rounded px-2 py-1"
            onClick={() => showToastDownloadAll()}
          >
            Baixar todos
          </button>
        </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalArquivosAnexos;
