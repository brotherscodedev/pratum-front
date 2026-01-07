"use client"
import React, { ChangeEvent, useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { ArquivoRequestType } from "@/services/projeto-service/types";

const messages : {success : string, uploading : string } = {
    success : 'Done',
    uploading : 'Uploading...'
}

interface BotaoUploadProps {
    onUpload ?: (file: FileUploaded) => void;
    onUpdateMensage ?: (value : any) => void;
    doUpload ?: boolean 
    setFileSend ?: ( arquivo : ArquivoRequestType) => void
    filesSend: ArquivoRequestType[]
    setFilesSend:( value : ArquivoRequestType[]) => void
    setFileUrlMensagem ?: (value : String) => void;
}
  
export interface FileUploaded {
    id?: number
    nome: string;
    tamanho: number;
    key: string;
    url: string;
}

const FileUploadOnlyOneButton : React.FC<BotaoUploadProps> = ({ onUpload, doUpload, onUpdateMensage, setFileSend, filesSend, setFilesSend, setFileUrlMensagem }) => {

    // Variaveis
    const { toast } = useToast();
    const [file, setFile] = useState <File | null> (null)
    const [loading, setLoading] = useState<boolean>(false)
    // const [status, setStatus] = useState < 'uploading' | 'success' | null > ()

    // Funcoes
    function handleFileChange(e : ChangeEvent<HTMLInputElement> ){
        if(e.target.files){
            // setStatus(null)
            if(verifyTypeFileIsValid(e.target.files[0])){
                setFile( e.target.files[0])
                let aux : ArquivoRequestType = {
                    nome: e.target.files[0].name,
                    tamanho: e.target.files[0].size,
                    key: e.target.files[0].name,
                    url: e.target.files[0].name
                }
                //setFile(aux)   
                console.log(e.target.files[0])
                setFileSend && setFileSend(aux)
                let auxFiles = [aux]
                setFilesSend && setFilesSend(auxFiles)
                onUpdateMensage && onUpdateMensage(e.target.files[0].name)
                
            }
            else{
                toast({
                    title: "Formato de arquivo inválido",
                    description: "Tipos válidos: pdf, doc, docx, xls, xlsx, png ou jpg",
                    variant: "erro",
                    position: "top"
                  });
                  return 
            }
            
        }  
    }

    function  verifyTypeFileIsValid(fileName : any){
        if( fileName.name.endsWith("pdf") || fileName.name.endsWith("doc") || fileName.name.endsWith("docx") || fileName.name.endsWith("xls") || fileName.name.endsWith("xlsx") || fileName.name.endsWith("png") || fileName.name.endsWith("jpg") ){
            return true
        }
        else{
            false
        }
    }

    async function handleUpload() {
        setLoading(true)
        onUpdateMensage && onUpdateMensage("")
        if(!file){
            return
        }

        // setStatus("uploading")

        const formData = new FormData()
        formData.append('file', file)

        const baseUrl = process.env.NEXT_PUBLIC_PROXY_UPLOAD;

        try {
            const result = await fetch(`${baseUrl}/proxy-upload` , {
                method : 'POST',
                body : formData
            } )

            //console.log(result)
            const data = await result.json()
            //console.log(data)
            //setFileUrlMensagem(data.fileUrl)
            let aux : ArquivoRequestType = {
                nome: data.nome,
                tamanho: data.tamanho,
                key: data.key,
                url: data.url
            }
            
            let auxFiles = filesSend
            auxFiles.push(aux)
            setFilesSend(auxFiles)
            //setFileName(data.nome)
            // setStatus("success")
            //setFile(null)
            setLoading(false)
            toast({
                title: "Aviso",
                description: "Dados gravados com sucesso!",
                position: "top",
                variant : "sucesso",
                className : "text-white"
              });
              const fileUp = {
                nome: data.nome,
                tamanho: data.tamanho,
                key: data.key,
                url: data.fileUrl,
            }
            if(doUpload){
                onUpload && onUpload(fileUp)
                //setFile(null)
            }
            setFilesSend([])
        }
        catch (error) {
            console.error(error);
            toast({
              title: "Erro ao gravar dados",
              description: "Não foi possível gravar os dados",
              color: "error",
              position: "top"
            });
            // setFilesSend([])
            // let aux : ArquivoRequestType = {
            //         nome: "",
            //         tamanho: 0,
            //         key: "",
            //         url: ""
            // }
            // let arrayAux = []
            // arrayAux.push(aux)
            // setFile(aux as any)    
            
            setLoading(false)
        }

        
    }

    function handleCancelar() {
        setFile(null)
        onUpdateMensage && onUpdateMensage("")
    }

    // Renders
    const renderAnexar = () => {
        return (
            <div className="mt-1.5" >
                <label htmlFor="input-file" className="bg-white text-greenTertiary p-2 rounded shadow hover:bg-secondary/90">Anexar </label>
                <input id="input-file" className="hidden" type="file"  onChange={handleFileChange} />
            </div>
        )
    }

    const renderEnviarCancelar = () => {
        return (
            <div className="flex gap-2" >
                <div> { file && <p className="text-white" > {file.name}   </p>  } </div>  
                {/* - {file.type}  - {file.size} bytes */}
                <Button variant="secondary" className="text-red-500 bg-white" onClick={handleCancelar} >
                    Cancelar
                </Button>
                <Button variant="secondary" className="text-greenTertiary bg-white" onClick={handleUpload} >
                    Enviar
                </Button>
            </div>
        )
    }

    const renderUpoad = () => {
        return (
            <>
                {loading === false ? (
                    <div>
                        {/* <h2 className="text-white text-lg mb-4" >Selecione os arquivos que deseja anexar</h2> */}
                        {file === null ? <> {renderAnexar()} </>  : <> {renderEnviarCancelar()} </>  }
                    </div>
                ) : (
                    <> <h1 className="text-white" >Carregando...</h1> </>
                ) }    
            </>
        )
    }

    return (
        <>
            {renderUpoad()}
        </>
    );
}

export default FileUploadOnlyOneButton