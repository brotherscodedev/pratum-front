import { FC, useCallback, useState } from "react";

import { SimpleModal } from "@/components/modal/simple-modal";
import {
  ProjetoStatusAnalise,
  ProjetoStatusEmFila,
  ProjetoStatusPausado,
  ProjetoStatusRascunho,
  ProjetoType,
} from "@/services/projeto-service/types";
import { LoadingSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import projetoService from "@/services/projeto-service";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PropsType = {
  onClose?: () => void;
  projeto: ProjetoType | undefined;
};

const ModalProtocolo: FC<PropsType> = ({ onClose, projeto }) => {
  const { toast } = useToast();

  const [gravando, setGravando] = useState<boolean>(false);
  const [gravado, setGravado] = useState<ProjetoType>();
  const router = useRouter();

  const handleCancel = useCallback(() => {
    if (onClose) onClose();
    if (!open && !!gravado) redirect();
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && onClose) onClose();
    if (!open && !!gravado) redirect();
  }, []);

  const redirect = () => {
    router.push("/ocupante/projetos");
  };

  const onSalvar = async (status: string) => {
    setGravando(true);
    try {
      const p = await projetoService.submeterProjeto(projeto?.id || 0, status);
      setGravando(false);
      setGravado(p);

      toast({
            title: "Sucesso",
            description: "Projeto Salvo com Sucesso",
            variant: "sucesso",
            position: "top",
      });
    } catch (error) {
      toast({
        description: "Não foi possível submeter o projeto",
        variant: "erro",
        position: "top"
      }) 
    }
  };

  return (
    <div className="flex grow justify-center space-x-4">
      <SimpleModal
        open={true}
        onOpenChange={handleOpenChange}
        titulo="Gravar Projeto"
        descricao=""
      >
        {gravando && <LoadingSpinner />}
        {gravado && (
          <div className="flex flex-col">
            <div className="text-green-500 mb-5">
              Projeto gravado com sucesso!
            </div>
            <Alert>
              <Icons.info className="h-4 w-4" />
              <AlertTitle>Situação:</AlertTitle>
              <AlertDescription>
                {gravado &&
                  gravado.status === ProjetoStatusEmFila && 
                  <div>
                    <p>O projeto foi salvo como Em Fila e poderá ser editado novamente.</p>
                    <p>Os postes selecionados podem sofrer alterações.</p>
                  </div>  
                }
                {gravado &&
                  gravado.status === ProjetoStatusRascunho &&
                  "O projeto foi salvo como RASCUNHO e poderá ser editado novamente\nOs postes selecionados podem sofrer alterações"}
                {gravado &&
                  gravado.status === ProjetoStatusPausado &&
                  "O projeto foi salvo como PAUSADO e poderá ser editado novamente\nOs postes selecionados podem sofrer alterações"}
                {gravado &&
                  gravado.status === ProjetoStatusAnalise &&
                  `Protocolo ${gravado.protocolo} Seu projeto está na fila de análise, prazo normativo de até 90 dias.`}
              </AlertDescription>
            </Alert>

            <Button className="mt-5" onClick={redirect}>
              Ok
            </Button>
          </div>
        )}
        {!gravado && !gravando && (
          <div className="flex justify-center gap-16 mt-4">
            {/* {projeto?.status === ProjetoStatusEmFila && ( */}
                <Button onClick={() => onSalvar(ProjetoStatusEmFila)}>
                  Salvar
                </Button>
                        {/* )} */}
             {projeto?.status === ProjetoStatusRascunho && (
              <Button onClick={() => onSalvar(ProjetoStatusRascunho)}>
                Salvar como rascunho
              </Button>
            )}

            {/*{projeto?.status === ProjetoStatusPausado && (
              <Button onClick={() => onSalvar(ProjetoStatusPausado)}>
                Salvar alterações e manter pausado
              </Button>
            )}
            <Button onClick={() => onSalvar(ProjetoStatusAnalise)}>
              Submeter projeto para Análise
            </Button> */}
            <Button onClick={() => handleCancel()}>Cancelar</Button>
          </div>
        )}
      </SimpleModal>
    </div>
  );
};

export default ModalProtocolo;
