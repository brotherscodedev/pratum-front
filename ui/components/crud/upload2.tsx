import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";
import { useToast } from "../ui/use-toast";
import React from "react";

export default function BotaoUpload({ onUpload }: any) {
  const { toast } = useToast();
  const ref = React.useRef(null);

  return (
    <UploadButton<OurFileRouter>
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {

        toast({
            title: "Upload",
            description: "Arquivo enviado com sucesso!",
        });

        onUpload(res ? res[0] : null);
      }}
      onUploadError={(error: Error) => {
        console.log("Error: ", error);
        toast({
          title: "Error",
          variant: "erro",
          description: error.message,
          position: "top"
        });
      }}
    />
  );
}
