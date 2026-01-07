"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { useToast } from "@/components/ui/use-toast";
import { UsuarioContext } from "@/app/context";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import FileUploadOnlyOneButton from "../file-upload/file-upload-one-button";
import ExcluirPontoServiceOcupante   from "@/services/ocupante/excluir-ponto";
import useAsync from "@/hooks/useAsync";
import ExcluirPontoService from "@/services/concessionaria/excluir-ponto";
import { ArquivoRequestType } from "@/services/projeto-service/types";
import { ExcluirPontos } from "@/types";
import { HistoryEmptyModal } from "./history-empty-modal";
import BotaoUploadSmsChat from "../crud/uploadSms";
import { FileUploaded } from "../crud/upload";
import Link from "next/link";
import IconGfonts from "../icon-gfonts/icon";

type HistoryOrChatRemovePointsModalProps = {
  isOpen: boolean;
  exclusaoRef: ExcluirPontos;
  habilitaResponder: boolean;
  onClose: () => void;
  onSubmit ?: (resposta: string) => Promise<void>;
  usuario ?: "concessionaria" | "ocupante"
};

const HistoryOrChatRemovePoints = ({
  isOpen,
  onClose,
  onSubmit,
  habilitaResponder,
  usuario,
  exclusaoRef
}: HistoryOrChatRemovePointsModalProps) => {

   // Constantes e variaveis
  const fileEmpty = {
      nome: "",
      tamanho: 0,
      key: "",
      url: ""
  }
  const user = useContext(UsuarioContext);
  const [filesSend, setFilesSend] = useState<ArquivoRequestType[]>([])
  const [fileSend, setFileSend] = useState<ArquivoRequestType>(fileEmpty)
  const [historico, setHistorico] = useState<any[]>([]);
  const [fileName, setFileName] = useState("")
  const { toast } = useToast();
  const [resposta, setResposta] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const exibirMensagemAguarde = historico?.length > 0 && historico[0]?.usuario?.id === user?.id;
  const [open, setOpen] = useState<boolean>(false);

  // Funcoes
  const { loading: loadingPontosExclusao, call: mostrarHistorico } = 
    useAsync(async () => {
      if(user?.type === "ocupante"){
        try {
          // const encodedFilters = encodeFilters(filtros);
          const response = await ExcluirPontoServiceOcupante.getHistorico(exclusaoRef.id)
          setHistorico(response);
        } catch (error) {
          setHistorico([]);
          toast({ description: "Não foi possível carregar o Historico", variant: "erro", position: "top"});
        }
      }else {
        try {
          // const encodedFilters = encodeFilters(filtros);
          const response = await ExcluirPontoService.getHistorico(exclusaoRef.id)
          setHistorico(response);

        } catch (error) {
          setHistorico([]);
          toast({ description: "Não foi possível carregar o Historico", variant: "erro", position: "top"});
        }
      }
      
  }, []);

  // const { loading: loadingPontosExclusao, call: sendSms } = 
  //   useAsync(async () => {
      
  // }, []);

  useEffect(() => {
    mostrarHistorico();
  }, [resposta]); 

  const handleSave = async () => {
    setFileSend(fileEmpty)
    if (!resposta.trim()) {
      toast({
        description: "A resposta não pode estar vazia.",
        variant: "destructive",
        position: "top"
      });

      return;
    }
    else{
      if(usuario === "concessionaria"){
          try {
          // const encodedFilters = encodeFilters(filtros);
          
          if(fileSend.tamanho === 0){
              const response = await ExcluirPontoService.saveInteraction({
              exclusaoPontoId: exclusaoRef.id , 
              mensagem: resposta , 
              //arquivos : []  //filesSend
            })
          } else{
              const response = await ExcluirPontoService.saveInteraction({
              exclusaoPontoId: exclusaoRef.id , 
              mensagem: resposta , 
              arquivos : [fileSend]  //filesSend
            })

          }
          
          setFilesSend([])
          toast({ 
            title: "Mensagem Enviada com Sucesso.",
            description: "Aguarde a resposta da Ocupante" , 
            variant: "sucesso", 
            position: "top" 
          });
        } catch (error: any) {
          toast({ description: error?.response?.data?.error || "Não foi possível enviar mensagem", variant: "erro", position: "top" });
          setFilesSend([])
        }
      } else { // perfil usuario === ocupante
         try {
          // const encodedFilters = encodeFilters(filtros);
          
          if(fileSend.tamanho === 0){
              const response = await ExcluirPontoServiceOcupante.saveInteraction({
              exclusaoPontoId: exclusaoRef.id , 
              mensagem: resposta , 
              //arquivos : [] 
            })
          } else{
              const response = await ExcluirPontoServiceOcupante.saveInteraction({
              exclusaoPontoId: exclusaoRef.id , 
              mensagem: resposta , 
              arquivos : [fileSend] 
            })
            
          }
          
          
          setFilesSend([])
          toast({ 
            title: "Mensagem Enviada com Sucesso.",
            description: "Aguarde a resposta da Concessionaria" , 
            variant: "sucesso", 
            position: "top" 
          });
        } catch (error: any) {
          toast({ description: error?.response?.data?.error || "Não foi possível enviar mensagem", variant: "erro", position: "top" });
          setFilesSend([])
        }
      }
  
  
    
    setIsSubmitting(true);

    setResposta("")
    // toast({
    //   description: "Resposta da exclusão enviada a concessionária",
    //   variant: "sucesso",
    //   position : "top",
    //   className : "text-white"
    // });

    setIsSubmitting(false);
  }
      

  };

  // Renders
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
        <div key={`container-sms ${item.usuario.name} ${index}`} className={`space-y-4 w-[70%] ${alignmentClass}`}>
          <p key={`${item.usuario.name}} ${index}`} className={`text-white ${textAlignClass}`}>
            {item.usuario.name}
          </p>
          <div key={`container ${item.usuario.name}`} className="bg-[#163233] p-2 rounded-lg">
            <p key={`mensagem ${item.usuario.name}`} className="text-gray-200">{item.mensagem}</p>
            {item.arquivos !== null && item.arquivos !== undefined && 
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

  const RenderModalHistoryEmpty = () => {
    return 
          <HistoryEmptyModal
            isOpen={open}
           onClose={() => setOpen(false)}
           description="Não Existe Histórico para essa exclusão!"
          />
  } 

  const renderChat = () => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="bg-greenTertiary text-white " >
          <DialogTitle className="text-2xl pt-6 space-x-2 flex items-left justify-left w-full text-white bg-greenTertiary text-white" >
            {habilitaResponder ? "Responder Pausa" : "Histórico" }
          </DialogTitle>
          <DialogDescription className="hidden" ></DialogDescription> 
          <div className="space-y-4 bg-greenTertiary">
            {/* <p className="text-white text-sm font-bold">Motivo: {exclusaoRef.motivo}</p> */}
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
                  className="mt-2 w-full bg-white text-black"
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-end mt-8 pb-8 mr-8 gap-8">
              {habilitaResponder && !exibirMensagemAguarde ? (
                <>
                  <BotaoUploadSmsChat
                    onUpload={(file: FileUploaded) => setFileSend(file) }
                  />
                  {fileSend.nome !== "" && 
                                  <Button variant="destructive" 
                                    onClick={() => {
                                      setFileSend(fileEmpty)
                                      toast({ title: "Arquivo", description: "Envio Cancelado", variant: "sucesso", position: "top" })
                                      }
                                    } 
                                    disabled={isSubmitting}
                                  >
                                  {isSubmitting ? "Enviando..." : "Cancelar"}
                                  </Button> 
                  }
                  {/* <Suspense fallback={<h1>Carregando...</h1>} > */}
                    {/* {filesSend.length > 0 && <p className="text-white text-sm font-bold">Arquivo: {filesSend[0].nome}</p>} */}
                    {/* <FileUploadOnlyOneButton 
                      setFileSend={ ( value : ArquivoRequestType) => setFileSend(value) }
                      filesSend={filesSend}
                      onUpdateMensage={setFileName}
                      setFilesSend={( value : ArquivoRequestType[]) => setFilesSend(value)}
                    /> */}
                  {/* </Suspense> */}
                  <Button variant="secondary" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Responder"}
                  </Button>
                </>
              ) : null }
              
            </div>
          </div>
        </DialogContent>
    </Dialog>
    )
  }

  return (
    <>
      {renderChat()}
    </>
  );
};

export default HistoryOrChatRemovePoints;
