"use client";

import { useContext, useState } from "react";
import { SimpleModal } from "@/components/modal/simple-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Opcional, para respostas longas
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import notificacaoService from "@/services/concessionaria/notificacao-service";
import { UsuarioContext } from "@/app/context";
import FileUploadOnlyOneButton, { FileUploaded } from "@/components/file-upload/file-upload-one-button";
import { ArquivoRequestType } from "@/services/projeto-service/types";
import IconGfonts from "@/components/icon-gfonts/icon";
import BotaoUploadSmsChat from "@/components/crud/uploadSms";
import Link from "next/link";

type ResponderNotificacaoModalProps = {
  isOpen: boolean;
  notificacaoId: number;
  historico: any[];
  habilitaResponder: boolean;
  onClose: () => void;
  onSubmit: (resposta: string) => Promise<void>;
};

const ResponderNotificacaoModal = ({
  isOpen,
  onClose,
  onSubmit,
  habilitaResponder,
  historico,
  notificacaoId
}: ResponderNotificacaoModalProps) => {

  // Constantes e variaveis
  const fileEmpty = {
      nome: "",
      tamanho: 0,
      key: "",
      url: ""
  }
  const user = useContext(UsuarioContext);
  const { toast } = useToast();
  const [resposta, setResposta] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const exibirMensagemAguarde = historico?.length > 0 && historico[0]?.usuario?.id === user?.id;
  const [filesSend, setFilesSend] = useState<ArquivoRequestType[]>([])
  const [fileSend, setFileSend] = useState<ArquivoRequestType>(fileEmpty)
  

  const handleSave = async () => {
    setFileSend(fileEmpty)
    if (!resposta.trim()) {
      toast({
        description: "A resposta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
        notificacaoService.respondNotification({
          notificacaoId: notificacaoId,
          mensagem: resposta,
          arquivos: [fileSend] // era []
        })
            .then(() => toast({ description: "Notificação respondida com sucesso.", variant: "sucesso", position: "top" }))
            .catch((error) => {
              const errorMessage = error?.response?.data?.error || error.error || "Não foi possível responder a notificação.";
              toast({ 
                title: "Erro",
                description: errorMessage, 
                variant: "erro",
                position: "top"
              })})
      setResposta("");
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a resposta.",
        variant: "destructive",
        position: "top"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  function renderMensagens(historico: any[]) {
    if (!historico || historico.length === 0) {
      return <div className="text-white">Nenhuma mensagem encontrada</div>;
    }
  
    return historico.slice().reverse().map((item: any, index: number, reversedArray: any[]) => {
      const isSameUserAsPrevious = index > 0 && reversedArray[index - 1].usuario.id === item.usuario.id;
      const alignmentClass = isSameUserAsPrevious
        ? reversedArray[index - 1].alignment
        : (index === 0 || reversedArray[index - 1].alignment === 'self-end' ? 'self-start' : 'self-end');
  
      item.alignment = alignmentClass;
  
      const textAlignClass = alignmentClass === 'self-start' ? 'text-left' : 'text-right';
  
      return (
        <div key={item.id} className={`space-y-4 w-[70%] ${alignmentClass}`}>
          <p className={`text-white ${textAlignClass}`}>
            {item.usuario.name}
          </p>
          <div className="bg-[#163233] p-2 rounded-lg">
            <p className="text-gray-200">{item.mensagem}</p>
             {item.arquivos !== null && item.arquivos[0].nome !== "" &&  
              <Link target="_blank" href={item.arquivos[0].url}>
                <div className="flex  items-center gap-2" > <span className="text-white text-2xl" > <IconGfonts id="article" /> </span>  <p className="text-gray-200">{item.arquivos[0].nome}</p> </div>
              </Link>
            }      
            <p className="text-gray-400 text-sm text-end pt-4">
              {new Date(item.data).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
      );
    });
  }

  // Renders
  const RenderBtnUploadFile = () => (
    <FileUploadOnlyOneButton
      setFileSend={ ( value : ArquivoRequestType) => setFileSend(value) }
      filesSend={filesSend}
      //onUpdateMensage={setFileName}
      setFilesSend={( value : ArquivoRequestType[]) => setFilesSend(value)}
      //setFileUrlMensagem={ ( value: String ) => setFileUrlMensagem(value) }
    />
  )

  return (
    <SimpleModal
      open={isOpen}
      titulo={
        habilitaResponder ? "Responder Notificação" : "Historico da Notificação"
      }
      descricao=""
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="space-y-4 bg-greenTertiary">
      {exibirMensagemAguarde ? <span className="block pl-4 mt-6 text-white dark:text-white">Aguarde a resposta do usuário.</span> : null}
      <hr className="bg-white"/>
      <div className="flex flex-col space-y-4 p-4 max-h-[487px] overflow-y-auto">
          {renderMensagens(historico)}
        </div>

        {habilitaResponder && !exibirMensagemAguarde && (
          <div className="p-4">
            <Textarea
              id="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta..."
              className="mt-2 w-full bg-white dark:text-black"
              rows={4}
            />
          </div>
        )}

        <div className="flex justify-end mt-8 pb-8 mr-8 gap-2">
          
          
           {/* {habilitaResponder && !exibirMensagemAguarde && <> {RenderBtnUploadFile()} </> } */}
          {habilitaResponder && !exibirMensagemAguarde ? 
          <>
            <BotaoUploadSmsChat
                onUpload={(file: FileUploaded) => setFileSend(file) }
            />
            {fileSend.nome !== "" && 
              <Button variant="destructive" 
                onClick={() =>  {
                  setFileSend(fileEmpty)
                  toast({ title: "Arquivo", description: "Envio Cancelado", variant: "sucesso", position: "top" })
                }

                }  
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Cancelar"}
              </Button> 
            }
            <Button variant="secondary" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Responder"}
            </Button>
          </>  : null } 
          
        </div>
      </div>
    </SimpleModal>
  );
};

export default ResponderNotificacaoModal;
