"use client"
import React, { ChangeEvent, useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@radix-ui/react-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ArquivoRequestType } from "@/services/projeto-service/types";
import ExcluirPontoService from "@/services/ocupante/excluir-ponto";
import BotaoUploadSmsChat from "../crud/uploadSms";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";
import BotaoUploadExcluirPontos from "../crud/uploadModalExcluirPontos";
import BotaoUploadGenerico from "../modal/botao-generico-upload-arquivos";

const messages : {success : string, uploading : string } = {
    success : 'Done',
    uploading : 'Uploading...'
}

interface BotaoUploadProps {
    onUpload ?: (file: FileUploaded) => void;
    doUpload : (    open: boolean) => void;
    setFileUp ?: (file : ArquivoRequestType ) => void
}
  
export interface FileUploaded {
    id?: number
    nome: string;
    tamanho: number;
    key: string;
    url: string;
}

const FileUploadOnlyTxtPdf : React.FC<BotaoUploadProps> = ({ onUpload, doUpload, setFileUp }) => {

    const { toast } = useToast();

    const [file, setFile] = useState <FileUploaded | File | null> (null)
    const [loading, setLoading] = useState<boolean>(false)
    // const [status, setStatus] = useState < 'uploading' | 'success' | null > ()
    // BotaoUpload

    function handleFileChange(e : ChangeEvent<HTMLInputElement> ){
        if(e.target.files && verifyTypeFileIsValid(e.target.files[0])){
            setFile(e.target.files[0])
            console.log(e.target.files[0])
            setFileUp && setFileUp(
                {nome: e.target.files[0].name,
                 tamanho:  e.target.files[0].size,
                 key: e.target.files[0].name,
                 url: e.target.files[0].name  
                })
        }
        else{
            toast({
                title: "Formato de arquivo inválido",
                description: "Tipos válidos: xlsx ou txt",
                variant: "erro",
                position: "top"
              });
              return 
        }
    }

    function  verifyTypeFileIsValid(fileName : any){
        if( fileName.name.endsWith("xlsx") || fileName.name.endsWith("txt") || fileName.name.endsWith("csv") ){
            return true
        }
        else{
            false
        }
    }


    async function handleUpload() {
        console.log(file)
        if(!file){
            toast({
              title: "Erro",
              description: "Selecione um arquivo para ser enviado!",
              variant: "erro",
              position: "top"
            });
            return
        }
        setLoading(true)

        const formData = new FormData()
        if (file instanceof File) {
            formData.append('file', file)
        } else {
            console.error('File is not a File instance')
            return
        }
        if(file && setFileUp) {
            //setFileUp(file as ArquivoRequestType)
        }
        const baseUrl = process.env.NEXT_PUBLIC_PROXY_UPLOAD;

        try {
            const response = await ExcluirPontoService.saveRemovePointsByFile(formData)
            console.log(response)
            
            //doUpload(true)

            //setFileUp(e.target.files[0])
            setLoading(false)
            toast({
              title: "Sucesso",
              description: "Arquivo gravado com sucesso",
              variant: "sucesso",
              position: "top"
            });
        }
        catch (error) {
            console.error(error);
            toast({
              title: "Erro ao gravar dados",
              description: "Não foi possível gravar os dados",
              color: "error",
              position: "top"
            });
            setLoading(false)
        }

        
     }

    return (
        <>
        <div>
            <h2 className="text-white text-lg mb-4" >Selecione os arquivos que deseja anexar </h2>
            <div className="mt-3" >
                {/* <label htmlFor="input-file" className="bg-white text-greenTertiary p-2 rounded shadow hover:bg-secondary/90">Selecione o arquivo </label>
                <input id="input-file" className="hidden" type="file"  onChange={handleFileChange} /> */}
                <BotaoUploadGenerico
                    onUpload={(file: FileUploaded) => setFile(file) }
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
                {file !== null ? (
                
                    <TableRow key={file instanceof File ? file.name + file.size : (file as any).tamanho}>
                    <TableCell  className="h-24 text-white text-base" >
                        {file instanceof File ? file.name : (file as any).nome}
                    </TableCell>
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
        </>
    );
}

export default FileUploadOnlyTxtPdf