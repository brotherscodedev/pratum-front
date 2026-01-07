"use client"
import React, { ChangeEvent, useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@radix-ui/react-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const messages : {success : string, uploading : string } = {
    success : 'Done',
    uploading : 'Uploading...'
}

interface BotaoUploadProps {
    onUpload ?: (file: FileUploaded) => void;
}
  
export interface FileUploaded {
    id?: number
    nome: string;
    tamanho: number;
    key: string;
    url: string;
}


const BtnFileUploadOnlyTxtPdf : React.FC = ({ onUpload }: BotaoUploadProps) => {

    const { toast } = useToast();

    const [file, setFile] = useState <FileUploaded | null> (null)
    const [originalFile, setOriginalFile] = useState <File | null> (null)
    const [status, setStatus] = useState < 'uploading' | 'success' | null > ()

    function handleFileChange(e : ChangeEvent<HTMLInputElement> ){
        if(e.target.files){
            setStatus(null)
            const selectedFile = e.target.files[0];
            setOriginalFile(selectedFile);
            const fileUploaded: FileUploaded = {
                nome: selectedFile.name,
                tamanho: selectedFile.size,
                key: selectedFile.name,
                url: URL.createObjectURL(selectedFile)
            };
            setFile(fileUploaded)
        }
    }

    async function handleUpload() {
        if(!file || !originalFile){
            return
        }

        setStatus("uploading")

        const formData = new FormData()
        formData.append('file', originalFile)

        const baseUrl = process.env.NEXT_PUBLIC_PROXY_UPLOAD;

        try {
            const result = await fetch(`${baseUrl}/proxy-upload`, {
                method : 'POST',
                body : formData
            } )
            const data = await result.json()

            console.log(data)

            const fileUp = {
                nome: data.nome,
                tamanho: data.tamanho,
                key: data.key,
                url: data.fileUrl,
            }

            setStatus("success")
            toast({
                title: "Aviso",
                description: "Dados gravados com sucesso!",
                position: "top"
              });
            onUpload && onUpload(fileUp);
        }
        catch (error) {
            console.error(error);
            toast({
              title: "Erro ao gravar dados",
              description: "Não foi possível gravar os dados",
              color: "error",
              position: "top"
            });
        }

        
    }

    return (
        
        <div className="w-full bg-red" >
            {/* <h2 className="text-white text-lg mb-4" >Selecione os arquivos que deseja anexar</h2> */}
            <div className="my-3" >
                {/* <label htmlFor="input-file" className="bg-greenTertiary text-white p-2 rounded w-full">Selecione o arquivo </label> hidden */}
                <input id="input-file" className="" type="file"  onChange={handleFileChange} />
            </div>
            
            
            <button className="bg-greenTertiary text-white p-2 rounded ml-1.5"  onClick={handleUpload} >Anexar</button>
    
            
        </div>
        
    );
}

export default BtnFileUploadOnlyTxtPdf