import { FC, useCallback, useState } from "react";

import { SimpleModal } from "@/components/modal/simple-modal";
import {
  ProjetoStatusAnalise,
  ProjetoStatusAprovado,
  ProjetoStatusRascunho,
  ProjetoType,
} from "@/services/projeto-service/types";
import UploadInput from "@/components/upload-input";
import { FileUploaded } from "@/components/crud/upload";
import { Separator } from "@radix-ui/react-separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import projetoService from "@/services/projeto-service";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { statusProjetoMap } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type PropsType = {
  onClose?: () => void;
  projeto: ProjetoType | undefined;
  status: string;
  mostrarMotivo: boolean;
  idProjeto: number | string
};

const ModalSalvar: FC<PropsType> = ({
  onClose,
  projeto,
  status,
  mostrarMotivo,
  idProjeto
}) => {
  
  // Constatantes e variaveis
  const { toast } = useToast();
  const [gravando, setGravando] = useState<boolean>(false);
  const motivoInicial = status === ProjetoStatusAprovado ? "Projeto aprovado" : "";
  const [motivo, setMotivo] = useState<string>(motivoInicial);
  const [gravado, setGravado] = useState<boolean>(false);
  const router = useRouter();

  // Funcoes
  const handleCancel = useCallback(() => {
    if (onClose) onClose();
    if (!open && !!gravado) redirect();
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && onClose) onClose();
    if (!open && !!gravado) redirect();
  }, []);

  const redirect = () => {
    router.push("/concessionaria/projetos");
  };

  const onSalvar = async () => {
    setGravando(true);
    try {
      if(status === ProjetoStatusAprovado){
        setMotivo("Projeto aprovado");
      }

      const p = await projetoService.postSalvarStatus(
        Number(idProjeto), //projeto?.id || 0,
        status,
        motivo
      );
      setGravando(false);
      setGravado(p);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o projeto",
        variant: "erro",
        position: "top"
      });
    }
  };

  return (
    <div className="flex grow justify-end space-x-4">
      <SimpleModal
        open={true}
        onOpenChange={handleOpenChange}
        titulo="Gravar Análise"
        descricao={
          "O Projeto será gravado com o status: " + statusProjetoMap[status]
        }
      >
        {gravando && <LoadingSpinner />}
        {gravado && (
          <div className="flex flex-col">
            <div className="text-green-500 mb-5">
              Análise gravada com sucesso!
            </div>
            <Alert>
              <Icons.info className="h-4 w-4" />
              <AlertTitle>Situação:</AlertTitle>
              <AlertDescription>
                {gravado &&
                  "O projeto foi salvo como: " + statusProjetoMap[status]}
              </AlertDescription>
            </Alert>
            <Button className="mt-5" onClick={redirect}>
              Ok
            </Button>
          </div>
        )}
        {!gravado && !gravando && (
          <>
            {mostrarMotivo && (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Motivo</Label>
                <Textarea
                  id="motivoAnalise"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Informe o motivo da alteração"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => onSalvar()}
                disabled={mostrarMotivo && motivo?.length < 10}
              >
                Salvar
              </Button>
              <Button onClick={() => handleCancel()}>Cancelar</Button>
            </div>
          </>
        )}
      </SimpleModal>
    </div>
  );
};

export default ModalSalvar;
