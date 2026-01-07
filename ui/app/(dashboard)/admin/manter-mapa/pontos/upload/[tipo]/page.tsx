"use client";

import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import adminService from "@/services/admin-service";
import { useToast } from "@/components/ui/use-toast";
import BotaoUpload from "@/components/crud/upload";
import { FileUploaded } from "@/components/file-upload/file-upload-one-button";

const breadcrumbItems = [{ title: "Manter Mapa", link: "/admin/manter-mapa" }];

const SubmeterPage = () => {
  const params = useParams();
  const tipo = params.tipo;

  const [file, setFile] = useState<any>();
  const { toast } = useToast();
  const sendFile = async () => {
    if (!file) {
      return;
    }

    try {
      await adminService.sendFile(file);
      toast({
        title: "Aviso",
        description: "Dados gravados com sucesso!",
        variant: "sucesso",
        position: "top"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao gravar dados",
        description: "Não foi possível gravar os dados",
        color: "error",
        position: "top"
      });
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-4">
          <Heading title={`Upload de informações (${tipo})`} description={""} />
          <div className="flex grow justify-end space-x-4"></div>
        </div>
        <Separator />
        <div className="flex items-left justify-between w-full">
          <div className="flex items-center space-x-4">{}</div>
        </div>
        {/* <div className="flex-1 items-left justify-between w-full">
          <div className="grid grid-flow-row-dense md:grid-cols-2 sm:grid-cols-1 gap-y-7">
            <>
              <Label>
                Arquivo
                <Input
                  type="file"
                  lang="PT_br"
                  value={""}
                  className="mt-2"
                  onChange={(e) => {
                    console.log(e.target.files);
                    if (e.target.files && e.target.files.length > 0){
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </Label>
            </>
          </div>
          <div className="flex flex-row gap-3 mt-8">&nbsp;</div>
          <div className="flex flex-row gap-3 mt-8">
            <Button disabled={!file} onClick={sendFile}>
              Enviar
            </Button>
          </div>
        </div> */}
        <BotaoUpload
          onUpload={(file: FileUploaded) =>
            setFile({ file })
          }
        />
      </div>
    </ScrollArea>
  );
};

export default SubmeterPage;
