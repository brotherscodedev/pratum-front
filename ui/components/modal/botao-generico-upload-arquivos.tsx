import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";
import { useToast } from "../ui/use-toast";

interface BotaoUploadGenericoProps {
  onUpload: (file: FileUploaded) => void;
  name: string;
  styleButton ?: string;
}

export interface FileUploaded {
  id?: number
  nome: string;
  tamanho: number;
  key: string;
  url: string;
}

export default function BotaoUploadGenerico({ onUpload, name, styleButton }: BotaoUploadGenericoProps) {
  const { toast } = useToast();

  return (
    <UploadButton<OurFileRouter>
      appearance={{
        button:
          `w-200 ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none  bg-none  px-2 ${styleButton} hover:bg-accent hover:text-accent-foreground hover:bg-secondary/80`, // after:bg-orange-400
        container:
          "w-max flex-row rounded-md text-none", //border-cyan-300 bg-slate-800
        allowedContent:
          "flex h-8 flex-col items-center jusFtify-center px-2 text-none", //text-white 
        clearBtn:
          "text-none hidden",
      }}
      content={{ button: <span className="z-50"> {name} </span> }}
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