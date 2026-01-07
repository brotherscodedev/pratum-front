import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";
import { useToast } from "../ui/use-toast";

interface BotaoUploadProps {
  onUpload: (file: FileUploaded) => void;
}

export interface FileUploaded {
  id?: number
  nome: string;
  tamanho: number;
  key: string;
  url: string;
}

export default function BotaoUploadSmsChat({ onUpload }: BotaoUploadProps) {
  const { toast } = useToast();

  return (
    <UploadButton<OurFileRouter>
      appearance={{
        button:
          "w-200 ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-blue-500 bg-none after:bg-orange-400 px-2",
        container:
          "w-max flex-row rounded-md border-cyan-300 bg-slate-800",
        allowedContent:
          "flex h-8 flex-col items-center jusFtify-center px-2 text-white",
      }}
      content={{ button: <span className="z-50">Selecione o arquivo</span> }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (!res) {
          toast({
            title: "Upload",
            description: "Erro ao enviar o arquivo!",
            variant: "erro",
            position: "top"
          });
          return;
        }

        toast({
          title: "Upload",
          description: "Arquivo enviado com sucesso!",
          variant: "sucesso",
          position: "top",
          color: "white"
        });
        const file = res[0];
        const fileUploaded: FileUploaded = {
          nome: file?.name,
          tamanho: file?.size,
          key: file?.key,
          url: file?.url,
        };
        console.log(file)
        console.log(fileUploaded)
        onUpload(fileUploaded);
      }}
      onUploadError={(error: Error) => {
        console.log("Error: ", error);
        if(error.message === "Invalid config."){
          toast({
          title: "Erro",
          variant: "erro",
          description: "Tipo de Arquivo Invalido",
          position: "top"
        });
        } else{
            toast({
            title: "Erro",
            variant: "erro",
            description: error.message,
            position: "top"
          });
        }
        
      }}
    />
  );
}
