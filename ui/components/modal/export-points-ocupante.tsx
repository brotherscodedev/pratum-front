"use client";
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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import {mockPontos} from "./../../constants/data"

type PropsType = {
  isOpen : boolean;
  onClose?: () => void;
  
};

const ModalExportPoints: FC<PropsType> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<FileUploaded>();
  

  const { toast } = useToast();
  const showToast = async (nameFile : string) => {
    toast({
         description: `Download do arquivo : ${nameFile}`,
         variant: "sucesso",
         position : "top",
         className : "text-white "
     })
 }

  const dowloadFile = (nameFile : string) => {
     showToast(nameFile)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-greenTertiary text-white" > 
        <DialogTitle className="hidden" ></DialogTitle>
        <DialogDescription className="hidden" > </DialogDescription> 
        <Separator />
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead key={"idPoste"}>ID do poste</TableHead>
              <TableHead key={"latitude"}>Latitude</TableHead>
              <TableHead key={"longitude"}>Longitude</TableHead>
              <TableHead key={"acoes"}>AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPontos?.length ? (
              mockPontos?.map((ponto, count) => (
                <TableRow key={count}>
                
                  <TableCell> {ponto.idPoste} </TableCell>
                  <TableCell> {ponto.latitude} </TableCell>
                  <TableCell> {ponto.longitude} </TableCell>
                  <TableCell>

                    <button
                      className="text-blue-500"
                      onClick={() => dowloadFile(ponto.idPoste)}
                    >
                      Download
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
        </DialogContent>
        </Dialog>
    </>
  );
};

export default ModalExportPoints;
