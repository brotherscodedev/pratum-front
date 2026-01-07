"use client";
import { useCallback, useState } from "react";
import { FC, ReactNode} from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { atualizarStatusExclusaoPontos } from "@/types";
import ExcluirPontoService from "@/services/concessionaria/excluir-ponto";
import { useRouter } from "next/navigation";

type ConcessionariaAskModalPropsType = {
  open: boolean;
  title : "Aprovado" | "Reprovado" | "Pausado"
  id: number,
  onOpenChange: (open: boolean) => void;
}

export const ConcessionariaAskModal: FC<ConcessionariaAskModalPropsType> = ({
  open,
  title,
  id,
  onOpenChange,
}) => {
  
  //Variaveis
  const [observation, setObservation] = useState("")
  const { toast } = useToast();
  const router = useRouter();

  // Funcoes
  const showToast = async () => {
    toast({
      description: `Solicitação de exclusão ${title}`,
      variant: "sucesso",
      position : "top",
      className : "text-white z-50"
    })
  }

  const handleNavegarParaExclusaoPontos = useCallback(() => {
    router.push("/concessionaria/excluir-pontos");
  }, []);

  const handleSubmit =  async () => {
      const atualizarStatusExclusaoPontos : atualizarStatusExclusaoPontos = {
        status: title,
        motivo : observation
      }

      try {
        const response = await ExcluirPontoService.atualizarStatusExclusaoPontos(id, atualizarStatusExclusaoPontos);
        if(response === null) {
          toast({
            description: "Ponto que possua Status Aprovado ou Reprovado não pode ser modificado",
            variant: "erro",
            position: "top",
          })
        } else {
          showToast()
          onOpenChange(true)
          setTimeout(() => {
            handleNavegarParaExclusaoPontos()
          }, 1500)
        }
        
        console.log(response)
        
      } catch (error: any) {
        if(error.response?.data?.error) {
          toast({
            description: error.response.data.error,
            variant: "erro",
            position: "top",
          })
        }

      }
      // console.log(atualizarStatusExclusaoPontos)
      // onOpenChange()
      // showToast()
    }

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-96 md:max-w-[768px] bg-greenTertiary text-white ">
      <DialogTitle className="hidden" ></DialogTitle>
      <DialogDescription className="hidden" > </DialogDescription>
            <div className="w-full flex flex-col gap-y-2" >
                <label className="text-white w-full mb-4" htmlFor="textarea">Observação</label>
                <textarea id="textarea" className="h-48 w-full text-black dark:text-white p-3 rounded-lg" value={observation} onChange={(e) => setObservation(e.target.value) }></textarea>
            </div>
            
            <div className="flex justify-start space-x-4">
                <Button variant="default" size="lg" className="bg-white text-greenTertiary" onClick={handleSubmit}  >
                    Salvar
                </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
};