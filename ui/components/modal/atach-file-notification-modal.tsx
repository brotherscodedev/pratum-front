"use client";

import { FC, useState} from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUploadOnlyTxtPdf from "../file-upload/file-upload-txtpdf";
import { FileUploaded } from "../ui/btn-upload";
import { ArquivoRequestType } from "@/services/projeto-service/types";
import BotaoUploadSmsChat from "../crud/uploadSms";
import BotaoUploadGenerico from "./botao-generico-upload-arquivos";
import { Separator } from "@radix-ui/react-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";

type AtachFileNotificationModalPropsType = {
  open: boolean;
  titulo ?: string;
  descricao?: string;
  onUpload ?: (file: FileUploaded) => void;
  onOpenChange: (open: boolean) => void;
  doUpload : boolean
  actionSuccess: (file: FileUploaded) => void
  file ?: ArquivoRequestType
  setFile ?: (file : ArquivoRequestType ) => void
}

export const AtachFileNotificationModal: FC<AtachFileNotificationModalPropsType> = ({
  open,
  titulo,
  descricao,
  onUpload,
  onOpenChange,
  actionSuccess,
  doUpload,
  setFile,
  file
}) => {

  const emptyFile = {nome: "", tamanho: 0, key: "", url: ""}
  const [tamanho, setTamanho] = useState<number>(file?.tamanho || 0)
  //console.log(file)

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[768px] bg-greenTertiary text-white">
        <DialogHeader>
          <DialogTitle className="text-white" >{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        {/* <BotaoUploadSmsChat  
          onUpload={(file: FileUploaded) => actionSuccess(file) }
        /> */}
        {/* <FileUploadOnlyTxtPdf 
          onUpload={onUpload} 
          doUpload={onOpenChange} 
          setFileUp={(file : ArquivoRequestType) => actionSuccess(file)}
        /> */}
        <div>
            <h2 className="text-white text-lg mb-4" >Selecione os arquivos que deseja anexar </h2>
            <div className="mt-3" >
                {/* <label htmlFor="input-file" className="bg-white text-greenTertiary p-2 rounded shadow hover:bg-secondary/90">Selecione o arquivo </label>
                <input id="input-file" className="hidden" type="file"  onChange={handleFileChange} /> */}
                <BotaoUploadGenerico
                    onUpload={(file: FileUploaded) => setFile && setFile(file) }
                    name="Selecione o Arquivo"
                    styleButton="bg-white text-greenTertiary"
                />
            </div>
            {/* <BotaoUploadExcluirPontos
                setFile={ (file: any) => setFile(file) }  
                onUpload={(file: FileUploaded) => setFileUp(file) }
            /> */}
            

            {/* <div> { file && <p> {file.name}  - {file.type}  - {file.size} bytes </p>  } </div>  */}
            
            {/* <p> { status && messages[status] } </p> */}
        
            <Separator />
            <Table className="relative my-4">
            <TableHeader>
                <TableRow>
                <TableHead className="text-white text-lg" key={"nome"}>NOME</TableHead>
                <TableHead className="text-white text-lg" key={"acoes"}>AÇÕES</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { file !== null  ? (
                
                  <TableRow key={file?.tamanho || 'default'}>
                    {/* <TableCell  className="h-24 text-white text-base" > <Link href={file.url} > {file.nome} </Link> </TableCell> */}
                    <TableCell  className="h-24 text-white text-base" > {file?.nome}  </TableCell>
                    <TableCell>
                        <button
                        className="text-red-500 text-base"
                        onClick={() => setFile && setFile(emptyFile)}
                        >
                        Remover
                        </button>
                    </TableCell>
                  </TableRow>
                ) : (
                <TableRow>
                    <TableCell colSpan={2}  className="h-24 text-center text-white">
                    Nenhum arquivo adicionado.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
            
             
            
                
                    <button 
                        className="bg-white text-greenTertiary p-2 rounded ml-1.5 shadow hover:bg-secondary/9"  
                        onClick={() => onOpenChange(false)} 
                    >
                        Salvar
                    </button>
            
    
            
        </div>
      </DialogContent>
    </Dialog>
  );
};