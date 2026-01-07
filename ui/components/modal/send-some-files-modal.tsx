"use client";

import { ChangeEvent, FC, useState} from "react"
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
import ExcluirPontoService from "@/services/ocupante/excluir-ponto";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

type SendSomeFilesModalPropsType = {
  open: boolean;
  titulo ?: string;
  descricao?: string;
  onUpload ?: (file: FileUploaded) => void;
  onOpenChange: (open: boolean) => void;
  doUpload : boolean
  actionSuccess: (file: FileUploaded) => void
  // file ?: ArquivoRequestType
  // setFile ?: (file : ArquivoRequestType ) => void
}

export const SendSomeFilesModal: FC<SendSomeFilesModalPropsType> = ({
  open,
  titulo,
  descricao,
  onUpload,
  onOpenChange,
  actionSuccess,
  doUpload,
  // setFile,
  // file
}) => {

  const [file, setFile] = useState<ArquivoRequestType | null> (null)
  const [fileTwo, setFileTwo] = useState<File | null> (null)
  const { toast } = useToast();
  const handleSalvar2 = async () => {
    
      //console.log(file)
        // setFile({
        //   nome: file.name, 
        //   tamanho: file.size, 
        //   key: file.name, 
        //   url: file.url
        // })
        //console.log(file)
      if(file !== null) {
        let formData = new FormData();
        formData.append('file', fileTwo as any)
        // formData.append('nome', file.nome);
        // formData.append('tamanho', file.tamanho);
        // formData.append('key', file.key);
        // formData.append('url', file.url);
          try {
          
          const objRequest = {
              // cidadeId: Number(municipio),
              posteCodigos: [],
              arquivos: [file],
          };
            //console.log(objRequest, formData) 
            const response = await ExcluirPontoService.saveRemovePointsByFile( //         saveRemovePoints
              //objRequest as any
              formData
            );
            //console.log(response)
            if(response === null) {
              toast({
                title: "Erro",
                description: "Não foi possível Salvar",
                variant: "erro",
                position: "top"
              });
            } else{
              toast({
              description: "Solicitação enviada com sucesso",
              variant: "sucesso",
              position: "top",
              className: "text-white",
            });
            }
            
          
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível Salvar",
            variant: "erro",
            position: "top"
          });
        }
      } else{
         toast({
            title: "Erro",
            description: "Selecione um arquivo",
            variant: "erro",
            position: "top"
          });
      }
  };

  function handleFileChange(e : ChangeEvent<HTMLInputElement> ){
          if(e.target.files && verifyTypeFileIsValid(e.target.files[0])){
              setFileTwo(e.target.files[0])
              //console.log(e.target.files[0])
              setFile(
                  {nome: e.target.files[0].name,
                   tamanho:  e.target.files[0].size,
                   key: e.target.files[0].name,
                   url: e.target.files[0].name  
                  })
          }
          else{
              toast({
                  title: "Formato de arquivo inválido",
                  description: "Tipos válidos: csv, xlsx, pdf ou txt",
                  variant: "erro",
                  position: "top"
                });
                return 
          }
  }
  
  function  verifyTypeFileIsValid(fileName : any){
          if( fileName.name.endsWith("xlsx") || fileName.name.endsWith("txt") || fileName.name.endsWith("csv") || fileName.name.endsWith("pdf") ){
              return true
          }
          else{
              false
          }
  }

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[768px] bg-greenTertiary text-white">
        <DialogHeader>
          <DialogTitle className="text-white" >{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        {/* <BotaoUploadSmsChat  
          onUpload={(file: ArquivoRequestType) => setFile(file) }
        /> */}
        {/* <FileUploadOnlyTxtPdf 
          onUpload={onUpload} 
          doUpload={onOpenChange} 
          //setFileUp={(file : ArquivoRequestType) => actionSuccess(file)}
          setFileUp={(file : ArquivoRequestType) => setFile(file)}
        /> */}

        <div>
                    <h2 className="text-white text-lg mb-4" >Selecione os arquivos que deseja anexar </h2>
                    <div className="mt-3" >
                        <label htmlFor="input-file" className="bg-white text-greenTertiary p-2 rounded shadow hover:bg-secondary/90">Selecione o arquivo </label>
                        <input id="input-file" className="hidden" type="file"  onChange={handleFileChange} />
                        {/* <BotaoUploadGenerico
                            onUpload={(file: FileUploaded) => setFile(file) }
                            name="Selecione o Arquivo"
                            styleButton="bg-white text-greenTertiary"
                        /> */}
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
                        {file !== null ? (
                        
                            <TableRow key={file.tamanho}>
                            <TableCell  className="h-24 text-white text-base" >{file.nome}</TableCell>
                            <TableCell>
                                <button
                                className="text-red-500 text-base"
                                onClick={() =>  setFile(null)}
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
                    
                    {/* {loading === false ? 
                    (
                        <>
                            <button 
                                className="bg-white text-greenTertiary p-2 rounded ml-1.5 shadow hover:bg-secondary/9"  
                                onClick={handleUpload} 
                            >
                                Salvar
                            </button>
                        </>
                    ) : 
                    (
                        <>
                            <h2>Carregando...</h2>
                        </>
                    )} */}
                    
            
                    
                </div>
        
        <Button className="bg-white text-greenTertiary w-[120px]" onClick={handleSalvar2} >Salvar</Button>
      </DialogContent>
    </Dialog>
  );
};